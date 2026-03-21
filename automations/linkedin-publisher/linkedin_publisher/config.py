"""Configuration management for LinkedIn Publisher."""

import json
import os
from pathlib import Path


def get_config_dir() -> Path:
    """Return ~/.linkedin-publisher/, creating with 0o700 if missing."""
    config_dir = Path.home() / ".linkedin-publisher"
    if not config_dir.exists():
        config_dir.mkdir(mode=0o700, parents=True)
    return config_dir


def load_config() -> dict:
    """Read config.json, return empty dict if missing."""
    config_file = get_config_dir() / "config.json"
    if not config_file.exists():
        return {}
    with open(config_file, "r", encoding="utf-8") as f:
        return json.load(f)


def save_config(data: dict) -> None:
    """Write config.json with 0o600 permissions."""
    config_file = get_config_dir() / "config.json"
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.chmod(config_file, 0o600)


def is_configured() -> bool:
    """Check if client_id and person_urn exist in config."""
    config = load_config()
    return bool(config.get("client_id") and config.get("person_urn"))
