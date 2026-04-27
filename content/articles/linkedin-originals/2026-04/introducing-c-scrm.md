# Introducing C-SCRM - LinkedIn Original

**Posted:** April 23, 2026
**Platform:** LinkedIn
**Author:** Trevor Kavanaugh

---

Most TPRM programs evaluate vendors. Their controls, their financials, their compliance posture. That's the job.

But there's a discipline most TPRM practitioners have never been introduced to that asks a fundamentally different question. Not "is this vendor secure?" but "what is inside the product they're delivering to us, and how does it get here?"

That discipline is called C-SCRM - Cybersecurity Supply Chain Risk Management. And it changes how you think about third-party risk.

🔴 Where TPRM stops

TPRM evaluates the vendor as an entity. Do they have a SOC 2? Did they pass their pen test? Do they have an incident response plan? Are they financially stable? These are important questions about the organization you're doing business with.

But they tell you very little about the product itself. What open-source libraries are embedded in the code? What dependencies does it rely on that the vendor may not even be fully aware of? How does the software get built, compiled, and delivered to your environment? Who has access to that delivery pipeline?

TPRM asks "can we trust this vendor?" C-SCRM asks "can we trust what this vendor is shipping us?"

⚠️ Why the distinction matters

SolarWinds had security controls. They would have looked fine on a vendor questionnaire. Their environment wasn't breached in the traditional sense - attackers compromised their build pipeline and injected malicious code during the software compilation process. The product itself was weaponized before it ever reached customers.

Log4j was an open-source logging component buried deep in dependency chains across thousands of products. Most vendors didn't even know it was in their codebase until the vulnerability was disclosed. Your due diligence wouldn't have surfaced it because nobody was asking about software composition.

These weren't vendor security failures in the way TPRM is designed to assess. They were supply chain failures - risks that live deeper than the vendor entity itself.

📊 What this means practically

NIST published 800-161 specifically for this - a framework for managing cybersecurity risks in supply chains. It's not a replacement for TPRM. It's a different lens on a different layer of risk that traditional vendor assessments were never built to evaluate.

Most banks don't have a C-SCRM program. Most don't even use the term. But the risks it addresses - software composition, delivery integrity, dependency mapping - are already present in every vendor relationship that involves technology. Which in 2026 is basically all of them.

This isn't something programs need to build overnight. But understanding that TPRM and C-SCRM are different disciplines solving different problems is the first step toward closing a gap most programs don't know they have.

Had you heard of C-SCRM before this post? If so, how far along is your program in addressing supply chain risk beyond traditional vendor assessments?
