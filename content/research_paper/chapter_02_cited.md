# Chapter 2: The Accountants Stepped In
### How Financial Auditors Became the Stewards of Technology Risk Assurance

### SAS 70's Original Purpose

In April 1992, the American Institute of Certified Public Accountants (AICPA) introduced Statement on Auditing Standards No. 70 (SAS 70).[1] Its purpose was narrow and specific: to provide guidance for CPAs reporting on controls at service organizations that affected their clients' financial statements.

The context matters. Organizations were beginning to outsource financial transaction processing—payroll, benefits administration, transaction processing—to specialized service providers (see Chapter 1 for the broader history of outsourcing's emergence in the 1990s). External auditors needed a way to assess the controls at these third-party organizations without having to audit each one individually for every client that used them. SAS 70 solved this problem. A service organization could engage a CPA firm to issue a report on its internal controls over financial reporting. User auditors (the auditors of companies using the service) could then rely on that report rather than conducting their own assessment.

This was an auditor-to-auditor communication mechanism. SAS 70 reports were designed for a technical audience of accounting professionals. They addressed a specific concern: do the controls at this service organization provide reasonable assurance that financial data processed on behalf of our client is accurate and complete?

The standard served its intended purpose well—for about a decade.

### The Market Misuse Problem

As outsourcing expanded through the 1990s and into the 2000s, companies began outsourcing not just financial processing but core business functions: IT infrastructure, security services, cloud hosting, managed services, customer data processing.[2] The scope and complexity of outsourced relationships grew exponentially.

When companies engaged these new categories of service providers, they naturally asked: "How do we know you have adequate controls?" The service providers, seeking a credible answer, pointed to the only standardized framework available: SAS 70. "We have a SAS 70 report," became the response.

This was, technically, a misuse. SAS 70 was designed for controls over financial reporting, not information security, not data privacy, not operational resilience.[3] But the market had no alternative. There was no equivalent framework for technology controls. So SAS 70 became the catch-all assurance mechanism, regardless of whether financial reporting was even relevant to the service being provided.

The AICPA observed this trend with growing concern. Chuck Landes, vice president of professional standards and services for the AICPA, noted that vendors were claiming "SAS 70 certification" when no such certification existed.[4] Marketing materials implied that a SAS 70 report guaranteed security or compliance, when the report merely confirmed that stated controls were being followed. There was no minimum standard, no benchmark for adequacy—only verification that the organization did what it said it did.[5]

Auditors found themselves complicit. Firms began preparing SAS 70 reports for organizations whose services had nothing to do with financial statement preparation—HR software, communications tools, cloud hosting. The scope creep was undeniable, but the demand was real.[6]

### The AICPA's Response: SSAE 16 and the SOC Framework

In 2011, the AICPA made a decisive move. Rather than fight the market misuse of SAS 70, they formalized it. They introduced Statement on Standards for Attestation Engagements No. 16 (SSAE 16) and created the Service Organization Control (SOC) framework, effective June 15, 2011.[7]

The new framework separated financial reporting controls from broader technology and security controls through a three-tier structure:

**SOC 1**: The successor to SAS 70, focused exclusively on controls relevant to financial reporting. Designed for user auditors and restricted in distribution—cannot be used as a marketing tool.[8]

**SOC 2**: The innovation. Designed specifically to address controls relevant to security, availability, processing integrity, confidentiality, and privacy. This was the framework for technology risk. Unlike SOC 1, SOC 2 reports could be shared with management, regulators, and business partners (under non-disclosure agreements).

**SOC 3**: A public-facing summary report. The only SOC report explicitly designed for marketing purposes.[8] Provides a high-level seal indicating that an organization has been examined against the Trust Services Criteria, without disclosing detailed control descriptions.

To provide substantive criteria for SOC 2 examinations, the AICPA developed the Trust Services Principles[9] (later rebranded as Trust Services Criteria in 2017).[10] These defined the five categories: security, availability, processing integrity, confidentiality, and privacy. For each category, the criteria specified what controls organizations should have in place.

### Two Perspectives on the AICPA's Decision

The creation of SOC 2 can be viewed in two ways, both of which contain truth.

**Perspective 1: Productizing the Misuse**
The AICPA recognized that companies were using SAS 70 for technology controls despite it being inappropriate. Rather than correcting this behavior, they monetized it by creating SOC 2. Accounting firms, which had built lucrative practices around SAS 70 audits, now had an even larger market: every technology service provider needed SOC 2 attestation. The misuse became the product.

**Perspective 2: Addressing an Unmet Need**
The market genuinely needed a standardized framework for technology control assurance. Companies were demanding "show us your controls" from vendors. Procurement processes required some form of independent validation. The AICPA, seeing this need and possessing the institutional infrastructure to address it, stepped forward when no one else did.

Both perspectives have merit. The AICPA did see a market opportunity created by the misuse of SAS 70. But they also filled a genuine void. Why did the accounting profession fill this void rather than technology-focused organizations?

### Why Accounting Firms Stuck

The dominance of accounting firms in technology risk attestation is not accidental. They possess several structural advantages that technology consulting firms, cybersecurity specialists, or information security professionals cannot easily replicate.

#### 1. Existing Audit Infrastructure

Accounting firms already had deep relationships with the companies that would need SOC reports. CFOs, controllers, and audit committees were existing touchpoints. Firms like Deloitte, PwC, EY, and KPMG had global presence, enabling them to serve multi-national organizations.[11] They had established audit methodologies for evaluating internal controls—frameworks that could be adapted from financial controls to technology controls.[12]

When SOC 2 emerged, accounting firms did not need to build client relationships from scratch. They were already in the building.

#### 2. Professional Standards and Independence

A pillar of AICPA standards is independence. CPAs conducting attestation engagements must be independent of the entity they are auditing.[13] This is not merely a professional guideline—it is enforced through state licensing boards and peer review processes. A CPA firm that violates independence standards faces professional consequences, including potential license revocation.

Technology consulting firms often provide implementation services to the same clients they might assess. This creates inherent conflicts of interest. A firm that helps design a security architecture and then attests to its adequacy has compromised independence. The AICPA has clear guidance on this: providing certain non-attest services—including penetration testing, vulnerability management, and incident response—to an audit client creates independence threats that must be carefully managed or avoided entirely.[14]

Independence is not just a technical requirement; it is a market signal. When a company tells a prospective customer "we have a SOC 2 report," the credibility of that report depends on the independence of the auditor. "Audited by Deloitte" carries weight in procurement decisions in a way that "assessed by XYZ Consulting" does not, precisely because the market understands that Deloitte has professional obligations and oversight mechanisms that a consulting firm may lack.

#### 3. Regulatory Authority

Here is the critical structural advantage: the AICPA created and codified the SOC standards. SSAE 18 (the current attestation standard) and the Trust Services Criteria were developed by the AICPA.[15] The standards explicitly state that only licensed CPA firms may perform SOC 1 and SOC 2 audits.[16]

This is a regulatory moat. It is not merely that CPA firms are well-positioned to perform these audits—they are the **only** organizations authorized to do so. A technology consulting firm, no matter how technically proficient, cannot issue a SOC 2 report. The AICPA controls the standard, and compliance with the standard requires using a licensed CPA firm.

This was not a nefarious power grab. The AICPA had the authority to create attestation standards because it is the professional body governing the accounting profession. When they developed SOC 2 to address market demand, they naturally embedded it within their existing professional standards framework. The result, however, is that technology risk attestation became structurally dependent on the accounting profession.

#### 4. Risk Management Expertise Transfer

From a non-technical perspective, CPAs are experts in risk management. Auditing is fundamentally about evaluating risk and controls. The transition from auditing financial risk to auditing cybersecurity risk was conceptually straightforward.[17] CPAs understand internal control concepts, evidence requirements, risk-based audit approaches, and control framework evaluation. These skills transfer across domains.

Of course, this does not mean CPAs are cybersecurity experts. Most are not. But CPA firms addressed this by hiring technology specialists—professionals with IT, security, and engineering backgrounds—and integrating them into audit teams. The firms leveraged their institutional infrastructure (methodology, quality control, client relationships, independence frameworks) and supplemented it with technical expertise.

#### 5. "Audited by Big 4" Market Weight

The prestige and market recognition of being audited by a Big 4 firm carries significant weight.[11] This creates a self-reinforcing cycle:
- Companies seeking vendors prefer those with Big 4 SOC 2 reports
- Service organizations seek Big 4 auditors to satisfy customer demands
- Big 4 firms gain more experience and market share
- The cycle continues

Smaller CPA firms and regional practices also perform SOC 2 audits, and many do so with equal rigor. But in high-stakes procurement decisions, the brand recognition of a Big 4 auditor can be the deciding factor.

### The Counterfactual: What If Technology Firms Had Led?

It is worth considering why technology consulting firms, cybersecurity specialists, or professional associations like ISACA did not create competing frameworks.

**Lack of Independence Standards**: Technology consultants often implement the very systems they might assess, creating conflicts of interest with no professional framework to manage them.

**No Unified Professional Body**: Unlike the AICPA, which represents all CPAs under consistent standards, the technology industry lacks a single authoritative body with the power to create and enforce attestation standards.

**Implementation vs. Attestation**: Technology firms excel at building and securing systems but lack the attestation tradition and methodology that accounting firms have developed over decades. Attestation is a distinct competency—not simply technical assessment, but independent verification according to established criteria with defined reporting formats and professional liability frameworks.

**Client Skepticism**: Would CFOs and audit committees trust a technology vendor to objectively assess another technology vendor? The perception of independence matters as much as actual independence. Accounting firms benefit from a century of credibility in independent verification.

### The Answer to "Why Accountants?"

The AICPA and accounting firms ended up governing technology risk assurance because:

1. They were already there (existing client relationships)
2. They had the infrastructure (audit methodology, quality control, peer review)
3. They had independence (professional requirements and enforcement mechanisms)
4. They created the standards (AICPA codified the rules, creating a regulatory moat)
5. They had market credibility ("Audited by [Big 4]" carries weight)
6. No one else stepped up (no competing professional body created a credible alternative)

This was not nefarious. It was institutional advantage meeting market need.

### Implications

The AICPA deserves credit for recognizing a market gap and filling it with a structured framework when chaos threatened to persist. SOC 2 is far superior to the pre-2011 environment of misapplied SAS 70 reports and meaningless certification claims.

However, this history reveals an important dynamic: technology risk attestation is governed by a profession whose core expertise is financial auditing, not technology. The Trust Services Criteria are principle-based and abstract because that is how accountants approach standards—they favor broad applicability over technical prescriptiveness.

This matters because the governance structure affects what evolves and what does not. An accounting body is not naturally positioned to drive innovation in software supply chain attestation, CI/CD pipeline security, or application-layer dependency transparency. These are not areas where the profession has deep native expertise.

CPAs can competently assess technology risks, especially when supported by technical specialists. What's less clear is whether the institutional incentives and expertise of the accounting profession will naturally drive the evolution needed to address gaps that are becoming increasingly visible: software bill of materials disclosure, software delivery mechanism attestation, application-layer dependency transparency.

So far, the answer appears to be no. SOC 2's Trust Services Criteria have remained largely unchanged since 2017, with only revised points of focus in 2022 that explicitly did not alter the core criteria.[18] The framework has not required SBOMs, has not mandated disclosure of CI/CD pipeline security controls, has not addressed open source dependency transparency. These gaps persist not because of negligence, but because the governance structure does not naturally incentivize their closure.

The accountants stepped in when no one else did. That was the right thing to do in 2011. The question now is whether the same governance structure will prove sufficient for the challenges ahead.

As technology dependencies grew more complex, regulators began attempting to address the gaps—with mixed results.

---

### Endnotes - Chapter 2

[1] AICPA, "Statement on Auditing Standards No. 70: Service Organizations," issued April 1992. Historical context from PKF AvantEdge, "A Brief History of SOC and SAS," and AICPA professional standards documentation. See also: Journal of Accountancy, "Replacing SAS 70," August 2010, https://www.journalofaccountancy.com/issues/2010/aug/20103009/

[2] The evolution of outsourcing scope is documented in FFIEC IT Examination Handbooks across editions (2000, 2004, 2013). The 2004 edition explicitly noted expansion beyond "data processing and related technology services" to include "networking, Web hosting, software development and maintenance, and other technology-based products and services." See also: Deloitte Global Outsourcing Survey series (2000-2012) documenting the shift from cost-driven tactical outsourcing to strategic technology partnerships.

[3] CFO.com, "The Truth About SAS 70," September 2010, https://www.cfo.com/news/the-truth-about-sas-70/669107/

[4] CFO.com, "The Truth About SAS 70," September 2010, https://www.cfo.com/technology/2010/09/the-truth-about-sas-70/ (Chuck Landes quotes and auditor complicity discussion)

[5] Vibato Blog, "SAS 70 to SSAE 16: How to Review your Vendors Internal Control Report," https://www.vibato.com/blog/bid/79403/SAS-70-to-SSAE-16-How-to-Review-your-Vendors-Internal-Control-Report

[6] CFO.com, "The Truth About SAS 70," September 2010, https://www.cfo.com/technology/2010/09/the-truth-about-sas-70/ (auditor complicity discussion)

[7] Vibato Blog, "SAS 70 to SSAE 16: How to Review your Vendors Internal Control Report," https://www.vibato.com/blog/bid/79403/SAS-70-to-SSAE-16-How-to-Review-your-Vendors-Internal-Control-Report (SSAE 16 effective date: June 15, 2011)

[8] PKF AvantEdge, "A Brief History of SOC and SAS," https://www.pkfavantedge.com/it-compliance/a-brief-history-of-soc-and-sas/

[9] Compass IT Compliance, "A Detailed History of SOC 2 Compliance," https://www.compassitc.com/blog/a-detailed-history-of-soc-2-compliance

[10] Secureframe, "2025 Trust Services Criteria for SOC 2," https://secureframe.com/hub/soc-2/trust-services-criteria (2017 Trust Services Criteria rebrand from Trust Services Principles)

[11] Schellman, "Which Big 4 Auditing Firm Should Perform Your SOC Audit?" https://www.schellman.com/blog/soc-examinations/which-audit-big-4-should-perform-your-soc-audit

[12] Linford & Co., "Who Can Perform a SOC Audit? CPA, non-CPA, SOC 1 & SOC 2," https://linfordco.com/blog/who-can-perform-soc-audit/ (CPA audit methodology and training)

[13] Linford & Co., "Who Can Perform a SOC Audit? CPA, non-CPA, SOC 1 & SOC 2," https://linfordco.com/blog/who-can-perform-soc-audit/ (Independence requirements)

[14] Sprinto Blog, "SOC 2 Myths and Malpractices Busted: Be Wary Of These Red Flags," https://sprinto.com/blog/soc-2-myths/ (Independence threats from nonattest services including penetration testing, vulnerability management, incident response)

[15] Linford & Co., "Who Can Perform a SOC Audit? CPA, non-CPA, SOC 1 & SOC 2," https://linfordco.com/blog/who-can-perform-soc-audit/ (AICPA codification of SOC standards)

[16] Secureframe, "Who Performs a SOC 2 Audit?" https://secureframe.com/hub/soc-2/who-performs-a-soc-2-audit (Only licensed CPA firms can perform SOC audits)

[17] Schneider Downs, "Why Do CPA Firms Perform SOC 2 Audits?" https://schneiderdowns.com/our-thoughts-on/why-cpa-firms-perform-soc-2-audits/ (Natural progression from financial risk to cybersecurity risk)

[18] AICPA, "2017 Trust Services Criteria (With Revised Points of Focus – 2022)," https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022

\newpage
