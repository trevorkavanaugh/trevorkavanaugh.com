# LinkedIn Post Publisher — Project Brief

## What We're Building

A simple command-line tool that lets me draft LinkedIn posts locally and publish them directly to my personal LinkedIn profile without ever opening linkedin.com. That's it. Not a social media management platform, not a scheduler (yet), not a dashboard. Just: write post, preview post, publish post.

## Why

I'm building a thought leadership presence in the TPRM / vendor risk management space. I write posts frequently with help from Claude Desktop, and the manual flow right now is: copy text, open LinkedIn, paste, format, publish. I want to cut that down to: finalize draft, run a command, done.

## How It Should Work

1. I write a post (or Claude Desktop helps me write one) and save it as a text/markdown file
2. I give Claude Code the post content and Claude Code uses a command like `python publish.py post.md` or similar
3. The tool shows me a preview of what's about to go out — the full text, character count, any warnings
4. I confirm with a y/n
5. It hits the LinkedIn API and publishes to my personal profile
6. Claude Code tells me it worked and gives me the link to the live post

That's the happy path. Keep it simple.

## LinkedIn API Details

- LinkedIn has a Posts API: `POST https://api.linkedin.com/rest/posts`
- I need to create a LinkedIn Developer App at developer.linkedin.com to get a client ID and client secret
- The app needs the `w_member_social` OAuth scope to post on my behalf
- Auth is OAuth 2.0 — three-legged flow to get an access token
- Access tokens expire after 60 days, so we need a clean way to handle token refresh or re-auth when it expires
- The API also needs my LinkedIn Person URN (like `urn:li:person:abc123`) which we get from the profile endpoint once authenticated
- Required headers include `X-Restli-Protocol-Version: 2.0.0` and `Linkedin-Version: YYYYMM`

## What I Want in V1

- **Auth flow:** A one-time setup command that walks me through OAuth, stores the token locally (securely — not plaintext in a config file sitting in a git repo), and handles refresh/re-auth gracefully when the token expires
- **Publish command:** Takes a text file or markdown file as input, formats it for LinkedIn's API, previews it, and publishes on confirmation
- **Text-only posts for now.** No images, no articles, no document attachments in V1. Just text content. We can add media support later.
- **Post validation:** Warn me if the post exceeds LinkedIn's character limit (~3,000 chars), if there are formatting issues, etc.
- **Success confirmation:** After publishing, return the post URL so I can verify it's live
- **Integration with Website:** When a post is published to linkedin, it will be converted to article format using our existing methodology and then converted to newsletter format and sent out using our existing methodology. Essentially: Linkedin Post published -> Post converted to Article -> Article published to Insights -> Article converted to Newsletter -> Newsletter sent to subscribers.

## What I DON'T Want in V1

- No scheduling. I'll publish manually for now. (this will be V2)
- No analytics or engagement tracking (this will be V2)
- No multi-account support. Just my personal profile.
- No web UI or GUI. CLI only.
- No image/media uploads yet

## Tech Preferences

- Python (I'm comfortable reading and QA'ing Python)
- Config and tokens stored in a dotfile directory

## Future Ideas (NOT for V1, just context)

- Image and document attachment support
- Scheduled posting (cron or task scheduler)
- Integration with my TPRM content generation workflow in Claude Desktop adapted for Claude Code or Claude API — where Claude drafts posts on topics I have listed out and publishes them on a schedule. MUST AVOID LLM GIVEAWAYS and MUST USE MY WRITING STYLE.
- Post templates for recurring content formats
- Analytics pull to see how posts performed

## Next Steps

Architect the project structure, figure out the OAuth flow implementation details, and scaffold the codebase. Don't start building until we've agreed on the approach. I want to see the blueprint before we pour concrete.

## Overall End Goal

We have an automated TPRM and Risk Management content engine that drafts and publishes posts from a topic list I will create and that I will continue updating as the list runs out of topics. This will be integrated with the website insights and newsletter.

— Trevor
