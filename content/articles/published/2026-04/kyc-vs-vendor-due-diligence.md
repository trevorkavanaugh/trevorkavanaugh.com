---
title: "If We Did KYC the Way We Do Vendor Due Diligence"
date: 2026-04-28
category: TPRM
read_time: 4 min
description: "If banks ran KYC the way TPRM runs vendor due diligence - self-reported, vendor-scoped, redacted - regulators would shut them down in a week. Here's the asymmetry."
---

# If We Did KYC the Way We Do Vendor Due Diligence

Imagine if banks did KYC the way we do vendor due diligence.

A new customer walks in to open an account. Instead of verifying their identity independently, we hand them a questionnaire and ask them to tell us about themselves. We take every answer at face value. No independent verification. Just their word.

They hire whatever company they want to confirm they're a real person - and that company only checks the things the customer asked them to check. The customer defines the scope.

We ask for copies of their policies and procedures. They send us a table of contents. Or a redacted version with the actual content blacked out. We file it and move on.

Every ID they provide, every license, every proof of address - redacted. We accept it anyway.

Regulators would shut that bank down in a week. It would be the most egregious KYC failure in examination history.

## That's Vendor Due Diligence

Vendor risk questionnaires are [self-reported](the-self-attestation-problem.html). The vendor tells you about their own control environment. You take the answers, maybe ask a follow-up or two, and file the results. The questionnaire becomes the artifact, the artifact becomes evidence, and the evidence becomes the foundation of the risk decision - all without anyone independent looking at the actual controls.

Their SOC 2 is performed by an auditor the vendor selected, under [scoping the vendor defined](soc-2-scoping-problem.html), covering the [system boundaries the vendor drew](soc-2-system-description.html). The opinion is clean because the auditor tested exactly what the vendor asked them to test. Whatever fell outside that scope - whatever the vendor didn't want examined - never appears in the report.

You request their information security policy. Half the time you get a table of contents or a summary. Sometimes you get the full document with sections redacted. You file it because getting the unredacted version would take three months of back-and-forth you don't have time for. The deadline is real, the document gap isn't documented, and the program moves on.

And the [complementary user entity controls](soc-2-cuec-problem.html) in the SOC 2 report shift responsibility back to your organization without anyone necessarily mapping them against what your organization actually does. The audit opinion was conditional. Most TPRM programs treat the conditions as fine print.

## The Trust Asymmetry

In KYC, we independently verify. We run OFAC screens. We check government databases. We validate documents against independent sources. The customer doesn't get to define what we check or choose who checks it. The framework was built on the assumption that the customer's word, on its own, is not sufficient evidence.

In TPRM, we run OFAC. That's about where independent verification ends. After that, the vendor controls almost every variable. What gets assessed, who assesses it, what documentation you see, and how much of it is redacted. The entire process depends on the vendor's honesty and willingness to be transparent. The framework was built on the assumption that the vendor's word, on its own, is sufficient evidence.

We call both of these "due diligence." One of them actually is.

## Calling It What It Is

Vendor questionnaires and SOC 2 reports still provide useful information. The signal they generate has real value, especially when read carefully and challenged where the answers don't make sense. But we should be honest about what we're actually doing when we collect them. We're conducting trust-based assessments, not independent verification. [Calling something what it isn't](compliance-theater-vs-real-risk-management.html) is how programs end up surprised when an incident exposes the gap between assumed controls and actual ones.

The moment we start naming the trust-based mechanism for what it is, we can start having real conversations about where independent verification is needed and where trust-based assessment is acceptable given the risk. Not every vendor relationship requires KYC-grade scrutiny. Some categorically do. The argument was never that everything should be independently verified. The argument is that we should know which is which - and we should stop pretending the trust-based path is something it isn't.

If we held vendor due diligence to KYC standards, the first thing that would break is the assumption that what we have today is rigorous enough to call due diligence in the first place.

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*
