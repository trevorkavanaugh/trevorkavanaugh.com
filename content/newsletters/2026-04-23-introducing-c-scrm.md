---
title: "Introducing C-SCRM"
date: 2026-04-23
article_slug: introducing-c-scrm
article_url: https://trevorkavanaugh.com/articles/introducing-c-scrm.html
sent_date: 
subscribers_sent: 
---

# Introducing C-SCRM

Most TPRM programs evaluate vendors - their controls, their financials, their compliance posture. That's the job, and it's necessary work. But there's a discipline most practitioners have never been formally introduced to that asks a fundamentally different question. Not "is this vendor secure?" but "what is inside the product they're delivering to us, and how does it get here?" That discipline is Cybersecurity Supply Chain Risk Management - C-SCRM - and understanding it changes how you think about the boundaries of third-party risk.


## Where TPRM Stops


TPRM evaluates the vendor as an entity. Do they have a SOC 2? Did they pass their penetration test? Do they have an incident response plan? Are they financially stable? These are important questions about the organization you're doing business with, and they belong in any serious due diligence program.


But they tell you very little about the product itself. What [open-source libraries are embedded in the code](software-supply-chain-composition.html)? What dependencies does the software rely on that the vendor may not even be fully aware of? How does the software get built, compiled, and delivered to your environment? Who has access to that delivery pipeline?


TPRM asks "can we trust this vendor?" C-SCRM asks "can we trust what this vendor is shipping us?" Those are different questions, and they require different methods to answer.


## Why the Distinction Matters


SolarWinds had security controls. They would have looked acceptable on a vendor questionnaire. Their environment wasn't breached in the traditional sense - attackers compromised their build pipeline and injected malicious code during the software compilation process. The product itself was weaponized before it ever reached customers. [How software gets built and delivered to your environment](software-supply-chain-delivery.html) is a risk dimension that traditional vendor assessments weren't designed to evaluate.


Log4j was an open-source logging component buried deep in dependency chains across thousands of products. Most vendors didn't even know it was in their codebase until the vulnerability was disclosed. Your due diligence wouldn't have surfaced it because nobody was asking about software composition - and [many vendors still can't answer those questions accurately](software-supply-chain-visibility.html) even when asked.


These weren't vendor security failures in the way TPRM is designed to assess. They were supply chain failures - risks that live deeper than the vendor entity itself. The distinction matters because the remediation path is different too. You can't questionnaire your way to understanding a vendor's dependency graph.


## What This Means Practically


NIST published SP 800-161 specifically for this - a framework for managing cybersecurity risks in supply chains. It's not a replacement for TPRM. It's a different lens on a different layer of risk that traditional vendor assessments were never built to evaluate. The two disciplines are complementary, not competing.


Most banks don't have a C-SCRM program. Most don't even use the term. But the risks it addresses - [software composition](software-supply-chain-composition.html), [delivery integrity](software-supply-chain-delivery.html), [dependency mapping](software-supply-chain-visibility.html) - are already present in every vendor relationship that involves technology. Which in 2026 is essentially all of them. The risk doesn't disappear because nobody has named it yet in your program documentation.


The [gap between assessing vendors and assessing what vendors deliver](visibility-gap-assessing-software-not-vendors.html) is one of the most consequential blind spots in financial services TPRM today. [Every year the vulnerability count accelerates](finish-the-last-assignment.html) and the software supply chain gets more complex, that gap widens.


## The Starting Point


This isn't something programs need to build overnight. C-SCRM maturity takes time, and most organizations are still working through the fundamentals of traditional TPRM. But understanding that TPRM and C-SCRM are different disciplines solving different problems is the necessary first step toward closing a gap most programs don't yet know they have.


Start by asking a simple question about your highest-risk technology vendors: do you know what their software is made of, and do you have any visibility into how it gets to you? If the answer is no - and for most programs, it will be - that's the gap C-SCRM is designed to address.


*For more perspectives on third-party risk management, [connect with me on LinkedIn](https://www.linkedin.com/in/trevorkavanaugh/).*

---

## Newsletter Metadata

- **Subject Line**: Introducing C-SCRM
- **Preview Text**: C-SCRM asks a different question than TPRM: not whether your vendor is secure, but whether what they're shipping you can be trusted. Here's why it matters.
- **Sent**: 
- **Recipients**: 

## Email HTML Content

<!-- Use this content for the article_content field when sending via API -->

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Most TPRM programs evaluate vendors - their controls, their financials, their compliance posture. That's the job, and it's necessary work. But there's a discipline most practitioners have never been formally introduced to that asks a fundamentally different question. Not "is this vendor secure?" but "what is inside the product they're delivering to us, and how does it get here?" That discipline is Cybersecurity Supply Chain Risk Management - C-SCRM - and understanding it changes how you think about the boundaries of third-party risk.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Where TPRM Stops</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">TPRM evaluates the vendor as an entity. Do they have a SOC 2? Did they pass their penetration test? Do they have an incident response plan? Are they financially stable? These are important questions about the organization you're doing business with, and they belong in any serious due diligence program.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">But they tell you very little about the product itself. What <a href="https://trevorkavanaugh.com/articles/software-supply-chain-composition.html" style="color: #4A90E2; text-decoration: underline;">open-source libraries are embedded in the code</a>? What dependencies does the software rely on that the vendor may not even be fully aware of? How does the software get built, compiled, and delivered to your environment? Who has access to that delivery pipeline?</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">TPRM asks "can we trust this vendor?" C-SCRM asks "can we trust what this vendor is shipping us?" Those are different questions, and they require different methods to answer.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">Why the Distinction Matters</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">SolarWinds had security controls. They would have looked acceptable on a vendor questionnaire. Their environment wasn't breached in the traditional sense - attackers compromised their build pipeline and injected malicious code during the software compilation process. The product itself was weaponized before it ever reached customers. <a href="https://trevorkavanaugh.com/articles/software-supply-chain-delivery.html" style="color: #4A90E2; text-decoration: underline;">How software gets built and delivered to your environment</a> is a risk dimension that traditional vendor assessments weren't designed to evaluate.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Log4j was an open-source logging component buried deep in dependency chains across thousands of products. Most vendors didn't even know it was in their codebase until the vulnerability was disclosed. Your due diligence wouldn't have surfaced it because nobody was asking about software composition - and <a href="https://trevorkavanaugh.com/articles/software-supply-chain-visibility.html" style="color: #4A90E2; text-decoration: underline;">many vendors still can't answer those questions accurately</a> even when asked.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">These weren't vendor security failures in the way TPRM is designed to assess. They were supply chain failures - risks that live deeper than the vendor entity itself. The distinction matters because the remediation path is different too. You can't questionnaire your way to understanding a vendor's dependency graph.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">What This Means Practically</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">NIST published SP 800-161 specifically for this - a framework for managing cybersecurity risks in supply chains. It's not a replacement for TPRM. It's a different lens on a different layer of risk that traditional vendor assessments were never built to evaluate. The two disciplines are complementary, not competing.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Most banks don't have a C-SCRM program. Most don't even use the term. But the risks it addresses - <a href="https://trevorkavanaugh.com/articles/software-supply-chain-composition.html" style="color: #4A90E2; text-decoration: underline;">software composition</a>, <a href="https://trevorkavanaugh.com/articles/software-supply-chain-delivery.html" style="color: #4A90E2; text-decoration: underline;">delivery integrity</a>, <a href="https://trevorkavanaugh.com/articles/software-supply-chain-visibility.html" style="color: #4A90E2; text-decoration: underline;">dependency mapping</a> - are already present in every vendor relationship that involves technology. Which in 2026 is essentially all of them. The risk doesn't disappear because nobody has named it yet in your program documentation.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">The <a href="https://trevorkavanaugh.com/articles/visibility-gap-assessing-software-not-vendors.html" style="color: #4A90E2; text-decoration: underline;">gap between assessing vendors and assessing what vendors deliver</a> is one of the most consequential blind spots in financial services TPRM today. <a href="https://trevorkavanaugh.com/articles/finish-the-last-assignment.html" style="color: #4A90E2; text-decoration: underline;">Every year the vulnerability count accelerates</a> and the software supply chain gets more complex, that gap widens.</p>

<h2 style="margin: 32px 0 16px 0; font-size: 20px; color: #1a2a3a;">The Starting Point</h2>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">This isn't something programs need to build overnight. C-SCRM maturity takes time, and most organizations are still working through the fundamentals of traditional TPRM. But understanding that TPRM and C-SCRM are different disciplines solving different problems is the necessary first step toward closing a gap most programs don't yet know they have.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;">Start by asking a simple question about your highest-risk technology vendors: do you know what their software is made of, and do you have any visibility into how it gets to you? If the answer is no - and for most programs, it will be - that's the gap C-SCRM is designed to address.</p>

<p style="margin: 0 0 16px 0; color: #4a5568; line-height: 1.8; font-size: 16px;"><em>For more perspectives on third-party risk management, <a href="https://www.linkedin.com/in/trevorkavanaugh/" style="color: #4A90E2; text-decoration: underline;">connect with me on LinkedIn</a>.</em></p>
