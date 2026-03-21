# Automations Roadmap

Internal planning document for the TPRM Insights automation tooling.

---

## Current Status

| Version | Name | Status |
|---------|------|--------|
| V1 | LinkedIn Publisher | In Progress |
| V1.5 | Content Pipeline Integration | Planned |
| V2 | Scheduling & Media | Planned |
| V3 | Content Engine | Planned |
| Future | Multi-Platform & Repurposing | Ideas Only |

**Now:** Building V1 core CLI in `automations/linkedin-publisher/`.
**Next:** V1.5 connects the publisher to the existing article and newsletter pipelines.

---

## V1 — LinkedIn Publisher CLI

**Goal:** Publish text posts to LinkedIn from the command line with proper auth and validation.

**Status:** In progress

Features:

- **OAuth 2.0 authentication** — Full LinkedIn API auth flow with browser-based token grant
- **Publish text-only posts** — Post from local markdown or text files
- **Post preview and validation** — Character limit checks, formatting warnings, dry-run preview
- **Token management** — Encrypted local storage, expiry tracking, auto-refresh prompts
- **CLI commands:**
  - `setup` — First-time OAuth configuration
  - `publish` — Send a post to LinkedIn
  - `preview` — Preview formatted output and run validation
  - `status` — Show auth status, token expiry, recent post info
  - `auth-refresh` — Manually refresh OAuth tokens

---

## V1.5 — Content Pipeline Integration

**Goal:** One command publishes to LinkedIn and triggers the full content pipeline: article conversion, website publish, newsletter send.

**Status:** Planned

**Depends on:** V1 complete, existing article/newsletter methodologies, existing newsletter API

Features:

- **LinkedIn-to-article conversion** — After LinkedIn publish, auto-convert the post to a website article using `docs/methodologies/linkedin-to-article-methodology.md`
- **Website auto-publish** — Generate article HTML, update `insights.html` and `index.html`, commit and push to GitHub Pages
- **Article-to-newsletter conversion** — Convert the finished article to email-safe HTML using `docs/methodologies/article-to-newsletter-methodology.md`
- **Newsletter send** — Send via `api.trevorkavanaugh.com` newsletter endpoint to all confirmed subscribers
- **Single pipeline command** — `publish --pipeline` (or similar) triggers the full chain: LinkedIn post → article → website → newsletter
- **Step confirmation option** — Optional interactive mode to review/approve at each stage before proceeding

**Ordering constraint:** Newsletter must be generated from the finished article, not from the original LinkedIn post. The article undergoes significant expansion during conversion.

---

## V2 — Scheduling & Media

**Goal:** Schedule posts in advance and support richer media content.

**Status:** Planned

Features:

- **Scheduled posting** — Cron-based or at-style scheduling for future posts (e.g., `publish --at "2026-04-01 09:00"`)
- **Image attachments** — Attach images to LinkedIn posts (single image, carousel if API supports)
- **Document attachments** — Attach PDFs or other documents to posts
- **LinkedIn analytics pull** — Fetch engagement metrics (impressions, reactions, comments) from LinkedIn API
- **Post performance dashboard** — CLI summary or simple web view of post performance over time

---

## V3 — Content Engine

**Goal:** AI-assisted content creation that maintains Trevor's authentic writing voice.

**Status:** Planned

Features:

- **AI-assisted post drafting** — Generate draft posts from a topic using Claude API integration
- **Voice matching** — Train on Trevor's existing posts to match his direct, practitioner-oriented writing style. Must not read as LLM-generated.
- **Topic list management** — Maintain a topic backlog: add topics, mark as drafted/published, track usage
- **Automated content calendar** — Suggest publishing cadence, assign topics to dates, track pipeline status
- **Post templates** — Reusable formats for recurring content types:
  - "This Week in TPRM" roundups
  - Hot takes on industry news
  - Deep dives on specific risk topics
  - Practical how-to posts

---

## Future / Ideas

Not committed to a version. Evaluate after V3.

- **Multi-platform publishing** — Extend to Twitter/X, Substack, or other platforms from the same source content
- **Content repurposing automation** — Long-form post → Twitter thread → website article (automated format adaptation)
- **Engagement-based topic prioritization** — Use LinkedIn analytics data to identify which topics and formats perform best, feed that back into the content engine's topic suggestions

---

## Design Principles

These apply across all versions:

1. **CLI-first** — All features work from the command line. No web UI required (dashboards are optional additions).
2. **Local-first** — Content, tokens, and config stay on the local machine. No third-party SaaS dependencies beyond the platform APIs themselves.
3. **Pipeline-oriented** — Each step is independently runnable. The pipeline chains them, but any step can be run solo.
4. **Existing infra** — Reuse the website (GitHub Pages), API (Digital Ocean), and methodologies already in place. Don't rebuild what works.
5. **Authentic voice** — Any AI-assisted content must be indistinguishable from Trevor's own writing. If it reads like an LLM wrote it, it's a bug.
