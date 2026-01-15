---
title: "How Vendors Deploy Updates Matters More Than You Think"
date: 2026-01-15
article_slug: vendor-update-deployment-practices
article_url: https://trevorkavanaugh.com/articles/vendor-update-deployment-practices.html
sent_date: null
subscribers_sent: null
---

# How Vendors Deploy Updates Matters More Than You Think

Not all vendors deploy updates the same way. The differences matter more than most risk assessments acknowledge.

Your vendor is continuously pushing code into your environment. That's the reality of modern software delivery. But *how* they push it—that's where the risk actually lives.

## Simultaneous vs. Staged Deployment

Some vendors push updates to every customer simultaneously. One release, everyone gets it, same day. It's efficient from a support perspective—one version to maintain, one set of documentation, no compatibility questions.

Others roll out in stages. A small group first—maybe 1% of customers. Wait. Monitor. If nothing breaks, expand to 10%. Then 50%. Then everyone. The staged approach takes longer, but it catches problems before they become widespread.

CrowdStrike pushed to everyone at once. One bad file, 8.5 million devices, no buffer. A staged rollout would have caught the problem at 1% before it became a global outage affecting hospitals, airlines, and financial institutions simultaneously.

This isn't hindsight. It's a design choice. Some vendors make it, some don't. And your due diligence questionnaire probably doesn't distinguish between them.

## Rollback Capability

When an update breaks something, can your vendor undo it? How fast?

Some vendors can roll back a bad deployment in minutes. They've built their delivery pipeline with failure as an expected scenario. The infrastructure exists to revert quickly because someone thought about it in advance.

Others can't. Once it's pushed, you're waiting for a fix to be developed, tested, and deployed. Could be hours. Could be days. There's no "undo" button because the architecture wasn't designed with one.

The difference between "brief disruption" and "extended outage" often comes down to whether rollback was built into the delivery process or bolted on as an afterthought.

## Visibility and Notification

Some vendors tell you when they deploy. Release notes. Changelogs. Advance notice for major updates. You know what changed and when it changed, so you can correlate issues with deployments and respond intelligently when something goes wrong.

Others deploy silently. You find out when something looks different—or when something breaks. The first indication that a deployment happened is often a support ticket from your users or an alert from your monitoring systems.

This isn't about getting approval rights you'll never have. It's about knowing when your environment changed so you can respond intelligently when something goes wrong. Without visibility into the deployment process, you're troubleshooting blind.

## Why This Matters for TPRM

Two vendors can have identical security certifications. Same SOC 2. Same policies on paper. Same checkboxes ticked on your standard due diligence questionnaire.

One deploys in stages with rollback capability and customer notification. The other pushes to everyone simultaneously with no undo button and no changelog.

Your due diligence probably doesn't distinguish between them. But your operational risk exposure is completely different.

The vendor with staged rollouts, fast rollback, and clear notification gives you resilience. When something goes wrong—and something always goes wrong eventually—the blast radius is limited, recovery is fast, and you know what happened.

The vendor without those capabilities gives you a single point of failure with no safety net. Same SOC 2 report. Completely different risk profile.

> "Two vendors with identical SOC 2s. One deploys in stages with rollback capability. The other pushes to everyone at once with no undo button. Your due diligence probably doesn't distinguish between them."

**Do you know how your critical vendors deploy updates—or just that they do?**

---

## Newsletter Metadata

- **Subject Line**: How Vendors Deploy Updates Matters More Than You Think
- **Preview Text**: Two vendors with identical SOC 2s can have completely different operational risk.
- **Sent**: [Pending]
- **Recipients**: [Pending]
