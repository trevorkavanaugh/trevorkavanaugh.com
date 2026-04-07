# CLAUDE.md - trevorkavanaugh.com Thought Leadership Website

## Deployment

- **Digital Ocean Droplet**: `ssh naughtymoddy@64.23.250.139`
- API server runs on this droplet (api.trevorkavanaugh.com)
- Frontend is GitHub Pages (trevorkavanaugh.com)
- Analytics dashboard: trevorkavanaugh.com/analytics/

## Project Overview

TPRM Insights - professional thought leadership profile focused on third-party risk management for the banking and financial services industry. Content strategy: transform 15+ LinkedIn thought leadership posts into website articles. Purpose: share expertise, establish thought leadership, and create opportunities for speaking and collaboration.

## PM/QA Role

Inherits PM/QA role from global CLAUDE.md. Claude operates as Project Manager and Quality Assurance Officer - delegate implementation to agents, review deliverables before approving.

## Source of Truth Docs

Source of truth docs: STATUS.md, README.md, PROJECT_PLAN.md, docs/REQUIREMENTS.md, docs/DESIGN_SYSTEM.md. Read these before major work. See index.md for directory structure and file purposes.

## CRITICAL: Content Transformation Rule

**MANDATORY**: When creating or refactoring articles from LinkedIn posts, ALWAYS follow the methodology in `docs/methodologies/linkedin-to-article-methodology.md`. Key points:
- Remove emojis and replace with proper headers
- Replace engagement questions with LinkedIn CTA
- Add internal links where relevant
- Write compelling meta descriptions (150-160 chars)
- Calculate read time (word count / 200)
- Ensure intro paragraph hooks reader and contains key terms
- Preserve Trevor's direct, practitioner voice

## Article Publishing Workflow

Two phases: Prepare and Review, then Publish to Production.

**CRITICAL ORDERING RULE:** The newsletter must be created AFTER the article is complete. The article undergoes significant expansion during LinkedIn-to-article conversion (new sections, elaborated examples, bullet lists, blockquotes, internal links). The newsletter must be derived from the finished article HTML, never from the original LinkedIn post. See `docs/methodologies/article-to-newsletter-methodology.md` for details.

### Phase 1: Prepare and Review

**Step 1.1: User Provides LinkedIn Post**
- User drops LinkedIn post in conversation or in `content/articles/drafts/`

**Step 1.2: Claude Creates Article** (can parallelize sub-steps within)
- Convert to professional article following `docs/methodologies/linkedin-to-article-methodology.md`
- Create HTML page in `frontend/articles/[slug].html`
- Create markdown archive in `content/articles/published/YYYY-MM/[slug].md`
- Archive original LinkedIn post to `content/articles/linkedin-originals/YYYY-MM/`
- Update `frontend/insights.html` (add card at top of grid)
- Update `frontend/index.html` Latest Insights (add new, bump oldest)

**Step 1.3: Claude Creates Newsletter** (MUST wait for article to be complete)
- Follow `docs/methodologies/article-to-newsletter-methodology.md`
- Read the FINISHED article from `frontend/articles/[slug].html`
- Convert to inline-styled, table-based HTML for email
- Create newsletter archive file in `content/newsletters/YYYY-MM-DD-[slug].md`
- Verify email HTML includes all expanded sections from the article

**Step 1.4: Claude Sends Test Newsletter**
- Send via API with `test_mode: true` to trevor@trevorkavanaugh.com

**Step 1.5: User Reviews Everything**
- Preview article locally at `localhost:8000`
- Check test newsletter rendering in inbox (Outlook, Gmail)
- Confirm both are ready, or request fixes
- Nothing goes to production until user says go

### Phase 2: Publish to Production

**Step 2.1: Claude Pushes to Production**
- Git commit all article files with descriptive message
- Git push to trigger GitHub Pages deployment
- Verify deployment at trevorkavanaugh.com

**Step 2.2: Claude Sends Newsletter to Subscribers**
- Send via API with `test_mode: false`
- All confirmed subscribers receive the email
- Update newsletter archive with send metadata (date, count)

**Step 2.3: Claude Verifies and Cleans Up**
- Verify all files in correct locations
- Verify article loads on production site
- Update STATUS.md with published article

### Content Folder Structure

```
content/
  articles/
    drafts/                    # Incoming LinkedIn posts (temporary)
    linkedin-originals/YYYY-MM/ # Original posts archived after publish
    published/YYYY-MM/          # Converted markdown articles (permanent)
    ideas/                      # Future topic ideas
  newsletters/
    YYYY-MM-DD-slug.md          # Newsletter archives with metadata
```

**Key Principles:**
- Drafts should be empty between publishing cycles
- Originals are archived, not deleted
- Every newsletter sent is archived with metadata
- Article and newsletter are BOTH prepared before production push

## Quality Reference

Before approving code changes, verify against `docs/QUALITY_CHECKLIST.md`. This covers HTML, CSS, JS, accessibility, performance, content, and design standards.

## Banking Industry Context

This content targets banking industry professionals. Special considerations:
- Professional, conservative tone
- Emphasis on compliance and regulation
- Data security and privacy paramount
- Examples should be educational and anonymized
- Claims must be substantiated
- Focus on sharing knowledge and perspectives, not selling services

TPRM focus areas: vendor risk assessment, third-party due diligence, ongoing monitoring, regulatory compliance (OCC, FFIEC), risk rating methodologies, vendor lifecycle management, contract risk management, and information security in vendor relationships.
