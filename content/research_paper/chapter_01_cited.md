\begin{center}
{\Large\bfseries Part I: The Historical Context}
\end{center}

---

# Chapter 1: From Vendor Management to TPRM
### The Semantic Misinterpretation That Created a Structural Gap

### The 1990s: Simple Relationships

In the early 1990s, vendor management was an administrative function. Banks maintained most critical systems in-house, and third-party relationships followed a straightforward pattern: one vendor provided one product or service. A payroll processor handled payroll. A benefits administrator managed employee benefits. A software vendor sold a license for on-premise deployment.[1]

The risk profile was equally straightforward. Vendor management focused on contractual compliance, service delivery, and pricing. The function typically reported to procurement or operations. Risk, in the sense we understand it today, was not the primary lens through which these relationships were evaluated.

This simplicity was a function of the technology landscape. Outsourcing was a relatively new practice.[2] Most organizations retained data processing and IT operations internally. When they did engage third parties, the relationships were discrete and bounded. If a vendor failed, the impact was localized to that specific function. Dependencies rarely extended beyond the direct contractual relationship.

### The Shift to "Third-Party Risk Management"

As outsourcing accelerated through the 1990s and into the 2000s, the terminology began to change. "Vendor management" became "third-party risk management." This shift reflected a fundamental evolution in how organizations viewed these relationships. Vendors were no longer simply suppliers to be managed—they were sources of risk requiring assessment, monitoring, and oversight.

Regulatory attention followed. The FFIEC issued guidance on technology outsourcing in November 2000.[3] The OCC published Advisory Letter 2000-9 introducing "third-party risk" terminology.[4] By November 2001, with OCC Bulletin 2001-47, the foundational principles of third-party risk management were established: banks must develop risk management plans before contracting with third parties, conduct due diligence, structure contracts appropriately, and maintain ongoing oversight.[5]

The industry embraced the new paradigm. Risk management functions began taking ownership of vendor relationships. Assessment questionnaires proliferated. Due diligence processes formalized. The recognition that third parties created operational, compliance, and information security risks became standard operating procedure.

### The Misinterpretation

Here is where the critical misinterpretation occurred—subtle, understandable, and consequential.

The term "Third-Party Risk Management" was intended to mean: **managing all risks associated with third-party relationships, including the dependencies those third parties rely upon**. When a bank engages a vendor, it assumes not just the direct risks that vendor creates, but also the inherited risks from that vendor's own third-party dependencies. The vendor's cloud provider, their software libraries, their security tools, their subcontractors—all become part of the risk profile the bank must manage.

However, the industry adopted a weaker interpretation: **managing the risks that directly come from our third party**. This framing positioned the third party as the risk boundary. TPRM programs focused on assessing the vendor's controls, reviewing their SOC 2 reports, evaluating their security posture, and monitoring their performance. But the dependencies that vendor relied upon—their "fourth parties"—remained largely invisible.

This was not unreasonable. In the early 2000s, those fourth-party dependencies were fewer and more manageable. A vendor's critical dependencies typically consisted of their data center or colocation provider. Infrastructure-level visibility was sufficient. Application-level dependencies—the software libraries embedded in their code, the third-party components integrated into their systems—were not yet recognized as material risk drivers.

### Cloud Computing Forces Recognition of Fourth Parties

The emergence of cloud computing in the late 2000s and early 2010s made fourth-party risk impossible to ignore.[6] As vendors migrated from on-premise data centers to cloud infrastructure providers like AWS, Azure, and Google Cloud, financial institutions began to realize that their apparent vendor diversification masked underlying concentration.

An institution might have 100 different SaaS vendors, creating the appearance of a diversified vendor portfolio. But if 80 of those vendors run on AWS, the institution has significant concentration risk on a single infrastructure provider with whom they have no direct contractual relationship. This was the fourth-party problem made visible.

Regulatory guidance evolved to address this. OCC Bulletin 2013-29 introduced the concept of "critical activities" requiring heightened oversight.[7] The 2013 Federal Reserve guidance (SR 13-19) explicitly identified concentration risk as an area of concern.[8] The framework expanded: institutions were now expected to identify their vendors' critical fourth parties, particularly cloud infrastructure providers.

But even this evolution remained bounded. TPRM programs built processes to identify "critical fourth parties"—which in practice meant asking vendors: "What cloud provider do you use? Do you have a colocation provider?" The focus remained at the infrastructure layer. The inventory was still organized around **parties** (legal entities), not **dependencies** (technical components).

### The Current State: Built for n=4 at Best

Today's TPRM programs are optimized for managing third-party relationships with visibility into critical fourth parties. This represents significant maturation from the procurement-focused vendor management of the 1990s. Institutions maintain vendor inventories, conduct risk assessments, require SOC 2 attestations, monitor for incidents, and track critical dependencies like cloud providers.

Yet the framework stops there. Fifth-party visibility—the subcontractors and service providers that a vendor's vendors rely upon—is rarely collected or analyzed.[9] The data is not readily available, and even when institutions request it, the information is often incomplete or quickly becomes stale.

More fundamentally, this entire paradigm is organized around **legal entities**. Third party = the vendor (a company). Fourth party = the vendor's vendor (another company). Fifth party = their vendor (yet another company). The framework assumes risk can be managed by understanding the chain of contractual relationships between organizations.

### Why This Matters: Application-Layer Dependencies Remain Invisible

This legal entity focus creates a profound blind spot: application-layer dependencies.

Modern SaaS applications are built on foundations of external code libraries—components embedded in the application code itself, not the infrastructure layer where cloud providers operate. These components have no Legal Entity Identifiers (LEIs) and are not "vendors" in the traditional sense. Many are open-source projects maintained by volunteers; others are commercial libraries from companies with whom the financial institution has no direct relationship.[10] (Chapter 4 examines the full taxonomy of these invisible dependencies and their risk implications.)

When the Log4j vulnerability was discovered in December 2021 (detailed in Chapter 7),[11] financial institutions faced a simple but devastating question: "Which of our vendors use Log4j?" Most could not answer. The dependency existed deep within transitive dependency chains, did not appear on any vendor assessment questionnaire, and was not listed as a "critical fourth party." Traditional TPRM frameworks had no mechanism to discover it, inventory it, or monitor it. The same pattern repeated in 2024 with the xz Utils backdoor attempt,[12] where a widely-used compression library nearly became a vector for supply chain compromise—again, a dependency invisible to traditional vendor management processes.

This is the core problem: **TPRM programs are built to manage parties, but modern technology risk propagates through dependencies.**

### The Original Intent vs. Weak Interpretation

Returning to the original terminology: "Third-Party **Risk** Management." The emphasis should have been on **risk**—all risks emanating from the third-party relationship, regardless of how many levels deep the dependency chain extends.

If a bank's payment processing vendor relies on a specific logging library, and that library has a critical vulnerability, the bank faces risk. The fact that the library is not a "party" in the contractual sense is irrelevant. The risk exists. It can be exploited. It can cause material harm.

The weaker interpretation—managing only the direct risks from our third party—was never the intent. But it became the practice. And as technology dependencies have grown exponentially more complex, the gap between intent and practice has widened into a fundamental gap.

### Implications

This chapter has traced the evolution from administrative vendor management to risk-based TPRM, highlighting the critical semantic misinterpretation that shaped how frameworks developed. The shift to "third-party risk management" should have meant comprehensive management of all dependency risks. Instead, it was interpreted as managing risks from direct vendor relationships, with limited visibility into fourth parties and virtually no visibility beyond.

The result is a set of programs built for a simpler technological era—one where vendors provided bounded services, dependencies were few and visible, and infrastructure-level oversight was sufficient. Modern technology operates differently. Applications are composed of hundreds of external components.[13] Vendors rely on dozens of service providers. Infrastructure converges on a handful of cloud platforms. The dependency chains extend 10, 20, 50 levels deep.

Until frameworks close this gap, incidents like Log4j will continue to expose the fundamental mismatch between entity-based oversight and dependency-level risk.

Understanding why requires examining an unlikely origin story: how the accounting profession became the de facto arbiter of technology risk assurance.

---

**Endnotes - Chapter 1**

[1] Federal Financial Institutions Examination Council (FFIEC), "Outsourcing Technology Services" IT Examination Handbook, 2000 (noting that outsourcing of technology services was "relatively new" in the early 1990s and describing the evolution from administrative vendor management to risk-focused TPRM). The OCC's 1996 Banking Circular 196 and 1997 updates marked the beginning of formal regulatory expectations for vendor management in financial services.

[2] Federal Financial Institutions Examination Council (FFIEC), "FFIEC IT Examination Handbook: Outsourcing Technology Services," June 2004, https://ithandbook.ffiec.gov/it-booklets/outsourcing-technology-services (noting that in the early 1990s, outsourcing was a relatively new practice and most organizations retained data processing and IT operations internally)

[3] Federal Financial Institutions Examination Council (FFIEC), "Risk Management of Outsourced Technology Services," November 28, 2000 (rescinded by 2004 FFIEC Outsourcing Technology Services Booklet)

[4] Office of the Comptroller of the Currency (OCC), "Advisory Letter 2000-9: Third-Party Risk," 2000 (rescinded by OCC Bulletin 2013-29)

[5] Office of the Comptroller of the Currency (OCC), "Bulletin 2001-47: Third-Party Relationships: Risk Management Principles," November 2001 (rescinded by OCC Bulletin 2013-29), https://corpgov.law.harvard.edu/2013/12/01/occ-updates-guidance-on-third-party-risk-management/

[6] Amazon Web Services launched in 2006 with S3 and EC2. Microsoft Azure followed in 2010, and Google Cloud Platform in 2012. By 2015, enterprise cloud adoption had reached mainstream status. See: Gartner, "Cloud Computing Timeline and Market Evolution," and IDC, "Worldwide Public Cloud Services Market Share" reports, 2010-2015.

[7] Office of the Comptroller of the Currency (OCC), "Bulletin 2013-29: Third-Party Relationships: Risk Management Guidance," October 30, 2013 (rescinded by OCC Bulletin 2023-17), https://sharedassessments.org/blog/occ-releases-guidance-third-party-relationships-occ-2013-29/

[8] Board of Governors of the Federal Reserve System, "SR 13-19: Guidance on Managing Outsourcing Risk," December 5, 2013, https://securityscorecard.com/blog/sr-13-19-provides-guidance-service-provider-risk-management

[9] Industry surveys consistently show limited visibility beyond fourth parties. The Shared Assessments Program's 2023 Third Party Risk Management Survey found that only 23% of organizations had formal processes for assessing risks beyond their direct vendors' subcontractors. KPMG's 2024 Third Party Risk Management Outlook similarly noted that "nth-party risk remains a significant blind spot" for most financial institutions.

[10] The Linux Foundation and Laboratory for Innovation Science at Harvard's 2020 "Census II of Free and Open Source Software" found that 60% of the most critical open source components are maintained by small teams of unpaid volunteers. The Tidelift "2023 Open Source Maintainer Survey" reported that 60% of maintainers are unpaid and 46% have considered quitting due to burnout.

[11] Cybersecurity & Infrastructure Security Agency (CISA), "CSRB Report on Log4j," July 2022, https://www.cisa.gov/sites/default/files/publications/CSRB-Report-on-Log4-July-11-2022_508.pdf (noting that the Log4Shell vulnerability CVE-2021-44228 was publicly disclosed in December 2021)

[12] The xz Utils backdoor incident (CVE-2024-3094, disclosed March 2024) involved a sophisticated supply chain attack where a malicious actor gained maintainer access to the xz Utils compression library and inserted a backdoor targeting SSH authentication. The backdoor was discovered by a Microsoft engineer before widespread deployment, but the incident demonstrated the vulnerability of widely-used open source dependencies to social engineering and maintainer compromise. See: Ars Technica, "What we know about the xz Utils backdoor that almost infected the world," April 2024; CISA Alert, "Reported Supply Chain Compromise Affecting XZ Utils Data Compression Library," March 29, 2024.

[13] Software composition analysis industry research indicates modern applications average 100-500 direct dependencies, with transitive dependencies often reaching into the thousands. See: Synopsys Open Source Security and Risk Analysis (OSSRA) Report 2024; Sonatype State of the Software Supply Chain 2024.

\newpage
