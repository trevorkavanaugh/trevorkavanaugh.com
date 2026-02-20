---
title: "The SOC 2 System Description Problem"
date: 2026-02-19
category: TPRM
read_time: 5 min
description: "The system description in Section III of a SOC 2 report defines audit boundaries. Most reviewers skip it. That's where the real scoping decisions hide."
slug: soc-2-system-description
---

# The SOC 2 System Description Problem

Some SOC 2 scoping decisions are easy to spot—missing trust services criteria, carved-out infrastructure providers. But the hardest one to catch is the system description itself.

Every SOC 2 report includes a section—usually Section III—where the vendor describes "the system" being audited. It has a name. It has a description. It sounds comprehensive. The problem is what it leaves out.

## How This Actually Works

A vendor calls their system "The XYZ Platform" and describes it as a cloud-based solution for managing client data. That sounds like it covers the product you use. And it might.

But read the system description closely. Does it describe the customer-facing portal? Probably. Does it describe the backend data processing engine that actually handles your information? Maybe not. The internal admin tools their employees use to access your records? The API layer connecting their system to yours? The CI/CD pipeline pushing code updates to the environment you depend on?

Those components touch your data. They affect your risk. And they can be excluded from scope without a single red flag on the auditor's opinion.

The opinion is clean because the auditor tested exactly what the system description defined. Everything inside the boundary was evaluated. Everything outside it simply doesn't exist as far as the report is concerned.

## Why This Is So Hard to Catch

Missing trust services criteria shows up on the cover page. A carved-out subservice organization usually gets called out in the auditor's opinion or a dedicated section.

But a narrowly drawn system boundary? That requires you to read the system description and ask yourself: what's NOT here? What components would I expect to see described that aren't mentioned?

That's a different skill than reviewing control test results. Most reviewers go straight to Section IV—the controls and test results—because that's where the "findings" live. Section III reads like background. It's easy to skim.

But Section III is where scoping decisions are buried. And if the boundary was drawn to exclude components that matter to your risk assessment, no amount of clean test results in Section IV changes that. You're reading a clean audit of a partial picture.

## What to Actually Look For

When you open Section III, read it like a detective, not a reviewer. Ask: does this description account for everywhere my data goes inside this vendor's environment? Every system their employees use to access it? Every layer between their code and my information?

If the description only covers the front door and you care about what's happening in the back office, the report isn't giving you what you think it is.

Next week we'll get into the part of the report most people skip—where the vendor shifts control responsibility to you, and what that means for gaps nobody owns.

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*
