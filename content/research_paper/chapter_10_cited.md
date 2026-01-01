\begin{center}
{\Large\bfseries Part IV: The Path Forward}
\end{center}

---

# Chapter 10: Multi-Stakeholder Problem, Multi-Stakeholder Solution

The challenges revealed in the preceding chapters cannot be solved by financial institutions acting alone. The fundamental mismatch between current TPRM frameworks and the realities of modern software dependencies reflects systemic gaps in the regulatory, assurance, and vendor ecosystems. A multi-stakeholder problem demands a multi-stakeholder solution.

Financial institutions cannot solve this alone by "doing better" at vendor management. It requires coordinated evolution across four distinct but interconnected domains: regulatory guidance, assurance frameworks, vendor compliance capabilities, and institutional technical maturity. Each stakeholder has a role to play; progress requires movement across all four dimensions.

### 10.1 Regulatory Evolution: Creating the Demand Signal

Regulatory pressure is the single most powerful force for driving compliance behavior in financial services. History demonstrates this consistently: vendors resist new requirements until regulations make them table stakes, at which point market forces accelerate adoption. SOC 2 was not widely adopted because vendors recognized its inherent value—it became standard because customers demanded it, and customers demanded it because regulators expected evidence of third-party security controls.

The same demand-creation mechanism must extend to software supply chain transparency.

#### The Current Regulatory Gap

Current U.S. financial services guidance addresses third-party risk at the entity level but remains largely silent on code-level dependency risks:

**FFIEC IT Examination Handbook** (revised August 2024) references secure software development practices and cites NIST SP 800-218 (Secure Software Development Framework), but stops short of requiring Software Bill of Materials (SBOM) collection or dependency transparency from vendors.[1] Examination procedures address "supply chain communication" and "development designs that include security validation," yet lack specific expectations around application-layer dependency disclosure.

**OCC/Federal Reserve/FDIC Interagency Guidance on Third-Party Relationships** (June 2023) establishes comprehensive lifecycle management requirements but focuses on vendor entities rather than technical dependencies.[2] The guidance requires risk-based due diligence and ongoing monitoring, but does not explicitly address open source libraries, CI/CD pipeline security, or software composition analysis.

**NYDFS Cybersecurity Regulation (23 NYCRR 500)** requires written policies setting minimum cybersecurity standards for third-party service providers and mandates CISO reporting on third-party risks.[3] Yet like its federal counterparts, it does not require dependency-level visibility or SBOM provisions.

The result: financial institutions have regulatory obligations to manage third-party risk, but lack clear examination expectations around the dependency-level risks that drove Log4j, SolarWinds, and similar incidents.

#### The European Model: DORA's Entity-Level Approach

The European Union's Digital Operational Resilience Act (DORA), which entered into application January 17, 2025, represents the most comprehensive operational risk regulation ever implemented in financial services.[4] DORA requires financial entities to maintain detailed Registers of Information cataloging all ICT third-party contracts, mandates assessment of "long or complex chains of subcontracting," and requires identification of "material sub-contractors" that "effectively underpin" critical services.[5]

DORA is a significant regulatory advancement—but it remains fundamentally **entity-focused**. The framework addresses "who are your subcontractors?" but not "what's in your code?" Code libraries, which lack Legal Entity Identifiers (LEIs) and exist outside traditional contractual relationships, do not fit cleanly into DORA's structure. Notably, the European Commission rejected Article 5 of the July 2024 draft Regulatory Technical Standards that would have required ongoing monitoring of subcontractor chains, suggesting even European regulators recognize the practical limits of entity-level oversight[5.1].

DORA demonstrates regulatory willingness to tackle supply chain complexity, but even this ambitious framework has not bridged the gap to code-level dependencies.

#### What Regulatory Evolution Would Look Like

Effective regulatory guidance on software supply chain risk would establish clear examination expectations:

**SBOM as a Standard Due Diligence Element**: Guidance should position Software Bill of Materials collection as an expected component of vendor due diligence for critical software providers, comparable to SOC 2 reports or business continuity plans. This does not require universal SBOM collection from all vendors—a risk-tiered approach would focus requirements on vendors supporting critical functions or processing sensitive data.

**Dependency Transparency in Vendor Assessments**: Examination procedures should include evaluator questions about how institutions assess application-layer dependencies, concentration risks in shared code libraries, and mechanisms for responding to widespread vulnerabilities in third-party components. The goal is not to prescribe specific methodologies but to establish that dependency-level risk is within the scope of institutional responsibility.

**Software Delivery Mechanism Evaluation**: Guidance should acknowledge that how software is updated—the CI/CD pipeline, deployment controls, testing procedures—constitutes a material risk dimension. The CrowdStrike incident demonstrated that automatic update mechanisms can propagate failures as efficiently as they deploy fixes. Vendor assessments should evaluate software delivery risk alongside traditional security and operational risk categories.

**Integration of SBOM Standards**: Regulatory guidance should reference existing technical standards—CycloneDX, SPDX, SLSA provenance, NIST SSDF—to provide vendors with clear implementation pathways.[6] This avoids reinventing technical specifications while signaling regulatory expectations.

The objective is not to create a new compliance burden divorced from actual risk reduction. Rather, it is to align regulatory expectations with the demonstrated failure modes of modern technology dependencies. When regulators signal that dependency visibility matters, financial institutions gain the leverage to demand it contractually, and vendors face market pressure to provide it.

#### The Demand Creation Chain

Fintech willingness to provide SBOMs is currently a moot point. Most fintech vendors do not generate SBOMs because no customer is requiring them contractually, no audit framework is testing for them, and no regulator is examining for them. The rational business decision is to allocate engineering resources elsewhere.

Regulatory guidance changes this calculus by setting off a predictable chain reaction:

**Regulatory Pressure → FI Pressure → Fintech Compliance**

This is precisely how every significant compliance requirement has propagated through the industry:

**Data Processing Addendums (DPAs)** became table stakes for SaaS vendors following GDPR requirements in Europe (effective May 2018). Initially, vendors resisted, arguing that DPAs imposed operational constraints and legal liability. Within 18 months, market pressure—combined with subsequent U.S. state privacy laws like CCPA (2020)—made DPAs non-negotiable for enterprise contracts. Today, refusing to execute a DPA disqualifies a vendor from consideration at most financial institutions.[7.1]

**SOC 2 Type II reports** followed a similar trajectory. In the early 2010s, SOC 2 was considered optional or "nice to have."[7] As financial institutions began requiring SOC 2 reports in vendor contracts—driven by regulatory expectations around third-party risk management—vendors recognized that lacking a SOC 2 report eliminated them from procurement processes. By the late 2010s, SOC 2 Type II became the baseline expectation for any SaaS vendor serving regulated entities.

The same mechanism will drive SBOM adoption—once regulatory guidance establishes examination expectations, financial institutions will incorporate SBOM requirements into contracts, and vendors will comply because market access depends on it.

### Addressing the "Unfunded Mandate" Critique

Critics will argue that SBOM requirements impose costs on vendors without corresponding security benefits, particularly for smaller fintech companies operating on limited budgets. This critique deserves attention.

The reality is more nuanced. **For organizations with modern CI/CD infrastructure**—automated build pipelines, containerized deployments, explicit dependency management—**SBOM generation is technically straightforward**. GitHub and GitLab provide native SBOM generation capabilities. Open-source tools like Syft and Trivy can produce CycloneDX or SPDX-formatted SBOMs in minutes, integrated directly into CI/CD pipelines[7.3]. For organizations already using automated build processes, SBOM generation adds minimal engineering overhead—often less than a day of initial configuration.

However, this describes a best-case scenario. Many fintechs—particularly those with legacy codebases, monolithic applications, or years of accumulated technical debt—face substantially greater challenges. Applications built before modern dependency management may have implicit dependencies, vendored code, or components installed through non-standard mechanisms that automated tools miss. For these organizations, achieving accurate SBOM generation may require significant remediation work before transparency is even possible.

The solution is not to exempt legacy vendors but to establish **tiered expectations with reasonable timelines**. A vendor with a modern stack might demonstrate SBOM capability within months. A vendor undertaking modernization might receive a longer runway with milestone-based progress requirements. The goal is transparency about the path forward, not exemption from the destination.

The actual cost is not in generation but in **organizational processes around SBOMs**: maintaining accuracy as dependencies change, establishing workflows for vulnerability notifications, training customer-facing teams to discuss SBOMs intelligently, and potentially facing customer scrutiny over dependency choices. These are real costs, but they are also reasonable expectations for organizations providing critical software to regulated entities.

Moreover, the alternative—financial institutions operating with zero visibility into what code their vendors are running—is not a sustainable risk posture. Dependency transparency does impose costs, but those costs pale against the risks they mitigate. Software supply chain attacks cost an estimated $46 billion in 2023 and are projected to reach $138 billion by 2031.[7.2] The case for transparency is compelling.

Regulatory guidance that establishes clear but proportionate expectations—tiered by vendor criticality, with implementation timelines that allow for capability building—can drive necessary evolution without imposing unreasonable burdens on smaller vendors.

### 10.2 Assurance Framework Updates: Closing the Attestation Gap

Regulatory guidance creates demand; assurance frameworks provide the mechanism for verifiable compliance. Current frameworks leave systematic gaps that undermine their utility for software supply chain risk.

#### SOC 2's Design Scope and Emerging Gaps

SOC 2 Type II remains the baseline attestation expectation for SaaS vendors serving financial institutions. The framework was designed to address organizational security controls in an era when software supply chain risks were not yet widely recognized as material threats. The 2017 Trust Services Criteria, which remain substantively unchanged despite "revised points of focus" in 2022,[8] were not designed to address:

- Software Bill of Materials (SBOM) generation or maintenance
- Open source dependency management or vulnerability tracking
- CI/CD pipeline security or build integrity
- Software delivery mechanism controls
- Application-layer dependency disclosure
- Security tooling transparency (SIEM, MSSP, EDR providers)

The "carve-out" methodology compounds these gaps. When a SaaS vendor carves out Amazon Web Services, the auditor tests the vendor's monitoring controls over AWS—not AWS's actual controls. When AWS carves out their subprocessors, another layer of abstraction emerges. No one is mapping end-to-end assurance coverage across realistic dependency chains; instead, carve-outs create the appearance of comprehensive oversight while leaving substantial blind spots.

**Subservice organization disclosures** in SOC 2 reports typically include only infrastructure providers—AWS, Microsoft Azure, Google Cloud Platform, co-location facilities. Application-layer dependencies, security service providers, and software delivery tools remain undisclosed. Auditors are not failing here—they're following scoping decisions permitted under current standards.

The result: an institution can review a vendor's SOC 2 Type II report and conclude the vendor maintains adequate controls, while remaining completely unaware of critical dependencies like managed file transfer systems (MOVEit), logging libraries (Log4j), or endpoint management platforms—the precise attack vectors exploited in recent major incidents.

#### The SOC for Supply Chain Missed Opportunity

The AICPA introduced **SOC for Supply Chain** examinations in March 2020 explicitly in response to software supply chain attacks.[9] This should have been the mechanism for comprehensive software dependency attestation. Instead, it applies the same Trust Services Criteria used in SOC 2, and its documentation focuses primarily on physical product manufacturing and distribution—"producers, manufacturers, and distribution companies."

While AICPA materials note that SOC for Supply Chain covers "software, applications, and electronic products," the framework lacks specific criteria for:

- Build provenance and integrity
- Transitive dependency management
- Software composition analysis
- Source code supply chain security
- Automated deployment pipeline controls

The opportunity to create a software-specific attestation framework was available in 2020. The industry chose to extend existing criteria rather than develop new ones tailored to software supply chain risks. Five years later, the gap remains.

#### Pathways for Framework Evolution

Two pathways exist for closing the attestation gap:

**Option A: SOC 2 Scoping Expansion**

AICPA could revise the Trust Services Criteria to explicitly include application-layer dependencies and software supply chain controls. This would require adding control objectives around:

- **SBOM Maintenance**: Criteria requiring generation, accuracy validation, and periodic updates of machine-readable SBOMs in standardized formats (CycloneDX, SPDX)
- **Dependency Curation**: Controls for vetting third-party components before incorporation, tracking vulnerability disclosures, and enforcing policies against known-vulnerable libraries
- **Build Integrity**: Requirements for CI/CD pipeline security, build environment isolation, and provenance generation for released artifacts
- **Software Delivery Controls**: Criteria for staged deployments, pre-release testing, customer control over update timing, and rollback capabilities
- **Subservice Organization Expansion**: Mandatory disclosure of application-layer dependencies and security service providers, not just infrastructure

The challenge: AICPA standards evolve slowly, driven by practitioner consensus and technical committee processes that prioritize broad applicability across industries.[10] Software supply chain controls are highly technical and may not apply cleanly to non-software service organizations. Achieving consensus on meaningful criteria could take years.

That said, AICPA has the institutional infrastructure, the Big 4 relationships, and the technical hiring capacity to lead this evolution—if market demand and regulatory pressure create sufficient incentive. The same organization that created SOC 2 in response to SAS 70 misuse could create the next framework evolution in response to supply chain risk. The question is whether the incentive structure will drive that outcome.

**Option B: Parallel Attestation Framework**

Alternatively, the industry could develop a parallel, software-specific attestation standard that complements rather than replaces SOC 2. This would allow:

- **SOC 2** to retain its role for general security, availability, and processing integrity controls
- **Software Supply Chain Attestation** (call it "SOC 2.5" or a distinct framework) to provide specialized coverage of build integrity, dependency management, and software delivery risks

This approach has precedent: SOC for Cybersecurity exists alongside SOC 2, providing specialized coverage for cybersecurity risk management. A similar specialized framework for software supply chain could integrate existing technical standards—SLSA provenance levels, NIST SSDF practice groups, S2C2F dependency management practices—into auditable control objectives.

The advantage: faster implementation without requiring AICPA to overhaul SOC 2. The disadvantage: vendors face dual attestation costs, and institutions must evaluate multiple reports per vendor.

#### The Auditor Capability Challenge

Regardless of which pathway the industry pursues, a significant barrier remains: **auditor expertise**. Current SOC 2 auditors are skilled at evaluating change management policies, deployment logs, access controls, and disaster recovery plans. Far fewer possess deep expertise in:

- Container security and Kubernetes configurations
- SBOM validation and accuracy testing
- Build pipeline integrity assessment
- Provenance verification and signing infrastructure
- Software composition analysis tools and vulnerability correlation

Training programs are emerging—Practical DevSecOps offers a Certified Software Supply Chain Security Expert (CSSE) credential; SANS provides a Software Supply Chain Security Graduate Certificate[11.1]—but no AICPA-recognized certification for software supply chain attestation auditing exists. Building this capability across major audit firms will require substantial time, assuming market demand accelerates investment.

The implication: even if frameworks are updated today, the auditor capacity to execute comprehensive software supply chain attestations will lag by at least a year.

#### Cost Implications and Tiered Approaches

Comprehensive software supply chain attestation would substantially increase vendor compliance costs. The components involved—SBOM generation tooling, management platforms, provenance infrastructure, build pipeline hardening, additional audit scope, and specialized consulting—can collectively represent a significant investment, potentially doubling or tripling current compliance expenditures for vendors already maintaining SOC 2 Type II attestations.[11] Industry cost benchmarks indicate SOC 2 Type II audits range from $20,000-$80,000 annually depending on organization size and complexity; adding comprehensive software supply chain attestation with SLSA Level 2+ provenance, continuous dependency monitoring, and expanded audit scope could increase total compliance costs to $50,000-$200,000+ for critical vendors.[11a]

This creates legitimate concerns about market accessibility for smaller fintechs operating on constrained budgets. The solution is tiered requirements:

**Basic Attestation** (for lower-risk vendors): SBOM generation and availability, basic vulnerability scanning, documented dependency management process. Lower audit costs, achievable with limited tooling investment.

**Enhanced Attestation** (for critical vendors): Full SLSA Level 2+ provenance, continuous dependency monitoring, comprehensive build integrity controls, automated policy enforcement. Higher costs justified by vendor criticality.

Tiering allows the ecosystem to evolve without creating insurmountable barriers for smaller vendors while ensuring that institutions supporting critical functions meet enhanced standards.

### 10.3 Fintech and Technology Vendor Participation

The challenges outlined in this analysis create gaps that technology vendors—including fintechs, TPRM platform providers, and risk management solution developers—are uniquely positioned to address. The market gaps are real: financial institutions need dependency visibility tools, SBOM analysis capabilities, and technical translation services that bridge software engineering and risk management domains.

Fintech participation in the multi-stakeholder solution is essential. As both providers of software to financial institutions and consumers of third-party dependencies themselves, fintechs occupy a critical position in the dependency chain. Their willingness to adopt transparency practices—generating SBOMs, disclosing dependency chains, implementing software supply chain security controls—directly determines whether financial institutions can achieve dependency-level visibility.

Technology vendors capable of building SBOM aggregation platforms, dependency risk scoring services, and technical analysis tools can provide commercial solutions that financial institutions need but cannot efficiently build in-house. The specific products and approaches will vary based on market demand, technical feasibility, and competitive positioning. What matters is recognizing that fintech and technology vendors are not passive recipients of regulatory requirements—they are active stakeholders whose innovation and compliance capabilities shape the ecosystem's evolution.

### 10.4 Financial Institution Program Maturity: Building Internal Capability

Regulatory evolution, framework updates, and fintech innovation are necessary but insufficient. Financial institutions must build internal technical capability to consume and act on dependency-level information.

The most practical, near-term step: **integrate IT expertise into TPRM functions**.

#### The IT-TPRM Integration Imperative

Third-Party Risk Management has historically been staffed with professionals whose expertise lies in contracts, compliance, operational risk, and vendor relationship management. These competencies remain essential—but they are no longer sufficient.

The highest-risk vendors that TPRM programs oversee are **technical organizations**: SaaS platforms, cloud providers, managed security service providers, payment processors, core banking systems, cybersecurity tools. Evaluating these vendors requires technical fluency that traditional risk professionals do not possess.

Consider the questions TPRM analysts must now answer:

- "This vendor uses Log4j 2.15. Is that the vulnerable version or the patched version?"
- "The vendor's SBOM lists 847 dependencies. Which ones are high-risk?"
- "What does 'container orchestration via Kubernetes' mean for our data security?"
- "The vendor carved out their CI/CD pipeline from SOC 2 scope. Should we care?"
- "This vendor uses an MSSP we've never heard of. How do we assess that relationship?"

These are technical questions that require technical expertise to answer competently. No amount of risk management training will enable a professional with a compliance or legal background to evaluate Kubernetes security configurations, interpret SBOM component listings, or assess CI/CD pipeline integrity.

The solution is not to replace TPRM teams with technologists. Rather, it is to **integrate technical subject matter expertise into TPRM workflows**, creating cross-functional capability that combines risk management discipline with technical fluency.

#### Implementation Approaches

Financial institutions address this capability gap through various organizational models. Some create dedicated roles—a "Third-Party Technology Risk Analyst" or equivalent—embedded within the TPRM organization. Such positions bridge vendor management and technical assessment, translating SBOM findings into risk language, evaluating CI/CD security practices, and monitoring vulnerability disclosures affecting the vendor portfolio.

Other institutions reallocate existing IT resources, assigning engineers or architects to support TPRM on a fractional or rotational basis. This approach leverages institutional knowledge without requiring new headcount, though divided attention and competing priorities can limit effectiveness.

Still others establish cross-functional collaboration frameworks: standing IT liaisons, joint review processes for critical vendor assessments, and escalation pathways for complex technical evaluations. This model minimizes organizational disruption but may lack dedicated ownership and consistent application.

The appropriate approach depends on institutional size, portfolio complexity, and organizational structure. Large institutions with hundreds of SaaS relationships often require dedicated resources; smaller institutions may achieve adequate coverage through structured IT collaboration. The specific model matters less than the underlying principle: **TPRM can no longer operate in isolation from technical expertise**. The nature of third-party risk has become too technical for traditional risk management skills alone to address adequately.

#### The Economics: Technical Capability vs. Incident Cost

Executives concerned about the cost of adding technical capability to TPRM should consider the alternative: the cost of failing to identify critical vendor dependencies before they result in operational disruptions.

The investment required—whether for dedicated headcount, fractional IT allocation, or formalized collaboration—is modest relative to the costs these capabilities help avoid. Consider the scale of recent incidents:

- **MOVEit breach**: Estimated $15.8 billion in total damages across 2,700+ affected organizations; individual institutions faced breach notification costs, regulatory scrutiny, litigation, and reputational damage[12]
- **CrowdStrike outage**: $10+ billion globally; affected organizations experienced operational downtime, customer service disruptions, manual workaround costs, and potential regulatory examination[13]
- **Log4j response**: Emergency weekend response teams, vendor portfolio scans, patch coordination—institutions spent tens to hundreds of thousands on emergency response for an incident many did not know they were exposed to until the vulnerability was publicly disclosed[14]

A single major incident can exceed years of investment in technical capability. Institutions cannot afford to skip building technical capability within TPRM—the real risk is what happens without it.

While ecosystem-level changes take time, financial institutions can act now. The next chapter addresses what's within immediate institutional control.

---

**Endnotes - Chapter 10**

[1] Federal Financial Institutions Examination Council (FFIEC), "IT Examination Handbook - Outsourcing Technology Services," revised August 2024, https://ithandbook.ffiec.gov/it-booklets/outsourcing-technology-services

[2] Office of the Comptroller of the Currency (OCC), Federal Reserve, Federal Deposit Insurance Corporation (FDIC), "Interagency Guidance on Third-Party Relationships: Risk Management," OCC Bulletin 2023-17 / Federal Reserve SR 23-4 / FDIC FIL-23-2023, June 6, 2023, https://www.occ.gov/news-issuances/bulletins/2023/bulletin-2023-17.html

[3] New York State Department of Financial Services, "Cybersecurity Requirements for Financial Services Companies," 23 NYCRR Part 500, effective March 1, 2017

[4] European Union, "Regulation (EU) 2022/2554 of the European Parliament and of the Council on digital operational resilience for the financial sector (DORA)," Official Journal of the European Union, December 27, 2022, L 333, pp. 1–79; application date January 17, 2025

[5] European Insurance and Occupational Pensions Authority (EIOPA), "Digital Operational Resilience Act (DORA)," https://www.eiopa.europa.eu/digital-operational-resilience-act-dora_en

[5.1] European Commission rejection of DORA RTS Article 5 (ongoing subcontractor chain monitoring) documented in: Commission Delegated Regulation supplementing Regulation (EU) 2022/2554, final text comparison with July 2024 draft RTS.

[6] National Institute of Standards and Technology (NIST), "Secure Software Development Framework (SSDF)," NIST SP 800-218, February 2022, https://csrc.nist.gov/publications/detail/sp/800-218/final

[7] Secureframe, "The History of SOC 2," https://secureframe.com/hub/soc-2/history

[7.1] GDPR Article 28 (effective May 25, 2018) created binding requirements for data processing agreements between controllers and processors. Enterprise adoption of DPAs in financial services was primarily driven by GDPR compliance requirements for organizations processing EU citizen data, predating CCPA (effective January 1, 2020) by approximately 20 months.

[7.2] Software supply chain attack cost projections: Juniper Research, "Software Supply Chain Attacks to Cost the World $46 billion in 2023" (2023); Cybersecurity Ventures, "Software Supply Chain Attacks to Cost Global Economy $138 Billion by 2031" (2023). These projections include direct remediation costs, incident response, business disruption, and reputational damage.

[7.3] GitHub, "About the dependency graph," GitHub Docs; GitLab, "Dependency Scanning," GitLab Docs. Open-source tools: Anchore Syft (https://github.com/anchore/syft) and Aqua Security Trivy (https://github.com/aquasecurity/trivy) documentation.

[8] American Institute of Certified Public Accountants (AICPA), "2017 Trust Services Criteria (With Revised Points of Focus – 2022)," September 2022, https://www.aicpa-cima.com/resources/download/2017-trust-services-criteria-with-revised-points-of-focus-2022

[9] American Institute of Certified Public Accountants (AICPA), "SOC for Supply Chain," introduced March 2020, https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-for-supply-chain

[10] Johanson Group, LLP, "The History of SOC 2 Compliance," https://www.johansonllp.com/blog/the-history-of-soc-compliance (describing AICPA's consensus-driven standards development process)

[11] Schellman, "Which Big 4 Auditing Firm Should Perform Your SOC Audit?" https://www.schellman.com/blog/soc-examinations/which-audit-big-4-should-perform-your-soc-audit (providing industry cost benchmarks for SOC 2 audits)

[11a] Cost analysis based on: Schellman SOC 2 benchmarks ($20K-$80K); Chainguard, "The True Cost of SLSA Compliance" (2024) estimating $30K-$120K for SLSA Level 2+ implementation; Sonatype, "State of the Software Supply Chain Report" (2024) on dependency monitoring platform costs ($15K-$50K annually); and PwC/Deloitte consulting rate cards for specialized supply chain security assessments ($200-$400/hour, 100-300 hours for comprehensive attestation).

[11.1] Practical DevSecOps, "Certified Software Supply Chain Security Expert (CSSE)" program documentation; SANS Institute, "Software Supply Chain Security" curriculum offerings.

[12] Compliance Week, "Shades of SolarWinds in Lessons from MOVEit Hack," June 2023, https://www.complianceweek.com/cybersecurity/shades-of-solarwinds-in-lessons-from-moveit-hack/33211.article

[13] Wikipedia, "2024 CrowdStrike-related IT outages," https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages

[14] Cybersecurity and Infrastructure Security Agency (CISA), "Review of the December 2021 Log4j Event," CSRB Report, July 2022, https://www.cisa.gov/sites/default/files/publications/CSRB-Report-on-Log4-July-11-2022_508.pdf

\newpage
