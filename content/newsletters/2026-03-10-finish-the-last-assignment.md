---
title: "Finish the Last Assignment"
date: 2026-03-10
article_slug: finish-the-last-assignment
article_url: https://trevorkavanaugh.com/articles/finish-the-last-assignment.html
sent_date: 2026-03-10
subscribers_sent: 2
---

# Finish the Last Assignment

Everyone's talking about AI governance. Frameworks. Guardrails. Responsible AI. Ethical AI. Most of it is buzzwords dressed up as strategy. I don't say that to be dismissive---I say it because for anyone to tell you what AI governance actually looks like in practice, they'd need a crystal ball. We don't know what these systems will be doing in three years, what they'll be integrated into, or what failure modes look like at scale. Building governance frameworks for AI right now is like planning your teenager's curfew when they're still in preschool. You don't even know what they'll be into yet.

And while everyone races to govern what's coming next, we still haven't figured out what's already here. The internet era---the infrastructure we've been building on for a quarter century---is not secured. The tools we use to evaluate it haven't kept pace. And the speed at which AI will compound these existing gaps should concern anyone paying attention.

## The Internet Era Is Not Secured

The numbers tell a story that's hard to argue with. In 2020, the security community identified 18,323 new vulnerabilities. By 2023, that number hit 29,000. In 2024, it crossed 40,000. In 2025---48,448. That's a **164% increase in five years**. Not a gradual drift. An acceleration.

And these aren't theoretical risks sitting in academic papers. Third-party involvement in breaches **doubled to 30%** this year. Ransomware appeared in **44% of breaches**---up 37% year over year. The average data breach now costs **$4.88 million**. All from systems we built over the last two decades that we're still struggling to secure.

This is the infrastructure we're layering AI on top of. Not a hardened, well-understood foundation---an expanding attack surface that's getting worse faster than we're getting better at defending it. Every new vulnerability in an internet-era system is a vulnerability that AI-powered processes will inherit, interact with, and potentially amplify.

## Our Attestation Tools Haven't Kept Pace

SOC 2's trust services criteria---the foundation of how we independently evaluate vendor controls---were established in 2017 and haven't changed since. Think about what's happened in that time. SolarWinds happened in 2020, demonstrating that a compromised software build pipeline could deliver malicious code to 18,000 organizations through a trusted update mechanism. Log4j hit in 2021, revealing that a single vulnerability in an open-source logging library could expose virtually every enterprise on the planet. The CrowdStrike outage in 2024 showed that a single content update from a trusted security vendor could take down systems across the Fortune 500 simultaneously.

Each of these incidents exposed a fundamentally different failure mode. SolarWinds was a supply chain integrity attack. Log4j was a dependency risk explosion. CrowdStrike was a trusted-channel deployment failure. None of them were about whether a vendor had access controls or encryption or change management procedures---the kinds of controls SOC 2 was designed to evaluate.

AICPA designed SOC 2 to assess control environments against defined criteria, and it does that well. The framework isn't broken for what it was built to do. But no comparable framework has emerged to cover what SOC 2 was never built for---software supply chain integrity, dependency risk, update delivery mechanisms. The scoping decisions, system boundary definitions, and timing gaps I've written about in the SOC 2 series all compound this problem---they show how even within what SOC 2 does cover, the conditionality underneath the assurance is substantial. The gap between what the criteria address and what actually threatens organizations in 2026 has only widened since 2017.

Now layer AI on top of that.

## The Speed Problem

The internet let us share data and connect like never before. It created enormous value and enormous risk simultaneously. AI lets us do things we never could---at speeds we'd have thought unimaginable five years ago. That's not just a capability upgrade. It's a fundamental change in the relationship between decision speed and oversight capacity.

Every "human in the loop" advocate believes in the concept. I'd bet a fraction of them actually insert themselves to any meaningful degree. Consider what this looks like in practice: an AI system flags a vendor risk assessment for review. The analyst opens it, sees the AI's analysis is thorough and well-reasoned, and approves it. Then does the same thing for the next one. And the next. At some point, the "review" becomes a rubber stamp---not because the analyst is lazy, but because the AI's output is consistently good enough that careful review stops adding value relative to the time it costs.

Give it a few years. Once AI performs review steps as well as humans---and in many domains, it already does---the human bottleneck disappears. Not because anyone decides to remove it, but because the process just moves faster without us. Nobody fights to slow it back down. The economics don't support it. The competitive pressure doesn't allow it. The human in the loop becomes the human adjacent to the loop, then the human who gets a summary after the loop completes.

> "We're building governance for systems that will outpace the governance before the ink dries. On top of internet infrastructure we've had 25 years to secure and still haven't."

## The Compounding Problem

Here's what makes this particularly dangerous: AI doesn't just inherit the vulnerabilities of the infrastructure it runs on. It amplifies them. An unsecured API endpoint is a problem. An unsecured API endpoint that an AI agent autonomously calls thousands of times per hour, making decisions based on the data it receives, is a categorically different problem. A compromised software update mechanism is bad. A compromised update mechanism for an AI model that other systems depend on for decision-making is worse by orders of magnitude.

The internet era created distributed risk---vulnerabilities scattered across interconnected systems. AI creates **concentrated, high-velocity risk**---automated systems making consequential decisions at machine speed on top of that distributed, unsecured foundation. The failure modes aren't additive. They're multiplicative.

And we're trying to govern the AI layer while the infrastructure layer underneath it remains demonstrably insecure. That's building a fire escape plan for the penthouse while the foundation has cracks.

## What "Finishing the Last Assignment" Actually Looks Like

I'm not arguing that AI governance doesn't matter. It does. And it will matter more as these systems become more capable and more deeply integrated into critical processes. But the industry's current approach---racing to publish AI governance frameworks while internet-era security gaps widen every year---has the sequencing wrong.

Finishing the last assignment means:

- **Closing the attestation gap**---The industry needs independent assessment frameworks that address software supply chain integrity, dependency risk, and deployment mechanisms. SOC 2 covers what it covers. Something needs to cover what it doesn't. The conditionality underneath SOC 2 assurance is already substantial enough without adding AI complexity on top.
- **Addressing the vulnerability acceleration**---A 164% increase in new vulnerabilities over five years isn't a trend line that governance documents will flatten. It requires structural changes in how software is built, deployed, and maintained---and how organizations assess the vendors doing the building.
- **Getting honest about third-party risk**---Third-party involvement in breaches doubling to 30% means the current approach to vendor risk management isn't keeping pace with how interconnected systems have become. The persistent channels between vendors and your environment represent continuous risk exposure, not point-in-time relationships.
- **Building security infrastructure that can absorb AI**---Rather than governing AI in a vacuum, secure the infrastructure AI will run on. Harden the APIs it will call. Validate the data pipelines it will consume. Secure the update mechanisms it will use to evolve. If the foundation is solid, AI governance becomes a more tractable problem. If the foundation is cracked, AI governance is theater.

## Where the Industry's Energy Should Be

The appeal of AI governance is understandable. It's forward-looking. It sounds sophisticated. It positions organizations as thoughtful and proactive. Publishing an AI governance framework gets attention in ways that quietly hardening your vendor assessment methodology does not.

But the organizations that will actually be resilient in an AI-powered world aren't the ones with the most polished governance documents. They're the ones that secured their internet-era infrastructure first. That understood their software supply chain risk. That closed the gaps in their attestation tools. That built the unglamorous foundational security that gives AI governance something solid to sit on.

We've had 25 years to secure internet infrastructure. We haven't finished. The vulnerability count is accelerating, not declining. Third-party breaches are increasing, not decreasing. Our primary attestation framework hasn't been updated since before the most significant supply chain attacks in history.

Maybe before we race to govern AI, we should finish the last assignment.

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*

---

## Newsletter Metadata

- **Subject Line**: Finish the Last Assignment
- **Preview Text**: The industry is racing to govern AI while internet-era infrastructure remains unsecured. 48,000 new CVEs in 2025 and SOC 2 criteria unchanged since 2017.

## Email HTML Content

<!-- Use this content for the article_content field when sending via API -->

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Everyone's talking about AI governance. Frameworks. Guardrails. Responsible AI. Ethical AI. Most of it is buzzwords dressed up as strategy. I don't say that to be dismissive&mdash;I say it because for anyone to tell you what AI governance actually looks like in practice, they'd need a crystal ball. We don't know what these systems will be doing in three years, what they'll be integrated into, or what failure modes look like at scale. Building governance frameworks for AI right now is like planning your teenager's curfew when they're still in preschool. You don't even know what they'll be into yet.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">And while everyone races to govern what's coming next, we still haven't figured out what's already here. The internet era&mdash;the infrastructure we've been building on for a quarter century&mdash;is not secured. The tools we use to evaluate it haven't kept pace. And the speed at which AI will compound these existing gaps should concern anyone paying attention.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">The Internet Era Is Not Secured</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The numbers tell a story that's hard to argue with. In 2020, the security community identified 18,323 new vulnerabilities. By 2023, that number hit 29,000. In 2024, it crossed 40,000. In 2025&mdash;48,448. That's a <strong style="color: #1a2a3a;">164% increase in five years</strong>. Not a gradual drift. An acceleration.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">And these aren't theoretical risks sitting in academic papers. Third-party involvement in breaches <strong style="color: #1a2a3a;">doubled to 30%</strong> this year. Ransomware appeared in <strong style="color: #1a2a3a;">44% of breaches</strong>&mdash;up 37% year over year. The average data breach now costs <strong style="color: #1a2a3a;">$4.88 million</strong>. All from systems we built over the last two decades that we're still struggling to secure.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">This is the infrastructure we're layering AI on top of. Not a hardened, well-understood foundation&mdash;an expanding attack surface that's getting worse faster than we're getting better at defending it. Every new vulnerability in an internet-era system is a vulnerability that AI-powered processes will inherit, interact with, and potentially amplify.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Our Attestation Tools Haven't Kept Pace</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">SOC 2's trust services criteria&mdash;the foundation of how we independently evaluate vendor controls&mdash;were established in 2017 and haven't changed since. Think about what's happened in that time. SolarWinds happened in 2020, demonstrating that a compromised software build pipeline could deliver malicious code to 18,000 organizations through a trusted update mechanism. Log4j hit in 2021, revealing that a single vulnerability in an open-source logging library could expose virtually every enterprise on the planet. The CrowdStrike outage in 2024 showed that a single content update from a trusted security vendor could take down <a href="https://trevorkavanaugh.com/articles/software-supply-chain-delivery.html" style="color: #4A90E2; text-decoration: underline;">systems across the Fortune 500 simultaneously</a>.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Each of these incidents exposed a fundamentally different failure mode. SolarWinds was a supply chain integrity attack. Log4j was a dependency risk explosion. CrowdStrike was a trusted-channel deployment failure. None of them were about whether a vendor had access controls or encryption or change management procedures&mdash;the kinds of controls SOC 2 was designed to evaluate.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">AICPA designed SOC 2 to assess control environments against defined criteria, and it does that well. The framework isn't broken for what it was built to do. But no comparable framework has emerged to cover what SOC 2 was never built for&mdash;<a href="https://trevorkavanaugh.com/articles/software-supply-chain-composition.html" style="color: #4A90E2; text-decoration: underline;">software supply chain integrity</a>, <a href="https://trevorkavanaugh.com/articles/software-supply-chain-visibility.html" style="color: #4A90E2; text-decoration: underline;">dependency risk</a>, <a href="https://trevorkavanaugh.com/articles/vendor-update-deployment-practices.html" style="color: #4A90E2; text-decoration: underline;">update delivery mechanisms</a>. The <a href="https://trevorkavanaugh.com/articles/soc-2-scoping-problem.html" style="color: #4A90E2; text-decoration: underline;">scoping decisions</a>, <a href="https://trevorkavanaugh.com/articles/soc-2-system-description.html" style="color: #4A90E2; text-decoration: underline;">system boundary definitions</a>, and <a href="https://trevorkavanaugh.com/articles/soc-2-timing-gap.html" style="color: #4A90E2; text-decoration: underline;">timing gaps</a> I've written about in the SOC 2 series all compound this problem&mdash;they show how even within what SOC 2 does cover, the conditionality underneath the assurance is substantial. The gap between what the criteria address and what actually threatens organizations in 2026 has only widened since 2017.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Now layer AI on top of that.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">The Speed Problem</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The internet let us share data and connect like never before. It created enormous value and enormous risk simultaneously. AI lets us do things we never could&mdash;at speeds we'd have thought unimaginable five years ago. That's not just a capability upgrade. It's a fundamental change in the relationship between decision speed and oversight capacity.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Every "human in the loop" advocate believes in the concept. I'd bet a fraction of them actually insert themselves to any meaningful degree. Consider what this looks like in practice: an AI system flags a vendor risk assessment for review. The analyst opens it, sees the AI's analysis is thorough and well-reasoned, and approves it. Then does the same thing for the next one. And the next. At some point, the "review" becomes a rubber stamp&mdash;not because the analyst is lazy, but because the AI's output is consistently good enough that careful review stops adding value relative to the time it costs.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Give it a few years. Once AI performs review steps as well as humans&mdash;and in many domains, it already does&mdash;the human bottleneck disappears. Not because anyone decides to remove it, but because the process just moves faster without us. Nobody fights to slow it back down. The economics don't support it. The competitive pressure doesn't allow it. The human in the loop becomes the human adjacent to the loop, then the human who gets a summary after the loop completes.</p>

<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
<tr>
<td style="border-left: 4px solid #4A90E2; padding: 16px 20px; background-color: #f8fafc;">
<p style="margin: 0; color: #2d3748; line-height: 1.6; font-size: 16px; font-style: italic;">"We're building governance for systems that will outpace the governance before the ink dries. On top of internet infrastructure we've had 25 years to secure and still haven't."</p>
</td>
</tr>
</table>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">The Compounding Problem</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Here's what makes this particularly dangerous: AI doesn't just inherit the vulnerabilities of the infrastructure it runs on. It amplifies them. An unsecured API endpoint is a problem. An unsecured API endpoint that an AI agent autonomously calls thousands of times per hour, making decisions based on the data it receives, is a categorically different problem. A compromised software update mechanism is bad. A compromised update mechanism for an AI model that other systems depend on for decision-making is worse by orders of magnitude.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The internet era created distributed risk&mdash;vulnerabilities scattered across interconnected systems. AI creates <strong style="color: #1a2a3a;">concentrated, high-velocity risk</strong>&mdash;automated systems making consequential decisions at machine speed on top of that distributed, unsecured foundation. The failure modes aren't additive. They're multiplicative.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">And we're trying to govern the AI layer while the infrastructure layer underneath it remains demonstrably insecure. That's building a fire escape plan for the penthouse while the foundation has cracks.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">What "Finishing the Last Assignment" Actually Looks Like</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">I'm not arguing that AI governance doesn't matter. It does. And it will matter more as these systems become more capable and more deeply integrated into critical processes. But the industry's current approach&mdash;racing to publish AI governance frameworks while internet-era security gaps widen every year&mdash;has the sequencing wrong.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Finishing the last assignment means:</p>

<ul style="margin: 0 0 16px 0; padding-left: 24px; color: #4a5568;">
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Closing the attestation gap</strong>&mdash;The industry needs independent assessment frameworks that address software supply chain integrity, dependency risk, and deployment mechanisms. SOC 2 covers what it covers. Something needs to cover what it doesn't. The <a href="https://trevorkavanaugh.com/articles/soc-2-cuec-problem.html" style="color: #4A90E2; text-decoration: underline;">conditionality underneath SOC 2 assurance</a> is already substantial enough without adding AI complexity on top.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Addressing the vulnerability acceleration</strong>&mdash;A 164% increase in new vulnerabilities over five years isn't a trend line that governance documents will flatten. It requires structural changes in how software is built, deployed, and maintained&mdash;and how organizations assess the vendors doing the building.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Getting honest about third-party risk</strong>&mdash;Third-party involvement in breaches doubling to 30% means the current approach to vendor risk management isn't keeping pace with how interconnected systems have become. The <a href="https://trevorkavanaugh.com/articles/the-persistent-channel.html" style="color: #4A90E2; text-decoration: underline;">persistent channels</a> between vendors and your environment represent continuous risk exposure, not point-in-time relationships.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Building security infrastructure that can absorb AI</strong>&mdash;Rather than governing AI in a vacuum, secure the infrastructure AI will run on. Harden the APIs it will call. Validate the data pipelines it will consume. Secure the update mechanisms it will use to evolve. If the foundation is solid, AI governance becomes a more tractable problem. If the foundation is cracked, AI governance is theater.</li>
</ul>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Where the Industry's Energy Should Be</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The appeal of AI governance is understandable. It's forward-looking. It sounds sophisticated. It positions organizations as thoughtful and proactive. Publishing an AI governance framework gets attention in ways that quietly hardening your vendor assessment methodology does not.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">But the organizations that will actually be resilient in an AI-powered world aren't the ones with the most polished governance documents. They're the ones that secured their internet-era infrastructure first. That understood their software supply chain risk. That closed the gaps in their attestation tools. That built the unglamorous foundational security that gives AI governance something solid to sit on.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">We've had 25 years to secure internet infrastructure. We haven't finished. The vulnerability count is accelerating, not declining. Third-party breaches are increasing, not decreasing. Our primary attestation framework hasn't been updated since before the most significant supply chain attacks in history.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Maybe before we race to govern AI, we should finish the last assignment.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;"><em>For more perspectives on third-party risk management, <a href="https://www.linkedin.com/in/trevorkavanaugh/" style="color: #4A90E2; text-decoration: underline;">connect with me on LinkedIn</a>.</em></p>
