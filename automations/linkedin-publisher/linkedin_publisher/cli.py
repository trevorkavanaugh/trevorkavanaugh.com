"""CLI entry point for LinkedIn Publisher."""

import argparse
import sys
import traceback

from . import __version__
from .errors import LinkedInPublisherError


def _cmd_setup(args: argparse.Namespace) -> None:
    from .auth import setup
    setup()


def _cmd_publish(args: argparse.Namespace) -> None:
    from .auth import get_access_token
    from .config import load_config
    from .api import create_post, get_post_url
    from .formatter import read_post, format_for_linkedin, validate_post, format_preview

    raw = read_post(args.file)
    text, warnings = format_for_linkedin(raw)
    issues = validate_post(text)

    # Show preview
    print(format_preview(text, warnings))

    # Check for errors
    errors = [i for i in issues if i["level"] == "error"]
    if errors:
        for e in errors:
            print(f"  ERROR: {e['message']}")
        print("\nPost has errors. Fix them before publishing.")
        sys.exit(1)

    # Show warnings
    warn_issues = [i for i in issues if i["level"] == "warning"]
    for w in warn_issues:
        print(f"  WARNING: {w['message']}")

    # Confirm
    if not args.no_confirm:
        answer = input("\nPublish this post? [y/N] ").strip().lower()
        if answer != "y":
            print("Cancelled.")
            return

    print("\nPublishing...")
    access_token = get_access_token()
    config = load_config()
    person_urn = config["person_urn"]

    post_urn = create_post(access_token, person_urn, text)
    post_url = get_post_url(post_urn)

    print(f"\nPublished successfully!")
    print(f"Post URL: {post_url}")


def _cmd_preview(args: argparse.Namespace) -> None:
    from .formatter import read_post, format_for_linkedin, validate_post, format_preview

    raw = read_post(args.file)
    text, warnings = format_for_linkedin(raw)
    issues = validate_post(text)

    print(format_preview(text, warnings))

    for issue in issues:
        prefix = "ERROR" if issue["level"] == "error" else "WARNING"
        print(f"  {prefix}: {issue['message']}")


def _cmd_status(args: argparse.Namespace) -> None:
    from .auth import get_status

    status = get_status()

    print(f"\nLinkedIn Publisher v{__version__}")
    print("─" * 40)

    if not status.get("is_valid", False) and status.get("error"):
        print(f"  Status: Not authenticated")
        print(f"  Error:  {status['error']}")
        return

    print(f"  Profile:   {status.get('profile_name', 'Unknown')}")
    print(f"  Person:    {status.get('person_urn', 'Unknown')}")
    print(f"  Expires:   {status.get('token_expires', 'Unknown')}")
    print(f"  Days left: {status.get('days_remaining', '?')}")
    print(f"  Valid:     {'Yes' if status.get('is_valid') else 'No'}")


def _cmd_auth_refresh(args: argparse.Namespace) -> None:
    from .auth import setup
    print("Starting full re-authentication...\n")
    setup()


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="linkedin",
        description="CLI tool for publishing LinkedIn posts.",
    )
    parser.add_argument(
        "--version", action="version", version=f"%(prog)s {__version__}"
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # setup
    subparsers.add_parser("setup", help="First-run setup: configure credentials and authenticate")

    # publish
    pub_parser = subparsers.add_parser("publish", help="Publish a post from a file")
    pub_parser.add_argument("file", help="Path to post file (text or markdown)")
    pub_parser.add_argument(
        "--no-confirm",
        action="store_true",
        help="Skip confirmation prompt",
    )

    # preview
    prev_parser = subparsers.add_parser("preview", help="Preview a post without publishing")
    prev_parser.add_argument("file", help="Path to post file (text or markdown)")

    # status
    subparsers.add_parser("status", help="Show authentication status and profile info")

    # auth-refresh
    subparsers.add_parser("auth-refresh", help="Force full re-authentication")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    commands = {
        "setup": _cmd_setup,
        "publish": _cmd_publish,
        "preview": _cmd_preview,
        "status": _cmd_status,
        "auth-refresh": _cmd_auth_refresh,
    }

    try:
        commands[args.command](args)
    except KeyboardInterrupt:
        print("\nCancelled.")
        sys.exit(130)
    except LinkedInPublisherError as e:
        print(f"\nError: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error: {e}", file=sys.stderr)
        traceback.print_exc()
        sys.exit(2)


if __name__ == "__main__":
    main()
