# trevorkavanaugh.com - Project Index

**Last Updated**: 2026-04-06
**Referenced by**: `CLAUDE.md` (Directory Structure section)

This document describes the directory structure and file organization rules for the trevorkavanaugh.com thought leadership website project.

---

## Directory Index

| Directory | Purpose |
|-----------|---------|
| `CLAUDE.md` | Project operating instructions |
| `STATUS.md` | Current project state (update frequently) |
| `README.md` | Project overview and setup |
| `PROJECT_PLAN.md` | Phased approach and timeline |
| `REQUIREMENTS.md` | Business and technical requirements |
| `frontend/` | Website source code deployed to GitHub Pages |
| `frontend/index.html` | Homepage |
| `frontend/insights.html` | All articles listing |
| `frontend/about.html` | About page |
| `frontend/articles/` | Individual article pages |
| `frontend/research/` | Research paper pages |
| `frontend/css/` | Stylesheets (`styles.css`, `articles.css`) |
| `frontend/js/` | JavaScript (`main.js`) |
| `frontend/images/` | Website images |
| `api/` | Backend API deployed to Digital Ocean (api.trevorkavanaugh.com) |
| `api/index.js` | Express API server |
| `api/analytics.db` | SQLite database |
| `api/package.json` | Node dependencies |
| `api/deploy.sh` | Deployment script |
| `content/` | All content marketing assets |
| `content/README.md` | Content strategy overview |
| `content/articles/drafts/` | Incoming LinkedIn posts (temporary) |
| `content/articles/linkedin-originals/` | Original posts archived after publish |
| `content/articles/published/` | Converted markdown articles (organized by `YYYY-MM/`) |
| `content/articles/ideas/` | Topic ideas and outlines |
| `content/newsletters/` | Newsletter archives (sent emails), named `YYYY-MM-DD-slug.md` |
| `content/playbook/` | Content strategy docs |
| `content/series/` | Multi-part series planning |
| `content/analytics/` | Performance tracking |
| `docs/` | Project documentation |
| `docs/methodologies/` | Transformation guides (linkedin-to-article, article-to-newsletter) |
| `docs/design/` | Design decisions and mockups |
| `docs/research/` | Market and competitor research |
| `docs/specs/` | Technical specifications |
| `assets/` | Shared assets (not website-specific) |
| `assets/brand/` | Logo source files, brand guidelines |
| `assets/images/` | Reusable images |
| `assets/downloads/` | PDFs, whitepapers, etc. |
| `archive/` | Completed work and old versions |
| `archive/session_summaries/` | Handoff documents |
| `archive/old_drafts/` | Superseded versions |
| `archive/decisions/` | Architecture Decision Records |

---

## File Organization Rules

**`frontend/` contains ONLY:**
- Production website files (HTML, CSS, JS) deployed to GitHub Pages
- Code that will be deployed to trevorkavanaugh.com
- Website-specific images

**`api/` contains:**
- Backend API code deployed to Digital Ocean (api.trevorkavanaugh.com)
- Analytics tracking, newsletter, subscriber management
- SQLite database (not committed to git)

**`content/` contains:**
- Source content in markdown format
- LinkedIn posts (original and converted)
- Newsletter archives (every email sent)
- Content calendars and strategy docs
- Analytics and engagement tracking

**`docs/` contains:**
- Project planning documents
- Requirements and specifications
- Design documentation
- Technical architecture decisions

**`assets/` contains:**
- Brand assets (logos, guidelines)
- Reusable images (not page-specific)
- Downloadable resources

**`archive/` receives:**
- Completed session notes
- Old drafts when new version finalized
- Superseded documentation
- Decision logs after implementation
