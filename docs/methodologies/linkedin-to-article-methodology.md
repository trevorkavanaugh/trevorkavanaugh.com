# LinkedIn Post to Website Article Transformation Methodology

## Purpose

This document provides Claude Code with a reusable methodology for transforming Trevor Kavanaugh's LinkedIn posts into professional website articles. Apply this methodology to all existing articles on trevorkavanaugh.com and to any new LinkedIn posts provided for publication.

---

## Core Principles

### 1. Signal Over Noise
- Expand only where more depth adds value to the existing point
- Never add generic filler, obvious statements, or common-sense padding
- If you can't add genuine insight to a section, leave it at its original length
- The goal is depth on the signal already present, not word count

### 2. Preserve Voice
- Trevor writes directly—maintain that directness
- He uses concrete examples—keep them, potentially add specificity
- He makes definitive statements—don't soften them with hedging language
- Practitioner perspective, not consultant-speak

### 3. Platform-Appropriate Formatting
- LinkedIn uses emojis for visual hierarchy → Website uses proper typography (headers, bold, formatting)
- LinkedIn engagement questions → Replace with professional CTA directing to LinkedIn
- LinkedIn's short paragraphs for thumb-scrolling → Can use slightly longer paragraphs where flow benefits

---

## Transformation Rules

### Remove
- All emojis (🔍 📊 💡 🛑 ⚠️ etc.)
- LinkedIn-style engagement questions at the end ("What's been your experience...?")
- The "Topic:" and "Date:" metadata lines (these become article metadata)

### Replace
- Emoji section headers → Proper H2 or H3 headers with descriptive titles
- Engagement question → Standard CTA: *"For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/)."*

### Add (Where Appropriate)
- Expand examples with additional specificity if the point benefits from it
- Add brief context that LinkedIn's character limit forced out
- Include transitional sentences between sections if flow improves
- Consider adding a brief introductory paragraph that sets up the core argument
- **Internal links** to other articles on the site where topics overlap or relate
- **Meta description** (150-160 characters) that hooks readers and contains key terms

### Formatting Conventions
- Use **bold** for emphasis on key terms or phrases
- Use H2 (`##`) for major sections
- Use H3 (`###`) for subsections if needed
- Use bullet points or numbered lists where structure aids comprehension
- Paragraphs can be 2-4 sentences; no need for single-sentence paragraphs

### Read Time Calculation
- Calculate as: **word count ÷ 200**, rounded up to nearest minute
- Minimum of 3 minutes for any article
- Update the `read_time` metadata field accordingly

### Introduction Paragraph
- The opening paragraph is critical for both SEO and reader engagement
- It should hook the reader within the first two sentences
- Include the core argument or insight that the article delivers
- Contain key terms naturally (not stuffed) for search visibility
- Set up why this topic matters to TPRM professionals

---

## Example Transformation

### BEFORE (LinkedIn Post)

```
Topic: Information System Data Rot
Date: 11/20/2025

Everyone's obsessing over TPRM frameworks and risk methodologies, but no one mentions the biggest threat to your program: vendor data integrity degrading over time.

You've got elegant frameworks and comprehensive policies that satisfy regulator expectations. But the data that drives those frameworks is slowly rotting away.

🔍 Here's how this actually happens:

Critical vendor with full NPPI access performing internal audit functions. Business unit wrote "consulting services" on the intake form. Gets classified as medium-risk based on that description. The risk tier is meaningless because the intake data was incomplete from day one.

Or: Vendor contact who left 18 months ago still listed as primary. Risk rating from initial onboarding three years ago—nobody refreshed it. The relationship evolved—they added services, changed subcontractors, got new data access—but nobody updated the record.

Programs look sophisticated on paper. The data underneath is garbage.

🛑 Here's why this goes unnoticed:

Auditors and regulators examine outputs—risk reports, board presentations, monitoring results. They don't audit vendor database fields. Banks build elegant risk assessments on top of stale data, and nobody catches it until an auditor asks "how did you determine this vendor's risk rating?"
By then, fixing it isn't a quick update—it's forensic investigation across hundreds of vendor records.

The root cause? You build capture processes, not maintenance processes.

Everyone focuses on intake questionnaires and initial due diligence. But even good questionnaires fail when business units write vague descriptions without detail. And nobody builds the unglamorous work of keeping it accurate over time — no validation cadence, no ownership for currency, no alerts when critical data hasn't been verified in 18 months.

The assumption is once you capture the data, it stays good. It doesn't.

💡 What actually works?

Treat data maintenance with the same rigor as initial collection. Scheduled validation cycles — not just risk reviews, actual verification that contacts still work, descriptions still match reality, relationships haven't materially changed. Field-level aging alerts flagging when critical data hasn't been touched in 12+ months. Clear ownership for keeping records current.

Audit data integrity separately from program outputs. Catch the rot before it corrupts risk assessments and board reports.

The alternative is discovering your vendor data is fiction when auditors start asking questions.


What's been your experience—do you have systematic processes for keeping vendor data current, or are you discovering staleness the hard way?
```

### AFTER (Website Article)

```html
---
title: "Information System Data Rot"
date: 2025-11-20
category: TPRM
read_time: 5 min
description: "The biggest threat to your TPRM program isn't framework sophistication—it's vendor data integrity degrading over time."
---

# Information System Data Rot

Everyone's obsessing over TPRM frameworks and risk methodologies, but no one mentions the biggest threat to your program: vendor data integrity degrading over time.

You've built elegant frameworks and comprehensive policies that satisfy regulator expectations. But the data that drives those frameworks is slowly rotting away. And unlike a framework gap—which auditors will find and you'll remediate—data rot is insidious. It corrupts your risk assessments silently, and by the time anyone notices, you're not fixing a data entry. You're conducting forensic archaeology across your entire vendor inventory.

## How Data Rot Actually Happens

Consider a critical vendor with full NPPI access performing internal audit functions. The business unit wrote "consulting services" on the intake form because that's how they think about the relationship—someone comes in, gives advice, leaves. The TPRM team classifies the vendor as medium-risk based on that description. The tiering is technically correct given the inputs. It's also meaningless, because the intake data was incomplete from day one.

Or consider this pattern: a vendor contact who left 18 months ago is still listed as primary in your system. The risk rating dates back to initial onboarding three years prior—nobody refreshed it. Meanwhile, the relationship has evolved substantially. The vendor added services. They changed subcontractors. They obtained new data access. None of this triggered an update to the vendor record, because your process captures information at intake but doesn't systematically validate it over time.

The program looks sophisticated on paper. The data underneath is garbage.

## Why This Goes Unnoticed

Auditors and regulators examine outputs—risk reports, board presentations, monitoring results. They're testing whether your program produces the artifacts regulatory guidance expects. They're not auditing individual vendor database fields. They're not spot-checking whether the contact listed for your core banking provider still works at that company.

So institutions build elegant risk assessments on foundations of stale data, and nobody catches it until an auditor asks a pointed question: "How did you determine this vendor's risk rating?" You pull up the record, and the rating traces back to a three-year-old questionnaire completed by someone who's since left the organization, describing services that have since expanded, with contacts that no longer exist.

At that point, fixing it isn't a quick update. It's forensic investigation across hundreds of vendor records, trying to reconstruct what's actually true.

## The Root Cause

The fundamental problem is that organizations build **capture processes**, not **maintenance processes**.

Everyone focuses on intake questionnaires and initial due diligence. Resources go into designing comprehensive onboarding workflows, building risk assessment templates, creating approval chains. These are visible, auditable artifacts that demonstrate program maturity.

But even well-designed questionnaires fail when business units write vague descriptions without detail—and nobody follows up to clarify. Nobody builds the unglamorous work of keeping data accurate over time: validation cadences, ownership assignments for data currency, automated alerts when critical fields haven't been verified in 18 months.

The implicit assumption is that once you capture vendor data, it stays good. It doesn't. Vendors change. Relationships evolve. Contacts leave. Subcontractors rotate. Data decays the moment it's entered.

## What Actually Works

Treat data maintenance with the same rigor as initial collection. This means:

- **Scheduled validation cycles**—not just periodic risk reviews (which examine outputs), but actual verification that contacts still work, descriptions still match reality, and relationships haven't materially changed
- **Field-level aging alerts** that flag when critical data hasn't been touched in 12+ months, forcing review even when no risk event triggers attention
- **Clear ownership** for keeping records current—someone accountable for data quality, not just program compliance

Audit data integrity separately from program outputs. Test whether the inputs driving your risk assessments reflect current reality, not just whether the assessments themselves are documented correctly. Catch the rot before it corrupts your risk reports and board presentations.

The alternative is discovering your vendor data is fiction when auditors start asking questions you can't answer.

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*
```

---

## Key Differences in the Example

| Element | LinkedIn Version | Website Version |
|---------|------------------|-----------------|
| Section headers | Emoji-prefixed ("🔍 Here's how...") | Descriptive H2 ("How Data Rot Actually Happens") |
| Opening | Two short paragraphs | Expanded with additional context on why data rot is insidious |
| Examples | Terse, punchy | Same examples with slightly more elaboration on implications |
| Root cause section | Brief explanation | Expanded to develop the capture vs. maintenance distinction |
| Solutions | Dense paragraph with em-dashes | Structured bullet points with bold emphasis |
| Closing | Engagement question | Professional CTA to LinkedIn |
| Overall length | ~400 words | ~700 words |

---

## Instructions for Claude Code

### For Existing Articles

1. Read each existing article HTML file on the website
2. Identify the original LinkedIn post structure (emoji headers, engagement questions)
3. Apply the transformation rules above
4. Expand sections where additional depth adds genuine value—use judgment
5. Maintain Trevor's direct voice and practitioner perspective
6. Do not add filler, hedging, or obvious statements
7. Update the HTML files in place, preserving existing metadata and styling

### For New Posts

When Trevor provides a new LinkedIn post for the website:

1. Apply this same methodology
2. Create the article in the established website format/structure
3. Generate appropriate metadata (title, date, category, read_time, description)
4. Place in the appropriate directory

### Quality Check

Before finalizing any transformation, verify:

- [ ] All emojis removed
- [ ] Proper headers replace emoji section markers
- [ ] Engagement question replaced with LinkedIn CTA
- [ ] Expansions add depth, not noise
- [ ] Voice remains direct and practitioner-focused
- [ ] No consultant-speak or generic filler introduced
- [ ] Formatting uses bold, headers, and lists appropriately
- [ ] Meta description is 150-160 characters and compelling
- [ ] Read time calculated correctly (word count ÷ 200)
- [ ] Opening paragraph hooks reader and contains key terms
- [ ] Internal links added where relevant articles exist

---

## Categories for Tagging

Use these category tags based on article content:

- **TPRM** - Core third-party risk management topics
- **Regulatory** - Compliance, examination, regulatory guidance
- **M&A** - Merger/acquisition integration topics
- **Technology** - Software supply chain, dependencies, technical risk
- **Leadership** - Career, management, professional development

Most articles will be TPRM; use other tags when the primary focus is clearly in that domain.
