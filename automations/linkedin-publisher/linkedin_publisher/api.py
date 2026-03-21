"""LinkedIn API client."""

import requests

from .errors import APIError, AuthExpiredError

BASE_URL = "https://api.linkedin.com"
DEFAULT_LINKEDIN_VERSION = "202603"


def _headers(access_token: str, linkedin_version: str = DEFAULT_LINKEDIN_VERSION) -> dict:
    """Build headers for LinkedIn API requests."""
    return {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": linkedin_version,
    }


def _handle_response(response: requests.Response) -> None:
    """Check status code and raise appropriate errors."""
    if response.status_code == 401:
        raise AuthExpiredError()

    if response.status_code == 429:
        retry_after = response.headers.get("Retry-After", "unknown")
        raise APIError(
            429,
            f"Rate limited. Retry after {retry_after} seconds.",
            response.text,
        )

    if response.status_code >= 400:
        raise APIError(
            response.status_code,
            response.reason or "Unknown error",
            response.text,
        )


def get_profile(access_token: str) -> dict:
    """GET /v2/userinfo, returns dict with name and sub (person ID)."""
    resp = requests.get(
        f"{BASE_URL}/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=15,
    )
    _handle_response(resp)
    data = resp.json()
    return {"name": data.get("name", "Unknown"), "sub": data.get("sub", "")}


def create_post(
    access_token: str,
    person_urn: str,
    text: str,
    linkedin_version: str = DEFAULT_LINKEDIN_VERSION,
) -> str:
    """POST /rest/posts, returns post URN."""
    payload = {
        "author": person_urn,
        "lifecycleState": "PUBLISHED",
        "visibility": "PUBLIC",
        "commentary": text,
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": [],
        },
    }

    resp = requests.post(
        f"{BASE_URL}/rest/posts",
        json=payload,
        headers=_headers(access_token, linkedin_version),
        timeout=30,
    )
    _handle_response(resp)

    # Post URN is in the x-restli-id header
    post_urn = resp.headers.get("x-restli-id", "")
    if not post_urn:
        # Fallback: try response body
        data = resp.json() if resp.text else {}
        post_urn = data.get("id", "unknown")

    return post_urn


def get_post_url(post_urn: str) -> str:
    """Construct LinkedIn feed URL from post URN."""
    return f"https://www.linkedin.com/feed/update/{post_urn}"
