# Article Publishing Quick Reference

## The Pipeline

```
LinkedIn Post → Article → Newsletter → Production
     ↓              ↓           ↓            ↓
  drafts/     frontend/   test email    git push
              articles/   ↓             + send to
                         user confirms   subscribers
```

---

## Phase 1: Content Prep

| Step | Action | Output |
|------|--------|--------|
| 1.1 | User drops LinkedIn post | `content/articles/drafts/#XX-title.txt` |
| 1.2 | Convert to article | `frontend/articles/[slug].html` |
| 1.2 | Archive markdown | `content/articles/published/YYYY-MM/[slug].md` |
| 1.2 | Update insights.html | New card at top |
| 1.2 | Update index.html | Rotate latest 3 |
| 1.3 | User reviews locally | localhost:8000 |

---

## Phase 2: Newsletter Prep

| Step | Action | Output |
|------|--------|--------|
| 2.1 | Convert to newsletter HTML | Table-based, inline styles |
| 2.1 | Create archive | `content/newsletters/YYYY-MM-DD-[slug].md` |
| 2.2 | Test send | `test_mode: true` → trevor@trevorkavanaugh.com |
| 2.3 | User confirms Outlook OK | Wait for thumbs up |

---

## Phase 3: Production

| Step | Action | Output |
|------|--------|--------|
| 3.1 | Wait for publish date | (if scheduled) |
| 3.2 | Git push | Deploys to trevorkavanaugh.com |
| 3.3 | Send newsletter | `test_mode: false` → all subscribers |
| 3.4 | Clean up | Move draft → linkedin-originals/ |

---

## API Commands

### Test Newsletter
```bash
curl -X POST https://api.trevorkavanaugh.com/api/newsletter/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: [KEY]" \
  -d '{
    "subject": "Article Title",
    "article_title": "Article Title",
    "article_content": "<p>HTML content...</p>",
    "test_mode": true,
    "test_email": "trevor@trevorkavanaugh.com"
  }'
```

### Production Send
```bash
# Same as above but:
"test_mode": false
# (remove test_email)
```

### Check Subscriber Count
```bash
curl https://api.trevorkavanaugh.com/api/stats \
  -H "X-API-Key: [KEY]"
```

---

## Key Files

| Purpose | Location |
|---------|----------|
| LinkedIn methodology | `docs/methodologies/linkedin-to-article-methodology.md` |
| Newsletter methodology | `docs/methodologies/article-to-newsletter-methodology.md` |
| Full workflow | `CLAUDE.md` → "Article Publishing Workflow" |
| Newsletter archives | `content/newsletters/` |

---

## Checklist Before Production Send

- [ ] Article renders correctly locally
- [ ] All links in article work
- [ ] insights.html updated
- [ ] index.html updated (latest 3)
- [ ] Newsletter test received
- [ ] Newsletter renders in Outlook
- [ ] Newsletter archive created
- [ ] Git commit ready
- [ ] It's the publish date
