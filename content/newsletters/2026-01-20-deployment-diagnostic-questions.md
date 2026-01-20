---
title: "Diagnostic Questions That Reveal Vendor Deployment Maturity"
date: 2026-01-20
article_slug: deployment-diagnostic-questions
article_url: https://trevorkavanaugh.com/articles/deployment-diagnostic-questions.html
sent_date: null
subscribers_sent: null
---

# Diagnostic Questions That Reveal Vendor Deployment Maturity

We've established that your vendors continuously push code into your environment, and that there are meaningful differences in how they do it—staged versus simultaneous rollouts, rollback capability, notification practices. The natural next question: how do you actually find out what your vendors do?

You ask. But you ask the **right** questions.

## Questions That Reveal Maturity

There are three questions that cut through the marketing language and reveal whether a vendor has built intentional deployment infrastructure—or is just doing whatever their dev team decided years ago and never revisited.

### "How do you deploy updates to customers?"

Vague answers like "we follow best practices" or "we have a robust deployment process" tell you nothing. They're compliance-speak designed to satisfy a checklist without revealing anything substantive. Every vendor claims best practices. Very few can describe what those practices actually are.

Specific answers tell a different story. "Staged rollout over 72 hours starting with 5% of customers" is a real answer. It means someone actually thought about deployment risk and built infrastructure to manage it. "Continuous deployment with feature flags for controlled rollout" is a real answer. "We push when QA passes" is also a real answer—it just tells you they haven't built staged deployment into their process.

The specificity of the response is the signal. Mature vendors can walk you through their deployment pipeline because they designed it intentionally. Immature vendors fumble because they've never had to articulate something that just happens.

### "If a bad update goes out, how fast can you roll it back?"

The mature answer includes a timeframe. Minutes, not hours. And not just a timeframe—a description of what actually happens. "We can roll back to the previous version in under 10 minutes" is credible. "Our platform automatically reverts if error rates spike above threshold" is even better.

If they hesitate, or start talking about "developing a patch" or "pushing a fix," that's not rollback. That's damage control. There's a fundamental difference between undoing a deployment and deploying a repair. The first takes minutes because the infrastructure exists. The second takes hours or days because you're starting from scratch.

Vendors without true rollback capability often don't realize they're lacking it. They've never needed it—until they do. And by then, you're both waiting while engineering scrambles.

### "How do customers find out when you've deployed changes?"

Release notes? Email notifications? In-app changelog? Nothing?

The answer tells you whether you'll know when your environment changed—or whether you'll be guessing when something breaks. This matters more than it seems. When an incident occurs, one of the first questions is "what changed?" If you have no visibility into your vendor's deployment schedule, you're troubleshooting blind.

Some vendors provide proactive notification for major releases and maintain detailed changelogs for everything else. Some only communicate when they have to. Some don't communicate at all. Knowing which type you're dealing with changes how you monitor and respond.

## What the Answers Tell You

These aren't gotcha questions. They're diagnostic.

A vendor who can answer specifically has built deployment infrastructure intentionally. Someone thought about failure modes, recovery processes, and customer communication. Someone made deliberate decisions about rollout strategy and built the tooling to execute it.

A vendor who fumbles through vague responses is probably deploying however their dev team decided years ago—and never revisited it. That doesn't make them a bad vendor. It means deployment practices evolved organically rather than by design.

Neither answer disqualifies them. But it changes your risk profile. And it should change your monitoring.

## The Practical Shift

You can't control your vendors' deployment schedules. That leverage doesn't exist for most of us. You're not going to call your core banking provider and demand they switch to staged rollouts.

But you can know what you're exposed to. You can prioritize monitoring and incident response around the vendors whose deployment practices create the most uncertainty. You can ask better questions during due diligence and renewals. You can make risk-aware decisions about concentration with vendors who can't articulate their deployment process.

Visibility isn't control. But it's not nothing either.

---

## Newsletter Metadata

- **Subject Line**: Diagnostic Questions That Reveal Vendor Deployment Maturity
- **Preview Text**: Three questions that cut through marketing language and reveal whether your vendors have built intentional deployment infrastructure.
- **Sent**: TBD
- **Recipients**: TBD
