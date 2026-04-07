# Trevor Kavanaugh - Professional Thought Leadership Platform

Professional thought leadership platform for Third-Party Risk Management in banking and financial services.

**Live Site:** [trevorkavanaugh.com](https://trevorkavanaugh.com)
**API:** [api.trevorkavanaugh.com](https://api.trevorkavanaugh.com)
**Advisory Firm:** [Provenance Risk Advisory](https://www.provenanceriskadvisory.com)
**Tagline:** "Practical Perspectives on Third-Party Risk Management"

## Tech Stack

- **Frontend:** Vanilla HTML5 / CSS3 / JavaScript (no framework, no build step)
- **Backend API:** Express.js + SQLite on Digital Ocean droplet
- **Fonts:** Google Fonts (Inter)
- **Analytics:** Custom client-side tracking + API analytics dashboard
- **Newsletter:** API-driven subscriber management and email sending
- **Deployment:** GitHub Pages (frontend), Digital Ocean (API)

## Quick Start

**Local preview:**
```bash
cd frontend && python3 -m http.server 8080
# Visit http://localhost:8080
```

**Run API locally:**
```bash
cd api && npm install && node index.js
```

**Deploy frontend:**
```bash
git push  # GitHub Pages auto-deploys from frontend/
```

**Deploy API:**
```bash
ssh naughtymoddy@64.23.250.139
# Then run deploy.sh on the droplet
```

## Project Structure

```
consulting_business/
├── CLAUDE.md                    # AI assistant PM/QA instructions
├── STATUS.md                    # Current project state
├── README.md                    # This file
├── PROJECT_PLAN.md              # Development roadmap
├── frontend/                    # Website (GitHub Pages at trevorkavanaugh.com)
│   ├── index.html               # Homepage
│   ├── about.html               # About page
│   ├── insights.html            # All articles listing
│   ├── services.html            # Services page
│   ├── privacy.html             # Privacy policy
│   ├── CNAME                    # Custom domain config
│   ├── articles/                # 36 article pages
│   ├── research/                # Research paper page + PDFs
│   ├── analytics/               # Analytics dashboard
│   ├── css/                     # Stylesheets
│   ├── js/                      # JavaScript
│   └── images/                  # Website images
├── api/                         # Backend API (Digital Ocean)
│   ├── index.js                 # Express server
│   ├── analytics.db             # SQLite database
│   ├── deploy.sh                # Deployment script
│   └── package.json
├── content/                     # Content marketing assets
│   ├── articles/                # drafts, linkedin-originals, published, ideas
│   ├── newsletters/             # 17 newsletter archives
│   ├── playbook/                # Content strategy docs
│   └── series/                  # Multi-part series planning
├── docs/                        # Project documentation
│   ├── methodologies/           # Content transformation guides
│   ├── design/                  # Design decisions
│   ├── research/                # Market and competitor research
│   └── specs/                   # Technical specifications
├── assets/                      # Brand, images, downloads
└── archive/                     # Completed session summaries
```

## Content Pipeline

LinkedIn posts are transformed into professional articles and newsletters using documented methodologies:

1. **LinkedIn post** arrives in `content/articles/drafts/`
2. **Article** created following `docs/methodologies/linkedin-to-article-methodology.md`
3. **Newsletter** derived from finished article per `docs/methodologies/article-to-newsletter-methodology.md`
4. **Test email** sent via API, reviewed, then published

## Key Pages

| Page | URL |
|------|-----|
| Homepage | trevorkavanaugh.com |
| Insights (all articles) | trevorkavanaugh.com/insights.html |
| About | trevorkavanaugh.com/about.html |
| Services | trevorkavanaugh.com/services.html |
| Analytics Dashboard | trevorkavanaugh.com/analytics/ |

## Documentation

- [STATUS.md](STATUS.md) - Current project state and progress tracking
- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Development roadmap and phases
- [docs/methodologies/](docs/methodologies/) - Content transformation guides

## License

Private project - All rights reserved.
