# Article to Newsletter Conversion Methodology

## Purpose

This document provides Claude Code with a reusable methodology for converting website articles into email newsletters. The newsletter is the delivery mechanism for new articles—subscribers receive the full article content in their inbox with a CTA to engage further on the website.

---

## Core Principles

### 1. Full Content Delivery
- Subscribers receive the **complete article** in the newsletter, not just a teaser
- The newsletter IS the article, formatted for email
- The CTA at the end invites engagement (LinkedIn, more articles) but the value is delivered in-email

### 2. Email Client Compatibility
- Outlook, Gmail, Apple Mail all render emails differently
- Use **table-based HTML layout** (not div-based) for maximum compatibility
- Inline critical styles or use inline style attributes
- Avoid CSS that Outlook strips (flexbox, grid, background-image, etc.)

### 3. Brand Consistency
- Match the website's visual identity within email constraints
- TK logo, color palette (#4A90E2 primary, #1a2a3a dark text)
- Professional, clean appearance befitting banking industry audience

---

## Newsletter Structure

### Required Components

```
1. Header
   - TK logo (border-styled text, not image)
   - Link to website

2. Article Title
   - H1-equivalent styling
   - Clear hierarchy

3. Full Article Content
   - All paragraphs, headers, lists from the article
   - Preserve H2/H3 hierarchy
   - Maintain bold/emphasis formatting

4. Divider

5. CTA Section
   - "For more insights & perspectives..."
   - Button linking to website/LinkedIn
   - Secondary link to browse all insights

6. Footer
   - Unsubscribe link (REQUIRED - CAN-SPAM compliance)
   - Copyright notice
   - Brief description of newsletter frequency
```

---

## Conversion Rules

### From Article HTML to Newsletter HTML

| Article Element | Newsletter Equivalent |
|-----------------|----------------------|
| `<h1>` | `<h1 style="margin: 0 0 24px 0; font-size: 26px; line-height: 1.3; color: #1a2a3a;">` |
| `<h2>` | `<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">` |
| `<h3>` | `<h3 style="margin: 24px 0 12px 0; font-size: 17px; color: #1a2a3a;">` |
| `<p>` | `<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">` |
| `<strong>` | `<strong style="color: #1a2a3a;">` |
| `<ul>/<ol>` | Same with `style="margin: 0 0 16px 0; padding-left: 24px; color: #4a5568;"` |
| `<li>` | Same with `style="margin-bottom: 8px; line-height: 1.6;"` |
| `<a>` | `<a href="..." style="color: #4A90E2; text-decoration: underline;">` |

### Content Transformation

1. **Extract article content** from the HTML article page
   - Skip the page header/navigation
   - Skip the page footer
   - Take only the article body content

2. **Convert to inline-styled HTML**
   - Replace CSS classes with inline styles
   - Use the style mappings above

3. **Wrap in email template**
   - Use the table-based structure (see template below)
   - Insert article title and content
   - Generate unique unsubscribe URL per subscriber

---

## Email Template Structure

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{article_title}}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7;
             font-family: Arial, Helvetica, sans-serif;">

  <!-- Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%"
         style="background-color: #f4f5f7;">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Main Container (600px max) -->
        <table border="0" cellpadding="0" cellspacing="0" width="600"
               style="max-width: 600px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <a href="https://trevorkavanaugh.com" style="text-decoration: none;">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border: 2px solid #4A90E2; padding: 10px 20px;
                               font-size: 24px; font-weight: bold; color: #4A90E2;">
                      TK
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td>
              <table border="0" cellpadding="0" cellspacing="0" width="100%"
                     style="background-color: #ffffff; border-radius: 8px;">
                <tr>
                  <td style="padding: 40px;">

                    <!-- Article Title -->
                    <h1 style="margin: 0 0 24px 0; font-size: 26px;
                               line-height: 1.3; color: #1a2a3a;">
                      {{article_title}}
                    </h1>

                    <!-- Article Content -->
                    <div style="color: #4a5568; line-height: 1.8; font-size: 16px;">
                      {{article_content}}
                    </div>

                    <!-- Divider -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 32px 0;">
                          <hr style="border: none; border-top: 1px solid #e2e8f0;
                                     margin: 0;" />
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Section -->
                    <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 15px;">
                      For more insights &amp; perspectives on third-party risk management:
                    </p>

                    <!-- CTA Button -->
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #4A90E2; border-radius: 6px;">
                          <a href="https://trevorkavanaugh.com/insights.html"
                             style="display: inline-block; padding: 14px 28px;
                                    color: #ffffff; text-decoration: none;
                                    font-weight: 600; font-size: 15px;">
                            Browse All Insights
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 16px 0 0 0; font-size: 14px; color: #718096;">
                      Or <a href="https://www.linkedin.com/in/trevorskavanaugh/"
                            style="color: #4A90E2; text-decoration: underline;">
                        connect with me on LinkedIn</a>
                    </p>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #8899aa;">
                You're receiving this because you subscribed to Trevor Kavanaugh's
                TPRM newsletter.
              </p>
              <p style="margin: 0; font-size: 13px; color: #8899aa;">
                <a href="{{unsubscribe_url}}"
                   style="color: #8899aa; text-decoration: underline;">
                  Unsubscribe
                </a>
                &nbsp;|&nbsp;
                &copy; 2026 Trevor Kavanaugh
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
```

---

## Conversion Process

### Step-by-Step Workflow

1. **Read the published article HTML**
   - Location: `frontend/articles/[slug].html`
   - Extract the `<article>` or main content section

2. **Strip website-specific elements**
   - Remove navigation, header, footer
   - Remove any JavaScript references
   - Remove CSS class references

3. **Convert content to inline styles**
   - Apply style mappings from table above
   - Ensure all formatting is inline

4. **Create newsletter markdown file**
   - Location: `content/newsletters/[slug].md`
   - Include metadata (title, date, article_url)
   - Include the converted HTML content

5. **Generate email HTML**
   - Insert content into template
   - Replace placeholders (title, content, unsubscribe_url)

---

## Newsletter Archive Format

Store each newsletter in `content/newsletters/` with this format:

```markdown
---
title: "Article Title Here"
date: 2026-01-01
article_slug: article-slug-here
article_url: https://trevorkavanaugh.com/articles/article-slug-here.html
sent_date: 2026-01-01
subscribers_sent: 47
---

# Article Title Here

[Full article content in markdown format for archival purposes]

---

## Newsletter Metadata

- **Subject Line**: Article Title Here
- **Preview Text**: First ~100 characters of article
- **Sent**: January 1, 2026 at 9:00 AM EST
- **Recipients**: 47 confirmed subscribers
```

---

## API Integration

### Sending a Newsletter

The newsletter is sent via the API endpoint:

```bash
curl -X POST https://api.trevorkavanaugh.com/api/newsletter/send \
  -H "Content-Type: application/json" \
  -H "X-API-Key: [ADMIN_KEY]" \
  -d '{
    "subject": "Article Title Here",
    "article_title": "Article Title Here",
    "article_content": "<p>Full HTML content...</p>",
    "test_mode": false
  }'
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `subject` | Yes | Email subject line (usually article title) |
| `article_title` | Yes | Title displayed in email body |
| `article_content` | Yes | Full article HTML (inline-styled) |
| `test_mode` | No | If true, sends only to `test_email` |
| `test_email` | No | Email for test sends (required if test_mode) |

### Response

```json
{
  "success": true,
  "sent": 47,
  "total": 47
}
```

---

## Quality Checklist

Before sending any newsletter, verify:

- [ ] Article content is complete (not truncated)
- [ ] All inline styles applied correctly
- [ ] Images have alt text (if any images used)
- [ ] Links all work and point to correct URLs
- [ ] Unsubscribe link present and functional
- [ ] Subject line is clear and compelling
- [ ] **Test email sent to personal inbox first**
- [ ] **Verified rendering in Outlook** (table layout intact)
- [ ] **Verified rendering in Gmail** (styles applied)
- [ ] Newsletter archived in `content/newsletters/`

---

## Outlook-Specific Considerations

Outlook uses Word's rendering engine, which strips many CSS properties. Always:

1. Use `<table>` for layout, never `<div>` for structural elements
2. Use `border`, `cellpadding`, `cellspacing` attributes on tables
3. Apply styles inline on each element
4. Avoid: `background-image`, `flexbox`, `grid`, `max-width` without `width`
5. Use `Arial, Helvetica, sans-serif` as font-family
6. Set explicit widths on table cells

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| No background color | Outlook strips `background` on divs | Use `bgcolor` attribute or `background-color` on table cells |
| Button not styled | Background on `<a>` tag | Wrap button in table cell with background |
| Content too wide | No max-width constraint | Use 600px table with explicit width |
| Fonts wrong | Web fonts not supported | Use Arial/Helvetica system fonts |
| Spacing broken | Margin/padding on wrong elements | Apply padding to table cells, not content |

---

## Instructions for Claude Code

### When Converting an Article to Newsletter

1. Read the article from `frontend/articles/[slug].html`
2. Extract the article body content
3. Convert all elements to inline-styled HTML per the mappings
4. Create the newsletter archive file in `content/newsletters/[slug].md`
5. Prepare the API payload with the converted content
6. **Always test first** with `test_mode: true`
7. Verify Outlook rendering before production send
8. Send to all subscribers with `test_mode: false`
9. Update the archive file with send metadata

### File Naming Convention

- Newsletter archive: `content/newsletters/YYYY-MM-DD-[slug].md`
- Example: `content/newsletters/2026-01-01-software-supply-chain-composition.md`
