"""Pipeline orchestrator — chains all publishing steps together.

Two-phase workflow:
    prepare()  — Steps 1-6: generate article, build files, write to disk
    push()     — Steps 7-10: git push, verify deployment, send newsletter

Or call run() for single-shot execution (both phases in sequence).
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from pathlib import Path

from .article_generator import ArticleContent, expand_post_to_article
from .errors import (
    ArticleGenerationError,
    DeploymentError,
    NewsletterError,
    PipelineError,
    SiteUpdateError,
)
from .git_ops import commit_and_push, verify_deployment
from .html_builder import build_all_files
from .newsletter import (
    build_newsletter_archive,
    build_newsletter_html,
    send_newsletter,
    update_newsletter_archive,
)
from .site_updater import update_site_pages


STATE_FILENAME = ".pipeline-state.json"


@dataclass
class PipelineState:
    slug: str
    title: str
    article: ArticleContent | None = None
    files_created: dict[str, str] = field(default_factory=dict)    # path -> content
    files_modified: dict[str, str] = field(default_factory=dict)   # path -> content
    newsletter_html: str = ""
    newsletter_archive_path: str = ""
    step_completed: int = 0
    prepared_at: str = ""
    commit_hash: str = ""
    send_result: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def prepare(post_text: str, slug: str | None, config: dict) -> PipelineState:
    """Run pipeline steps 1-6: generate article, build all files, write to disk.

    Args:
        post_text: Raw LinkedIn post text.
        slug: Optional URL slug override. If None, uses the slug from Claude.
        config: Dict with 'claude_api_key', 'project_root', etc.

    Returns:
        PipelineState with steps 1-6 complete.

    Raises:
        ArticleGenerationError: If Claude API call fails (step 2).
        SiteUpdateError: If site page updates fail (step 4).
        PipelineError: On file write failures (step 6).
    """
    project_root = Path(config.get("project_root", ".")).resolve()
    state = PipelineState(slug=slug or "", title="")

    # Step 1: Read post text (already provided)
    print("Step 1/6: Post text received.")
    state.step_completed = 1

    # Step 2: Expand post to full article via Claude API
    print("Step 2/6: Expanding article via Claude API...")
    try:
        article = expand_post_to_article(post_text, config)
    except ArticleGenerationError:
        print("FAILED at step 2: Article generation failed.")
        print(f"  Completed steps: {state.step_completed}")
        raise

    # Always override date to today — Claude may pick the original post date,
    # but we publish to the website today.
    today_iso = date.today().isoformat()

    article = ArticleContent(
        title=article.title,
        slug=slug if slug is not None else article.slug,
        date=today_iso,
        category=article.category,
        read_time=article.read_time,
        meta_description=article.meta_description,
        body_html=article.body_html,
    )

    state.slug = article.slug
    state.title = article.title
    state.article = article
    state.step_completed = 2
    print(f"  Title: {article.title}")
    print(f"  Slug:  {article.slug}")

    # Step 3: Build all new files (article page, archives)
    print("Step 3/6: Building article files...")
    try:
        files_created = build_all_files(article, post_text, project_root)
    except Exception as exc:
        print(f"FAILED at step 3: File building failed — {exc}")
        print(f"  Completed steps: {state.step_completed}")
        raise
    state.files_created = files_created
    state.step_completed = 3
    print(f"  Files to create: {len(files_created)}")

    # Step 4: Build site page modifications (insights.html, index.html)
    print("Step 4/6: Updating site pages...")
    try:
        files_modified = update_site_pages(article, project_root)
    except SiteUpdateError:
        print("FAILED at step 4: Site page update failed.")
        print(f"  Completed steps: {state.step_completed}")
        raise
    state.files_modified = files_modified
    state.step_completed = 4
    print(f"  Files to modify: {len(files_modified)}")

    # Step 5: Build newsletter HTML
    print("Step 5/6: Building newsletter HTML...")
    try:
        state.newsletter_html = build_newsletter_html(article.body_html)
    except Exception as exc:
        print(f"FAILED at step 5: Newsletter build failed — {exc}")
        print(f"  Completed steps: {state.step_completed}")
        raise
    state.step_completed = 5

    # Step 6: Write all files to disk + build newsletter archive
    print("Step 6/6: Writing files to disk...")
    try:
        _write_files(files_created, project_root)
        _write_files(files_modified, project_root)

        # Build and write newsletter archive (use today's date for the filename)
        archive_content = build_newsletter_archive(article)
        archive_rel = f"content/newsletters/{today_iso}-{article.slug}.md"
        archive_path = project_root / archive_rel
        archive_path.parent.mkdir(parents=True, exist_ok=True)
        archive_path.write_text(archive_content, encoding="utf-8")
        print(f"  Wrote: {archive_rel}")
        state.newsletter_archive_path = archive_rel

    except Exception as exc:
        print(f"FAILED at step 6: Disk write failed — {exc}")
        print(f"  Completed steps: {state.step_completed}")
        raise PipelineError(f"File write failed: {exc}") from exc

    state.step_completed = 6
    state.prepared_at = datetime.now(timezone.utc).isoformat()
    _save_state(state, project_root)
    print(f"\nPrepare complete. {len(files_created)} created, {len(files_modified)} modified.")
    print(f"State saved to {STATE_FILENAME}")
    return state


def push(config: dict) -> PipelineState:
    """Run pipeline steps 7-10: git push, verify, send newsletter, update archive.

    Reads state from .pipeline-state.json saved by prepare().

    Args:
        config: Dict with 'project_root', 'newsletter_api_url',
                'newsletter_api_key', etc.

    Returns:
        Updated PipelineState with steps 7-10 complete.

    Raises:
        PipelineError: If no saved state exists.
        DeploymentError: If git operations fail (step 7).
        NewsletterError: If newsletter send fails (step 9).
    """
    project_root = Path(config.get("project_root", ".")).resolve()
    state = _load_state(project_root)

    # Step 7: Commit and push
    print("Step 7/10: Committing and pushing to git...")
    all_files = list(state.files_created.keys()) + list(state.files_modified.keys())
    if state.newsletter_archive_path:
        all_files.append(state.newsletter_archive_path)

    commit_message = f"feat: Add article - {state.title}"
    try:
        state.commit_hash = commit_and_push(all_files, commit_message, project_root)
    except DeploymentError:
        print("FAILED at step 7: Git commit/push failed.")
        print(f"  Completed steps: {state.step_completed}")
        raise
    state.step_completed = 7
    print(f"  Commit: {state.commit_hash}")

    # Step 8: Verify deployment
    print("Step 8/10: Verifying deployment...")
    try:
        is_live = verify_deployment(state.slug)
    except Exception as exc:
        print(f"  WARNING: Deployment verification error — {exc}")
        is_live = False

    if is_live:
        print(f"  Article is live at https://trevorkavanaugh.com/articles/{state.slug}.html")
    else:
        print("  WARNING: Deployment verification timed out. Article may not be live yet.")
    state.step_completed = 8

    # Step 9: Send newsletter to all subscribers
    print("Step 9/10: Sending newsletter to subscribers...")
    subject = f"{state.title} | Trevor Kavanaugh"
    try:
        state.send_result = send_newsletter(
            subject=subject,
            article_title=state.title,
            article_slug=state.slug,
            article_content_html=state.newsletter_html,
            config=config,
            test_mode=False,
        )
    except NewsletterError:
        print("FAILED at step 9: Newsletter send failed.")
        print(f"  Completed steps: {state.step_completed}")
        raise
    state.step_completed = 9
    sent_count = state.send_result.get("sent", "unknown")
    print(f"  Sent to {sent_count} subscribers.")

    # Step 10: Update newsletter archive with send metadata
    print("Step 10/10: Updating newsletter archive with send metadata...")
    try:
        archive_path = project_root / state.newsletter_archive_path
        update_newsletter_archive(archive_path, state.send_result)
    except NewsletterError as exc:
        print(f"  WARNING: Archive update failed — {exc}")
    state.step_completed = 10

    # Clean up state file
    state_file = project_root / STATE_FILENAME
    if state_file.exists():
        state_file.unlink()

    print(f"\nPush complete. Article published and newsletter sent.")
    return state


def run(post_text: str, slug: str | None, config: dict) -> PipelineState:
    """Run the full pipeline (prepare + push) in one shot.

    Args:
        post_text: Raw LinkedIn post text.
        slug: Optional URL slug override.
        config: Full configuration dict.

    Returns:
        Final PipelineState with all steps complete.
    """
    prepare(post_text, slug, config)
    return push(config)


def get_status(config: dict) -> PipelineState | None:
    """Check if there is a pending pipeline state.

    Args:
        config: Dict with 'project_root'.

    Returns:
        PipelineState if a saved state exists, None otherwise.
    """
    project_root = Path(config.get("project_root", ".")).resolve()
    state_file = project_root / STATE_FILENAME

    if not state_file.exists():
        return None

    try:
        return _load_state(project_root)
    except PipelineError:
        return None


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------


def _save_state(state: PipelineState, project_root: Path) -> None:
    """Serialize pipeline state to .pipeline-state.json.

    Only writes serializable fields needed for the push phase —
    excludes full file content and the ArticleContent object.
    """
    data = {
        "slug": state.slug,
        "title": state.title,
        "files_created": list(state.files_created.keys()),
        "files_modified": list(state.files_modified.keys()),
        "newsletter_html": state.newsletter_html,
        "newsletter_archive_path": state.newsletter_archive_path,
        "step_completed": state.step_completed,
        "prepared_at": state.prepared_at,
    }

    state_file = project_root / STATE_FILENAME
    state_file.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _load_state(project_root: Path) -> PipelineState:
    """Read .pipeline-state.json and reconstruct a PipelineState.

    Raises:
        PipelineError: If the state file is missing or malformed.
    """
    state_file = project_root / STATE_FILENAME

    if not state_file.exists():
        raise PipelineError(
            f"No pipeline state found at {state_file}. Run 'prepare' first."
        )

    try:
        data = json.loads(state_file.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        raise PipelineError(f"Failed to read pipeline state: {exc}") from exc

    # Reconstruct state — files_created/files_modified store paths only (no content)
    return PipelineState(
        slug=data["slug"],
        title=data["title"],
        files_created={path: "" for path in data.get("files_created", [])},
        files_modified={path: "" for path in data.get("files_modified", [])},
        newsletter_html=data.get("newsletter_html", ""),
        newsletter_archive_path=data.get("newsletter_archive_path", ""),
        step_completed=data.get("step_completed", 0),
        prepared_at=data.get("prepared_at", ""),
    )


def _write_files(files: dict[str, str], project_root: Path) -> None:
    """Write a dict of {relative_path: content} to disk under project_root.

    Creates parent directories as needed. Prints each path as it's written.
    """
    for rel_path, content in files.items():
        full_path = project_root / rel_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        full_path.write_text(content, encoding="utf-8")
        print(f"  Wrote: {rel_path}")
