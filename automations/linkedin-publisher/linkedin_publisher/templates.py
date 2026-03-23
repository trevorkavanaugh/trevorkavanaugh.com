"""
HTML and Markdown templates for the LinkedIn Publisher pipeline.

All templates use str.format() compatible placeholders. Literal curly braces
in CSS/JS are escaped with double braces {{ }}.
"""

# ---------------------------------------------------------------------------
# 1. Full article HTML page template
# ---------------------------------------------------------------------------

ARTICLE_PAGE_TEMPLATE = """\
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-WXHBC0YD0Z"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());
      gtag('config', 'G-WXHBC0YD0Z');
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{meta_description}">
    <title>{title} | Trevor Kavanaugh</title>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/articles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="/js/analytics.js" defer></script>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <header class="site-header" id="header">
        <div class="header-container">
            <a href="../index.html" class="logo">
                <div class="logo-icon">TK</div>
                <span class="logo-text">Trevor Kavanaugh</span>
            </a>
            <nav class="main-nav" aria-label="Main navigation">
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../insights.html" class="active">Insights</a></li>
                    <li><a href="../services.html">Advisory</a></li>
                    <li><a href="../index.html#contact">Contact</a></li>
                </ul>
            </nav>
            <button class="menu-toggle" aria-label="Open navigation menu" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <div class="mobile-menu" id="mobile-menu">
        <button class="menu-close" aria-label="Close navigation menu">
            <span>&times;</span>
        </button>
        <nav aria-label="Mobile navigation">
            <ul>
                <li><a href="../index.html">Home</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="../insights.html">Insights</a></li>
                <li><a href="../services.html">Advisory</a></li>
                <li><a href="../index.html#contact">Contact</a></li>
            </ul>
            <div class="mobile-menu-contact">
                <a href="mailto:trevor@trevorkavanaugh.com">trevor@trevorkavanaugh.com</a>
                <a href="https://www.linkedin.com/in/trevorkavanaugh/" target="_blank">LinkedIn</a>
            </div>
        </nav>
    </div>
    <div class="mobile-menu-overlay" id="mobile-menu-overlay"></div>

    <main id="main-content">
        <article class="article-page">
            <header class="article-hero">
                <div class="article-hero-container">
                    <span class="article-category {category_class}">{category}</span>
                    <h1>{title}</h1>
                    <div class="article-meta-line">
                        <time datetime="{date_iso}">{date_formatted}</time>
                        <span class="separator">-</span>
                        <span class="read-time">{read_time} min read</span>
                    </div>
                </div>
            </header>

            <div class="article-content-wrapper">
                <div class="article-content">
                    {article_body}

                    <p><em>For more perspectives on third-party risk management, <a href="https://www.linkedin.com/in/trevorkavanaugh/" target="_blank">connect with me on LinkedIn</a>.</em></p>
                </div>
            </div>

            <section class="author-box">
                <div class="author-box-container">
                    <div class="author-info">
                        <div class="author-avatar">
                            <img src="../images/trevor_kavanaugh_headshot.jpg" alt="Trevor Kavanaugh" style="object-position: center 25%;">
                        </div>
                        <div class="author-details">
                            <h3>About the Author</h3>
                            <p><strong>Trevor Kavanaugh</strong> | VP, Third-Party Risk Management</p>
                            <p>With over a decade in banking, I've built my career across the risk spectrum&mdash;from compliance and BSA/AML to internal audit, now leading third-party risk management at an FDIC-chartered regional bank with DFPI oversight. This journey gave me a ground-level view of how risk actually functions across financial institutions.</p>
                            <p>I believe in building risk frameworks designed for modern, evolving threats&mdash;not just satisfying checkboxes. Risk management runs deeper than prescriptive compliance rules. It's abstract, constantly shifting, and demands continuous adaptation. I challenge legacy thinking and status quo approaches to push our profession forward.</p>
                            <p>My goal is simple: help everyone do better.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="related-articles">
                <div class="container">
                    <h2>Continue Reading</h2>
                    <div class="related-articles-grid">
                        {related_articles}
                    </div>
                </div>
            </section>
        </article>

        <section class="cta" id="contact">
            <div class="container">
                <h2>Continue the Conversation</h2>
                <p>Have thoughts on this topic? I'd love to hear your perspective. Connect with me on LinkedIn or reach out directly.</p>
                <div class="cta-buttons">
                    <a href="https://www.linkedin.com/in/trevorkavanaugh/" target="_blank" class="btn btn-cta">Connect on LinkedIn</a>
                    <a href="mailto:trevor@trevorkavanaugh.com" class="btn btn-secondary">Send an Email</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-logo">
                <div class="logo-icon">TK</div>
                <span>Trevor Kavanaugh</span>
            </div>
            <div class="footer-columns">
                <div class="footer-col">
                    <h3>Navigation</h3>
                    <nav aria-label="Footer navigation">
                        <ul>
                            <li><a href="../index.html">Home</a></li>
                            <li><a href="../about.html">About</a></li>
                            <li><a href="../insights.html">Insights</a></li>
                            <li><a href="../services.html">Advisory</a></li>
                            <li><a href="../index.html#contact">Contact</a></li>
                        </ul>
                    </nav>
                </div>
                <div class="footer-col">
                    <h3>Connect</h3>
                    <ul class="contact-info">
                        <li><a href="mailto:trevor@trevorkavanaugh.com">trevor@trevorkavanaugh.com</a></li>
                        <li><a href="https://www.linkedin.com/in/trevorkavanaugh/" target="_blank">LinkedIn</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Newsletter</h3>
                    <p style="color: #8899aa; font-size: 14px; margin-bottom: 12px;">New articles every Tuesday & Thursday</p>
                    <form id="newsletter-form" class="newsletter-form">
                        <div class="newsletter-input-group">
                            <input type="email" id="newsletter-email" placeholder="Enter your email" required>
                            <button type="submit">Subscribe</button>
                        </div>
                        <p id="newsletter-message" class="newsletter-message"></p>
                    </form>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2026 Trevor Kavanaugh</p>
                <nav class="legal-nav" aria-label="Legal navigation">
                    <a href="../privacy.html">Privacy Policy</a>
                </nav>
            </div>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>"""
"""Full article HTML page. Placeholders: {title}, {meta_description}, {category},
{category_class}, {date_formatted}, {date_iso}, {read_time}, {article_body},
{slug}, {related_articles}."""


# ---------------------------------------------------------------------------
# 2. Article card for insights.html
# ---------------------------------------------------------------------------

INSIGHTS_CARD_TEMPLATE = """\
                    <!-- Article: {title} -->
                    <article class="article-card" data-category="{category_class}">
                        <a href="articles/{slug}.html" class="article-card-link">
                            <div class="article-content">
                                <span class="article-category {category_class}">{category}</span>
                                <h3 class="article-title">{title}</h3>
                                <p class="article-excerpt">{meta_description}</p>
                                <div class="article-footer">
                                    <span class="article-date">{date_formatted} &bull; {read_time} min read</span>
                                    <span class="article-link">Read more &rarr;</span>
                                </div>
                            </div>
                        </a>
                    </article>"""
"""Single article card for the insights.html articles grid. Placeholders:
{slug}, {category}, {category_class}, {title}, {meta_description},
{date_formatted}, {read_time}."""


# ---------------------------------------------------------------------------
# 3. Insight card for the homepage Latest Insights section
# ---------------------------------------------------------------------------

INDEX_INSIGHT_TEMPLATE = """\
                    <article class="insight-card">
                        <a href="articles/{slug}.html">
                            <div class="insight-content">
                                <span class="insight-category">{category}</span>
                                <h3>{title}</h3>
                                <p>{meta_description}</p>
                                <div class="insight-meta">
                                    <span class="read-time">{read_time} min read</span>
                                    <span class="insight-date">{date_formatted}</span>
                                </div>
                            </div>
                        </a>
                    </article>"""
"""Single insight card for the index.html Latest Insights grid. Placeholders:
{slug}, {category}, {title}, {meta_description}, {read_time}, {date_formatted}."""


# ---------------------------------------------------------------------------
# 4. Inline style map for newsletter HTML conversion
# ---------------------------------------------------------------------------

NEWSLETTER_STYLE_MAP = {
    "h2": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 22px; color: #1a2332; margin: 32px 0 16px 0; "
        "padding-bottom: 8px; border-bottom: 2px solid #4A90E2;"
    ),
    "h3": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 18px; color: #1a2332; margin: 24px 0 12px 0;"
    ),
    "p": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 16px; line-height: 1.7; color: #2c3e50; "
        "margin: 0 0 16px 0;"
    ),
    "strong": "font-weight: 700;",
    "em": "font-style: italic;",
    "ul": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 16px; line-height: 1.7; color: #2c3e50; "
        "margin: 0 0 16px 0; padding-left: 24px;"
    ),
    "ol": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 16px; line-height: 1.7; color: #2c3e50; "
        "margin: 0 0 16px 0; padding-left: 24px;"
    ),
    "li": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 16px; line-height: 1.7; color: #2c3e50; "
        "margin-bottom: 8px;"
    ),
    "a": "color: #4A90E2; text-decoration: underline;",
    "blockquote": (
        "font-family: 'Georgia', 'Times New Roman', serif; "
        "font-size: 17px; font-style: italic; line-height: 1.7; "
        "color: #34495e; margin: 24px 0; padding: 16px 24px; "
        "border-left: 4px solid #4A90E2; background-color: #f8f9fa;"
    ),
}
"""Maps HTML tag names to inline CSS style strings for email-safe newsletter
conversion. Styles are compatible with Outlook and Gmail rendering."""


# ---------------------------------------------------------------------------
# 5. Markdown frontmatter template for the published article archive
# ---------------------------------------------------------------------------

ARTICLE_ARCHIVE_TEMPLATE = """\
---
title: "{title}"
date: {date_iso}
category: {category}
read_time: {read_time} min
description: "{meta_description}"
slug: {slug}
---

"""
"""Markdown frontmatter for content/articles/published/ archives. Placeholders:
{title}, {date_iso}, {category}, {read_time}, {meta_description}, {slug}."""


# ---------------------------------------------------------------------------
# 6. Markdown frontmatter template for the newsletter archive
# ---------------------------------------------------------------------------

NEWSLETTER_ARCHIVE_TEMPLATE = """\
---
title: "{title}"
date: {date_iso}
article_slug: {slug}
article_url: https://trevorkavanaugh.com/articles/{slug}.html
sent_date: {sent_date}
subscribers_sent: {subscribers_sent}
---

"""
"""Markdown frontmatter for content/newsletters/ archives. Placeholders:
{title}, {date_iso}, {slug}, {sent_date}, {subscribers_sent}."""
