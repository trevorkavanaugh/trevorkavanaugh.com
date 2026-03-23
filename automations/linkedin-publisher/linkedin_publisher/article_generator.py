"""Article generation module — expands LinkedIn posts into full website articles via Claude API."""

import json
import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import anthropic

from .errors import ArticleGenerationError


@dataclass
class ArticleContent:
    title: str
    slug: str
    date: str  # ISO format YYYY-MM-DD
    category: str  # TPRM, Regulatory, Technology, Leadership, M&A
    read_time: int  # minutes
    meta_description: str
    body_html: str  # article body as HTML elements


VALID_CATEGORIES = {"TPRM", "Regulatory", "Technology", "Leadership", "M&A"}

# ---------------------------------------------------------------------------
# Post-processing patterns for body_html cleanup
# ---------------------------------------------------------------------------

# LinkedIn CTA paragraph — the article template already includes this section,
# so strip it from Claude's body_html to avoid duplication.
_LINKEDIN_CTA_RE = re.compile(
    r"<p[^>]*>\s*<em>\s*For more perspectives.*?connect with me on LinkedIn.*?</em>\s*</p>",
    re.IGNORECASE | re.DOTALL,
)


def _clean_body_html(html: str) -> str:
    """Post-process body_html: strip duplicate CTA and convert leftover markdown."""
    # 1. Remove LinkedIn CTA paragraph (template has its own)
    html = _LINKEDIN_CTA_RE.sub("", html)

    # 2. Convert any remaining markdown bold (**text**) to <strong>
    html = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", html)

    # 3. Convert any remaining markdown italic (*text*) to <em>
    #    Negative lookbehind/lookahead to avoid matching inside <strong> tags
    html = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", html)

    return html.strip()

OUTPUT_FORMAT_INSTRUCTIONS = """\
Return ONLY a JSON object with these exact keys — no explanation, no markdown, no wrapper text:

{
  "title": "Article title (concise, compelling, no site suffix)",
  "slug": "url-safe-slug-like-this",
  "date": "YYYY-MM-DD",
  "category": "TPRM | Regulatory | Technology | Leadership | M&A",
  "read_time": <integer minutes, word count / 200 rounded up, minimum 3>,
  "meta_description": "<exactly 150-160 characters, compelling, contains key terms>",
  "body_html": "<p>First paragraph...</p><h2>Section</h2><p>More content...</p>"
}

Rules for body_html:
- Use ONLY these HTML tags: p, h2, h3, ul, ol, li, strong, em, blockquote, a
- No wrapper div, no h1 (the template handles that), no inline styles
- Produce the full expanded article body — not a summary or outline
- Internal links use relative paths: /articles/slug-here.html
"""


def expand_post_to_article(post_text: str, config: dict) -> ArticleContent:
    """Expand a LinkedIn post into a full website article via the Claude API.

    Args:
        post_text: Raw LinkedIn post text.
        config: Dict with keys 'claude_api_key', 'claude_model' (optional),
                and 'project_root' (str or Path to the consulting_business directory).

    Returns:
        ArticleContent dataclass with the generated article.

    Raises:
        ArticleGenerationError: On any failure (missing config, API error, bad response).
    """
    api_key = config.get("claude_api_key")
    if not api_key:
        raise ArticleGenerationError("Missing 'claude_api_key' in config.")

    project_root = Path(config.get("project_root", "."))
    model = config.get("claude_model", "claude-sonnet-4-20250514")

    # Load context documents
    try:
        methodology = _load_methodology(project_root)
        content_rules = _load_content_rules(project_root)
    except FileNotFoundError as exc:
        raise ArticleGenerationError(f"Could not load methodology docs: {exc}") from exc

    existing_articles = _get_existing_articles(project_root)
    system_prompt = _build_system_prompt(methodology, content_rules, existing_articles)

    # Call Claude API
    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model=model,
            max_tokens=4096,
            temperature=0.3,
            system=system_prompt,
            messages=[
                {"role": "user", "content": post_text},
            ],
        )
    except anthropic.APIError as exc:
        raise ArticleGenerationError(f"Anthropic API error: {exc}") from exc
    except Exception as exc:
        raise ArticleGenerationError(f"Unexpected error calling Claude API: {exc}") from exc

    # Extract text from response
    response_text = ""
    for block in message.content:
        if block.type == "text":
            response_text += block.text

    if not response_text.strip():
        raise ArticleGenerationError("Claude returned an empty response.")

    # Parse and validate
    data = _parse_response(response_text)
    return _validate_article(data)


def _load_methodology(project_root: Path) -> str:
    """Read the LinkedIn-to-article transformation methodology doc."""
    path = project_root / "docs" / "methodologies" / "linkedin-to-article-methodology.md"
    return path.read_text(encoding="utf-8")


def _load_content_rules(project_root: Path) -> str:
    """Read the content generation rules doc."""
    path = project_root / "docs" / "methodologies" / "content-generation-rules.md"
    return path.read_text(encoding="utf-8")


def _get_existing_articles(project_root: Path) -> list[dict]:
    """Scan frontend/articles/*.html and extract title + slug for each article.

    Skips template.html. Extracts the display title from <title> tags,
    stripping the common site suffix.
    """
    articles_dir = project_root / "frontend" / "articles"
    results: list[dict] = []

    if not articles_dir.is_dir():
        return results

    title_re = re.compile(r"<title>\s*(.+?)\s*</title>", re.IGNORECASE | re.DOTALL)
    suffix_re = re.compile(r"\s*\|\s*Risk Management Consulting\s*$")

    for html_file in sorted(articles_dir.glob("*.html")):
        if html_file.name == "template.html":
            continue

        slug = html_file.stem
        title = slug  # fallback

        try:
            # Read only first 2 KB — title tag is always near the top
            content = html_file.read_text(encoding="utf-8")[:2048]
            match = title_re.search(content)
            if match:
                raw_title = match.group(1).strip()
                title = suffix_re.sub("", raw_title).strip()
        except OSError:
            pass

        results.append({"slug": slug, "title": title})

    return results


def _build_system_prompt(
    methodology: str,
    content_rules: str,
    existing_articles: list[dict],
) -> str:
    """Assemble the full system prompt for the Claude API call."""
    articles_list = "\n".join(
        f"- {a['title']}  (/articles/{a['slug']}.html)" for a in existing_articles
    )

    return f"""\
You are a professional content writer expanding a LinkedIn post into a full website article \
for Trevor Kavanaugh's third-party risk management thought leadership site (trevorkavanaugh.com).

## Transformation Methodology

{methodology}

## Content Generation Rules

{content_rules}

## Existing Articles on the Site

Use these for internal linking where genuinely relevant (conservative — only when it strengthens the argument):

{articles_list}

## Output Format

{OUTPUT_FORMAT_INSTRUCTIONS}
"""


def _parse_response(response_text: str) -> dict:
    """Parse Claude's JSON response, handling markdown code fences and stray text.

    Raises:
        ArticleGenerationError: If the response cannot be parsed as JSON.
    """
    text = response_text.strip()

    # Strip markdown code fences if present (```json ... ``` or ``` ... ```)
    fence_re = re.compile(r"^```(?:json)?\s*\n(.*?)\n```\s*$", re.DOTALL)
    match = fence_re.match(text)
    if match:
        text = match.group(1).strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Fallback: find first { ... last } in the text
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace > first_brace:
        try:
            return json.loads(text[first_brace : last_brace + 1])
        except json.JSONDecodeError:
            pass

    raise ArticleGenerationError(
        f"Failed to parse Claude response as JSON. Response starts with: {text[:200]}"
    )


def _validate_article(data: dict) -> ArticleContent:
    """Validate parsed JSON and return an ArticleContent dataclass.

    Raises:
        ArticleGenerationError: On missing/invalid fields.
    """
    required_fields = {"title", "slug", "date", "category", "read_time", "meta_description", "body_html"}
    missing = required_fields - set(data.keys())
    if missing:
        raise ArticleGenerationError(f"Missing required fields in response: {missing}")

    # Validate slug is URL-safe
    slug = data["slug"]
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
        raise ArticleGenerationError(
            f"Slug is not URL-safe (lowercase alphanumeric + hyphens only): '{slug}'"
        )

    # Validate category
    category = data["category"]
    if category not in VALID_CATEGORIES:
        raise ArticleGenerationError(
            f"Invalid category '{category}'. Must be one of: {', '.join(sorted(VALID_CATEGORIES))}"
        )

    # Validate date format
    date_str = data["date"]
    try:
        date.fromisoformat(date_str)
    except ValueError:
        raise ArticleGenerationError(f"Invalid date format '{date_str}'. Expected YYYY-MM-DD.")

    # Validate meta_description length
    meta = data["meta_description"]
    if not isinstance(meta, str) or not (130 <= len(meta) <= 170):
        raise ArticleGenerationError(
            f"meta_description must be 130-170 characters, got {len(meta)}: '{meta}'"
        )

    # Validate read_time
    read_time = data["read_time"]
    if not isinstance(read_time, int) or read_time < 1:
        raise ArticleGenerationError(f"read_time must be a positive integer, got: {read_time}")

    # Validate body_html is non-empty
    body_html = data["body_html"]
    if not isinstance(body_html, str) or len(body_html.strip()) < 100:
        raise ArticleGenerationError("body_html is missing or too short.")

    # Post-process: strip duplicate LinkedIn CTA + convert leftover markdown formatting
    body_html = _clean_body_html(body_html)

    return ArticleContent(
        title=data["title"],
        slug=slug,
        date=date_str,
        category=category,
        read_time=read_time,
        meta_description=meta,
        body_html=body_html,
    )
