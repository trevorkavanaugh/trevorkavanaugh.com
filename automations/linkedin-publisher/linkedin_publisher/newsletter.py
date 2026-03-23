"""Newsletter module — builds inline-styled HTML, sends via API, and manages archives."""

import re
from datetime import datetime
from pathlib import Path

import requests

from .article_generator import ArticleContent
from .errors import NewsletterError
from .templates import NEWSLETTER_ARCHIVE_TEMPLATE, NEWSLETTER_STYLE_MAP


# ---------------------------------------------------------------------------
# LinkedIn CTA pattern — removed from newsletter HTML since the email
# template has its own CTA section.
# ---------------------------------------------------------------------------

_LINKEDIN_CTA_RE = re.compile(
    r"<p[^>]*>\s*<em>\s*For more perspectives.*?connect with me on LinkedIn.*?</em>\s*</p>",
    re.IGNORECASE | re.DOTALL,
)


# ---------------------------------------------------------------------------
# Blockquote → Outlook-compatible table conversion
# ---------------------------------------------------------------------------

_BLOCKQUOTE_RE = re.compile(
    r"<blockquote(?:\s[^>]*)?>(.+?)</blockquote>",
    re.DOTALL,
)

_BLOCKQUOTE_TABLE_TEMPLATE = (
    '<table border="0" cellpadding="0" cellspacing="0" width="100%" '
    'style="margin: 24px 0;">'
    "<tr>"
    '<td width="4" style="background-color: #4A90E2;"></td>'
    '<td style="padding: 16px 24px; background-color: #f8f9fa; '
    "font-family: 'Georgia', 'Times New Roman', serif; font-size: 17px; "
    'font-style: italic; line-height: 1.7; color: #34495e;">'
    "{inner}"
    "</td>"
    "</tr>"
    "</table>"
)


def _replace_blockquote(match: re.Match) -> str:
    """Replace a <blockquote> with an Outlook-compatible table."""
    inner = match.group(1).strip()
    return _BLOCKQUOTE_TABLE_TEMPLATE.format(inner=inner)


# ---------------------------------------------------------------------------
# Tag inlining
# ---------------------------------------------------------------------------

def _build_tag_pattern(tag: str) -> re.Pattern:
    """Build a regex that matches an opening HTML tag, with or without attributes.

    For self-closing tags like <br />, this won't match — but the style map
    doesn't include those. For tags with existing attributes (e.g. <a href="...">),
    the style attribute is appended before the closing >.
    """
    # Match <tag> or <tag attr="val" ...>
    return re.compile(
        rf"<{tag}(\s[^>]*)?>",
        re.IGNORECASE,
    )


def build_newsletter_html(article_body_html: str) -> str:
    """Apply inline styles to article body HTML for email compatibility.

    Takes the raw article body HTML (from ArticleContent.body_html) and:
    1. Removes the LinkedIn CTA paragraph (the email template has its own).
    2. Converts <blockquote> to Outlook-compatible table layout.
    3. Applies inline styles from NEWSLETTER_STYLE_MAP to all matched tags.

    Returns the inline-styled HTML string (article body only — the API wraps
    this in the full email template).
    """
    html = article_body_html

    # Step 1: Remove LinkedIn CTA paragraph
    html = _LINKEDIN_CTA_RE.sub("", html)

    # Step 2: Convert blockquotes to table-based layout BEFORE general inlining
    # (so we don't double-style blockquote tags that get replaced)
    html = _BLOCKQUOTE_RE.sub(_replace_blockquote, html)

    # Step 3: Apply inline styles from the style map
    for tag, style in NEWSLETTER_STYLE_MAP.items():
        # Skip blockquote — already handled via table conversion
        if tag == "blockquote":
            continue

        pattern = _build_tag_pattern(tag)

        def _add_style(m: re.Match, _style: str = style) -> str:
            attrs = m.group(1) or ""
            return f"<{tag}{attrs} style=\"{_style}\">"

        html = pattern.sub(_add_style, html)

    return html


# ---------------------------------------------------------------------------
# Newsletter send
# ---------------------------------------------------------------------------

def send_newsletter(
    subject: str,
    article_title: str,
    article_slug: str,
    article_content_html: str,
    config: dict,
    test_mode: bool = False,
) -> dict:
    """Send a newsletter via the Trevor Kavanaugh API.

    Args:
        subject: Email subject line.
        article_title: Title for the email template header.
        article_slug: URL slug (used to build the article URL).
        article_content_html: Inline-styled HTML body (from build_newsletter_html).
        config: Dict with keys 'newsletter_api_url', 'newsletter_api_key',
                and optionally 'test_email'.
        test_mode: If True, send only to config['test_email'].

    Returns:
        Response JSON dict from the API.

    Raises:
        NewsletterError: On missing config, HTTP errors, or API failures.
    """
    api_url = config.get("newsletter_api_url")
    api_key = config.get("newsletter_api_key")
    if not api_url or not api_key:
        raise NewsletterError(
            "Missing 'newsletter_api_url' or 'newsletter_api_key' in config."
        )

    article_url = f"https://trevorkavanaugh.com/articles/{article_slug}.html"

    payload: dict = {
        "subject": subject,
        "article_title": article_title,
        "article_slug": article_slug,
        "article_url": article_url,
        "article_content": article_content_html,
    }

    if test_mode:
        test_email = config.get("test_email")
        if not test_email:
            raise NewsletterError(
                "test_mode is True but 'test_email' not set in config."
            )
        payload["test_mode"] = True
        payload["test_email"] = test_email

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": api_key,
    }

    try:
        resp = requests.post(
            f"{api_url.rstrip('/')}/api/newsletter/send",
            json=payload,
            headers=headers,
            timeout=120,
        )
    except requests.RequestException as exc:
        raise NewsletterError(f"HTTP request failed: {exc}") from exc

    try:
        data = resp.json()
    except ValueError:
        raise NewsletterError(
            f"API returned non-JSON response (status {resp.status_code}): "
            f"{resp.text[:500]}"
        )

    if not resp.ok:
        error_msg = data.get("error", resp.text[:300])
        raise NewsletterError(
            f"API error {resp.status_code}: {error_msg}"
        )

    return data


# ---------------------------------------------------------------------------
# Newsletter archive
# ---------------------------------------------------------------------------

def build_newsletter_archive(
    article: ArticleContent,
    send_result: dict | None = None,
) -> str:
    """Build markdown content for a newsletter archive file.

    Args:
        article: The ArticleContent dataclass for the article.
        send_result: API response dict from send_newsletter (None if pre-send).

    Returns:
        Markdown string with frontmatter + article body content.
    """
    if send_result is not None:
        sent_date = datetime.now().strftime("%Y-%m-%d")
        subscribers_sent = send_result.get("sent", 0)
    else:
        sent_date = "pending"
        subscribers_sent = "pending"

    frontmatter = NEWSLETTER_ARCHIVE_TEMPLATE.format(
        title=article.title,
        date_iso=article.date,
        slug=article.slug,
        sent_date=sent_date,
        subscribers_sent=subscribers_sent,
    )

    return frontmatter + article.body_html + "\n"


def update_newsletter_archive(archive_path: Path, send_result: dict) -> str:
    """Update an existing newsletter archive file with send metadata.

    Replaces the 'pending' values for sent_date and subscribers_sent with
    actual values from the API response.

    Args:
        archive_path: Path to the existing archive markdown file.
        send_result: API response dict from send_newsletter.

    Returns:
        The updated file content (also written back to archive_path).

    Raises:
        NewsletterError: If the file cannot be read or updated.
    """
    try:
        content = archive_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise NewsletterError(f"Cannot read archive file: {exc}") from exc

    sent_date = datetime.now().strftime("%Y-%m-%d")
    subscribers_sent = send_result.get("sent", 0)

    content = re.sub(
        r"^sent_date:\s*.+$",
        f"sent_date: {sent_date}",
        content,
        count=1,
        flags=re.MULTILINE,
    )
    content = re.sub(
        r"^subscribers_sent:\s*.+$",
        f"subscribers_sent: {subscribers_sent}",
        content,
        count=1,
        flags=re.MULTILINE,
    )

    try:
        archive_path.write_text(content, encoding="utf-8")
    except OSError as exc:
        raise NewsletterError(f"Cannot write archive file: {exc}") from exc

    return content
