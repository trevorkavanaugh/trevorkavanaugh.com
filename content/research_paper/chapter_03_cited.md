# Chapter 3: Who Should Have Followed (But Didn't)

### The Technology-Focused Organizations That Could Have Created Alternatives

### The Vacuum

By the mid-2000s, the limitations of SAS 70 were evident. It was being used for purposes it was never designed to address. The market needed a technology-specific attestation framework—one designed by and for technology professionals, with criteria that addressed modern software development practices, security architectures, and operational resilience.

This need was recognized. Companies were asking vendors for assurance. Procurement teams were demanding independent validation. Risk managers needed some basis for evaluating third-party technology controls. The demand was real and growing.

The AICPA filled this vacuum with SOC 2 in 2011. But that should not have been the only option. Several technology-focused organizations had the expertise, credibility, and market presence to create competing frameworks. None did. Understanding why reveals structural constraints that persist to this day.

### ISACA: The Professional Association That Could Not Compete

ISACA (formerly the Information Systems Audit and Control Association), established in 1969,[1] is the most prominent professional association dedicated to managing and auditing information systems. It is best known for the COBIT framework[2] and for administering certifications including CISA (Certified Information Systems Auditor), CRISC (Certified in Risk and Information Systems Control), and CISM (Certified Information Security Manager).[3]

If any organization had the expertise to create a technology-specific attestation framework, ISACA did. COBIT provides comprehensive IT governance and management guidance. ISACA's certifications are widely recognized in the information security and audit community. The organization publishes standards, guidelines, and best practices specifically for IT audit and assurance.[4]

Yet ISACA did not create an attestation framework to compete with SOC 2. Why?

**Structural Mission Constraint**: ISACA operates as a professional association and standards development organization, not as an attestation service provider. This creates a fundamental separation:

- **What ISACA does**: Certify individuals (CISA, CRISC, CISM), develop frameworks and standards (COBIT), publish audit guidance
- **What ISACA does not do**: Perform organizational attestations, certify companies, issue audit reports

This is not accidental. ISACA's mission is to support the profession, not compete with it. If ISACA created an attestation service, it would be competing with the audit firms and internal audit departments whose professionals hold ISACA certifications. This creates an insurmountable conflict of interest.

ISACA publishes standards that **others** use to perform attestations.[5] Individual auditors may hold ISACA certifications, but the attestation is performed by their firm (a CPA firm or internal audit department), not by ISACA. The organization certifies practitioners, not companies.

**The Business Model Problem**: Professional associations derive revenue from certifications, memberships, training, and conferences. Adding attestation services would require building an entirely different business—one that competes with members. The economics do not work.

**The Independence Question**: Even if ISACA wanted to provide attestation, the independence concerns would be significant. If ISACA develops the standard (COBIT), trains professionals in that standard, and then attests that companies comply with the standard, where is the independence? The AICPA model works because different CPA firms compete to perform SOC audits—the standard-setter does not perform the attestations. ISACA would be both.

**What ISACA Actually Contributed**: ISACA's frameworks and guidance are used by auditors performing SOC 2 assessments. The Trust Services Criteria align with COBIT principles. Many SOC 2 auditors hold CISA certifications. ISACA's contribution is indirect but real—just not in the form of a competing attestation framework.

### NIST: The Government Agency Barrier

The National Institute of Standards and Technology (NIST) is a U.S. federal government agency with a statutory mission to develop standards and guidance.[6] NIST has produced extensive frameworks relevant to technology risk, including the Cybersecurity Framework (CSF),[7] SP 800-53 (Security and Privacy Controls),[8] SP 800-171 (Protecting Controlled Unclassified Information),[9] and SP 800-218 (Secure Software Development Framework).[10]

These frameworks are widely respected. Federal agencies rely on them. Many financial institutions use NIST CSF as a foundational element of their cybersecurity programs. The frameworks are technically robust, comprehensive, and continuously updated.

Yet NIST does not offer certification or attestation. There is no "NIST CSF certification" issued by NIST.[11] Why?

**Explicit Policy of Non-Certification**: NIST intentionally maintains separation between standards development and compliance verification. The agency develops frameworks that **others** use for attestation. This prevents conflicts of interest and maintains objectivity in the standards development process.

NIST's website explicitly states that the Cybersecurity Framework is voluntary and does not establish a certification program.[12] Organizations may self-assess, may be assessed by third parties, or may face regulatory requirements based on NIST standards—but NIST itself does not certify compliance.

**Government Agency Mission Constraint**: As a federal agency, NIST's role is to develop standards, conduct research, and provide guidance. Creating a certification or attestation business would fundamentally change its mission and raise questions about government involvement in commercial markets. Would a NIST certification give certified companies a competitive advantage? Would foreign entities trust a U.S. government certification? These questions illustrate why government agencies typically do not perform attestation.

**Self-Attestation Model**: For federal software procurement, NIST frameworks are used via self-attestation or third-party assessment organizations (3PAOs). Executive Order 14028 (2021)[13] required software producers selling to the federal government to attest compliance with NIST Secure Software Development Framework (SSDF). But the attestation is provided by the software producer or an independent assessor—not by NIST.[14]

**Third-Party Ecosystem**: NIST's approach has enabled an ecosystem of third-party assessors. FedRAMP uses NIST standards but has its own authorization process.[15] CMMC (Cybersecurity Maturity Model Certification) for Department of Defense contractors requires third-party assessments against NIST 800-171.[16] Private organizations have created certification programs based on NIST standards (such as the SCF Conformity Assessment Program).[17] NIST provides the criteria; others provide the attestation.

**What NIST Actually Contributed**: NIST frameworks serve as the foundation for many attestation programs, including FedRAMP and CMMC. They are referenced in SOC 2 assessments and incorporated into risk management programs globally. NIST's contribution is profound—just not in the form of a NIST-issued attestation.

### ISO/IEC: Organizational Scope, Not Product-Specific

ISO/IEC 27001 is an internationally recognized standard for information security management systems (ISMS).[18] It provides a framework for managing and protecting sensitive information and is widely adopted globally. Organizations can become ISO 27001 certified through independent certification bodies.

This sounds like exactly what the market needed—a technology-specific certification alternative to SOC 2. Yet ISO 27001 did not fill the gap. Why?

**Organizational vs. Product-Level Scope**: ISO 27001 certifies an organization's security management system, not specific technology products or services.[19] The scope is enterprise-wide governance and process maturity, not the security controls of a particular application, system, or service offering.

A SaaS vendor might achieve ISO 27001 certification for their overall ISMS, but that certification does not attest to the specific security controls of their software product. It confirms they have a structured approach to information security management—policies, risk assessments, training, incident response processes. It does not confirm that their application is free of Log4j vulnerabilities, that their CI/CD pipeline is secured, or that they generate SBOMs.

**Broad vs. Technical Focus**: ISO 27001 addresses general information security management. It is process-oriented and technology-agnostic. While this broadness enables global applicability, it also means the standard does not address technology-specific risks like software supply chain dependencies, cloud architecture patterns, or infrastructure concentration.

**Complementary, Not Competing**: ISO 27001 and SOC 2 serve different purposes. ISO 27001 provides organizational-level assurance. SOC 2 provides service-level assurance based on specific Trust Services Criteria. Many organizations pursue both: ISO 27001 to demonstrate enterprise security maturity, and SOC 2 to provide detailed control attestation for their service offerings.

**Cloud-Specific Extensions (ISO 27017/27018)**: ISO developed cloud-specific guidance with ISO 27017 (cloud services information security controls) and ISO 27018 (protection of PII in cloud environments).[20] However, these remain organizational certifications, not product or service-level attestations. They extend ISO 27001 to cloud contexts but do not fundamentally change the scope.

**What ISO Actually Contributed**: ISO 27001 provides a globally recognized standard for ISMS certification. It is referenced in procurement requirements, integrated into risk management programs, and recognized by regulators. But it addresses a different assurance need than SOC 2—organizational governance rather than service-specific control validation.

### Cloud Security Alliance: Enhancement, Not Alternative

The Cloud Security Alliance (CSA), founded in 2008,[21] is a nonprofit organization dedicated to defining standards, certifications, and best practices for cloud security. Given its focus and timing (emerging alongside cloud adoption), CSA seemed positioned to create a cloud-specific attestation framework that could serve as an alternative to SOC 2.

CSA did create the Security Trust Assurance and Risk (STAR) Program, which "encompasses key principles of transparency, rigorous auditing, and harmonization of standards."[22] STAR operates on three levels: self-assessment (Level 1), independent third-party certifications (Level 2), and continuous monitoring (Level 3).[23]

This appears to be exactly what was needed. Yet STAR did not become an alternative to SOC 2. Instead, it became a complement. Why?

**STAR Attestation = SOC 2 + Cloud Controls Matrix**: The critical finding is that CSA STAR Attestation is not an independent framework. It is an enhancement to SOC 2. According to CSA's own description, STAR Attestation is "a collaboration between CSA and the AICPA to provide guidelines for CPAs to conduct SOC 2 engagements using criteria from the AICPA (Trust Service Principles) and the CSA Cloud Controls Matrix."[24]

Translation: STAR Attestation is a SOC 2 Type II report with additional criteria from CSA's Cloud Controls Matrix. The same CPA firms perform the audits. The same SSAE 18 attestation standards apply. CSA added cloud-specific controls to the assessment, but the foundational framework remained SOC 2.

**STAR Certification = ISO 27001 + Cloud Controls Matrix**: Similarly, CSA STAR Certification builds atop ISO 27001. It acknowledges that an organization has implemented an ISMS per ISO 27001 and also features cloud-specific controls from the Cloud Controls Matrix.[25] Again, CSA enhanced an existing framework rather than creating an independent one.

**Why CSA Chose This Approach**: CSA's decision to augment SOC 2 and ISO 27001 rather than create a competing standard was pragmatic:

1. **Leverages existing audit infrastructure**: CPAs already perform SOC 2; certification bodies already perform ISO 27001. No need to build a new auditor ecosystem.
2. **Increases adoption**: Organizations already pursuing SOC 2 or ISO 27001 can add STAR more easily than switching to a new framework.
3. **Avoids market fragmentation**: Does not force organizations to choose between competing frameworks; instead, allows layering of assurance.

**The Trade-Off**: This approach increased STAR adoption but meant CSA STAR inherited the limitations of its underlying frameworks. SOC 2's technology gaps (no SBOM requirements, limited software supply chain coverage) carry forward into STAR Attestation. ISO 27001's organizational focus (rather than product-specific attestation) carries forward into STAR Certification.

**What CSA Actually Contributed**: The Cloud Controls Matrix (CCM) provides a comprehensive controls framework with 197 control objectives across 17 domains,[26] mapped to multiple standards including ISO 27001, NIST SP 800-53, PCI DSS, and AICPA Trust Services Criteria. CSA provided a valuable mapping and harmonization layer, enabling organizations to see how different frameworks align. But STAR did not replace SOC 2—it enhanced it.

### Emerging Frameworks: Specialized, Not Comprehensive

In recent years, technology-focused frameworks have emerged to address specific gaps, particularly in software supply chain security.

**in-toto**: A framework designed to ensure the integrity of a software product from initiation to end-user installation.[27] It provides a generalized workflow to secure software supply chains and a framework for software attestations—signed documents that associate metadata with artifacts. Hosted by the Cloud Native Computing Foundation (CNCF), in-toto provides the technical foundation for supply chain attestation.

**SLSA (Supply-chain Levels for Software Artifacts)**: A set of incrementally adoptable guidelines for supply chain security, established by industry consensus and backed by The Linux Foundation.[28] SLSA focuses on protecting software from source through deployment and allows users to make automated decisions about artifact integrity. SLSA recommends in-toto attestations as the vehicle to express provenance and other supply chain attributes.[29]

**SBOM (Software Bill of Materials)**: While not an attestation framework per se, SBOMs provide transparency into software dependencies.[30] Executive Order 14028 (2021) mandated SBOMs for software sold to the federal government. Technical standards exist (CycloneDX, SPDX, SWID), and tools can auto-generate SBOMs in CI/CD pipelines.

**Why These Don't Replace SOC 2**: These frameworks address **specific technical gaps** but remain narrowly focused:

1. **Specialized scope**: Focus on software supply chain and artifact integrity, not broader operational controls
2. **Different use case**: Address build/release pipeline security, not organizational governance or service operations
3. **Early adoption stage**: Not yet widely accepted by procurement/risk teams as SOC 2 alternatives
4. **Complementary nature**: Designed to work alongside organizational attestations, not replace them

**Example Layering**:
- **SOC 2**: Attests that a SaaS vendor has appropriate security controls, incident response, access management, etc.
- **SLSA**: Attests that the software artifacts the vendor deploys were built securely with proper provenance
- **SBOM**: Lists what third-party components are in the software

All three address different aspects of risk. An ideal future state might include all three, but they serve distinct purposes.

### The Window That Closed

Between 2000 and 2010, there was a window of opportunity. SAS 70's limitations were evident. Cloud computing was emerging. SaaS business models were proliferating. Software supply chain risks were becoming visible. Technology dependency chains were deepening.

This was the moment when a technology-focused organization could have created a comprehensive attestation framework purpose-built for modern technology risks. Such a framework might have addressed software supply chain from the start, incorporated delivery pipeline security, included infrastructure dependency mapping, and prevented SOC 2's dominance in technology attestation.

It did not happen. ISACA could not, due to structural mission constraints. NIST would not, due to government agency boundaries. ISO addressed organizational governance, not product-specific attestation. CSA chose enhancement over competition. Emerging frameworks (SLSA, in-toto) arrived a decade later and addressed specialized needs, not comprehensive attestation.

By the time these technology-focused frameworks emerged, SOC 2 had achieved market dominance. The network effects were too strong. Procurement teams asked for SOC 2 by name. Vendors invested in achieving SOC 2 compliance. The ecosystem had formed around the accounting profession's framework.

### Implications

The absence of a technology-focused alternative to SOC 2 is not the result of negligence or lack of expertise. It is the result of structural constraints:

**Mission limitations**: Professional associations (ISACA) and government agencies (NIST) cannot provide attestation without conflicting with their core missions.

**Market dynamics**: Network effects and first-mover advantage made it difficult for later entrants to compete with an established standard.

**Infrastructure requirements**: Creating a new attestation framework requires building an entire ecosystem—auditor training, accreditation mechanisms, market acceptance, professional liability frameworks. This is a massive undertaking.

**Scope challenges**: Comprehensive attestation must address organizational controls, operational processes, and technical specifics. Balancing breadth and depth while remaining technology-agnostic is extraordinarily difficult.

The result is that SOC 2—designed by accountants, governed by an accounting body, and performed by CPA firms—remains the dominant framework for technology risk attestation. Technology-focused organizations contributed frameworks, guidance, and specialized standards. But none created a comprehensive alternative.

This is the historical accident: not that SOC 2 exists, but that it is the only option. The market needed technology risk attestation. The AICPA provided it when no one else did. That was valuable. But the governance structure—accountants governing technology attestation—has implications for what evolves and what does not.

The gaps in SOC 2 (software supply chain, delivery mechanisms, application-layer dependencies) persist not because CPAs are incapable—they demonstrably have the technical resources and institutional infrastructure—but because the structure does not naturally prioritize innovation in those areas. Technology-focused organizations could have created alternatives but were structurally constrained from doing so.

The window closed. The market settled. And financial institutions now manage technology risk using frameworks that apply auditing methodology developed for financial controls to an increasingly technical domain.

Yet even as guidance evolved, a more fundamental question remained unaddressed: were regulators—and institutions—managing the right unit of risk?

---

### Endnotes - Chapter 3

[1] Information Systems Audit and Control Association, ScienceDirect Topics, https://www.sciencedirect.com/topics/computer-science/information-systems-audit-and-control-association

[2] ISACA, "COBIT Framework," https://www.isaca.org/resources/cobit

[3] ISACA, "Certifications," https://www.isaca.org/credentialing

[4] ISACA, "IT Audit Resources," https://www.isaca.org/resources/it-audit

[5] ISACA, "Standards, Guidelines, Tools and Techniques," ISACA Journal, Volume 6, 2020, https://www.isaca.org/resources/isaca-journal/issues/2020/volume-6/standards-guidelines-tools-and-techniques

[6] "National Institute of Standards and Technology," Government Contracts Law Blog, https://www.governmentcontractslawblog.com/articles/national-institute-of-standards-and-technology-nist/

[7] NIST, "Cybersecurity Framework: Assessment & Auditing Resources," https://www.nist.gov/cyberframework/assessment-auditing-resources

[8] NIST Special Publication 800-53, "Security and Privacy Controls for Information Systems and Organizations"

[9] NIST Special Publication 800-171, "Protecting Controlled Unclassified Information in Nonfederal Systems and Organizations"

[10] CISA, "Secure Software Development Attestation Common Form," April 2023, https://www.cisa.gov/sites/default/files/2023-04/secure-software-self-attestation_common-form_508.pdf (referencing NIST SP 800-218)

[11] Security Compass, "NIST CSF Compliance & Certification: Everything You Need to Know," https://www.securitycompass.com/blog/nist-csf-compliance-certification/

[12] NIST, "Cybersecurity Framework," https://www.nist.gov/cyberframework/assessment-auditing-resources

[13] Executive Order 14028, "Improving the Nation's Cybersecurity," May 12, 2021

[14] K&L Gates, "Secure Software Regulations and Self-Attestation Required for Federal Contractors," May 19, 2023, https://www.klgates.com/Secure-Software-Regulations-and-Self-Attestation-Required-for-Federal-Contractors-5-19-2023; NASA SEWP, "Software Attestation," https://www.sewp.nasa.gov/software_attestation.shtml

[15] Microsoft Azure Compliance, "NIST CSF," https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-nist-csf

[16] PreVeil, "NIST 800-171 Compliance: Third-Party Assessments Now Required," https://www.preveil.com/blog/nist-800-171/

[17] ComplianceForge, "NIST CSF 2.0 Certification," https://complianceforge.com/scf-certifications/nist-csf-certification/

[18] ISMS.online, "ISO 27001 Certification vs SOC 2 Attestation: What Are the Key Differences?" https://www.isms.online/iso-27001/iso-27001-certification-vs-soc-2-attestation/

[19] ISMS.online, "ISO 27001 Certification vs SOC 2 Attestation"

[20] ISO/IEC 27017:2015 (cloud services information security controls); ISO/IEC 27018:2019 (protection of PII in public clouds)

[21] Cloud Security Alliance founding date referenced in organizational history

[22] Cloud Security Alliance, "STAR Program," https://cloudsecurityalliance.org/star

[23] Schellman, "Understanding the CSA STAR Program," https://www.schellman.com/blog/pci-compliance/understanding-csa-star-program

[24] Microsoft Azure Compliance, "CSA STAR Attestation," https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-csa-star-attestation

[25] TÜV SÜD, "CSA STAR Certification," https://www.tuvsud.com/en-us/services/auditing-and-system-certification/csa-star

[26] Cloud Security Alliance, "STAR Program Overview," https://cloudsecurityalliance.org/artifacts/star-program-overview (Cloud Controls Matrix details)

[27] in-toto Framework, https://in-toto.io/

[28] SLSA Framework, "Frequently Asked Questions," https://slsa.dev/spec/v1.0/faq

[29] SLSA Blog, "in-toto and SLSA," May 2023, https://slsa.dev/blog/2023/05/in-toto-and-slsa

[30] SLSA Blog, "SLSA and SBOM," May 2022, https://slsa.dev/blog/2022/05/slsa-sbom

\newpage
