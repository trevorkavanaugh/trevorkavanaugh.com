---
title: "The SOC 2 System Description Problem"
date: 2026-02-19
article_slug: soc-2-system-description
article_url: https://trevorkavanaugh.com/articles/soc-2-system-description.html
sent_date:
subscribers_sent:
---

# The SOC 2 System Description Problem

Some SOC 2 scoping decisions are easy to spot---missing trust services criteria, carved-out infrastructure providers. But the hardest one to catch is the system description itself---Section III of the report---and most reviewers treat it as background material on their way to the controls and test results.

Every SOC 2 report includes a section where the vendor describes "the system" being audited. It has a name. It has a description. It sounds comprehensive. The problem isn't what it says. The problem is what it leaves out.

## How the System Boundary Gets Drawn

A vendor calls their system "The XYZ Platform" and describes it as a cloud-based solution for managing client data. That sounds like it covers the product you use. And it might. But read the system description closely and ask yourself what's actually included in that boundary.

Does it describe the customer-facing portal? Probably. Does it describe the backend data processing engine that actually handles your information---the batch jobs running overnight, the data transformation pipelines, the queuing systems that route your records through their infrastructure? Maybe not. The internal admin tools their employees use to access your records---the support dashboard, the database management interface, the user impersonation feature their engineers use for troubleshooting? The API layer connecting their system to yours? The CI/CD pipeline pushing code updates to the environment you depend on?

Every one of those components touches your data. Every one of them affects your risk. And every one of them can be excluded from scope without a single red flag on the auditor's opinion.

The opinion is clean because the auditor tested exactly what the system description defined. Everything inside the boundary was evaluated. Everything outside it simply doesn't exist as far as the report is concerned.

## Why Vendors Draw Narrow Boundaries

This isn't usually malice. Vendors draw narrow system boundaries for practical reasons that make perfect sense from their side of the table. Broader scope means higher audit costs---more controls to document, more evidence to collect, more testing hours billed by the audit firm. It means more complexity in maintaining control documentation across disparate systems. It means exposing internal tools and processes to auditor scrutiny that the vendor may not have fully formalized yet. And it means a higher likelihood of exceptions showing up in the report, because the more you include, the more surface area exists for something to go wrong.

So vendors scope to what's manageable and defensible. The customer-facing application with well-documented controls becomes the system boundary. The internal tools, the backend infrastructure, the integration layers---those get quietly excluded. The auditor doesn't object because the scope is the vendor's decision. The report comes back clean because the boundary was drawn around the parts that were ready to be tested.

## Why This Is So Hard to Catch

Missing trust services criteria is visible on page one if you check. A carved-out subservice organization usually gets called out explicitly. But a narrowly drawn system boundary? That requires you to read the system description and ask yourself: **what's NOT here?** What components would I expect to see described that aren't mentioned?

That's a fundamentally different skill than reviewing control test results. It requires you to know enough about the vendor's architecture to recognize what's absent---and that means doing your own homework before you open the report. Most reviewers go straight to Section IV, the controls and test results, because that's where the "findings" live. Section III reads like background. It's easy to skim past on your way to the substance.

But Section III *is* the substance. It defines what the rest of the report means. If the boundary was drawn to exclude components that matter to your risk assessment, no amount of clean test results in Section IV changes that. You're reading a clean audit of a partial picture. Your file says the SOC 2 was "received and reviewed." Your actual assurance covers a fraction of the environment you thought it covered.

> "Section III defines what the rest of the report means. If the boundary was drawn to exclude components that matter to your risk assessment, no amount of clean test results changes that. You're reading a clean audit of a partial picture."

## What to Actually Look For

When you open Section III, read it like a detective, not a reviewer. The vendor wrote this description, and they had every incentive to define it in a way that makes the audit easier to pass. Your job is to evaluate whether the boundary they drew covers the components that matter to your risk assessment.

Start with a simple question: **does this description account for everywhere my data goes inside this vendor's environment?** Every system their employees use to access it. Every layer between their code and my information. Every integration point where data enters or leaves their boundary.

Then get specific:

- **Backend processing**---If the vendor describes a customer portal but doesn't mention the data processing infrastructure behind it, ask why. Your data doesn't live in the portal. It lives in the systems the portal talks to.
- **Internal tools**---Support dashboards, admin consoles, and database management interfaces are where insider threats and access control failures actually happen. If they're not in scope, the audit didn't test them.
- **Integration layers**---APIs, webhooks, file transfer mechanisms, and third-party connectors that move your data between systems. If the description only covers the application and not the plumbing, you have a gap.
- **Development and deployment**---CI/CD pipelines, staging environments, and code repositories determine what gets pushed to the production environment you depend on. If change management controls were tested but the deployment pipeline was out of scope, you're trusting a process you haven't validated.

If the description only covers the front door and you care about what's happening in the back office, the report isn't giving you what you think it is.

## What Comes Next

The system description defines the audit boundary. But there's another section most people skip that shifts the story even further: the part where the vendor identifies controls they expect *you* to operate. These are complementary user entity controls---CUECs---and they represent responsibility the vendor is explicitly handing to you. If nobody on your side owns those controls, you have gaps that neither the vendor's audit nor your own review process is catching. That's where we're going next.

*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*

---

## Newsletter Metadata

- **Subject Line**: The SOC 2 System Description Problem
- **Preview Text**: The hardest SOC 2 scoping decision to catch isn't on the cover page. It's buried in the system description.

## Email HTML Content

<!-- Use this content for the article_content field when sending via API -->

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Some SOC 2 scoping decisions are easy to spot—missing trust services criteria, carved-out infrastructure providers. But the hardest one to catch is <strong style="color: #1a2a3a;">the system description itself</strong>—Section III of the report—and most reviewers treat it as background material on their way to the controls and test results.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Every SOC 2 report includes a section where the vendor describes "the system" being audited. It has a name. It has a description. It sounds comprehensive. The problem isn't what it says. The problem is what it leaves out.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">How the System Boundary Gets Drawn</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">A vendor calls their system "The XYZ Platform" and describes it as a cloud-based solution for managing client data. That sounds like it covers the product you use. And it might. But read the system description closely and ask yourself what's actually included in that boundary.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Does it describe the customer-facing portal? Probably. Does it describe the backend data processing engine that actually handles your information—the batch jobs running overnight, the data transformation pipelines, the queuing systems that route your records through their infrastructure? Maybe not. The internal admin tools their employees use to access your records—the support dashboard, the database management interface, the user impersonation feature their engineers use for troubleshooting? The API layer connecting their system to yours? The CI/CD pipeline pushing code updates to the environment you depend on?</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Every one of those components touches your data. Every one of them affects your risk. And every one of them can be excluded from scope without a single red flag on the auditor's opinion.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The opinion is clean because the auditor tested exactly what the system description defined. Everything inside the boundary was evaluated. Everything outside it simply doesn't exist as far as the report is concerned.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Why Vendors Draw Narrow Boundaries</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">This isn't usually malice. Vendors draw narrow system boundaries for practical reasons that make perfect sense from their side of the table. Broader scope means higher audit costs—more controls to document, more evidence to collect, more testing hours billed by the audit firm. It means more complexity in maintaining control documentation across disparate systems. It means exposing internal tools and processes to auditor scrutiny that the vendor may not have fully formalized yet. And it means a higher likelihood of exceptions showing up in the report, because the more you include, the more surface area exists for something to go wrong.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">So vendors scope to what's manageable and defensible. The customer-facing application with well-documented controls becomes the system boundary. The internal tools, the backend infrastructure, the integration layers—those get quietly excluded. The auditor doesn't object because the scope is the vendor's decision. The report comes back clean because the boundary was drawn around the parts that were ready to be tested.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Why This Is So Hard to Catch</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Missing trust services criteria is visible on page one if you check. A carved-out subservice organization usually gets called out explicitly. But a narrowly drawn system boundary? That requires you to read the system description and ask yourself: <strong style="color: #1a2a3a;">what's NOT here?</strong> What components would I expect to see described that aren't mentioned?</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">That's a fundamentally different skill than reviewing control test results. It requires you to know enough about the vendor's architecture to recognize what's absent—and that means doing your own homework before you open the report. Most reviewers go straight to Section IV, the controls and test results, because that's where the "findings" live. Section III reads like background. It's easy to skim past on your way to the substance.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">But Section III <em>is</em> the substance. It defines what the rest of the report means. If the boundary was drawn to exclude components that matter to your risk assessment, <strong style="color: #1a2a3a;">no amount of clean test results in Section IV changes that</strong>. You're reading a clean audit of a partial picture. Your file says the SOC 2 was "received and reviewed." Your actual assurance covers a fraction of the environment you thought it covered.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">What to Actually Look For</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">When you open Section III, read it like a detective, not a reviewer. The vendor wrote this description, and they had every incentive to define it in a way that makes the audit easier to pass. Your job is to evaluate whether the boundary they drew covers the components that matter to your risk assessment.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Start with a simple question: <strong style="color: #1a2a3a;">does this description account for everywhere my data goes inside this vendor's environment?</strong> Every system their employees use to access it. Every layer between their code and my information. Every integration point where data enters or leaves their boundary.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Then get specific:</p>

<ul style="margin: 0 0 16px 0; padding-left: 24px; color: #4a5568;">
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Backend processing</strong>—If the vendor describes a customer portal but doesn't mention the data processing infrastructure behind it, ask why. Your data doesn't live in the portal. It lives in the systems the portal talks to.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Internal tools</strong>—Support dashboards, admin consoles, and database management interfaces are where insider threats and access control failures actually happen. If they're not in scope, the audit didn't test them.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Integration layers</strong>—APIs, webhooks, file transfer mechanisms, and third-party connectors that move your data between systems. If the description only covers the application and not the plumbing, you have a gap.</li>
<li style="margin-bottom: 8px; line-height: 1.6;"><strong style="color: #1a2a3a;">Development and deployment</strong>—CI/CD pipelines, staging environments, and code repositories determine what gets pushed to the production environment you depend on. If change management controls were tested but the deployment pipeline was out of scope, you're trusting a process you haven't validated.</li>
</ul>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">If the description only covers the front door and you care about what's happening in the back office, the report isn't giving you what you think it is.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">What Comes Next</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The system description defines the audit boundary. But there's another section most people skip that shifts the story even further: the part where the vendor identifies controls they expect <em>you</em> to operate. These are complementary user entity controls—CUECs—and they represent responsibility the vendor is explicitly handing to you. If nobody on your side owns those controls, you have gaps that neither the vendor's audit nor your own review process is catching. That's where we're going next.</p>
