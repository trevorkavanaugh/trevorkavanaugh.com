---
title: "The SOC 2 CUEC Problem"
date: 2026-02-26
article_slug: soc-2-cuec-problem
article_url: https://trevorkavanaugh.com/articles/soc-2-cuec-problem.html
sent_date: TBD
subscribers_sent: TBD
---

# The SOC 2 CUEC Problem

Buried in every SOC 2 report is a section called Complementary User Entity Controls---CUECs. It's easy to gloss over. Most reviewers skip it entirely on their way to the controls and test results. That's a mistake, because CUECs represent controls the vendor assumes *you* have in place. The auditor's opinion---that clean, unqualified opinion everyone skips to---is conditioned on your organization doing certain things on your end. If you're not doing them, the assurance that report provides has holes that neither side is accounting for.

This is Part 4 of a series examining the layers of conditionality underneath SOC 2 reports. We've covered the timing gap, the scoping problem, and the system description problem. CUECs are the final layer---and arguably the most operationally dangerous, because they create control gaps that exist in no man's land between your organization and the vendor.

## How Shared Responsibility Actually Works

A vendor's control environment doesn't operate in isolation. Some controls only function correctly if the customer is doing their part. So the auditor documents assumptions about what the customer is responsible for---these are the CUECs.

Some of these are completely reasonable and expected. "Customer is responsible for managing their own user access credentials." Of course. "Customer should restrict access to authorized personnel." Sure. Nobody has a problem with those. They're the kind of shared responsibility that any competent organization would already be handling regardless of what the SOC 2 says.

But some CUECs are doing something different. They're moving **meaningful control responsibility** from the vendor to you---and unless someone on your side is reading that section and mapping it against what you actually do, those controls exist nowhere. The vendor didn't build them because they assumed you would. You didn't build them because you assumed the vendor did. That's not a control gap anyone planned for. It's a gap that emerged from assumptions documented in a section of the report that most people skip.

## Where This Gets Real

Consider a CUEC that says "Customer is responsible for monitoring user activity logs provided by the platform." That sounds reasonable on the surface. But does your team actually monitor those logs? Do you have the staffing to review them with any meaningful frequency? Did anyone even set up the log exports? In many organizations, the answer to all three questions is no---not because anyone decided monitoring wasn't important, but because nobody read the CUEC section and identified it as an obligation that needed to be operationalized.

Or consider this one: "Customer is responsible for ensuring data transmitted to the platform is encrypted in transit." Your integration team built the API connection two years ago. Did they configure TLS? Probably. Has anyone verified it's still enforced after the vendor's last platform update? After your own infrastructure changes? After the certificate rotation that may or may not have happened on schedule? These aren't hypothetical edge cases. They're the kinds of assumptions buried in reports right now that create real exposure when no one on either side is owning the control.

The pattern is consistent: CUECs that sound like standard practice often require **specific operational processes** that your organization may not have in place. The gap between "this sounds like something we'd do" and "we have a documented process with assigned ownership for doing this" is where risk lives.

> "The vendor didn't build the control because they assumed you would. You didn't build it because you assumed the vendor did. That's not a control gap anyone planned for."

## The No Man's Land Problem

The real danger with CUECs isn't that individual controls fall through the cracks---it's the **systematic nature** of the gap. Every vendor with a SOC 2 report has a CUEC section. Every CUEC section contains assumptions about what you're doing. If your organization manages dozens or hundreds of vendor relationships, each with their own set of CUECs, the aggregate exposure is significant and almost certainly untracked.

Most TPRM programs treat SOC 2 review as a binary activity: receive the report, confirm it's a Type 2 with an unqualified opinion, check the box, move on. The CUECs don't factor into the risk assessment. They don't get mapped to internal controls. They don't get assigned to control owners. They exist in the report and nowhere else in your risk management framework.

That means you have a population of controls that your vendors are formally relying on you to operate---documented in writing, referenced in the auditor's opinion---and your organization may have no visibility into whether those controls exist, let alone whether they're functioning effectively.

## Why This Matters for Your Risk Assessment

A clean SOC 2 opinion means the vendor's controls operated effectively---within the system boundary they defined, for the criteria they selected, during a historical observation period, assuming you're holding up your end of the CUECs. That's four layers of conditionality sitting underneath what most programs treat as blanket assurance.

The SOC 2 scoping series comes down to this: the report isn't lying to you. It's telling you exactly what it covers, what it excludes, and what it assumes. Every limitation is documented. Every boundary is defined. Every assumption about your responsibilities is spelled out in the CUEC section. The question is whether anyone on your team is reading closely enough to hear what the report is actually saying---and whether your program is structured to act on it.

## What to Do About It

The fix isn't complicated in concept, but it requires treating CUECs as actionable obligations rather than background reading:

- **Extract CUECs during SOC 2 review**---Don't just read Section IV for control test results. Pull every CUEC out of the report and document it separately. This should be a standard step in your SOC 2 review process, not an occasional deep-dive.
- **Map CUECs to internal controls**---For each CUEC, determine whether your organization has a corresponding control in place. Not "we probably do that somewhere"---a specific, documented control with an assigned owner and evidence of operation.
- **Flag gaps immediately**---If a CUEC maps to nothing in your environment, that's a finding. It means the assurance you're deriving from that SOC 2 report has a hole in it. Treat it the same way you'd treat a control exception in the report itself.
- **Aggregate across vendors**---Look at CUECs in the aggregate. You'll likely find common themes---log monitoring, encryption enforcement, access management---that point to systemic gaps in your own control environment rather than vendor-specific issues.
- **Include in risk ratings**---A vendor whose CUECs you've fully mapped and validated is a different risk profile than a vendor whose CUECs you've never reviewed. Your risk assessment should reflect that distinction.

## Read the Series

This article is Part 4 of a series on what SOC 2 reports actually tell you---and what they assume you'll figure out on your own.

- **Part 1:** [The SOC 2 Timing Gap](https://trevorkavanaugh.com/articles/soc-2-timing-gap.html)---Why the report's observation period creates a gap between tested controls and current reality.
- **Part 2:** [The SOC 2 Scoping Problem](https://trevorkavanaugh.com/articles/soc-2-scoping-problem.html)---How vendors define what gets audited, and what that means for your coverage assumptions.
- **Part 3:** [The SOC 2 System Description Problem](https://trevorkavanaugh.com/articles/soc-2-system-description.html)---How system boundaries in Section III quietly exclude backend components from audit scope.
- **Part 4:** The SOC 2 CUEC Problem (this article)---How complementary user entity controls shift responsibility to you without anyone noticing.

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*

---

## Newsletter Metadata

- **Subject Line**: The SOC 2 CUEC Problem
- **Preview Text**: CUECs in SOC 2 reports shift control responsibility to your organization. If nobody maps them, you have gaps no one owns.

## Email HTML Content

<!-- Use this content for the article_content field when sending via API -->

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Buried in every SOC 2 report is a section called Complementary User Entity Controls—CUECs. It's easy to gloss over. Most reviewers skip it entirely on their way to the controls and test results. That's a mistake, because CUECs represent controls the vendor assumes <em>you</em> have in place. The auditor's opinion—that clean, unqualified opinion everyone skips to—is conditioned on your organization doing certain things on your end. If you're not doing them, the assurance that report provides has holes that neither side is accounting for.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">This is Part 4 of a series examining the layers of conditionality underneath SOC 2 reports. We've covered <a href="https://trevorkavanaugh.com/articles/soc-2-timing-gap.html" style="color: #4A90E2; text-decoration: underline;">the timing gap</a>, <a href="https://trevorkavanaugh.com/articles/soc-2-scoping-problem.html" style="color: #4A90E2; text-decoration: underline;">the scoping problem</a>, and <a href="https://trevorkavanaugh.com/articles/soc-2-system-description.html" style="color: #4A90E2; text-decoration: underline;">the system description problem</a>. CUECs are the final layer—and arguably the most operationally dangerous, because they create control gaps that exist in no man's land between your organization and the vendor.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">How Shared Responsibility Actually Works</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">A vendor's control environment doesn't operate in isolation. Some controls only function correctly if the customer is doing their part. So the auditor documents assumptions about what the customer is responsible for—these are the CUECs.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Some of these are completely reasonable and expected. "Customer is responsible for managing their own user access credentials." Of course. "Customer should restrict access to authorized personnel." Sure. Nobody has a problem with those. They're the kind of shared responsibility that any competent organization would already be handling regardless of what the SOC 2 says.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">But some CUECs are doing something different. They're moving <strong style="color: #1a2a3a;">meaningful control responsibility</strong> from the vendor to you—and unless someone on your side is reading that section and mapping it against what you actually do, those controls exist nowhere. The vendor didn't build them because they assumed you would. You didn't build them because you assumed the vendor did. That's not a control gap anyone planned for. It's a gap that emerged from assumptions documented in a section of the report that most people skip.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Where This Gets Real</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Consider a CUEC that says "Customer is responsible for monitoring user activity logs provided by the platform." That sounds reasonable on the surface. But does your team actually monitor those logs? Do you have the staffing to review them with any meaningful frequency? Did anyone even set up the log exports? In many organizations, the answer to all three questions is no—not because anyone decided monitoring wasn't important, but because nobody read the CUEC section and identified it as an obligation that needed to be operationalized.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Or consider this one: "Customer is responsible for ensuring data transmitted to the platform is encrypted in transit." Your integration team built the API connection two years ago. Did they configure TLS? Probably. Has anyone verified it's still enforced after the vendor's last platform update? After your own infrastructure changes? After the certificate rotation that may or may not have happened on schedule? These aren't hypothetical edge cases. They're the kinds of assumptions buried in reports right now that create real exposure when no one on either side is owning the control.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The pattern is consistent: CUECs that sound like standard practice often require <strong style="color: #1a2a3a;">specific operational processes</strong> that your organization may not have in place. The gap between "this sounds like something we'd do" and "we have a documented process with assigned ownership for doing this" is where risk lives.</p>

<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
<tr>
<td style="border-left: 4px solid #4A90E2; padding: 16px 20px; background-color: #f8fafc;">
<p style="margin: 0; color: #2d3748; line-height: 1.6; font-size: 16px; font-style: italic;">"The vendor didn't build the control because they assumed you would. You didn't build it because you assumed the vendor did. That's not a control gap anyone planned for."</p>
</td>
</tr>
</table>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">The No Man's Land Problem</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The real danger with CUECs isn't that individual controls fall through the cracks—it's the <strong style="color: #1a2a3a;">systematic nature</strong> of the gap. Every vendor with a SOC 2 report has a CUEC section. Every CUEC section contains assumptions about what you're doing. If your organization manages dozens or hundreds of vendor relationships, each with their own set of CUECs, the aggregate exposure is significant and almost certainly untracked.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Most TPRM programs treat SOC 2 review as a binary activity: receive the report, confirm it's a Type 2 with an unqualified opinion, check the box, move on. The CUECs don't factor into the risk assessment. They don't get mapped to internal controls. They don't get assigned to control owners. They exist in the report and nowhere else in your risk management framework.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">That means you have a population of controls that your vendors are formally relying on you to operate—documented in writing, referenced in the auditor's opinion—and your organization may have no visibility into whether those controls exist, let alone whether they're functioning effectively.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Why This Matters for Your Risk Assessment</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">A clean SOC 2 opinion means the vendor's controls operated effectively—within <a href="https://trevorkavanaugh.com/articles/soc-2-system-description.html" style="color: #4A90E2; text-decoration: underline;">the system boundary they defined</a>, for <a href="https://trevorkavanaugh.com/articles/soc-2-scoping-problem.html" style="color: #4A90E2; text-decoration: underline;">the criteria they selected</a>, during <a href="https://trevorkavanaugh.com/articles/soc-2-timing-gap.html" style="color: #4A90E2; text-decoration: underline;">a historical observation period</a>, assuming you're holding up your end of the CUECs. That's four layers of conditionality sitting underneath what most programs treat as blanket assurance.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The SOC 2 scoping series comes down to this: the report isn't lying to you. It's telling you exactly what it covers, what it excludes, and what it assumes. Every limitation is documented. Every boundary is defined. Every assumption about your responsibilities is spelled out in the CUEC section. The question is whether anyone on your team is reading closely enough to hear what the report is actually saying—and whether your program is structured to act on it.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">What to Do About It</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The fix isn't complicated in concept, but it requires treating CUECs as actionable obligations rather than background reading:</p>

<ul style="margin: 0 0 16px 0; padding-left: 24px; color: #4a5568;">
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Extract CUECs during SOC 2 review</strong>—Don't just read Section IV for control test results. Pull every CUEC out of the report and document it separately. This should be a standard step in your SOC 2 review process, not an occasional deep-dive.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Map CUECs to internal controls</strong>—For each CUEC, determine whether your organization has a corresponding control in place. Not "we probably do that somewhere"—a specific, documented control with an assigned owner and evidence of operation.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Flag gaps immediately</strong>—If a CUEC maps to nothing in your environment, that's a finding. It means the assurance you're deriving from that SOC 2 report has a hole in it. Treat it the same way you'd treat a control exception in the report itself.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Aggregate across vendors</strong>—Look at CUECs in the aggregate. You'll likely find common themes—log monitoring, encryption enforcement, access management—that point to systemic gaps in your own control environment rather than vendor-specific issues.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Include in risk ratings</strong>—A vendor whose CUECs you've fully mapped and validated is a different risk profile than a vendor whose CUECs you've never reviewed. Your risk assessment should reflect that distinction.</li>
</ul>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Read the Series</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">This article is Part 4 of a series on what SOC 2 reports actually tell you—and what they assume you'll figure out on your own.</p>

<ul style="margin: 0 0 16px 0; padding-left: 24px; color: #4a5568;">
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Part 1:</strong> <a href="https://trevorkavanaugh.com/articles/soc-2-timing-gap.html" style="color: #4A90E2; text-decoration: underline;">The SOC 2 Timing Gap</a>—Why the report's observation period creates a gap between tested controls and current reality.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Part 2:</strong> <a href="https://trevorkavanaugh.com/articles/soc-2-scoping-problem.html" style="color: #4A90E2; text-decoration: underline;">The SOC 2 Scoping Problem</a>—How vendors define what gets audited, and what that means for your coverage assumptions.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Part 3:</strong> <a href="https://trevorkavanaugh.com/articles/soc-2-system-description.html" style="color: #4A90E2; text-decoration: underline;">The SOC 2 System Description Problem</a>—How system boundaries in Section III quietly exclude backend components from audit scope.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Part 4:</strong> The SOC 2 CUEC Problem (this article)—How complementary user entity controls shift responsibility to you without anyone noticing.</li>
</ul>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;"><em>For more perspectives on third-party risk management, <a href="https://www.linkedin.com/in/trevorkavanaugh/" style="color: #4A90E2; text-decoration: underline;">connect with me on LinkedIn</a>.</em></p>
