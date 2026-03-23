"""Git operations module — commit, push, and deployment verification."""

import subprocess
import time
from pathlib import Path

import requests

from .errors import DeploymentError


def commit_and_push(files: list[str], message: str, project_root: Path) -> str:
    """Stage specific files, commit, and push to origin.

    Args:
        files: List of file paths (relative to project_root or absolute).
        message: Git commit message.
        project_root: Root directory of the git repository.

    Returns:
        The commit hash (short SHA).

    Raises:
        DeploymentError: On any git command failure.
    """
    cwd = str(project_root)

    # Stage files
    try:
        subprocess.run(
            ["git", "add"] + files,
            cwd=cwd,
            capture_output=True,
            check=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        raise DeploymentError(
            f"git add failed: {exc.stderr.strip()}"
        ) from exc

    # Commit
    try:
        subprocess.run(
            ["git", "commit", "-m", message],
            cwd=cwd,
            capture_output=True,
            check=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        raise DeploymentError(
            f"git commit failed: {exc.stderr.strip()}"
        ) from exc

    # Get commit hash
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=cwd,
            capture_output=True,
            check=True,
            text=True,
        )
        commit_hash = result.stdout.strip()
    except subprocess.CalledProcessError as exc:
        raise DeploymentError(
            f"git rev-parse failed: {exc.stderr.strip()}"
        ) from exc

    # Push
    try:
        subprocess.run(
            ["git", "push", "origin"],
            cwd=cwd,
            capture_output=True,
            check=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        raise DeploymentError(
            f"git push failed: {exc.stderr.strip()}"
        ) from exc

    return commit_hash


def verify_deployment(slug: str, timeout: int = 120) -> bool:
    """Poll the production URL until the article page returns HTTP 200.

    Args:
        slug: Article URL slug (without extension or path).
        timeout: Maximum seconds to wait before giving up.

    Returns:
        True if the page is live, False if timeout was reached.
    """
    url = f"https://trevorkavanaugh.com/articles/{slug}.html"
    deadline = time.monotonic() + timeout

    while time.monotonic() < deadline:
        try:
            resp = requests.head(url, timeout=10, allow_redirects=True)
            if resp.status_code == 200:
                return True
        except requests.RequestException:
            pass

        # Don't sleep past the deadline
        remaining = deadline - time.monotonic()
        if remaining > 5:
            time.sleep(5)
        elif remaining > 0:
            time.sleep(remaining)
        else:
            break

    return False
