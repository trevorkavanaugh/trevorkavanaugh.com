"""CLI entry point for LinkedIn Publisher."""

import argparse
import sys
import traceback

from . import __version__
from .errors import LinkedInPublisherError


def _cmd_setup(args: argparse.Namespace) -> None:
    from .auth import setup
    setup()


def _cmd_pipeline_setup(args: argparse.Namespace) -> None:
    import getpass
    from .config import load_config, save_config

    print("=== Pipeline Setup ===\n")
    config = load_config()

    # Claude API key
    claude_key = getpass.getpass("Anthropic API key (sk-ant-...): ").strip()
    if not claude_key:
        print("Skipping Claude API key (not provided).")
    else:
        config["claude_api_key"] = claude_key

    # Model selection
    model = input(f"Claude model [{config.get('claude_model', 'claude-sonnet-4-20250514')}]: ").strip()
    if model:
        config["claude_model"] = model
    elif "claude_model" not in config:
        config["claude_model"] = "claude-sonnet-4-20250514"

    # Newsletter API
    api_url = input(f"Newsletter API URL [{config.get('newsletter_api_url', 'https://api.trevorkavanaugh.com')}]: ").strip()
    config["newsletter_api_url"] = api_url or config.get("newsletter_api_url", "https://api.trevorkavanaugh.com")

    api_key = getpass.getpass(f"Newsletter admin API key: ").strip()
    if api_key:
        config["newsletter_api_key"] = api_key
    elif "newsletter_api_key" not in config:
        config["newsletter_api_key"] = "tk_admin_2026_x7k9m2p4q8r1s5t3"

    # Project root
    import os
    default_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    root = input(f"Project root [{config.get('project_root', default_root)}]: ").strip()
    config["project_root"] = root or config.get("project_root", default_root)

    # Test email
    email = input(f"Test email [{config.get('test_email', 'trevor@trevorkavanaugh.com')}]: ").strip()
    config["test_email"] = email or config.get("test_email", "trevor@trevorkavanaugh.com")

    save_config(config)
    print("\nPipeline configuration saved!")


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

    # If --pipeline flag, kick off article pipeline
    if args.pipeline:
        print("\nStarting article pipeline...")
        from .pipeline import prepare
        result = prepare(raw, args.slug, config)
        print(f"\nPipeline prepared successfully!")
        print(f"\nArticle: {result.title}")
        print(f"Slug: {result.slug}")
        print(f"Files created: {len(result.files_created)}")
        print(f"Files modified: {len(result.files_modified)}")
        print(f"\nReview the article at http://localhost:8080/articles/{result.slug}.html")
        print(f"\nWhen ready, run: linkedin pipeline push")


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


# ── Pipeline subcommands ──────────────────────────────────────────────


def _cmd_pipeline_prepare(args: argparse.Namespace) -> None:
    from .pipeline import prepare
    from .config import load_config
    from .formatter import read_post

    config = load_config()
    post_text = read_post(args.file)
    result = prepare(post_text, args.slug, config)

    print(f"\nPipeline prepared successfully!")
    print(f"\nArticle: {result.title}")
    print(f"Slug: {result.slug}")
    print(f"Files created: {len(result.files_created)}")
    print(f"Files modified: {len(result.files_modified)}")
    print(f"\nReview the article at http://localhost:8080/articles/{result.slug}.html")
    print(f"\nWhen ready, run: linkedin pipeline push")


def _cmd_pipeline_push(args: argparse.Namespace) -> None:
    from .pipeline import push
    from .config import load_config

    config = load_config()

    if not args.no_confirm:
        test_email = config.get("test_email", "trevor@trevorkavanaugh.com")
        answer = input(f"Send test newsletter to {test_email}? [y/N]: ").strip().lower()
        if answer == "y":
            from .newsletter import send_newsletter
            send_newsletter(config, test_mode=True)
            answer = input("Test sent. Proceed with production push? [y/N]: ").strip().lower()
            if answer != "y":
                print("Cancelled.")
                return
        else:
            answer = input("Skip test and push to production? [y/N]: ").strip().lower()
            if answer != "y":
                print("Cancelled.")
                return

    result = push(config)

    print(f"\nPipeline complete!")
    print(f"\nArticle: https://trevorkavanaugh.com/articles/{result.slug}.html")
    print(f"Commit: {result.commit_hash}")
    print(f"Newsletter: sent to {result.send_result.get('sent', '?')} subscribers")


def _cmd_pipeline_run(args: argparse.Namespace) -> None:
    from .pipeline import run
    from .config import load_config
    from .formatter import read_post

    config = load_config()
    post_text = read_post(args.file)

    if not args.no_confirm:
        test_email = config.get("test_email", "trevor@trevorkavanaugh.com")
        answer = input(f"Send test newsletter to {test_email}? [y/N]: ").strip().lower()
        if answer == "y":
            from .newsletter import send_newsletter
            send_newsletter(config, test_mode=True)
            answer = input("Test sent. Proceed with full pipeline? [y/N]: ").strip().lower()
            if answer != "y":
                print("Cancelled.")
                return
        else:
            answer = input("Skip test and run full pipeline? [y/N]: ").strip().lower()
            if answer != "y":
                print("Cancelled.")
                return

    result = run(post_text, args.slug, config)

    print(f"\nPipeline complete!")
    print(f"\nArticle: {result.title}")
    print(f"Slug: {result.slug}")
    print(f"Files created: {len(result.files_created)}")
    print(f"Files modified: {len(result.files_modified)}")
    print(f"\nArticle: https://trevorkavanaugh.com/articles/{result.slug}.html")
    print(f"Commit: {result.commit_hash}")
    print(f"Newsletter: sent to {result.send_result.get('sent', '?')} subscribers")


def _cmd_pipeline_status(args: argparse.Namespace) -> None:
    from .pipeline import get_status

    from .config import load_config
    config = load_config()
    state = get_status(config)

    if state is None:
        print("\nNo pending pipeline. Run `linkedin pipeline prepare <file>` to start.")
        return

    print(f"\nPipeline Status")
    print("─" * 40)
    print(f"  Slug:        {state.slug}")
    print(f"  Title:       {state.title}")
    print(f"  Step:        {state.step_completed}/6")
    print(f"  Prepared at: {state.prepared_at}")


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
    subparsers.add_parser("pipeline-setup", help="Configure pipeline: Claude API key, newsletter API, project root")

    # publish
    pub_parser = subparsers.add_parser("publish", help="Publish a post from a file")
    pub_parser.add_argument("file", help="Path to post file (text or markdown)")
    pub_parser.add_argument(
        "--no-confirm",
        action="store_true",
        help="Skip confirmation prompt",
    )
    pub_parser.add_argument(
        "--pipeline",
        action="store_true",
        help="After publishing, start article pipeline (prepare step)",
    )
    pub_parser.add_argument(
        "--slug",
        default=None,
        help="Article slug for pipeline (only used with --pipeline)",
    )

    # preview
    prev_parser = subparsers.add_parser("preview", help="Preview a post without publishing")
    prev_parser.add_argument("file", help="Path to post file (text or markdown)")

    # status
    subparsers.add_parser("status", help="Show authentication status and profile info")

    # auth-refresh
    subparsers.add_parser("auth-refresh", help="Force full re-authentication")

    # ── pipeline command group ────────────────────────────────────────
    pipeline_parser = subparsers.add_parser(
        "pipeline", help="Article pipeline commands (prepare, push, run, status)"
    )
    pipeline_sub = pipeline_parser.add_subparsers(
        dest="pipeline_command", help="Pipeline subcommands"
    )

    # pipeline prepare
    pipe_prepare = pipeline_sub.add_parser(
        "prepare", help="Prepare article and newsletter from a LinkedIn post file"
    )
    pipe_prepare.add_argument("file", help="Path to post file (text or markdown)")
    pipe_prepare.add_argument(
        "--slug", default=None, help="Article URL slug (auto-generated if omitted)"
    )

    # pipeline push
    pipe_push = pipeline_sub.add_parser(
        "push", help="Push prepared article to production and send newsletter"
    )
    pipe_push.add_argument(
        "--no-confirm",
        action="store_true",
        help="Skip all confirmation prompts",
    )

    # pipeline run
    pipe_run = pipeline_sub.add_parser(
        "run", help="Full pipeline: prepare + push in one step"
    )
    pipe_run.add_argument("file", help="Path to post file (text or markdown)")
    pipe_run.add_argument(
        "--slug", default=None, help="Article URL slug (auto-generated if omitted)"
    )
    pipe_run.add_argument(
        "--no-confirm",
        action="store_true",
        help="Skip all confirmation prompts",
    )

    # pipeline status
    pipeline_sub.add_parser(
        "status", help="Show current pipeline state"
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Handle pipeline subcommands
    if args.command == "pipeline":
        if not getattr(args, "pipeline_command", None):
            pipeline_parser.print_help()
            sys.exit(1)

        pipeline_commands = {
            "prepare": _cmd_pipeline_prepare,
            "push": _cmd_pipeline_push,
            "run": _cmd_pipeline_run,
            "status": _cmd_pipeline_status,
        }

        try:
            pipeline_commands[args.pipeline_command](args)
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
        return

    commands = {
        "setup": _cmd_setup,
        "pipeline-setup": _cmd_pipeline_setup,
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
