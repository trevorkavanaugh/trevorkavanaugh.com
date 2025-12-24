# Article Template - Usage Guide

## Overview
The `template.html` file is a reusable template for creating article detail pages on the Risk Management Consulting website. It includes all necessary components and styling to maintain consistency with the site's design system.

## Template Structure

### 1. Article Hero Section
- **Category Tag**: Color-coded pill badge (e.g., "TPRM", "Compliance", "Regulatory")
- **Article Title**: Large, prominent H1 heading
- **Meta Information**: Publication date and estimated read time

### 2. Article Content
- Maximum width of 720px for optimal reading experience
- Optimized typography (19px body text, 1.8 line-height)
- Support for:
  - Paragraphs with proper spacing
  - H2 and H3 subheadings
  - Bullet lists and numbered lists
  - Blockquotes with left border accent
  - Inline links with hover effects
  - Bold and italic text
  - Code snippets

### 3. Author Box
- Circular avatar with initials
- Author title and bio
- Clean, professional layout

### 4. Related Articles
- Three-column grid (responsive on mobile)
- Thumbnail images with category tags
- Hover effects for interactivity

### 5. CTA Section
- Call-to-action encouraging consultation
- Uses existing CTA styles from main site

## How to Use This Template

### Creating a New Article

1. **Copy the template:**
   ```bash
   cp template.html article-slug-name.html
   ```

2. **Update the meta information:**
   - Change the `<title>` tag
   - Update the meta description
   - Modify the article hero section with your title, category, and date

3. **Replace placeholder content:**
   - Write your article content in the `.article-content` div
   - Keep the HTML structure intact
   - Use the supported content elements (headings, lists, blockquotes, etc.)

4. **Update related articles:**
   - Replace the three related article cards with relevant links
   - Ensure category tags match your article categories

### Category Tag Colors

The template supports five category color schemes (defined in `/css/articles.css`):

- **TPRM**: Blue background (`category-tprm`)
- **Regulatory**: Green background (`category-regulatory`)
- **M&A**: Purple background (`category-ma`)
- **Leadership**: Orange background (`category-leadership`)
- **Compliance**: Teal background (`category-compliance`)

**Usage:**
```html
<span class="article-category category-tprm">TPRM</span>
```

### Supported Content Elements

#### Headings
```html
<h2>Main Section Heading</h2>
<h3>Subsection Heading</h3>
```

#### Lists
```html
<ul>
  <li>Bullet point item</li>
  <li>Another item</li>
</ul>

<ol>
  <li>Numbered item</li>
  <li>Another numbered item</li>
</ol>
```

#### Blockquotes
```html
<blockquote>
  "This is a pull quote or important statement from the article."
</blockquote>
```

#### Links
```html
<a href="https://example.com">Link text</a>
```

#### Text Formatting
```html
<strong>Bold text for emphasis</strong>
<em>Italic text for subtle emphasis</em>
```

## File Paths

Since articles are in a subdirectory, all links to site assets must use relative paths:

- CSS: `../css/styles.css` and `../css/articles.css`
- JavaScript: `../js/main.js`
- Home page: `../index.html`
- Section anchors: `../index.html#contact`

## Responsive Behavior

The template is fully responsive:

- **Desktop (>1024px)**: Three-column related articles, optimal reading width
- **Tablet (768-1024px)**: Two-column related articles, slightly reduced font sizes
- **Mobile (<768px)**: Single-column layout, stacked elements, optimized for touch

## Typography Scale

- **Article Title**: 48px (desktop) / 32px (mobile)
- **H2 Headings**: 32px (desktop) / 26px (mobile)
- **H3 Headings**: 24px (desktop) / 22px (mobile)
- **Body Text**: 19px (desktop) / 17px (mobile)
- **Line Height**: 1.8 for optimal readability

## Color Palette

Consistent with main site design system:

- **Navy** (#1D3557): Headings
- **Slate** (#4C607B): Body text
- **Medium Blue** (#4A90E2): Links and accents
- **Light Grey** (#F8F9FA): Backgrounds
- **White** (#FFFFFF): Content backgrounds

## Best Practices

1. **Keep articles focused**: Aim for 800-1500 words
2. **Use clear headings**: Help readers scan the content
3. **Break up text**: Use lists, blockquotes, and subheadings
4. **Update meta tags**: Always customize title and description
5. **Choose relevant related articles**: Keep readers engaged
6. **Test responsiveness**: Preview on mobile before publishing

## Example Article Structure

```
Introduction paragraph (1-2 paragraphs)

## First Major Section
Content with supporting details...

### Subsection if needed
More specific information...

## Second Major Section
Content with bullet points:
- Point 1
- Point 2
- Point 3

> Important quote or callout

## Conclusion
Wrap up and next steps...
```

---

**Questions?** Refer to `/css/articles.css` for detailed styling options or `/index.html` for site-wide patterns.
