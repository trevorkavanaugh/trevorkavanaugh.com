# Chapter 6: The Competency Gap

Even if TPRM frameworks mandated SBOM collection, dependency transparency, and supply chain attestation, a more fundamental challenge would emerge: the scope of TPRM has expanded into technical domains that were not part of vendor management a decade ago.

The mismatch is one of role evolution, not competency gaps. TPRM programs were built around contract analysis, financial risk assessment, operational resilience evaluation, and compliance verification. These capabilities remain essential. But the technology landscape has added new risk dimensions that require different expertise. Current TPRM professionals are adequate for traditional vendor management—what's missing is whether team compositions reflect the expanded scope of modern third-party risk.

Software supply chain analysis—dependency mapping, build pipeline security, code library vulnerability assessment—represents an adjacent discipline that has become relevant to TPRM only in the past decade. The integration of these skill sets is an organizational design challenge, not a professional development failure.

### What TPRM Teams Are Built to Assess

The contemporary TPRM professional is educated and trained to evaluate:

- **Financial stability**: Does the vendor have adequate financial resources to continue operations?
- **Operational resilience**: Does the vendor have business continuity and disaster recovery plans?
- **Reputational risk**: Is the vendor involved in controversies that could harm the institution by association?
- **Legal and regulatory compliance**: Does the vendor comply with relevant laws and regulations?
- **Contractual protections**: Are service levels, liability limitations, termination rights, and audit rights adequate?
- **Information security governance**: Does the vendor have policies, training, incident response plans, and attestations?

These are the domains where TPRM programs add genuine value. They prevent institutions from engaging vendors who are financially unstable, operationally fragile, legally non-compliant, or contractually unfavorable. They ensure that vendors meet baseline information security standards as evidenced through SOC 2 reports, attestations, and questionnaire responses.

This expertise remains essential. The problem is that software supply chain risk exists in domains where this expertise does not translate.

### The "Good on Paper" Solution and Why It Fails at Step Zero

The solution to nth-party dependency risk appears straightforward conceptually: Collect Software Bills of Materials from each critical SaaS vendor. Aggregate them into a centralized repository. Analyze convergence across the vendor portfolio. Identify concentrated dependencies. Prioritize monitoring accordingly.

The technology to execute this workflow exists. Commercial TPRM platforms could add SBOM ingestion and analysis modules. The technical barriers, while real for some organizations, are not insurmountable.

The solution fails at step zero: **most fintech SaaS vendors do not generate SBOMs because the market is not demanding them.**[6] TPRM teams cannot collect what vendors do not produce. (Chapter 9 examines market dynamics and multi-stakeholder solutions to this demand signal problem.)

### The Competency Gap in Interpretation

Even if SBOMs existed and were collected systematically, interpreting them requires expertise that falls outside traditional TPRM training. A Software Bill of Materials is a technical artifact—meaningful to software engineers and security analysts, but opaque without that background.

A Software Bill of Materials for a modern web application contains hundreds or thousands of components. A typical entry might look like this (simplified CycloneDX format):

```json
{
  "type": "library",
  "name": "notify",
  "group": "EventSMS",
  "version": "2.1.3",
  "purl": "pkg:npm/EventSMS/notify@2.1.3",
  "licenses": [{"license": {"id": "MIT"}}]
}
```

An SBOM contains dozens or hundreds of such entries. A TPRM analyst reviewing this list would see names like:

- express
- axios
- lodash
- moment
- jsonwebtoken
- bcrypt
- winston
- pg
- redis
- EventSMS/notify

Most of these are legitimate, widely used libraries. Express is a web framework. Axios handles HTTP requests. Lodash provides utility functions. Moment handles date/time operations. Each serves a clear purpose in modern web development.

But what is EventSMS/notify? Is it a legitimate third-party notification library? Is it a custom internal module the vendor wrote? Is it a typo or package name squat that could indicate malicious intent?

An experienced software developer would recognize that "EventSMS" as a package namespace is unusual—most legitimate libraries use descriptive names or developer handles. "Notify" is generic. The combination is a potential red flag worth investigating: Does this library have documentation? Who maintains it? How many weekly downloads does it have on npm? Are there known vulnerabilities?

The average TPRM analyst would not question it. Without software development context, "import notify from EventSMS" looks like every other dependency in the list—technical details that serve some purpose the vendor's engineers determined was necessary.

Now consider the referenced scenario from the source documents: a developer who added a library that sends smartphone notifications whenever specific application events occur. This is a convenience for the developer—they get instant alerts when errors happen or when specific users log in. It is also a potential data exfiltration channel. Event details could include customer names, account identifiers, transaction amounts, or other sensitive information. The library makes network requests to external services the vendor has no contract with and the financial institution has no visibility into.

A security-trained software engineer would recognize this as a control gap warranting investigation. A TPRM analyst reviewing an SBOM would not even notice it as anomalous.

### The Vulnerability Assessment Challenge

Even for well-known, legitimate libraries, assessing risk requires technical depth most TPRM teams do not possess.

When a new vulnerability is disclosed in a widely used library, TPRM teams need to answer:

1. Which of our vendors use this library?
2. Are they using a vulnerable version?
3. Is the vulnerable functionality actually exercised in the vendor's application, or is it unused code?
4. What is the exploitability in the vendor's specific deployment context?
5. What compensating controls exist (network segmentation, input validation, monitoring)?
6. What is the remediation timeline, and what customer action is required?

Questions 1 and 2 can be answered mechanically with SBOM data and vulnerability databases. Questions 3-6 require software engineering judgment. They require understanding not just that a library is present, but how it is used, what attack vectors exist, and what defenses are in place.

Consider Log4Shell as a concrete example. The vulnerability existed in Log4j versions 2.0-beta-9 through 2.14.1. Simply knowing a vendor uses Log4j is insufficient. You need to know:

- **Which version?** (Versions before 2.0-beta-9 were not vulnerable. Versions 2.15.0 and above had the vulnerability patched, though 2.15.0 itself had a bypass requiring 2.16.0 or 2.17.0 for complete mitigation.)[1.1]
- **Is it directly included or transitive?** (If transitive, which parent dependency brings it in? Updating the parent may be necessary.)
- **Where is it deployed?** (Internet-facing applications have higher exploitation risk than internal tools.)
- **What is logged?** (Applications that log user input are at higher risk than applications logging only system events.)
- **What mitigations are in place?** (Blocking specific JNDI lookup patterns, restricting outbound network traffic, applying virtual patches through WAF rules.)

Answering these questions requires software architecture knowledge, understanding of Java dependency management, familiarity with exploitation techniques, and ability to evaluate defense-in-depth controls. TPRM teams were not built for this—this is application security work.

And Log4j was a high-profile vulnerability with extensive public guidance, proof-of-concept exploits, and vendor advisories.[1] Most dependency vulnerabilities receive far less attention. CVE descriptions are technical and assume reader familiarity with the affected software. CVSS scores provide numeric severity ratings but do not account for deployment-specific mitigations. NVD data is often incomplete—64% of open source CVEs in 2025 had no CVSS score in the National Vulnerability Database.[2]

TPRM analysts tasked with dependency risk assessment would be operating in an environment where vulnerabilities are disclosed continuously, technical documentation is inconsistent, and vendor responses vary from immediate patching to prolonged delays. The skill required is not "read a report and check a box." It is "understand software architecture well enough to independently assess risk."

### The Unfair Comparison

The source documents include a critical observation: "Your average programmer is rarely able to identify the vulnerabilities they are creating."[1.5]

This is true. Software development is complex. Even experienced engineers introduce security vulnerabilities through coding errors, design flaws, or incomplete understanding of attack vectors. Secure software development requires specialized training, code review, static analysis tooling, dynamic testing, and security-focused architectural review. Most development teams rely on security specialists to identify vulnerabilities that general-purpose developers miss.

If trained software engineers struggle to identify vulnerabilities in code they wrote, expecting TPRM analysts—who are not software engineers—to identify vulnerabilities in hundreds of third-party dependencies is unrealistic to the point of absurdity.

Yet this is precisely what a dependency-centric TPRM model would require without structural changes to team composition.

### The Technical SME Gap in Context

The competency gap is not unique to TPRM. It reflects a broader pattern in risk management: as the domain being assessed becomes more technical, generalist risk assessment becomes inadequate.

Financial institutions have addressed this pattern in other domains:

- **Credit risk** for complex derivatives and structured products requires quantitative analysts with advanced mathematics and financial engineering backgrounds—not just credit analysts
- **Model risk management** for AI/ML systems requires data scientists who can evaluate model validity, training data quality, and algorithmic bias—not just model validators
- **Cybersecurity risk** evolved from IT audit functions to dedicated Chief Information Security Officer roles with technical depth in threat modeling, incident response, and security architecture

In each case, the evolution followed a predictable pattern: general risk assessment proved inadequate, incidents occurred, regulators increased expectations, and institutions built specialized capabilities.

TPRM is now at that inflection point for software supply chain risk. General vendor risk assessment—collecting questionnaires, reviewing SOC 2 reports, checking financial stability—is inadequate for evaluating dependency-level risks. The incidents have occurred (Log4j, SolarWinds, MOVEit, CrowdStrike). Regulators are increasing expectations (DORA, CISA guidance, FFIEC updates). Institutions can build the specialized capability proactively or wait for regulatory enforcement to force the issue.

### What Competency Actually Looks Like

The skill set needed to effectively manage software supply chain risk in a TPRM context includes:

**Software development fundamentals**: Understanding of programming concepts, dependency management, build processes, version control, and deployment pipelines. Not necessarily the ability to write production code, but enough familiarity to understand what developers are doing and why.

**Application security knowledge**: Familiarity with common vulnerability classes (injection, authentication bypass, cryptographic failures, supply chain compromise), attack vectors, and defensive controls. Ability to read CVE descriptions and assess exploitability in context.

**Dependency ecosystem familiarity**: Understanding of how package managers work (npm, Maven, PyPI, RubyGems), what transitive dependencies are, how version resolution works, and what software composition analysis tools do.

**SBOM interpretation**: Ability to read CycloneDX or SPDX formatted SBOMs, identify unusual or high-risk components, correlate SBOMs with vulnerability databases, and ask informed questions of vendors about their dependency management practices.

**DevOps and CI/CD literacy**: Understanding of how modern software is built and deployed—what CI/CD pipelines are, what artifact repositories do, how container registries work, what infrastructure-as-code means, and where security controls fit into these processes.

**Open source ecosystem awareness**: Familiarity with how open source software is developed, maintained, and funded. Understanding that "vendor" does not apply to most open source libraries. Awareness of the risks associated with unmaintained projects, single-maintainer dependencies, and malicious package injection.

This is not a list of skills that can be acquired through a two-day training course. It represents a fundamentally different professional background—one that bridges risk management and software engineering.

### The Solution That Is Not a Solution

The competency gap cannot be solved by training existing TPRM teams to become software engineers. The skill development timeline is too long, the opportunity cost is too high, and the retention risk is significant. A TPRM analyst who develops deep technical skills becomes marketable for higher-paying technical roles and may leave for engineering or security positions.

Nor can the competency gap be solved by expecting vendors to provide dumbed-down explanations of their software supply chains. Vendors can produce SBOMs, but they cannot eliminate the technical complexity inherent in modern software. Dependency analysis requires technical judgment that vendors cannot provide as a service.

Commercial TPRM platforms cannot fully solve the gap either. Tools can automate SBOM ingestion, correlate components with vulnerability databases, and flag high-risk dependencies. But tools cannot provide the contextual judgment required to assess whether a flagged vulnerability is exploitable in a specific deployment, whether a mitigation is adequate, or whether an unusual dependency is benign or suspicious.

The competency gap requires a structural solution: **integrating technical subject matter expertise directly into TPRM teams.**

### The Third-Party Technology Risk Analyst Role

Some institutions are addressing the competency gap by creating dedicated roles that bridge TPRM and technical functions. A Third-Party Technology Risk Analyst—or equivalent role embedded within TPRM programs—would:

- **Bridge TPRM and IT/security teams**: Act as translator between risk professionals who understand vendor management and technical professionals who understand software dependencies
- **Perform technical due diligence**: Evaluate SBOMs, assess dependency management practices, review CI/CD security controls, and analyze vendor security architecture
- **Support incident response**: When a critical dependency vulnerability is disclosed, lead vendor exposure identification, assess risk, and coordinate remediation
- **Provide technical consultation**: Assist TPRM analysts in interpreting technical findings from penetration tests, security assessments, and vendor attestations
- **Monitor dependency risk**: Track vulnerability disclosures affecting the vendor portfolio, identify concentration points, and report on emerging supply chain threats

Such roles typically command compensation above traditional TPRM analyst rates but below pure software engineering or security engineering positions—reflecting the hybrid skill set required.[3]

The scale of investment depends on portfolio complexity. Institutions with 100-500 third-party relationships may find a single dedicated analyst sufficient; larger organizations with thousands of vendors and complex technology stacks may require specialized teams.[3.1]

### The Alternative: IT Resource Allocation

Not every institution can immediately create a dedicated Third-Party Technology Risk Analyst position. Headcount approval processes are slow, hiring takes time, and budget constraints are real.

The alternative is to allocate existing IT or information security resources to support TPRM on software supply chain issues. This could take the form of:

- A senior application security engineer assigned to spend 25-50% of their time supporting TPRM vendor assessments
- An IT architect designated as the TPRM technical liaison for infrastructure and application dependency questions
- Cross-functional working sessions where TPRM brings vendor assessment questions to IT/security subject matter experts on a recurring basis

This approach leverages existing technical capability without requiring new headcount. The disadvantages are that it divides attention (the IT resource has competing priorities), creates coordination overhead, and does not build dedicated TPRM-embedded technical expertise over time.

But it is better than the status quo, where TPRM teams assess software supply chain risk without technical capability and IT teams are brought in only after an incident has occurred.

### Why This Is Not Optional

The most common objection to adding technical capability to TPRM teams is cost: "We can barely staff our current TPRM program. How can we add expensive technical resources?"

This objection misunderstands the risk landscape. Technology is not a peripheral concern for TPRM—it is the primary driver of third-party risk in financial services. The highest-risk vendors are SaaS applications, cloud platforms, security tools, payment processors, and core banking systems. Every one of these is a technology product or service. Assessing them without technical capability is assessing them inadequately.

The incidents validate this. Log4j caused emergency weekend response efforts across the industry.[4] SolarWinds led to federal investigations and heightened regulatory scrutiny. MOVEit resulted in breach notifications affecting millions of individuals and hundreds of institutions.[5] CrowdStrike created operational disruptions measurable in billions of dollars.

Each of these incidents was a software supply chain failure. Each exploited dependencies that TPRM programs could not see and would not have understood even if disclosed. Each demonstrated that entity-based risk assessment is insufficient for technology vendors.

The cost of adding technical capability to TPRM—whether through dedicated headcount, reallocated IT resources, or cross-functional collaboration—is a modest investment relative to the risk. The cost of a single major vendor incident—breach notification, regulatory scrutiny, customer remediation, reputational damage, operational disruption—can easily exceed $1 million for a regional institution and tens of millions for larger organizations.

The real question is not whether institutions can afford to integrate technical capability into TPRM—it is whether they can afford not to.

### The Long-Term Trajectory

The need for technical expertise in TPRM is not a temporary gap that will close as frameworks mature or tools improve. It is a permanent feature of software supply chain risk management. Software will continue to grow more complex. Dependency chains will continue to deepen. Vulnerabilities will continue to be discovered in widely used components. Attackers will continue to target supply chains because they are effective attack vectors.

TPRM programs that do not build technical capability will fall further behind. They will continue to collect SOC 2 reports that address organizational controls but not the application-layer dependency risks that have emerged as most material. They will continue to send questionnaires that vendors answer perfunctorily. They will continue to learn about critical exposures only after incidents occur and vendors issue notifications.

TPRM programs that integrate technical capability will have competitive and operational advantages. They will identify vendor risks earlier. They will ask better questions during due diligence. They will respond faster when vulnerabilities are disclosed. They will provide more accurate risk assessments to executive leadership and boards.

Over time, regulators will likely formalize expectations that TPRM programs have technical competency for software supply chain risk. DORA already implies this through requirements for assessing "long or complex chains of subcontracting" and evaluating concentration risk. Future regulatory guidance may be more explicit.

Institutions that build the capability now will be ahead of the regulatory curve. Those that wait will be forced to build it under scrutiny and time pressure, which is more expensive and less effective.

The competency gap is not a side issue or a nice-to-have enhancement. It is the central challenge in modernizing TPRM for the software-intensive financial services landscape. No framework can close it. No tool can solve it. Only people with the right skills, embedded in the right organizational structure, can bridge the gap between what TPRM programs were built to see and what software supply chain risk actually looks like.

Theory, however, requires proof. The seven incidents examined in the next chapter provide that proof—demonstrating with painful clarity how dependency risks manifest in practice.

---

### Endnotes - Chapter 6

[1] CISA Cyber Safety Review Board, "Review of the December 2021 Log4j Event," July 2022. The vulnerability received extensive public guidance, proof-of-concept exploits, and vendor advisories within days of disclosure in December 2021. Available at: https://www.cisa.gov/sites/default/files/publications/CSRB-Report-on-Log4-July-11-2022_508.pdf

[1.1] Apache Software Foundation, "Apache Log4j Security Vulnerabilities," detailing CVE-2021-44228 (Log4Shell) and subsequent patches through Log4j 2.17.1. NIST National Vulnerability Database CVE records. The vulnerability affected Log4j versions 2.0-beta-9 through 2.14.1; version 2.15.0 contained an incomplete fix requiring further patches to 2.16.0 and ultimately 2.17.0 for full remediation.

[1.5] This observation is commonly attributed to software security literature and practitioner experience. Similar findings appear in: Gary McGraw, "Software Security: Building Security In" (Addison-Wesley, 2006); OWASP Foundation, "Secure Coding Practices Quick Reference Guide"; and various academic studies on developer security awareness. The fundamental challenge—that creating secure code requires expertise most developers do not possess—is a consistent finding across software security research.

[2] Endor Labs, "State of Dependency Management 2024," noting data quality issues in vulnerability databases including incomplete CVSS scoring in NVD. See also: NIST National Vulnerability Database quality assessments.

[3] Compensation estimates based on industry salary surveys for hybrid risk/technology roles. Glassdoor, LinkedIn Salary Insights, and industry benchmarking data for comparable roles in financial services.

[3.1] Third-party vendor portfolio sizes vary significantly by institution size and business model. Industry surveys suggest regional banks ($5-50B in assets) typically maintain 100-500 third-party relationships total, with technology vendors (SaaS, cloud, security) representing approximately 30-40% of the portfolio. Larger institutions may have 1,000+ vendor relationships. Estimates derived from OCC examination data, FFIEC guidance on vendor management, and industry TPRM benchmarking surveys.

[4] CISA Cyber Safety Review Board, "Review of the December 2021 Log4j Event," July 2022. Financial services institutions spent weeks identifying exposure across vendor portfolios, with organizations lacking SBOM capabilities requiring manual investigation that extended response timelines from hours to weeks.

[5] Emsisoft, "Unpacking the MOVEit Breach: Statistics and Analysis," updated December 2023. The CL0P ransomware group's exploitation of Progress Software's MOVEit Transfer platform affected 2,773+ organizations and 95.8 million individuals, with 60+ banks and credit unions confirmed affected. Most financial institutions were compromised through their vendors' use of MOVEit rather than direct implementation.

[6] SBOM generation rates among commercial SaaS vendors remain low. While Executive Order 14028 (May 2021) mandated SBOM provision for federal software suppliers, no equivalent requirement exists for commercial software serving financial services. Industry surveys support limited adoption: Synopsys 2024 OSSRA report found that while 96% of codebases contain open source, SBOM generation remains primarily regulatory-driven; Linux Foundation/OpenSSF "State of SBOM" (2024) reported that only 47% of organizations produce SBOMs for their software products. Practitioner surveys from Shared Assessments and industry TPRM working groups confirm that SBOM requests from financial institutions are frequently met with responses indicating vendors do not generate them.

\newpage
