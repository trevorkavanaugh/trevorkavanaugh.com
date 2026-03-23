"""Site page updater for the LinkedIn Publisher pipeline.

Updates insights.html and index.html with new article cards.
All functions return modified HTML strings — the pipeline module
handles actual disk writes.
"""

import re
from pathlib import Path

from .article_generator import ArticleContent
from .errors import SiteUpdateError
from .html_builder import _category_class, _format_date
from .templates import INDEX_INSIGHT_TEMPLATE, INSIGHTS_CARD_TEMPLATE


def update_insights_page(article: ArticleContent, project_root: Path) -> str:
    """Insert a new article card at the top of the insights.html article grid.

    Reads frontend/insights.html, inserts the card immediately after the
    ``<div class="articles-grid">`` opening tag, and returns the full
    modified HTML string. Does not write to disk.

    Raises:
        SiteUpdateError: If the file cannot be read or the grid marker is missing.
    """
    insights_path = project_root / "frontend" / "insights.html"

    try:
        html = insights_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise SiteUpdateError(f"Cannot read insights.html: {exc}") from exc

    card_html = INSIGHTS_CARD_TEMPLATE.format(
        title=article.title,
        slug=article.slug,
        category=article.category,
        category_class=_category_class(article.category),
        meta_description=article.meta_description,
        date_formatted=_format_date(article.date),
        read_time=article.read_time,
    )

    # Find the articles-grid div and insert the new card right after it
    marker = '<div class="articles-grid">'
    idx = html.find(marker)
    if idx == -1:
        raise SiteUpdateError(
            'Could not find \'<div class="articles-grid">\' in insights.html'
        )

    insert_pos = idx + len(marker)
    # Insert a newline + the card so it sits as the first child of the grid
    modified = html[:insert_pos] + "\n" + card_html + "\n" + html[insert_pos:]
    return modified


def update_index_page(article: ArticleContent, project_root: Path) -> str:
    """Update the Latest Insights section on index.html.

    Adds the new article as the first insight card, shifts existing cards
    down, and drops the third (oldest) card so exactly three are shown.
    Returns the full modified HTML string. Does not write to disk.

    Raises:
        SiteUpdateError: If the file cannot be read or the insights grid is missing.
    """
    index_path = project_root / "frontend" / "index.html"

    try:
        html = index_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise SiteUpdateError(f"Cannot read index.html: {exc}") from exc

    new_card = INDEX_INSIGHT_TEMPLATE.format(
        title=article.title,
        slug=article.slug,
        category=article.category,
        meta_description=article.meta_description,
        date_formatted=_format_date(article.date),
        read_time=article.read_time,
    )

    # Locate the insights-grid div
    grid_marker = '<div class="insights-grid">'
    grid_start = html.find(grid_marker)
    if grid_start == -1:
        raise SiteUpdateError(
            'Could not find \'<div class="insights-grid">\' in index.html'
        )

    # Find the closing </div> for the grid by matching all <article> blocks
    # We expect exactly 3 insight-card articles inside the grid.
    grid_content_start = grid_start + len(grid_marker)

    # Find closing </div> that ends the insights-grid
    # Strategy: find all <article class="insight-card"> ... </article> blocks,
    # then the </div> after the last one.
    card_pattern = re.compile(
        r'(\s*<article class="insight-card">.*?</article>)',
        re.DOTALL,
    )

    # Search from grid_content_start onward
    remaining = html[grid_content_start:]
    cards = list(card_pattern.finditer(remaining))

    if not cards:
        raise SiteUpdateError(
            "Could not find any insight-card articles in the insights-grid on index.html"
        )

    # Build the new grid content: new card + first two existing cards
    # (dropping the third/oldest)
    kept_cards = [m.group(1) for m in cards[:2]]
    new_grid_content = "\n" + new_card + "".join(kept_cards) + "\n"

    # Calculate positions in the original string
    # Everything from after grid_marker to end of last card
    last_card = cards[-1]
    old_content_end = grid_content_start + last_card.end()

    modified = (
        html[:grid_content_start]
        + new_grid_content
        + html[old_content_end:]
    )
    return modified


def update_site_pages(
    article: ArticleContent, project_root: Path
) -> dict[str, str]:
    """Update both insights.html and index.html with the new article card.

    Returns a dict mapping relative file paths (from project_root) to their
    modified HTML content. Does not write to disk.

    Raises:
        SiteUpdateError: If either page update fails.
    """
    return {
        "frontend/insights.html": update_insights_page(article, project_root),
        "frontend/index.html": update_index_page(article, project_root),
    }
