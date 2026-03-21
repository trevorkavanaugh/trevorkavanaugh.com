"""Post reading, formatting, and validation for LinkedIn."""

import re


def read_post(filepath: str) -> str:
    """Read file as UTF-8, strip YAML frontmatter if present, strip whitespace."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Strip YAML frontmatter (between --- markers at start of file)
    if content.startswith("---"):
        end = content.find("---", 3)
        if end != -1:
            content = content[end + 3:]

    return content.strip()


def format_for_linkedin(text: str) -> tuple[str, list[str]]:
    """Convert markdown to plain text for LinkedIn.

    Returns (cleaned_text, list_of_warnings).
    """
    warnings: list[str] = []

    # Strip image references with warning (before link conversion)
    image_matches = re.findall(r"!\[.*?\]\(.*?\)", text)
    if image_matches:
        warnings.append(f"Stripped {len(image_matches)} image reference(s) — images must be added via LinkedIn UI.")
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)

    # Strip markdown headers (keep text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)

    # Remove bold markers
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)

    # Remove italic markers
    text = re.sub(r"\*(.+?)\*", r"\1", text)

    # Convert markdown links [text](url) -> text (url)
    text = re.sub(r"\[(.+?)\]\((.+?)\)", r"\1 (\2)", text)

    # Strip HTML tags with warning
    html_tags = re.findall(r"<[^>]+>", text)
    if html_tags:
        warnings.append(f"Stripped {len(html_tags)} HTML tag(s).")
    text = re.sub(r"<[^>]+>", "", text)

    # Normalize line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Collapse 3+ blank lines to 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip(), warnings


def validate_post(text: str) -> list[dict]:
    """Validate post text and return list of issues.

    Each issue is {"level": "error"|"warning", "message": str}.
    """
    issues: list[dict] = []

    if not text or not text.strip():
        issues.append({"level": "error", "message": "Post is empty."})
        return issues

    char_count = len(text)

    if char_count > 3000:
        issues.append({
            "level": "error",
            "message": f"Post exceeds 3,000 character limit ({char_count:,} chars).",
        })
    elif char_count > 2800:
        issues.append({
            "level": "warning",
            "message": f"Post is near the 3,000 character limit ({char_count:,} chars).",
        })

    hashtag_count = len(re.findall(r"#\w+", text))
    if hashtag_count > 5:
        issues.append({
            "level": "warning",
            "message": f"Post has {hashtag_count} hashtags (>5 may reduce reach).",
        })

    return issues


def format_preview(text: str, warnings: list[str]) -> str:
    """Return formatted terminal preview string."""
    lines = text.split("\n")
    line_count = len(lines)
    char_count = len(text)
    hashtag_count = len(re.findall(r"#\w+", text))

    separator = "─" * 60

    parts = [
        f"\n{separator}",
        "  LINKEDIN POST PREVIEW",
        separator,
        "",
        text,
        "",
        separator,
        f"  Characters: {char_count:,} / 3,000",
        f"  Lines:      {line_count}",
        f"  Hashtags:   {hashtag_count}",
    ]

    if warnings:
        parts.append("")
        parts.append("  Warnings:")
        for w in warnings:
            parts.append(f"    - {w}")

    parts.append(separator)
    parts.append("")

    return "\n".join(parts)
