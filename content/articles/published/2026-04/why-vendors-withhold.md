---
title: "Every Vendor Is Incentivized to Hide Bad News"
date: 2026-04-30
category: TPRM
read_time: 4 min
description: "Vendors aren't malicious when they hide bad news. The system rewards withholding and punishes transparency. Until the math flips, the incentive structure works against you."
---

# Every Vendor Is Incentivized to Hide Bad News

Every vendor you work with is incentivized to hide bad news from you. Not because they're malicious. Because the system rewards it.

Think about what happens when a vendor discloses a security incident. Their stock drops. Customers panic. Prospects walk. Competitors use it in sales decks. Regulators show up. Lawsuits follow.

Now think about what happens when they don't disclose. Nothing. At least not immediately. And "not immediately" is all the incentive most organizations need.

## The Math Works Against You

A vendor discovers a breach. From that moment, every day they delay disclosure is a day their stock price holds, their sales pipeline stays intact, and their other clients don't start demanding answers. The longer the silence holds, the longer the financial picture holds.

Their lawyers advise containment before notification. Their PR team wants to control the narrative. Their board wants full scope before making statements. None of this is unreasonable from the vendor's perspective. Each function is doing its job exactly the way its job is defined.

The average vendor takes about 25 days to notify affected clients. Banks have regulatory obligations to notify consumers within 36 to 72 hours depending on jurisdiction. Your contract says 24 hours. The vendor's entire incentive structure says wait. [Contract language doesn't fix the gap](contracts-are-financial-disaster-recovery.html) - it just allocates liability after the gap has already played out.

## Beyond Incident Disclosure

The incentive to withhold extends far beyond breach notification. It runs through every stage of vendor due diligence.

[Vendor questionnaires are self-reported](the-self-attestation-problem.html). What's the incentive to be honest about control weaknesses when honesty could cost you the contract? A vendor that admits "we don't have a formal patch management cadence" loses deals to the one that writes "patches are applied in accordance with our risk-based methodology" - which could mean the exact same thing. The first answer might be the more honest one. The second answer wins the business.

[SOC 2 scoping is vendor-defined](soc-2-scoping-problem.html). What's the incentive to include every system when a narrower scope means fewer findings and a cleaner report? The auditor tests what's in scope. What gets left out doesn't generate findings, and what doesn't generate findings doesn't surface in due diligence. The opinion stays clean because the boundary stays narrow.

Policy documents get redacted before sharing. What's the incentive to give full transparency into your security program when that could expose gaps? Whatever the vendor isn't comfortable showing gets a black bar. The receiving organization files the redacted version because chasing the unredacted one costs months of back-and-forth and might not produce a different outcome anyway.

At every stage of due diligence, the vendor's business interests and your risk management interests point in opposite directions. [The trust asymmetry runs deeper than questionnaire honesty](kyc-vs-vendor-due-diligence.html) - it's structural, baked into the incentive landscape that surrounds every vendor relationship.

## How the System Shifts

The incentive structure changes when the cost of withholding exceeds the cost of disclosure.

Right now, penalties for delayed breach notification are usually smaller than the market punishment for timely disclosure. A vendor that discloses on day three loses customers and stock value immediately. A vendor that discloses on day twenty-five may eventually face a contractual fine that's smaller than the revenue they preserved by delaying. The math points toward delay until the math stops pointing toward delay.

Regulatory pressure helps. Mandatory notification windows with real enforcement raise the cost of withholding. The 36-to-72-hour banking requirement is one example, but it only applies to the financial institution that holds the customer relationship - not to the vendor that caused the breach. The asymmetry is built into the regulatory architecture itself.

Contractual consequences help if they're enforceable at scale. Most aren't. A liability cap that pays out a fraction of the institution's actual cost to remediate a breach doesn't change the incentive math meaningfully. The vendor still profits from delay even after paying the contractual penalty.

The most powerful lever might be market expectation. If customers start treating transparency as a competitive advantage and opacity as a red flag, the incentive structure starts to move. Vendors who disclose quickly start winning deals against vendors who disclose slowly. Vendors who hand over unredacted policies start winning deals against vendors who redact. The market reward for transparency starts to rival the market punishment for it.

That requires buyers - the institutions doing the assessing - to actually weigh transparency in the assessment. [Most programs reward vendors who look clean on paper](compliance-theater-vs-real-risk-management.html). We should be rewarding vendors who are honest about where they're not.

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*
