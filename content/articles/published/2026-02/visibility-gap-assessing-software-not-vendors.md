---
title: "The Visibility Gap: Why We Should Be Assessing Software, Not Just Vendors"
slug: visibility-gap-assessing-software-not-vendors
date: 2026-02-10
category: TPRM
read_time: 5 min
description: "Traditional due diligence tells you whether a vendor has security controls. It doesn't tell you what's actually in their software. That's the gap we need to close."
---

# The Visibility Gap: Why We Should Be Assessing Software, Not Just Vendors

Over the past few weeks, we've talked about what SOC 2 doesn't cover. What pen tests can't find. Why self-attestation has a built-in credibility problem. The common thread? We're asking the right questions about the wrong things.

## The Gap We've Been Circling

Traditional due diligence tells you whether a vendor has security controls. It doesn't tell you what's actually in their software.

SOC 2 doesn't cover software composition. Pen tests don't review dependencies. Security questionnaires are self-reported. None of them would have caught Log4j before disclosure or prevented SolarWinds.

We've been assessing vendors. We should be assessing software.

## What Would Actually Provide Visibility

**Software Bills of Materials (SBOMs)** are machine-readable inventories of every component in a software product: open source libraries, third-party dependencies, version numbers. When Log4j hit, vendors with SBOMs could answer "are we affected?" in hours. Vendors without them took weeks, or never confirmed at all.

**Software composition analysis** provides ongoing monitoring of what's in the code, not just how it behaves. It identifies known vulnerabilities in dependencies before they're exploited, rather than discovering them during incident response.

**Delivery mechanism transparency** addresses how the vendor deploys updates. Staged rollouts or all-at-once? Rollback capability or wait-for-fix? These aren't exotic questions. They're basic operational realities most due diligence never touches.

## The Regulatory Picture Is Complicated

Two weeks ago, the US rescinded federal SBOM requirements. What was mandatory for software sold to government agencies is now optional, left to individual agency discretion.

Meanwhile, the EU's Cyber Resilience Act takes full effect in December 2027, making SBOMs mandatory for products with digital elements sold in European markets. Non-compliance carries fines up to 15 million euros.

Same visibility tools. Opposite regulatory directions.

## Requirements Aside, the Question Remains

Whether regulators mandate SBOMs or not, the visibility gap doesn't close itself.

Your vendor's software still contains components you've never assessed. Their updates still deploy through mechanisms you've never questioned. Their dependencies still carry risks that SOC 2 and pen tests were never designed to find.

The tools exist. The standards exist. Adoption is the variable.

> "The question isn't whether regulators will require this visibility. It's whether you'll wait for them to."

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*

---

## Related Articles

- [Software Supply Chain Composition](/articles/software-supply-chain-composition.html)
- [The SOC 2 Type 2 Reality Check](/articles/soc-2-type-2-reality.html)
- [What Penetration Testing Actually Proves](/articles/what-penetration-testing-actually-proves.html)
- [The Self-Attestation Problem](/articles/the-self-attestation-problem.html)
