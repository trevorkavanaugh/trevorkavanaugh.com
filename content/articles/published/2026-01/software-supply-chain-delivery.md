---
title: "How Your Vendor's Software Gets Delivered"
date: 2026-01-08
category: Software Supply Chain Risk
read_time: 4 min
description: "SolarWinds and CrowdStrike had nothing to do with software quality. They had everything to do with how software gets delivered to your systems."
slug: software-supply-chain-delivery
series: Software Supply Chain Risk
series_order: 4
---

# How Your Vendor's Software Gets Delivered

You can build perfect software. But if the way it reaches your systems is compromised, none of that matters.

We've talked about [what's inside software](/articles/software-supply-chain-composition.html)—the components, the open source dependencies, the [visibility gaps](/articles/software-supply-chain-visibility.html) that show up when vulnerabilities drop. But there's another dimension to software supply chain risk that gets even less attention: **how that software actually reaches you**.

Two incidents. Two names everyone in risk management knows. Two different lessons about the same vulnerability.

## SolarWinds (2020)

Attackers didn't hack into companies directly. They didn't need to. Instead, they compromised SolarWinds' update process—the mechanism that pushes new versions to customers.

When 18,000 organizations installed what looked like a routine software update, they were actually installing a backdoor. The software update itself was the attack vector. The malicious code was signed with SolarWinds' legitimate certificates. It came through official channels. It followed all the expected patterns.

Nobody questioned it. Why would they? It came from the vendor. It was digitally signed. It was "trusted." Every security control designed to verify software authenticity said this update was legitimate—because technically, it was. The build process that created it had been compromised, but the delivery mechanism worked exactly as designed.

The sophistication wasn't in the malware itself. It was in recognizing that the **update pipeline** was the softest target. Compromise that, and you inherit the trust relationship the vendor has built with thousands of customers.

## CrowdStrike (2024)

No nation-state actors this time. No hackers at all. Just a faulty update pushed to millions of machines simultaneously.

One bad configuration file. One automated delivery system with no staged rollout. One Friday morning. The result: 8.5 million devices crashed. Airlines grounded flights. Hospitals diverted patients. Emergency services went offline. Estimated damages exceeded $5 billion.

Same delivery mechanism that made SolarWinds catastrophic—the ability to push code to millions of endpoints instantly—but a completely different failure mode. This wasn't malicious compromise. It was operational risk in the delivery pipeline. The very efficiency that makes modern software distribution work—automatic updates, simultaneous deployment, minimal user intervention—became the mechanism for catastrophic failure.

CrowdStrike's software wasn't poorly built. Their update process was. And when you're deployed on millions of critical systems with kernel-level access, "move fast" becomes "break everything."

## The Common Thread

Both incidents had nothing to do with whether the software was well-built. They had everything to do with **how that software gets delivered**.

Updates. Patches. New versions. Hotfixes. The pipeline that moves code from a vendor's development environment to your production systems. That pipeline is infrastructure—critical infrastructure that most organizations have never examined.

We ask vendors about their development practices. Their code review processes. Their security testing. We rarely ask: *How exactly do updates reach our systems? What controls exist in that delivery chain? What happens if that process fails—or gets compromised?*

The [software supply chain risk conversation](/articles/software-supply-chain-pt1.html) has focused heavily on composition—what components make up the software. That matters. But delivery is equally critical. A perfectly secure application delivered through a compromised update mechanism is still a vector for attack. A well-tested product pushed through an automated pipeline with no staged rollout is still a single point of failure.

## Where This Is Headed

The next SolarWinds or CrowdStrike won't look exactly the same. Attackers adapt. Failure modes evolve. But the underlying vulnerability—implicit trust in software delivery mechanisms we've never examined—remains wide open.

Most organizations can tell you what software their critical vendors provide. Few can tell you how that software reaches their environment. What the update cadence looks like. Whether patches are staged or pushed simultaneously. What verification happens before deployment. What rollback capabilities exist.

That gap between what we assess and what actually creates risk is where the next incident lives.

The delivery mechanisms we trust implicitly deserve the same scrutiny we apply to the software itself. Because the attack surface isn't just the code—it's every step in how that code reaches you.

> "The update pipeline is infrastructure. And most of us have never looked at it."

---

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*
