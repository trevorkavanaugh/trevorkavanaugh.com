---
title: "The Self-Attestation Problem"
date: 2026-02-05
article_slug: the-self-attestation-problem
article_url: https://trevorkavanaugh.com/articles/the-self-attestation-problem.html
---

# The Self-Attestation Problem

If my career depended on attesting I was the greatest risk manager in the world, I would. So would you. So would your vendors. That's the fundamental problem with self-attestation: we've built an entire due diligence framework around asking the party with the most to lose to self-report their weaknesses.

## The Incentive Problem

Security questionnaires. Financial health attestations. Scope definitions for audits and pen tests. All of these share one thing in common: we're asking the party with the most to lose to self-report their weaknesses.

A vendor's business depends on passing your due diligence. Their sales team is waiting on the deal. Their compliance person has filled out 50 of these this quarter. What do you think they're going to write?

This isn't a hypothetical concern. It's the structural reality of how vendor assessment works. The entity being evaluated has direct financial incentive to present the most favorable picture possible. The entity doing the evaluation has limited ability to verify what they're told.

## This Isn't About Dishonesty

Most vendors aren't lying. They're just answering aspirationally.

**"Do you have an incident response plan?"** Yes—it's in a drawer somewhere. Seventy percent of companies rarely or never test theirs.

**"Do you conduct regular security training?"** Yes—annually, a 20-minute video. Most companies train employees less than once a month.

**"Is your financial condition stable?"** Yes—we're still operating, aren't we?

The questions get answered. The boxes get checked. Nobody verified anything. The vendor isn't lying—they're giving you the answer that's technically defensible while presenting their organization in the best possible light. And you have no mechanism to distinguish between "we have a mature, tested incident response program" and "we have a PDF someone wrote three years ago."

## The Model Is Backwards

Due diligence is supposed to surface risk. But we've built a system where the entity being assessed controls the narrative.

Vendors choose which controls go in the SOC 2 scope. Vendors define the boundaries for pen tests. Vendors self-report their security posture. Private vendors self-attest their financial health.

We're not assessing risk. We're documenting what vendors are willing to tell us.

The fundamental assumption underlying most due diligence is that vendors will accurately report information that might cost them business. That assumption doesn't survive contact with basic incentive analysis. Vendors aren't malicious—they're rational actors responding to the incentives we've created.

## What Actually Shifts the Incentive

The question isn't always what you ask. Sometimes it's **who** you ask—and what their incentive is.

For questions about operational reality—what data goes in, how integrated the product is, what access exists—I ask the business unit that owns the relationship. They use the product. They see how it actually works. And they're not incentivized to make the vendor look good. They're incentivized to make sure their operations run smoothly, which means they'll tell you when the vendor's claims don't match their experience.

For technical questions about the vendor's internal controls? You're still stuck with self-attestation. SOC 2s. Questionnaires. The vendor controls the narrative.

That's the gap. We have decent tools for understanding what the vendor says about themselves. We have almost nothing for verifying it.

> "We're not assessing risk. We're documenting what vendors are willing to tell us."

The path forward isn't eliminating self-attestation—that's not realistic given current industry infrastructure. The path forward is being honest about its limitations, triangulating with sources that have different incentives, and building verification mechanisms where the risk justifies the investment. Start by asking yourself: for every critical question in your due diligence, who's answering it, and what's their incentive to tell you the truth?

---

## Newsletter Metadata

- **Subject Line**: The Self-Attestation Problem
- **Preview Text**: We're asking the party with the most to lose to self-report their weaknesses.
