"""HTML and file content builder for the LinkedIn Publisher pipeline.

Generates article pages, markdown archives, and original-post archives
from an ArticleContent dataclass. All functions return strings — the
pipeline module handles actual disk writes.
"""

import re
from datetime import date
from pathlib import Path

from .article_generator import ArticleContent
from .templates import ARTICLE_ARCHIVE_TEMPLATE, ARTICLE_PAGE_TEMPLATE, INSIGHTS_CARD_TEMPLATE


def _format_date(iso_date: str) -> str:
    """Convert 'YYYY-MM-DD' to 'March 22, 2026' style."""
    d = date.fromisoformat(iso_date)
    return d.strftime("%B %-d, %Y")


def _category_class(category: str) -> str:
    """Return the lowercase CSS class for a category (e.g. 'TPRM' -> 'tprm')."""
    return category.lower().replace("&", "").replace(" ", "-")


def _strip_html_tags(html: str) -> str:
    """Remove HTML tags, leaving plain text content."""
    text = re.sub(r"<[^>]+>", "", html)
    # Collapse multiple whitespace/newlines into single newline between blocks
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _html_to_markdown(html: str) -> str:
    """Best-effort conversion of article body HTML to readable markdown.

    Handles the subset of tags produced by article_generator:
    p, h2, h3, ul, ol, li, strong, em, blockquote, a.
    """
    text = html

    # Headings
    text = re.sub(r"<h2[^>]*>(.*?)</h2>", r"\n## \1\n", text)
    text = re.sub(r"<h3[^>]*>(.*?)</h3>", r"\n### \1\n", text)

    # Bold and italic
    text = re.sub(r"<strong>(.*?)</strong>", r"**\1**", text)
    text = re.sub(r"<em>(.*?)</em>", r"*\1*", text)

    # Links
    text = re.sub(r'<a\s+href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", text)

    # Blockquotes
    text = re.sub(r"<blockquote[^>]*>(.*?)</blockquote>", _blockquote_replace, text, flags=re.DOTALL)

    # List items (before stripping ul/ol tags)
    text = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1", text)

    # Strip remaining tags (p, ul, ol, div, etc.)
    text = re.sub(r"<[^>]+>", "", text)

    # Clean up whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _blockquote_replace(match: re.Match) -> str:
    """Prefix each line of a blockquote with '> '."""
    inner = re.sub(r"<[^>]+>", "", match.group(1)).strip()
    lines = inner.split("\n")
    return "\n" + "\n".join(f"> {line.strip()}" for line in lines if line.strip()) + "\n"


def build_article_page(article: ArticleContent) -> str:
    """Build the complete article HTML page from an ArticleContent dataclass.

    Returns the full HTML string ready to write to frontend/articles/{slug}.html.
    """
    return ARTICLE_PAGE_TEMPLATE.format(
        title=article.title,
        meta_description=article.meta_description,
        category=article.category,
        category_class=_category_class(article.category),
        date_formatted=_format_date(article.date),
        date_iso=article.date,
        read_time=article.read_time,
        article_body=article.body_html,
        slug=article.slug,
        related_articles="",  # populated later by the pipeline or left empty
    )


def build_article_archive(article: ArticleContent) -> str:
    """Build the markdown archive content for content/articles/published/.

    Returns frontmatter + markdown body derived from the article HTML.
    """
    frontmatter = ARTICLE_ARCHIVE_TEMPLATE.format(
        title=article.title,
        date_iso=article.date,
        category=article.category,
        read_time=article.read_time,
        meta_description=article.meta_description,
        slug=article.slug,
    )

    title_line = f"# {article.title}\n\n"
    body_md = _html_to_markdown(article.body_html)

    return frontmatter + title_line + body_md + "\n"


def build_insights_card(article: ArticleContent) -> str:
    """Build the HTML card for insertion into insights.html."""
    return INSIGHTS_CARD_TEMPLATE.format(
        title=article.title,
        slug=article.slug,
        category=article.category,
        category_class=_category_class(article.category),
        meta_description=article.meta_description,
        date_formatted=_format_date(article.date),
        read_time=article.read_time,
    )


def build_all_files(
    article: ArticleContent, post_text: str, project_root: Path
) -> dict[str, str]:
    """Build all file contents the pipeline needs to create for a new article.

    Returns a dict mapping relative file paths (from project_root) to their
    string content. Does NOT write to disk.

    Files produced:
        - frontend/articles/{slug}.html
        - content/articles/published/YYYY-MM/{slug}.md
        - content/articles/linkedin-originals/YYYY-MM/{slug}.txt
    """
    # Use today's date for archive directory paths — this is the publication date,
    # regardless of what date Claude assigned to the article.
    year_month = date.today().strftime("%Y-%m")

    article_html_path = f"frontend/articles/{article.slug}.html"
    archive_md_path = f"content/articles/published/{year_month}/{article.slug}.md"
    original_path = f"content/articles/linkedin-originals/{year_month}/{article.slug}.txt"

    return {
        article_html_path: build_article_page(article),
        archive_md_path: build_article_archive(article),
        original_path: post_text,
    }
