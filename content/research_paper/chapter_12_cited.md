# Chapter 12: What Mature Dependency Risk Management Looks Like

The preceding chapters have diagnosed the framework gap: the mismatch between entity-focused oversight and dependency-level risk propagation. But diagnosis without direction is incomplete. What does mature dependency risk management actually look like in practice?

Rather than prescribing specific action plans—which vary by institution size, risk appetite, and organizational structure—this chapter frames the question differently: **What should a mature TPRM program be able to answer?**

The questions below map to the three risk dimensions established throughout this analysis. An institution that can answer these questions has achieved meaningful visibility into dependency-level risk. An institution that cannot answer them has work to do—regardless of how well its traditional vendor management processes perform.

This chapter does not prescribe specific implementation steps—institutions will build these capabilities differently based on their size, complexity, and risk appetite. Instead, it offers diagnostic questions that reveal where current capabilities provide genuine visibility and where blind spots remain. Within each section, questions are ordered from those answerable with existing resources to those requiring new capabilities or vendor cooperation.

---

### Supply Chain Risk: What's in the Code

These questions address the embedded components, libraries, and dependencies within vendor software—the layer where Log4j-type vulnerabilities propagate invisibly through transitive dependencies.

**If a critical vendor's subcontractor experienced a breach affecting your data, how would you expect to learn about it—and do your contracts support timely notification?**

The MOVEit incident revealed that many organizations learned of their exposure from news media or the Cl0p ransomware gang's leak site rather than from their vendors. Some received forensic details two months after initial exploitation. Contractual notification requirements typically address direct vendor breaches but may not cascade to nth-party incidents where your vendor is also a victim. Mature programs have mapped notification pathways for critical dependency chains and have contractual language requiring vendors to notify them of upstream breaches affecting their data—not just breaches of the vendor's own systems. This assessment requires only reviewing existing contracts—no new vendor cooperation needed.

**Can you identify which open source components are embedded across your critical vendor portfolio?**

This is the SBOM question. Mature programs can produce a consolidated view of what code libraries their critical vendors use, either through vendor-provided SBOMs or through systematic inquiry. Less developed programs know only that vendors exist—not what's inside them. Answering this question requires vendor cooperation in providing component inventories.

**If a Log4j-scale vulnerability emerged tomorrow, how quickly could you determine vendor exposure?**

When the Log4j vulnerability (CVE-2021-44228, detailed in Chapter 7) was disclosed, institutions with dependency visibility identified exposure within hours. Institutions without it spent weeks surveying vendors manually—and some never achieved complete visibility.[1] Another Log4j will happen—the question is when. Response time is a function of preparation—specifically, whether you have collected and can query component inventories before an incident occurs.

**For vendors that provide SBOMs, do you have the capability to ingest and analyze them?**

Collecting SBOMs is meaningless without the ability to interpret them. Mature programs can correlate vendor SBOMs against vulnerability databases, identify concentration on specific components, and surface emerging risks. Traditional programs collect documents they cannot use. This capability requires tooling investment beyond vendor cooperation.

**Do you track transitive dependencies, or only direct vendor relationships?**

As detailed in Chapter 7, the majority of Log4j exposure existed through transitive dependencies—meaning applications inherited the library through other components rather than declaring it directly.[2] A program that tracks only direct vendor relationships misses the majority of supply chain risk. Understanding transitive dependencies requires sophisticated SBOM analysis capabilities.

**For your critical vendors, do you understand whether their high-risk dependencies are direct or transitive—and how that affects remediation timelines?**

When Log4j was disclosed, organizations with direct Log4j dependencies could patch immediately. Organizations whose vendors used Log4j transitively—through other libraries that themselves depended on Log4j—faced longer remediation timelines because patches required upstream library maintainers to update first, then vendors to incorporate those updates, then customers to deploy. Transitive dependencies create remediation chains that extend timelines from days to weeks or months. Understanding dependency depth for critical components informs realistic expectations for vendor response. This represents the most sophisticated level of supply chain visibility.

---

### Software Delivery Risk: How Updates Reach You

These questions address the mechanisms through which vendor software is built, signed, and deployed—the layer where SolarWinds and 3CX-type compromises occur.

**Can you distinguish between vendors' SOC 2 infrastructure coverage and application-layer coverage?**

Many SOC 2 reports cover "corporate IT systems" or "infrastructure" without explicitly including the customer-facing application. A mature program scrutinizes Section III of every SOC 2 report to determine what's actually in scope. A less sophisticated program treats "has SOC 2" as binary assurance.[4] This assessment requires only reading reports you already have—no vendor cooperation needed.

**Do you know which vendors push automatic updates versus customer-controlled deployment?**

The CrowdStrike incident affected organizations precisely because updates deployed automatically without customer testing windows.[3] Understanding whether you control update timing—or whether the vendor does—is fundamental to assessing delivery risk. This information can be gathered through standard vendor inquiry.

**For critical vendors, do you understand their software release and testing processes?**

CrowdStrike's "Rapid Response Content" followed different testing protocols than standard software releases.[3] Understanding a vendor's release process—including what gets expedited testing and what does not—reveals risk that questionnaire-based assessments miss. This requires asking vendors questions that go beyond standard questionnaires.

**Do you assess vendor CI/CD pipeline security, or only production environment controls?**

SolarWinds had production security controls. The compromise occurred in the build environment—upstream of everything traditional assessments examine. Mature programs ask about build environment isolation, artifact signing, and deployment controls. Early-stage programs assess only where code runs, not how it gets there. Assessing CI/CD security requires technical questions that most vendors are not accustomed to answering.

**For vendors with privileged or kernel-level system access, do you control when updates deploy to your environment?**

The CrowdStrike incident affected organizations precisely because they followed security best practices—deploying trusted updates automatically from a trusted vendor. The 78-minute window between defective update release and rollback was sufficient to crash millions of systems globally. Organizations that maintained staging environments or delayed deployment windows for even critical security tools had time to observe failures before production impact. The question is not whether you trust the vendor, but whether that trust includes ceding control over deployment timing for software that can render systems inoperable. Implementing deployment controls for privileged software requires infrastructure and process changes within your own organization.

---

### Infrastructure Concentration Risk: Where It All Runs

These questions address the underlying platforms, providers, and services that vendors depend on—the layer where concentration creates correlated failure risk across apparently diverse vendor portfolios.

**Do you distinguish between vendors and platforms in your risk framework?**

AWS is both a vendor (a legal entity you may contract with) and a platform (infrastructure that many of your other vendors share). This distinction matters for concentration analysis. Mature programs track both dimensions. Less evolved programs treat everything as a vendor relationship. This is a conceptual framework adjustment that requires no external data—only internal alignment on how to categorize and track dependencies.

**What percentage of your critical vendor portfolio runs on AWS versus Azure versus GCP?**

An institution with 100 "diverse" vendors that all run on AWS has significant concentration risk on a single infrastructure provider—one with whom the institution has no direct contractual relationship. Mature programs map this concentration. Traditional programs see only the vendor layer. This information can be gathered through vendor inquiry during due diligence or renewal.

**How many of your vendors share the same EDR platform, identity provider, or CDN?**

CrowdStrike is deployed across 298 of the Fortune 500.[5] Okta provides identity services for thousands of enterprises. Cloudflare handles a significant fraction of internet traffic. Concentration on these platforms creates correlated risk that vendor-by-vendor assessment does not reveal. Like cloud provider mapping, this requires asking vendors about their technology stack.

**If a major cloud region experienced an extended outage, how many of your critical vendors would be simultaneously affected?**

Geographic concentration compounds platform concentration. A mature program can model the blast radius of infrastructure failures. A reactive program discovers concentration only during incidents. This requires aggregating the cloud provider and region data collected from individual vendors into a portfolio-level view.

**Do you assess vendor market penetration across financial services—not just "are we dependent on this vendor" but "are we and our peers dependent"?**

Traditional concentration risk asks whether your institution is over-reliant on a single vendor. But the collective fragility paradox operates at industry level: when 60% of the Fortune 500 uses the same endpoint security platform, or the majority of financial services runs on three cloud providers, individual institution diversification is insufficient. A vendor's operational failure becomes a sector-wide systemic event. Mature programs track not only their own vendor dependencies but the industry's collective convergence on critical platforms—because correlated failure across peers creates systemic risk that individual assessments cannot detect. This requires access to industry-level data beyond what individual vendor assessments provide.

**If a major cloud provider or critical infrastructure vendor experienced a prolonged outage, do you know which of your vendors have multi-region or multi-cloud resilience versus single points of failure?**

Vendor business continuity assessments typically confirm that disaster recovery plans exist. They rarely verify architectural resilience at the infrastructure layer. A vendor may have documented recovery procedures while running entirely in a single AWS region. Mature programs distinguish between vendors with genuine geographic and platform diversity and vendors whose "business continuity" depends on the same infrastructure remaining available. This requires technical assessment beyond attestation review—the most sophisticated level of infrastructure concentration analysis.

---

### The Maturity Progression

Institutions will find themselves at different points along the maturity spectrum for each risk dimension. Few organizations can answer all these questions comprehensively today—the capability gap is real, and closing it takes time.

The value of this framework is not as a pass/fail test, but as a diagnostic tool. It identifies where existing capabilities provide genuine visibility and where blind spots remain. It frames dependency risk management not as a compliance checklist but as an ongoing capability-building exercise.

For institutions beginning this journey, the honest answer to many of these questions may be "we do not know." That recognition is the first step. The incidents documented in this paper demonstrate the cost of not knowing. Will institutions build the capability to answer these questions before the next incident—or after?

---

### Endnotes - Chapter 12

[1] Log4j response timelines documented in multiple industry analyses (see Chapter 7 for detailed statistics). Organizations with SBOM capability identified exposure within hours; organizations without SBOM capability spent weeks on manual vendor surveys. See: CISA, "Apache Log4j Vulnerability Guidance," December 2021.

[2] For detailed Log4j transitive dependency statistics, see Chapter 7. Snyk analysis: "A straightforward search to determine if you're using a vulnerable version of Log4j would not necessarily find all occurrences in your projects" due to transitive dependencies. Source: Snyk, "Log4j Vulnerability Explained," December 2021.

[3] CrowdStrike post-incident analysis: Rapid Response Content updates deploy automatically to address emerging threats, following different testing protocols than standard Sensor Content updates. The July 19, 2024 incident resulted from a configuration file update that bypassed full testing procedures. Source: CrowdStrike, "Preliminary Post Incident Report," July 2024.

[4] SOC 2 scoping analysis: Service organizations determine which systems fall within audit scope based on "service commitments and system requirements." A vendor can legitimately scope SOC 2 to cover internal IT operations while excluding customer-facing applications—and remain compliant with AICPA standards. Source: AICPA, "SOC 2 Reporting on an Examination of Controls at a Service Organization."

[5] CrowdStrike market penetration: "Over half of Fortune 500 companies trust CrowdStrike" (298 of 500). Source: CrowdStrike corporate communications, June 2024; NotebookCheck, "How and why CrowdStrike has a massive market share," 2024.

---

*This paper represents independent analysis and is not an official position of any organization.*
