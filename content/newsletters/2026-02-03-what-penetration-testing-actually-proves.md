---
title: "What Penetration Testing Actually Proves"
date: 2026-02-03
article_slug: what-penetration-testing-actually-proves
article_url: https://trevorkavanaugh.com/articles/what-penetration-testing-actually-proves.html
sent_date: 2026-02-03
subscribers_sent: 2
---

# What Penetration Testing Actually Proves

Penetration testing is a staple of third-party due diligence. Clean pen test results feel like assurance. But what did that test actually prove?

Pen tests answer one specific question: can someone break in using techniques we already know about? That's a valuable question. It's also a much narrower one than most people realize when they're checking the "pen test received" box in their vendor assessment.

## What a Penetration Test Actually Does

A penetration tester tries to break into your vendor's environment using known techniques. They probe the perimeter, look for misconfigurations, attempt to exploit documented vulnerabilities. They're simulating an attacker who has access to the same playbook of attack methods that the security community has already catalogued.

External tests ask: can someone from the internet get in? Internal tests ask: if someone's already inside, how far can they go?

It's a valuable exercise. Finding misconfigurations and known vulnerabilities before attackers do has obvious value. But the scope of what's being tested is narrower than most third-party risk assessments acknowledge.

## What Penetration Testing Doesn't Cover

The gaps in penetration testing coverage map directly to the attack vectors that have caused the biggest third-party incidents in recent years.

**Zero-day vulnerabilities.** Pen testers use known attack methods. If a vulnerability hasn't been discovered yet, it's not in their toolkit. The unknown stays unknown. By definition, a pen test can only find what the security community already knows to look for.

**Software composition.** Pen testers are testing how the application behaves, not what it's built from. They're probing the perimeter and functionality—not auditing the open source libraries and transitive dependencies that make up 70-90% of the codebase. Log4j lived in applications for years before anyone knew to look for it. No pen test would have found it, because the vulnerability wasn't known, and pen tests don't inventory software components.

**Supply chain compromises.** SolarWinds probably had clean pen tests. The attackers didn't break through the firewall—they compromised the build pipeline and injected code during compilation. A pen tester isn't watching how software gets assembled. They're testing the finished product, not the delivery mechanism that puts it on your systems.

**Vendor's vendors.** The test covers your vendor's environment. Not the infrastructure underneath. Not the third parties they depend on. The pen test boundary stops at what your vendor directly controls, even though their dependencies represent real risk to you.

**Continuous state.** A pen test is a point-in-time assessment. New code deployed next week introduces a new vulnerability? The pen test from last month doesn't know. The environment you're relying on keeps changing after the test report is signed.

## The Gap Between Testing and Assurance

Pen tests answer one question: "Can someone break in using techniques we already know about?"

They don't answer: "Is the software itself compromised?" They don't answer: "What happens when the next unknown vulnerability emerges?" They don't answer: "How secure is the vendor's build pipeline?" or "What third-party components are embedded in this software?"

This gap between what pen tests prove and what they're often treated as proving creates a false sense of security in due diligence. The pen test becomes a proxy for comprehensive security assurance when it's actually evidence of one specific, narrow capability: defending against known attack patterns at a specific point in time.

## Clean Results Aren't the Same as Secure

A clean pen test means your vendor defended against known attacks on the day of the test. That has value. Knowing they don't have obvious misconfigurations or unpatched known vulnerabilities is meaningful information.

But many of the breaches that make headlines aren't attackers walking through the front door with yesterday's techniques. They're supply chain compromises. Zero-days. Attack vectors nobody was testing for. The attacker who compromises your vendor's build system doesn't need to break through the firewall that the pen tester probed.

> "The pen test passed. The breach happened anyway."

When you review pen test results, the question isn't whether you received one. The question is whether you understand what was actually tested—and what wasn't. A clean pen test is evidence of something specific. Treating it as comprehensive security assurance is a category error that shows up when the breach that hits your vendor doesn't look anything like the attack scenarios the pen tester simulated.

The same logic applies to SOC 2 reports and other compliance artifacts. Understanding what each document actually attests to—rather than what we assume it proves—is fundamental to making informed vendor risk decisions.

---

## Newsletter Metadata

- **Subject Line**: What Penetration Testing Actually Proves
- **Preview Text**: Clean pen test results feel like assurance. But what did that test actually prove?
