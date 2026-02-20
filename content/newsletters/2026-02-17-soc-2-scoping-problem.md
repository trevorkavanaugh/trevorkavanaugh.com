---
title: "The SOC 2 Scoping Problem"
date: 2026-02-17
article_slug: soc-2-scoping-problem
article_url: https://trevorkavanaugh.com/articles/soc-2-scoping-problem.html
sent_date: 2026-02-17
subscribers_sent: 2
---

# The SOC 2 Scoping Problem

Your vendor's SOC 2 report covers their product. It says so right on the cover. Except it might not. And most people reviewing it would never know.

SOC 2 audits have a design feature that doubles as a loophole: the vendor defines the scope. They decide which trust services criteria get tested, which systems are included, which infrastructure is carved out, and where the boundaries of "the system" begin and end.

That's not a flaw in the standard. It's how SOC 2 was designed---flexible enough to apply across industries, sizes, and architectures. But that same flexibility means two vendors offering identical services can produce SOC 2 reports with wildly different coverage. And unless you know what to look for, both reports look equally reassuring.

## This Happens at Multiple Levels

Some scoping decisions are obvious if you know where to look. A vendor only selects Security as their trust services criteria and skips Availability, Confidentiality, and Privacy---even though they're storing your NPPI and you need them operational 24/7. That's visible on page one if you check.

Some are subtler. The vendor carves out their cloud infrastructure provider entirely. The report covers the vendor's application controls but explicitly excludes the environment those controls run on. There's a line buried in the report that says so---most reviewers never find it.

And some are almost invisible. The vendor defines "the system" in a way that sounds comprehensive but quietly excludes backend components, internal tools, or integration layers that touch your data. The system description reads well. It just doesn't describe everything that matters.

## Why This Matters for Due Diligence

Every one of these scoping decisions is technically legitimate. The auditor tests exactly what the scope says. The opinion is clean. The report looks professional.

But if your risk assessment assumes the SOC 2 covers the full environment---and the scope was drawn to exclude significant pieces---your assurance has gaps you don't know about.

Over the next few posts, we'll walk through each of these layers. What to look for, where to find it in the report, and how vendors use legitimate scoping flexibility to narrow what actually gets tested.

---

## Newsletter Metadata

- **Subject Line**: The SOC 2 Scoping Problem
- **Preview Text**: Your vendor's SOC 2 report covers their product. It says so right on the cover. Except it might not.

## Email HTML Content

<!-- Use this content for the article_content field when sending via API -->

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Your vendor's SOC 2 report covers their product. It says so right on the cover. Except it might not. And most people reviewing it would never know.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">SOC 2 audits have a design feature that doubles as a loophole: <strong style="color: #1a2a3a;">the vendor defines the scope</strong>. They decide which trust services criteria get tested, which systems are included, which infrastructure is carved out, and where the boundaries of "the system" begin and end.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">That's not a flaw in the standard. It's how SOC 2 was designed—flexible enough to apply across industries, sizes, and architectures. But that same flexibility means two vendors offering identical services can produce SOC 2 reports with <strong style="color: #1a2a3a;">wildly different coverage</strong>. And unless you know what to look for, both reports look equally reassuring.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">This Happens at Multiple Levels</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Some scoping decisions are obvious if you know where to look. A vendor only selects Security as their trust services criteria and skips Availability, Confidentiality, and Privacy—even though they're storing your NPPI and you need them operational 24/7. That's visible on page one if you check.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Some are subtler. The vendor carves out their cloud infrastructure provider entirely. The report covers the vendor's application controls but <strong style="color: #1a2a3a;">explicitly excludes the environment those controls run on</strong>. There's a line buried in the report that says so—most reviewers never find it.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">And some are almost invisible. The vendor defines "the system" in a way that sounds comprehensive but quietly excludes backend components, internal tools, or integration layers that touch your data. The system description reads well. It just doesn't describe everything that matters.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Why This Matters for Due Diligence</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Every one of these scoping decisions is technically legitimate. The auditor tests exactly what the scope says. The opinion is clean. The report looks professional.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">But if your risk assessment assumes the SOC 2 covers the full environment—and the scope was drawn to exclude significant pieces—<strong style="color: #1a2a3a;">your assurance has gaps you don't know about</strong>.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Over the next few posts, we'll walk through each of these layers. What to look for, where to find it in the report, and how vendors use legitimate scoping flexibility to narrow what actually gets tested.</p>
