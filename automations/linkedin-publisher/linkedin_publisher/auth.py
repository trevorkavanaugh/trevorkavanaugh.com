"""OAuth flow and token management for LinkedIn API."""

import base64
import getpass
import hashlib
import json
import secrets
import threading
import webbrowser
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import requests
from cryptography.fernet import Fernet

from .config import get_config_dir, load_config, save_config
from .errors import AuthError, AuthExpiredError

AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization"
TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
USERINFO_URL = "https://api.linkedin.com/v2/userinfo"
REDIRECT_URI = "http://localhost:8338/callback"
SCOPES = "openid profile email w_member_social"


class _OAuthCallbackHandler(BaseHTTPRequestHandler):
    """Minimal HTTP handler for OAuth callback."""

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path != "/callback":
            self.send_response(404)
            self.end_headers()
            return

        params = parse_qs(parsed.query)
        code = params.get("code", [None])[0]
        state = params.get("state", [None])[0]
        error = params.get("error", [None])[0]

        if error:
            self.server.oauth_error = error  # type: ignore[attr-defined]
            self._respond("Authorization failed. Check the terminal for details.")
        elif state != self.server.expected_state:  # type: ignore[attr-defined]
            self.server.oauth_error = "State mismatch"  # type: ignore[attr-defined]
            self._respond("Authorization failed: state mismatch.")
        elif code:
            self.server.oauth_code = code  # type: ignore[attr-defined]
            self._respond("Authorization successful! You can close this tab.")
        else:
            self.server.oauth_error = "No code received"  # type: ignore[attr-defined]
            self._respond("Authorization failed: no code received.")

        # Shut down server after responding
        threading.Timer(0.5, self.server.shutdown).start()

    def _respond(self, message: str) -> None:
        html = f"""<!DOCTYPE html>
<html><head><title>LinkedIn Publisher</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px;">
<h2>{message}</h2>
</body></html>"""
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(html.encode())

    def log_message(self, format: str, *args: object) -> None:
        # Suppress default request logging
        pass


class _OAuthServer(HTTPServer):
    """HTTPServer with storage for OAuth results."""

    oauth_code: str | None = None
    oauth_error: str | None = None
    expected_state: str = ""


def setup() -> None:
    """Interactive first-run setup: prompt for credentials, run OAuth, store config."""
    print("=== LinkedIn Publisher Setup ===\n")

    client_id = input("LinkedIn App Client ID: ").strip()
    if not client_id:
        raise AuthError("Client ID is required.")

    client_secret = getpass.getpass("LinkedIn App Client Secret: ").strip()
    if not client_secret:
        raise AuthError("Client Secret is required.")

    print("\nStarting OAuth flow...")
    tokens = start_oauth_flow(client_id, client_secret)

    print("Fetching profile info...")
    userinfo = _fetch_userinfo(tokens["access_token"])
    person_id = userinfo["sub"]
    profile_name = userinfo.get("name", "Unknown")

    # Store tokens encrypted
    token_data = {
        "client_secret": client_secret,
        "access_token": tokens["access_token"],
        "refresh_token": tokens.get("refresh_token", ""),
        "access_token_expires_at": (
            datetime.now(timezone.utc) + timedelta(seconds=tokens["expires_in"])
        ).isoformat(),
        "refresh_token_expires_at": (
            datetime.now(timezone.utc) + timedelta(days=365)
        ).isoformat(),
    }
    _encrypt_tokens(token_data)

    save_config({
        "client_id": client_id,
        "person_urn": f"urn:li:person:{person_id}",
        "profile_name": profile_name,
    })

    print(f"\nSetup complete! Authenticated as {profile_name}.")
    print(f"Person URN: urn:li:person:{person_id}")


def get_access_token() -> str:
    """Decrypt tokens, check expiry, refresh if needed. Raises AuthExpiredError if no valid token."""
    config = load_config()
    if not config.get("client_id"):
        raise AuthError("Not configured. Run `linkedin setup` first.")

    try:
        tokens = _decrypt_tokens()
    except Exception as e:
        raise AuthError(f"Failed to decrypt tokens: {e}") from e

    expires_at = datetime.fromisoformat(tokens["access_token_expires_at"])
    buffer = timedelta(minutes=5)

    if datetime.now(timezone.utc) < expires_at - buffer:
        return tokens["access_token"]

    # Try refresh
    if tokens.get("refresh_token"):
        try:
            new_tokens = refresh_token(
                tokens["refresh_token"],
                config["client_id"],
                tokens["client_secret"],
            )
            token_data = {
                "client_secret": tokens["client_secret"],
                "access_token": new_tokens["access_token"],
                "refresh_token": new_tokens.get("refresh_token", tokens["refresh_token"]),
                "access_token_expires_at": (
                    datetime.now(timezone.utc) + timedelta(seconds=new_tokens["expires_in"])
                ).isoformat(),
                "refresh_token_expires_at": tokens["refresh_token_expires_at"],
            }
            _encrypt_tokens(token_data)
            return new_tokens["access_token"]
        except Exception:
            pass

    raise AuthExpiredError()


def start_oauth_flow(client_id: str, client_secret: str) -> dict:
    """Generate state, open browser, catch callback, exchange code for tokens."""
    state = secrets.token_urlsafe(32)

    auth_url = (
        f"{AUTHORIZE_URL}?response_type=code"
        f"&client_id={client_id}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&state={state}"
        f"&scope={SCOPES}"
    )

    server = _OAuthServer(("localhost", 8338), _OAuthCallbackHandler)
    server.expected_state = state

    print(f"\nOpening browser for authorization...\n{auth_url}\n")
    webbrowser.open(auth_url)

    server.serve_forever()

    if server.oauth_error:
        raise AuthError(f"OAuth failed: {server.oauth_error}")

    if not server.oauth_code:
        raise AuthError("No authorization code received.")

    return _exchange_code(server.oauth_code, client_id, client_secret, REDIRECT_URI)


def _exchange_code(code: str, client_id: str, client_secret: str, redirect_uri: str) -> dict:
    """POST to LinkedIn token endpoint to exchange auth code for tokens."""
    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_uri,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=15,
    )
    if resp.status_code != 200:
        raise AuthError(f"Token exchange failed ({resp.status_code}): {resp.text}")
    return resp.json()


def _fetch_userinfo(access_token: str) -> dict:
    """GET /v2/userinfo, return OIDC userinfo including sub (person ID)."""
    resp = requests.get(
        USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )
    if resp.status_code != 200:
        raise AuthError(f"Failed to fetch userinfo ({resp.status_code}): {resp.text}")
    data = resp.json()
    if not data.get("sub"):
        raise AuthError("No 'sub' field in userinfo response.")
    return data


def _derive_key() -> bytes:
    """Derive a Fernet key from machine-specific data."""
    import os
    import platform

    hostname = platform.node()
    username = os.getenv("USER", os.getenv("USERNAME", "unknown"))

    machine_id = ""
    machine_id_path = Path("/etc/machine-id")
    if machine_id_path.exists():
        machine_id = machine_id_path.read_text().strip()

    seed = f"{hostname}:{username}:{machine_id}"
    hash_bytes = hashlib.sha256(seed.encode()).digest()
    return base64.urlsafe_b64encode(hash_bytes[:32])


def _encrypt_tokens(data: dict) -> None:
    """Fernet-encrypt token data and write to tokens.json.enc."""
    key = _derive_key()
    fernet = Fernet(key)
    plaintext = json.dumps(data).encode()
    encrypted = fernet.encrypt(plaintext)

    token_file = get_config_dir() / "tokens.json.enc"
    token_file.write_bytes(encrypted)
    token_file.chmod(0o600)


def _decrypt_tokens() -> dict:
    """Read tokens.json.enc and Fernet-decrypt."""
    key = _derive_key()
    fernet = Fernet(key)

    token_file = get_config_dir() / "tokens.json.enc"
    if not token_file.exists():
        raise AuthError("No token file found. Run `linkedin setup` first.")

    encrypted = token_file.read_bytes()
    plaintext = fernet.decrypt(encrypted)
    return json.loads(plaintext.decode())


def refresh_token(refresh_tok: str, client_id: str, client_secret: str) -> dict:
    """POST to LinkedIn refresh endpoint."""
    resp = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_tok,
            "client_id": client_id,
            "client_secret": client_secret,
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=15,
    )
    if resp.status_code != 200:
        raise AuthError(f"Token refresh failed ({resp.status_code}): {resp.text}")
    return resp.json()


def get_status() -> dict:
    """Return dict with profile name, person_urn, token_expires, days_remaining, is_valid."""
    config = load_config()
    if not config.get("client_id"):
        return {"is_valid": False, "error": "Not configured"}

    try:
        tokens = _decrypt_tokens()
    except Exception as e:
        return {"is_valid": False, "error": str(e)}

    expires_at = datetime.fromisoformat(tokens["access_token_expires_at"])
    now = datetime.now(timezone.utc)
    days_remaining = (expires_at - now).days

    return {
        "profile_name": config.get("profile_name", "Unknown"),
        "person_urn": config.get("person_urn", "Unknown"),
        "token_expires": expires_at.isoformat(),
        "days_remaining": days_remaining,
        "is_valid": now < expires_at,
    }
