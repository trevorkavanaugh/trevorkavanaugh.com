# Chapter 5: Framework Gaps by Design

The structural mismatch between entity-based oversight and dependency-level risk is not an accident. It is embedded by design in every major third-party risk management and assurance framework currently in use. These frameworks were created to address legitimate risk management concerns, but they were created for a different technological landscape. As software supply chains have grown in complexity and concentration, the frameworks have remained largely unchanged—or their updates have not bridged the fundamental gap.

Three frameworks dominate the TPRM landscape in financial services: DORA (Digital Operational Resilience Act), SOC 2 (Service Organization Control Type 2), and SBOM/CISA guidance derived from Executive Order 14028. Each addresses a portion of the supply chain risk spectrum. None addresses the application-layer dependency problem.

### DORA: Entity-Focused Supply Chain Transparency

The Digital Operational Resilience Act, which became applicable January 17, 2025, represents the most comprehensive regulatory framework for ICT third-party risk management ever implemented in financial services.[1] DORA applies to over 22,000 financial entities across the EU and brings critical ICT third-party providers under direct regulatory oversight for the first time.[1.1]

DORA requires financial institutions to maintain a **Register of Information** cataloging all ICT third-party service provider relationships.[2] This register must document the vendor name, services provided, data accessed, criticality classification, contract dates, and dependencies. Article 29(2) explicitly requires assessment of "long or complex chains of subcontracting," and Article 28(3) mandates identification of "material sub-contractors" that "effectively underpin" critical services.[3]

This is meaningful progress beyond status quo TPRM programs. DORA forces systematic inventory, criticality classification, and subcontractor visibility. Financial institutions can no longer limit vendor oversight to direct third-party relationships and ignore downstream dependencies.

But DORA remains fundamentally entity-focused. It addresses the question "who are your subcontractors?" not "what's in your code?"

Consider Article 30(3)(f), which requires contracts to include provisions on "the use of subcontractors, including that the financial entity is informed of any planned change concerning the use of subcontractors."[3] This requirement is valuable for maintaining visibility into outsourcing chains—if a vendor shifts from self-hosting to AWS, DORA requires notification. But it does not reach application-level dependencies.

Code libraries do not have Legal Entity Identifiers (LEIs). They do not issue subcontracting notifications. They do not fit into DORA's framework because they are not subcontractors—they are embedded components. A financial institution's vendor may use hundreds of open source libraries maintained by individuals or loosely organized communities. None of these trigger DORA's subcontracting notification requirements. None appear in the Register of Information. Yet any of them could be the next Log4j.

The European Commission itself acknowledged the limitations of entity-level oversight in an instructive way. In July 2024, the draft Regulatory Technical Standards included a proposed Article 5 that would have required financial entities to establish processes for "ongoing monitoring of the ICT third-party service providers' supply chains." This would have pushed visibility down to code-level dependencies.

The European Commission **rejected this provision** in the final RTS.[4] The official justification was that such monitoring would be "disproportionate" and that existing requirements for subcontractor notification were sufficient. In other words, even the most ambitious regulatory framework in financial services pulled back from requiring dependency-level visibility when confronted with the operational complexity.

DORA's greatest contribution to supply chain risk management may be its unintentional demonstration of where entity-based frameworks reach their limit. Financial institutions subject to DORA will have comprehensive visibility into vendors and their subcontractors. They still will not know which of those vendors are exposed to the next critical code library vulnerability until the vulnerability is disclosed and they ask.

### SOC 2: Designed for Infrastructure Controls, Not Application Dependencies

SOC 2 Type II reports have become the de facto assurance baseline for SaaS vendors in financial services. Banks require them in vendor contracts, TPRM teams rely on them for due diligence, and auditors treat them as credible third-party attestations. SOC 2 provides genuine value for what it was designed to cover: access controls, change management, logical and physical security, availability, and data handling practices.

But regulators have explicitly cautioned against over-reliance on these reports. The FFIEC IT Examination Handbook states: **"Users of audit reports or reviews should not rely solely on the information contained in the report to verify the internal control environment of the TSP."**[12] This guidance applies directly to SOC 2 reports—the FFIEC specifically identifies SOC 1, SOC 2, and SOC 3 attestations as examples of the audit reports requiring supplemental verification. Financial institutions must implement additional monitoring and verification procedures beyond reviewing SOC reports.

SOC 2's scope reflects its origins and the risk landscape when it was designed. The Trust Services Criteria were finalized in 2017 and remain substantively unchanged (see Chapter 2 for the detailed SOC 2 evolution timeline).[5][6] The framework was not designed to require Software Bills of Materials, mandate CI/CD pipeline security assessment, or address application-layer dependencies—these risk categories were not yet widely recognized as material threats to financial institutions. When SOC 2 reports disclose subservice organizations, they almost universally disclose infrastructure providers (AWS, Azure, GCP) while application-layer dependencies remain invisible.

SOC 2's vendor-defined scoping creates additional gaps. A vendor could scope their SOC 2 to cover internal IT operations while excluding the customer-facing application entirely—and this would comply with AICPA standards. Even when application security is in scope, auditors test high-level process controls, not technical details like dependency vulnerability management or build pipeline isolation.

The AICPA introduced **SOC for Supply Chain** in March 2020 explicitly to address software supply chain attacks,[7] but this framework uses the same Trust Services Criteria and focuses primarily on physical manufacturing. No major audit firm has developed SOC for Supply Chain as a standard offering for software vendors. The framework has not achieved material adoption in financial services TPRM.[7.1] SOC 2 Type II remains the standard, and SOC 2 does not see application-layer dependencies.

(See Chapter 9 for detailed analysis of how SOC 2 could evolve to address emerging supply chain risks.)

### SBOM/CISA Guidance: Standards Without Mandates

Executive Order 14028 (Improving the Nation's Cybersecurity), issued in May 2021, established the most comprehensive federal software supply chain security requirements ever implemented in the United States.[8] The order directed NIST to issue guidelines on software supply chain security and directed CISA to develop an attestation form for software producers.

The technical standards exist. CycloneDX and SPDX provide machine-readable SBOM formats.[9] Tools like Syft, Trivy, and native GitHub/GitLab SBOM generation can automatically produce SBOMs in CI/CD pipelines. CISA's Secure Software Development Attestation Form (March 2024) requires software producers to attest to core secure development practices including:[10]

- Separation of build environments from development and production
- Multi-factor authentication for all personnel with access to software development environments
- Encryption of data in transit
- Trusted source code supply chains
- Provenance for third-party components
- Vulnerability disclosure programs
- SBOM capability

These requirements are comprehensive and technically sound. They address many of the control gaps that enabled the SolarWinds and 3CX attacks. They create a baseline expectation for software supply chain transparency.

But they apply only to federal contractors selling software to government agencies. Financial services institutions are not covered. There is no equivalent OCC, FDIC, Federal Reserve, or FFIEC guidance requiring financial institutions to collect SBOMs from vendors or to verify CISA attestations.[11] There is no examination manual checklist item for SBOM collection. There is no regulatory expectation.

The result is a demand problem masquerading as a technical problem. For organizations with modern CI/CD infrastructure, SBOM generation is technically straightforward—a single additional pipeline step can produce a machine-readable dependency inventory. However, the reality is more complex for legacy applications, acquired codebases, products with extensive runtime dependencies, or systems built by contractors no longer engaged.[11.1] The technical barrier is real but varies dramatically by technology stack and organizational maturity. Vendors are not refusing to generate SBOMs solely because it is technically difficult. They are not generating them because no customer is requiring it and no regulator is examining it.

Why would a fintech generate an SBOM when:

- No customer requires it contractually
- No audit framework tests for it
- No regulator examines it
- It costs engineering time with no return on investment
- There is zero competitive disadvantage for not having one

The irony is profound. The technology exists. The standards exist. The federal government has demonstrated that SBOM requirements can be implemented at scale. But in financial services—the sector most dependent on SaaS vendors, most exposed to supply chain concentration risk, and most heavily regulated for third-party risk—SBOM adoption remains voluntary and rare.

### The Void: Where Frameworks Do Not Meet

The gap between entity-level oversight and code-level dependency transparency is not a minor oversight that can be addressed through incremental updates. It is a structural void where no framework currently provides comprehensive assurance.

Consider how major incidents map to this void:

| Incident | Risk Category | Entity-Level Framework Coverage | Dependency-Level Gap |
|----------|---------------|----------------------------------|---------------------|
| **SolarWinds (2020)** | Software delivery pipeline | DORA: Would require notification of build environment changes, but compromise was undetected<br>SOC 2: SolarWinds held SOC 2 certification—controls did not prevent build compromise<br>SBOM: Would document components in delivered software, but not detect malicious injection during build | Compromise occurred in build process, not infrastructure. SOC 2 tested access controls and change management, but not build integrity or artifact signing. Attack vector outside audit scope. |
| **Log4j (2021)** | Code library vulnerability | DORA: Would require notification of subcontractor changes, but Log4j is not a subcontractor<br>SOC 2: CC9.2 covers vendor relationships, not embedded libraries<br>SBOM: Would have enabled rapid exposure identification, but not required in financial services | Embedded in applications invisibly. Not a legal entity. No contract, no SOC 2, no disclosure obligation. Organizations could not identify exposure for weeks. |
| **Kaseya VSA (2021)** | Remote management platform | DORA: Kaseya would appear in register if directly contracted, but many institutions affected through MSP relationships<br>SOC 2: Kaseya's SOC 2 did not prevent supply chain compromise<br>SBOM: Not applicable—attack targeted software delivery mechanism | Ransomware deployed through compromised software update affected 1,500+ organizations.[13.1] Fourth-party exposure invisible to institutions whose MSPs used Kaseya. |
| **3CX (2023)** | VoIP software supply chain attack | DORA: 3CX would appear in register if used directly; upstream dependency on X_TRADER software invisible<br>SOC 2: 3CX held SOC 2; did not cover build pipeline compromise<br>SBOM: Could have revealed compromised dependency if generated and monitored | Attackers compromised 3CX build process through trojanized upstream dependency. 600,000+ organizations affected.[13.2] Software signed with valid certificates passed security checks. |
| **MOVEit (2023)** | Application-layer tool | DORA: MOVEit would appear in register only if treated as "ICT third-party service provider"—likely not, since it is embedded tooling<br>SOC 2: Could be disclosed as subservice organization, but is not required<br>SBOM: Would not appear—MOVEit is operational infrastructure, not code dependency | Embedded in vendor systems for file transfer. Not disclosed as subservice organization on most SOC 2 reports. TPRM teams learned of exposure only after breach notification. |
| **xz Utils (2024)** | Code library backdoor attempt | DORA: xz Utils is not a subcontractor—it is an open source compression library<br>SOC 2: No visibility into individual code libraries embedded in applications<br>SBOM: Would have enabled detection of affected versions if SBOMs were current | Backdoor inserted by compromised maintainer nearly reached production systems globally. Discovered only through alert engineer's investigation, not through systematic dependency monitoring. |
| **CrowdStrike (2024)** | Kernel-level agent with automatic updates | DORA: CrowdStrike would appear in register, but automatic update mechanism would not be assessed as concentration risk<br>SOC 2: CrowdStrike's own SOC 2 would not cover customer update deployment risks<br>SBOM: Not applicable—incident was configuration update, not code | Automatic updates created single point of failure across enterprise. Not recognized as concentration risk because dependency was on update delivery mechanism, not on a contractual "party." |

Each incident exploited the same gap: the risk propagated through a technical dependency that did not map to an entity that frameworks are designed to assess.

### The Missing Framework Layer

What would a framework that bridged this gap look like? It would need to:

1. **Mandate SBOM collection** from all critical software vendors, with standardized formats (CycloneDX or SPDX) and machine-readable data
2. **Require dependency vulnerability disclosure** including transitive dependencies, with timelines for remediation and customer notification
3. **Assess CI/CD pipeline security** including build environment isolation, artifact signing, provenance attestation, and deployment controls
4. **Evaluate software delivery mechanisms** as part of vendor security assessment—how do updates deploy, who controls them, what testing occurs before release
5. **Distinguish between infrastructure and application dependencies**—AWS is both a vendor and a platform that many vendors share; this distinction matters for concentration risk
6. **Map convergence points** where multiple critical vendors depend on the same underlying components or services
7. **Create audit accountability** for dependency-level controls through third-party attestation, not just vendor self-assessment

No current framework provides this. DORA goes furthest on entity-level visibility but stops at subcontractor chains. SOC 2 provides process-level assurance for vendor controls but does not reach code dependencies. SBOM guidance establishes technical standards but has no regulatory mandate in financial services.

The void exists because each framework was designed for a specific purpose and reflects the technological assumptions of its era. DORA reflects regulatory concern about outsourcing and cloud concentration. SOC 2 reflects audit practices for IT controls and data handling. SBOM guidance reflects federal government cybersecurity priorities. None was designed to provide end-to-end software supply chain assurance.

Financial institutions today face a choice: rely on frameworks that were not built for software supply chain risk, or build supplemental capabilities that existing frameworks do not address. The incidents of recent years demonstrate that relying on existing frameworks alone is insufficient. The question is whether institutions will build those capabilities proactively or wait for the next crisis to reveal gaps that could have been anticipated.

Framework limitations are only part of the challenge. Equally important is whether TPRM teams have the technical expertise to evaluate these risks—even if frameworks were updated tomorrow.

---

### Endnotes - Chapter 5

[1] European Parliament and Council of the European Union, "Regulation (EU) 2022/2554 on Digital Operational Resilience for the Financial Sector (DORA)," December 14, 2022, https://eur-lex.europa.eu/eli/reg/2022/2554/oj

[1.1] European Insurance and Occupational Pensions Authority (EIOPA), "Digital Operational Resilience Act (DORA)" overview documentation. The 22,000+ figure includes banks, insurance companies, investment firms, and ICT third-party service providers subject to DORA requirements.

[2] DORA Article 28(3), "ICT Risk Management Framework - Register of Information," in Regulation (EU) 2022/2554

[3] DORA Article 29(2) and Article 30(3)(f), "Assessment of ICT Third-Party Risk and Key Contractual Provisions," in Regulation (EU) 2022/2554

[4] European Banking Authority, European Insurance and Occupational Pensions Authority, and European Securities and Markets Authority, "Final Report on Draft Regulatory Technical Standards," July 2024. The draft Article 5 requiring ongoing supply chain monitoring was removed in the final RTS published by the European Commission.

[5] American Institute of Certified Public Accountants, "2017 Trust Services Criteria for Security, Availability, Processing Integrity, Confidentiality, and Privacy," 2017

[6] American Institute of Certified Public Accountants, "2017 Trust Services Criteria (With Revised Points of Focus – 2022)," September 2022. The revision document explicitly states changes "do not, in any way, alter the criteria in the 2017 TSC."

[7] American Institute of Certified Public Accountants, "SOC for Supply Chain: An Examination Engagement to Report on a Subject Matter Related to the Products Produced by or Services Provided by a Producing Entity," March 2020

[7.1] Based on review of Big Four and major regional CPA firm service offerings (2024). SOC for Supply Chain engagements remain concentrated in manufacturing and distribution sectors per AICPA guidance; software vendor adoption remains limited.

[8] The White House, "Executive Order 14028: Improving the Nation's Cybersecurity," May 12, 2021, https://www.whitehouse.gov/briefing-room/presidential-actions/2021/05/12/executive-order-on-improving-the-nations-cybersecurity/

[9] OWASP Foundation, "CycloneDX Specification," https://cyclonedx.org/specification/overview/; Linux Foundation, "Software Package Data Exchange (SPDX) Specification," https://spdx.dev/specifications/

[10] Cybersecurity and Infrastructure Security Agency (CISA), "Secure Software Development Attestation Form," March 2024, https://www.cisa.gov/resources-tools/resources/secure-software-development-attestation-form

[11] Based on review of OCC Bulletins, FDIC Financial Institution Letters, Federal Reserve SR Letters, and FFIEC IT Examination Handbook updates through December 2025. While these agencies reference supply chain risk management principles, no guidance specifically mandates SBOM collection from vendors or CISA attestation verification for financial institutions. The June 2023 Interagency Guidance on Third-Party Relationships (OCC Bulletin 2023-17, Fed SR 23-4, FDIC FIL 29-2023) addresses supply chain risk conceptually but does not require SBOMs.

[11.1] SBOM generation challenges for complex environments documented in: NTIA Software Component Transparency, "SBOM Minimum Elements," noting that "SBOMs may require additional effort for legacy systems"; Sonatype "State of the Software Supply Chain" reports (2022-2024) discussing SBOM tooling gaps for legacy applications; and CISA "SBOM Sharing Lifecycle Report" (2024) noting "organizations with significant technical debt or acquired codebases face extended timelines for comprehensive SBOM coverage."

[12] Federal Financial Institutions Examination Council (FFIEC), "IT Examination Handbook: Outsourcing Technology Services," June 2023, Section "Third-Party Due Diligence and Monitoring." The handbook states: "Users of audit reports or reviews should not rely solely on the information contained in the report to verify the internal control environment of the TSP." Available at: https://ithandbook.ffiec.gov/

[13.1] Kaseya CEO Fred Voccola statement and industry reporting confirmed 50-60 MSPs directly affected and 800-1,500 downstream businesses. See: NPR, "Scale, Details Of Massive Kaseya Ransomware Attack Emerge," July 5, 2021; Reuters, "Up to 1,500 businesses affected by ransomware attack," July 5, 2021.

[13.2] 3CX company data and security researcher analysis. See: CPO Magazine, "Supply Chain Attack on VoIP Firm 3CX Puts 600,000 Businesses at Risk," March 2023; Krebs on Security, "3CX Breach Was a Double Supply Chain Compromise," April 2023.

\newpage
