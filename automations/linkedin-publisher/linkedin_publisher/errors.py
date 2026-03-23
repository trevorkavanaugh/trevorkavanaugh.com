class LinkedInPublisherError(Exception):
    """Base exception."""


class AuthError(LinkedInPublisherError):
    """Authentication issues."""


class AuthExpiredError(AuthError):
    """Token expired, re-auth needed."""

    def __str__(self):
        return "Access token expired. Run `linkedin auth-refresh` to re-authenticate."


class APIError(LinkedInPublisherError):
    """LinkedIn API returned an error."""

    def __init__(self, status_code: int, message: str, response_body: str | None = None):
        self.status_code = status_code
        self.response_body = response_body
        super().__init__(f"LinkedIn API error {status_code}: {message}")


class ValidationError(LinkedInPublisherError):
    """Post validation failed."""


class ArticleGenerationError(LinkedInPublisherError):
    """Article generation via Claude API failed."""


class NewsletterError(LinkedInPublisherError):
    """Newsletter build or send failed."""


class DeploymentError(LinkedInPublisherError):
    """Git commit/push or deployment verification failed."""


class SiteUpdateError(LinkedInPublisherError):
    """Failed to update site HTML files (insights.html or index.html)."""


class PipelineError(LinkedInPublisherError):
    """Pipeline orchestration failed (state load/save, step sequencing)."""
