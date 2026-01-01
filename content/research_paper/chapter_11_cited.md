# Chapter 11: Closing the Capability Gap

The multi-stakeholder solution described in Chapter 10 requires years to fully materialize. Regulatory guidance takes time to develop and promulgate. Assurance frameworks evolve through consensus processes measured in standards-body cycles. Fintech innovation responds to market demand signals that may take quarters or years to become clear.

Financial institutions cannot wait for the ecosystem to evolve. The risks are present today; the incidents are occurring now. There is one action every institution can take immediately, regardless of external stakeholder progress: **integrate technical expertise into third-party risk management functions**.

### The Technical Capability Gap

The demand for technical understanding in third-party risk management has never been greater—and it is not going away. The highest-risk items that TPRM teams oversee are not office supply vendors or facilities management contracts; they are:

- **SaaS platforms** running core business functions
- **Cloud infrastructure providers** hosting applications and data
- **Managed security service providers** operating security operations and endpoint detection
- **Cybersecurity tools** with deep system access
- **Payment processors and fintech integrations** with direct access to customer financial data
- **Core banking platforms and middleware** supporting critical operations

Every one of these vendor categories requires technical evaluation that exceeds the capabilities of traditional risk management training. A professional with expertise in contract review, operational risk assessment, and SOC 2 control evaluation is not equipped to interpret a software bill of materials, evaluate CI/CD pipeline integrity controls, or assess the implications of a vendor's infrastructure architecture choices.

These are not edge cases. They are routine questions that arise during vendor assessments, incident response, and ongoing monitoring. Without technical capability, TPRM teams either ignore these questions (leaving risk unaddressed), rely on vendor representations without independent validation (creating false assurance), or escalate every technical question to overloaded IT or InfoSec teams (creating bottlenecks and friction).

### The Economic Case

The cost of technical capability is modest compared to the cost of incidents it helps prevent:

- A **single major vendor breach** can result in remediation costs, regulatory examination, reputational damage, and potential enforcement actions totaling millions of dollars
- **Operational disruption** from unidentified vendor dependencies (like CrowdStrike) can halt business operations for hours or days, with estimated global financial damage exceeding $10 billion[1]
- **Emergency response** to widespread vulnerabilities (like Log4j) requires expensive weekend mobilization of technical teams across the institution

Technical capability for TPRM costs approximately the same as mid-tier vendor management software subscriptions that many institutions already pay.[4] The return on investment is avoiding blind spots that lead to incidents, and improving the quality of vendor risk assessments to provide actual assurance rather than false comfort.

Furthermore, technical capability enables TPRM to reduce reliance on external consultants for vendor technical assessments, often achieving positive ROI within the first year through reduced consulting spend.[5]

### Why This Exceeds Current Regulatory Requirements—And Why That Matters

Regulators have not explicitly mandated that TPRM teams include technical subject matter experts. But regulatory compliance is a floor, not a ceiling. The goal of TPRM is not to check boxes for examiners; it is to identify and mitigate third-party risks that could disrupt operations, compromise data, or harm customers.

Recent incidents demonstrate that traditional TPRM approaches are insufficient:

- **Log4j**: Institutions with fully compliant TPRM programs were blindsided by a vulnerability in a code library embedded throughout their vendor portfolios—because dependency-level risks were never assessed.[2]

- **SolarWinds**: Vendors with passing SOC 2 audits suffered build pipeline compromises that traditional controls did not detect—because software delivery mechanisms were out of scope.

- **CrowdStrike**: Institutions using a widely trusted cybersecurity vendor experienced widespread outages from a routine update—because no one evaluated update deployment controls as a risk dimension.[1]

Regulatory requirements reflect past incidents and established best practices. They lag current risks. Institutions that wait for explicit regulatory mandates before building necessary capabilities are perpetually reactive, responding to incidents rather than preventing them.

Moreover, regulatory expectations are evolving. DORA in Europe explicitly addresses ICT third-party risk with technical depth. FFIEC guidance now references NIST secure software development frameworks.[3] The trajectory is clear: regulators increasingly expect technical sophistication in third-party risk management. Building capability now positions institutions ahead of the curve rather than scrambling to catch up after the next examination finding.

### Implementation Approaches

How institutions integrate technical capability into TPRM will vary based on size, complexity, and risk exposure—the same "commensurate with" principle that governs all risk management investment decisions. Options range from dedicated technical analyst roles within TPRM, to formalized partnerships with Information Security or IT Architecture teams, to structured escalation frameworks that route technical questions appropriately.

The specific model matters less than the outcome: ensuring that someone with genuine technical expertise is involved in evaluating the vendors that present technology-driven risks. Each institution must determine the approach appropriate to its circumstances.

#### What Technical TPRM Capability Looks Like in Practice

For institutions considering dedicated technical roles within TPRM, here are concrete elements to consider:

**Role Profile: Third-Party Technology Risk Analyst**

Core responsibilities:
- Review vendor SBOMs and correlate against vulnerability databases
- Evaluate CI/CD pipeline security practices during critical vendor assessments
- Translate technical findings into risk language for TPRM reports
- Monitor CVE disclosures affecting the vendor portfolio
- Conduct technical deep-dives during incident response

Background characteristics (not all required):
- Software development or DevOps experience
- Cloud architecture familiarity (AWS, Azure, GCP)
- Understanding of container and Kubernetes environments
- Security certifications (CISSP, cloud security credentials) helpful but not essential
- Ability to read and interpret technical documentation

**Screening Questions for Candidates**

Technical depth:
- "Walk me through how you would assess whether a vendor is vulnerable to a Log4j-type incident."
- "What would you look for in a vendor's SOC 2 report to understand their software delivery controls?"
- "If a vendor told you they 'use containers,' what follow-up questions would you ask?"

Risk translation:
- "How would you explain CI/CD pipeline risk to a board member?"
- "A vendor says they 'practice DevSecOps.' What does that actually tell you about their security posture?"

**Essential Tools and Skills**

- SBOM analysis: Familiarity with CycloneDX/SPDX formats, tools like Dependency-Track or Snyk
- Vulnerability correlation: NVD, vendor security advisories, CVE databases
- Cloud architecture: Understanding shared responsibility models, IAM, network segmentation
- Container security: Basic understanding of image scanning, runtime protection, orchestration risks
- SOC 2 interpretation: Ability to read Section III scoping and evaluate carve-outs critically

What is not optional is recognizing the capability gap and taking deliberate action to close it. The incidents of recent years have demonstrated that traditional TPRM competencies—contract review, financial analysis, SOC 2 interpretation, business continuity assessment—are necessary but insufficient for managing the risks posed by modern technology vendors.

Building capability is an ongoing process. The final chapter provides diagnostic questions to assess current maturity and identify priority gaps.

---

### Endnotes - Chapter 11

[1] CrowdStrike incident analysis: The outage on July 19, 2024 caused approximately 8.5 million Windows devices to crash, with worldwide financial damage estimated at $10 billion or more. Fortune 500 companies faced $5.4 billion in direct losses according to Parametrix study. Sources: Wikipedia, "2024 CrowdStrike-related IT outages"; American Banker, "Tech issues afflict banks, Microsoft after critical CrowdStrike glitch"; Fortune, "CrowdStrike outage will cost Fortune 500 companies $5.4 billion."

[2] Log4j incident analysis: The vulnerability disclosed in December 2021 affected hundreds of millions of systems through transitive dependencies organizations did not know they had. 60% of affected Java applications used Log4j as a transitive dependency invisible to standard security assessments. Organizations with Software Bills of Materials reduced remediation time from weeks to hours. Sources: Apache Foundation disclosure; CISA Emergency Directive 22-02; NY DFS Industry Letter, December 17, 2021.

[3] FFIEC IT Examination Handbook, "Development and Acquisition" booklet (August 2024) references NIST Secure Software Development Framework (SSDF) as guidance for software development security practices.

[4] Cost comparison based on: Mid-tier TPRM platform subscriptions (ProcessUnity, Prevalent, OneTrust) range from $50,000-$150,000 annually for 100-500 vendor portfolio according to G2 and Gartner Peer Insights reviews (2023-2024). A dedicated Technical Risk Analyst role (salary $85K-$130K depending on market and experience per Glassdoor/Bureau of Labor Statistics) or fractional IT allocation (0.25-0.5 FTE, $40K-$70K cost) falls within comparable range to software subscriptions already in TPRM budgets.

[5] External consultant cost avoidance analysis: Specialized vendor technical assessments from Big 4 or boutique security firms cost $15,000-$50,000 per engagement (Deloitte, PwC, Coalfire rate cards). Financial institutions conducting 5-10 deep technical vendor assessments annually through external consultants spend $75K-$500K. Internal technical capability reduces this to $10K-$100K in residual consulting for highly specialized assessments, generating $65K-$400K in annual savings that offset dedicated headcount costs within 12-18 months.

\newpage
