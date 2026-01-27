---
title: "The SOC 2 Type 2 Reality Check"
date: 2026-01-27
category: TPRM
read_time: 4 min
slug: soc-2-type-2-reality
description: "SOC 2 Type 2 is the most requested document in TPRM. It's also the most misunderstood. Here's what it actually attests to—and what it doesn't cover."
---

# The SOC 2 Type 2 Reality Check

A SOC 2 Type 2 report is the most requested document in third-party risk management. It's also the most misunderstood. We treat it like comprehensive security assurance. It isn't.

Somewhere along the way, the industry started treating SOC 2 reports as proof that a vendor is "secure." That was never what they were designed to prove. Understanding what a SOC 2 actually attests to—and what it doesn't—is fundamental to making informed vendor risk decisions.

## What a SOC 2 Type 2 Actually Is

An independent auditor tested whether your vendor's controls operated effectively over a period of time—usually 6 to 12 months. That's it.

Not whether the vendor is "secure." Not whether their product is safe to use. Not whether they've addressed every possible threat. The SOC 2 attests to whether **the specific controls the vendor defined** were functioning as described during the audit period.

This is a critical distinction. The vendor decides which controls are in scope. The auditor tests those controls. If they pass, you get a clean report. A SOC 2 is an attestation about operational controls the vendor chose to include—not a comprehensive security assessment of everything that could go wrong.

## What It Doesn't Cover

The gaps in SOC 2 coverage are significant, and they map directly to the risks that have caused the biggest third-party incidents in recent years.

**Software composition.** A SOC 2 doesn't audit what's inside your vendor's code. The open source libraries, the transitive dependencies, the components nobody's tracking—none of that is in scope. When Log4j dropped, vendors with clean SOC 2 reports scrambled to figure out whether they were affected, because software composition was never part of what they were attesting to.

**Software delivery.** How updates get pushed to your environment isn't covered. Staged rollouts? Rollback capability? All-at-once deployments to every customer simultaneously? The SOC 2 doesn't touch it. CrowdStrike had a clean SOC 2. The issue wasn't their operational controls—it was how they delivered software to millions of endpoints without adequate staging or rollback mechanisms.

**The product itself.** SOC 2 audits operational controls: access management, change control processes, incident response procedures. It doesn't test whether the software has vulnerabilities. It doesn't assess whether the architecture is sound. A vendor can have excellent access controls and still ship code with critical security flaws.

**Their vendors.** Your vendor runs on AWS. AWS has a SOC 2. But that's AWS's SOC 2, not your vendor's. Your vendor's report attests to their controls, not the infrastructure underneath. The boundary of the attestation stops at your vendor's control environment. Understanding what visibility your vendor has into their own dependencies is a separate question entirely.

## Point in Time, Not Continuous

The report covers a specific audit period. What happened after the audit ended? What changed last month? The SOC 2 doesn't tell you.

You're looking at a snapshot. The vendor's environment kept moving. They may have added new systems, changed configurations, onboarded new subprocessors, or modified their deployment practices—all after the audit period ended. The clean report you're reviewing might describe a control environment that no longer exists in its audited form.

This isn't a flaw in the SOC 2 framework. It's simply a limitation that most risk assessments don't adequately account for.

## What This Means for TPRM

SOC 2 isn't useless. It's just not what we pretend it is.

It's a baseline attestation that certain operational controls exist and function. That has real value. Knowing a vendor has documented access management, change control, and incident response—and that an independent auditor verified those controls operated effectively—is meaningful information.

But it's not comprehensive assurance. It doesn't tell you about software supply chain risk. It doesn't tell you about deployment practices. It doesn't tell you whether the vendor knows what's in their code or how they'll respond when the next critical vulnerability drops.

> "A SOC 2 is an attestation about operational controls the vendor chose to include—not a comprehensive security assessment of everything that could go wrong."

When you receive a SOC 2, the question isn't whether you received one. The question is whether you're reviewing what's actually in scope—or just checking the box that you received it.

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*
