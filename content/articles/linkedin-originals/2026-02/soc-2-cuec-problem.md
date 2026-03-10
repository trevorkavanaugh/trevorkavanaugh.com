---
title: "The SOC 2 CUEC Problem"
platform: LinkedIn
date_posted: 2026-02-26
converted_to_article: 2026-02-26
article_url: /articles/soc-2-cuec-problem.html
series: SOC 2 Analysis (Part 4 of 4)
---

# Original LinkedIn Post

Last week we talked about how vendors draw system boundaries to quietly exclude backend components from their SOC 2. This week is the part of the report most people skip entirely.

Buried in every SOC 2 is a section called Complementary User Entity Controls — CUECs. It's easy to gloss over. It shouldn't be.

CUECs are controls the vendor assumes YOU have in place. The auditor's opinion — that clean, unqualified opinion everyone skips to — is conditioned on your organization doing certain things on your end. If you're not doing them, the assurance that report provides has holes.

🔴 How this works

The vendor's control environment doesn't operate in isolation. Some controls only work if the customer is doing their part. So the auditor documents assumptions about what the customer is responsible for.

Some of these are completely reasonable. "Customer is responsible for managing their own user access credentials." Of course. "Customer should restrict access to authorized personnel." Sure. Nobody has a problem with those.

But some CUECs are doing something different. They're moving meaningful control responsibility from the vendor to you — and unless someone on your side is reading that section and mapping it against what you actually do, those controls exist in no man's land. The vendor didn't build them because they assumed you would. You didn't build them because you assumed the vendor did.

That's not a control gap anyone planned for.

⚠️ Where this gets real

Imagine a CUEC that says "Customer is responsible for monitoring user activity logs provided by the platform." Sounds reasonable. But does your team actually monitor those logs? Do you have the staffing? Did anyone even set up the log exports?

Or: "Customer is responsible for ensuring data transmitted to the platform is encrypted in transit." Your integration team built the API connection two years ago. Did they configure TLS? Has anyone verified it's still enforced after the vendor's last platform update?

These aren't hypothetical. They're the kinds of assumptions buried in reports right now that create real exposure when no one on either side is owning the control.

📋 Why this matters for your risk assessment

A clean SOC 2 opinion means the vendor's controls operated effectively — within the system boundary they defined, for the criteria they selected, assuming you're holding up your end of the CUECs.

That's three layers of conditionality sitting underneath what most programs treat as blanket assurance.

The scoping series comes down to this: the report isn't lying to you. It's telling you exactly what it covers and what it assumes. The question is whether anyone on your team is reading closely enough to hear it.

Does your team review CUECs and map them against what you're actually doing — or is that section getting skimmed?
