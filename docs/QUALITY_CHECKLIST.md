# Quality Standards Checklist

**Last Updated**: 2026-04-06
**Referenced by**: `CLAUDE.md` (Quality Standards section)

This checklist is used before approving any code, content, or design changes to trevorkavanaugh.com.

---

## Code Review Checklist

Before approving ANY code changes, verify:

### HTML

- [ ] Semantic HTML5 elements used correctly
- [ ] Proper heading hierarchy (single h1, logical h2-h6)
- [ ] All images have descriptive alt text
- [ ] Forms have associated labels
- [ ] Links have descriptive text (not "click here")
- [ ] Meta tags present (title, description, viewport)
- [ ] No inline styles (use CSS classes)

### CSS

- [ ] Follows existing design system
- [ ] Uses CSS variables for colors/spacing
- [ ] Responsive design implemented
- [ ] Mobile-first approach
- [ ] No !important unless absolutely necessary
- [ ] Consistent naming convention (BEM or existing pattern)
- [ ] Print styles considered if applicable

### JavaScript

- [ ] No console.log statements in production
- [ ] Error handling implemented
- [ ] Graceful degradation if JS disabled
- [ ] No inline event handlers (use addEventListener)
- [ ] Comments for complex logic
- [ ] Performance considered (debouncing, throttling where needed)

### Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 UI)
- [ ] Screen reader tested (or aria labels verified)
- [ ] No content conveyed by color alone
- [ ] Form validation accessible

### Performance

- [ ] Images optimized (compressed, appropriate format)
- [ ] CSS/JS minified for production
- [ ] No render-blocking resources
- [ ] Lazy loading considered for images

### Browser Compatibility

- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Mobile browsers tested (or responsive preview verified)
- [ ] Fallbacks for modern CSS features

---

## Content Review Checklist

Before approving ANY content changes, verify:

### Writing Quality

- [ ] Professional tone appropriate for banking industry
- [ ] Clear and concise (no jargon without explanation)
- [ ] Grammar and spelling correct
- [ ] Active voice used predominantly
- [ ] Paragraphs focused on single ideas

### Brand Consistency

- [ ] Aligns with "Building Risk Management Frameworks That Scale" positioning
- [ ] Demonstrates third-party risk expertise
- [ ] Appropriate level of technical depth for banking audience
- [ ] Consistent terminology with existing content

### SEO Elements

- [ ] Title tag present and compelling (50-60 characters)
- [ ] Meta description present (150-160 characters)
- [ ] H1 includes target keyword
- [ ] Internal links to related content
- [ ] Image alt text descriptive
- [ ] URL slug clean and keyword-rich

### Content Structure

- [ ] Scannable (headings, short paragraphs, bullet points)
- [ ] Clear introduction and conclusion
- [ ] Logical flow between sections
- [ ] Call-to-action present and relevant
- [ ] Contact information or next steps clear

### Legal/Compliance

- [ ] No unsubstantiated claims
- [ ] Appropriate disclaimers if needed
- [ ] No confidential client information
- [ ] Copyright/attribution for quotes or data

---

## Design Consistency Checklist

### Visual Standards

- [ ] Uses approved color palette (see docs/DESIGN_SYSTEM.md)
- [ ] Typography follows system (font families, sizes, weights)
- [ ] Spacing follows grid system
- [ ] Components match existing patterns
- [ ] Icons from approved set

### UX Standards

- [ ] Navigation consistent across pages
- [ ] CTAs use standard button styles
- [ ] Forms follow standard layout
- [ ] Error messages helpful and consistent
- [ ] Loading states handled gracefully
