\begin{center}
{\Large\bfseries Part II: The Framework Gap}
\end{center}

---

# Chapter 4: Parties vs Dependencies

The fundamental problem with contemporary third-party risk management is architectural. TPRM programs are built to see, assess, and manage **legal entities**—parties with contracts, attestations, and business relationships. But software supply chain risk propagates through **technical dependencies**—code libraries, infrastructure services, build pipelines, and deployment mechanisms that exist largely independent of organizational boundaries.

The problem is not insufficient effort or inadequate resources—it is a structural blind spot embedded in how TPRM frameworks conceptualize the vendor ecosystem. The industry manages "parties" but should be managing "dependencies."

### The Entity-Centric View

Modern TPRM programs organize the world hierarchically by contractual relationships:

- **Third-party**: The vendor with whom you have a direct contract
- **Fourth-party**: The vendor's vendor, typically disclosed through SOC 2 subservice organization carve-outs or contractual notifications
- **Fifth-party**: The fourth-party's vendor, identified occasionally in comprehensive due diligence

This model maps cleanly to questions TPRM teams are trained to answer: Who are we doing business with? What services do they provide? What data do they access? What are our contractual protections? Do they have appropriate insurance? Have they provided a SOC 2 report?

At the fourth-party level, visibility narrows substantially. Critical fourth-party relationships identified in most financial institution TPRM programs consist primarily of cloud infrastructure providers—AWS, Microsoft Azure, Google Cloud—and occasionally colocation service providers. This gives TPRM teams an infrastructure-level view of vendor dependencies: where systems run, where data is stored, what network connectivity exists.

This infrastructure view is useful. It is also radically incomplete.

### What the Entity View Cannot See

Consider a typical fintech SaaS vendor serving community banks. The TPRM program sees:

- **Third-party**: The fintech company itself
- **Fourth-party**: AWS (disclosed on the fintech's SOC 2 as subservice organization)
- Possibly: Twilio (if SMS notifications are mentioned in the system description)
- Possibly: Stripe (if payment processing is disclosed)

What the TPRM program does not see, because no framework requires disclosure:

**Application-layer dependencies**: The 200+ open source libraries imported into the fintech's codebase—logging frameworks, authentication libraries, data validation utilities, API clients, cryptographic implementations, date/time handlers, JSON parsers, HTTP request handlers. According to the 2024 Synopsys Open Source Security and Risk Analysis (OSSRA) report, 96% of commercial codebases contain open source components, with the average codebase comprising 77% open source code.[1.1] Each of these components is a dependency. Each is maintained by individuals or organizations the fintech has no contractual relationship with. Each could contain vulnerabilities affecting your data.

**Software delivery dependencies**: The CI/CD pipeline through which code is built, tested, and deployed—GitHub Actions, Jenkins, GitLab CI, CircleCI. The artifact repositories storing compiled code—Docker Hub, npm registry, PyPI. The code signing infrastructure verifying package integrity. The configuration management tools controlling deployment. A compromise anywhere in this chain means malicious code reaches production, regardless of the fintech's application security practices.

**Security tooling dependencies**: The SIEM platform collecting logs, the EDR solution monitoring endpoints, the vulnerability scanner identifying weaknesses, the secrets management system protecting API keys, the identity provider controlling access. If these tools are managed by external providers—Datadog, CrowdStrike, Qualys, HashiCorp, Okta—each represents a dependency with privileged access to sensitive systems. Yet they rarely appear in TPRM inventories because they're not "vendors" in the traditional procurement sense.

**Development and consulting relationships**: The software development firm the fintech contracted to build v2.0 of their platform. The specialized consultants who configured the authentication system. The offshore development team handling maintenance. These parties directly influence the design and implementation of systems processing your customer data, yet they are invisible to TPRM programs focused on the fintech as a unified legal entity.

**Operational systems of the vendor**: The fintech's own third-party relationships—their payroll system, CRM, compliance management platform, ticketing system, communication tools. A breach of the vendor's HR system could expose employee credentials used to access production environments. Yet fourth-party risk assessment in practice rarely extends to vendors' own operational systems.

### The nth-Party Dependency Concept

The depth at which TPRM programs can see is, at best, n=4 (fourth-party), and only then for specific categories of relationships—primarily infrastructure. But the actual dependency chains extend to n=5, n=10, n=20, or effectively infinite depth as dependencies recursively pull in their own dependencies.

The term **nth-party dependency** captures this reality: every third-party relationship is its own cascading set of technical, organizational, and operational dependencies. When these dependency chains are mapped across an entire vendor portfolio, they converge at points no current TPRM framework is equipped to detect.

This convergence is where concentration risk hides.

### The Log4j Validation

The Log4j incident (CVE-2021-44228, detailed in Chapter 7) validated the nth-party dependency problem empirically.[1] Apache Log4j is a Java logging library, open source, maintained by volunteers, used directly or transitively in thousands of enterprise applications. It is not a vendor. It does not have a SOC 2 report. It does not appear in any TPRM register. It has no contract, no SLA, no business entity identifier.

Yet when the vulnerability was disclosed in December 2021, organizations with diversified vendor portfolios discovered they had catastrophic concentration risk. Applications from vendors with no apparent relationship—different industries, different technology stacks, different hosting environments—all pulled in Log4j, either directly or through other libraries that depended on it.

The impact was widespread across the software ecosystem, affecting both directly declared dependencies and code that had been copied into vendor codebases. No dependency scanner could find all instances. No SBOM would disclose everything.

Financial institutions with comprehensive TPRM programs, detailed vendor inventories, and SOC 2 reports for every critical vendor spent weeks trying to answer a single question: "Where are we exposed to Log4j?" The programs built to manage third-party risk could not answer the question because the dependency did not map to a party.

This was not a theoretical edge case. The Cybersecurity and Infrastructure Security Agency (CISA) stated Log4Shell was "one of the most serious flaws seen in recent years."[4] Exploitation began within hours of public disclosure. Nation-state actors, ransomware groups, and cryptocurrency miners all targeted the vulnerability.[4.1] Organizations without dependency visibility operated blind.

### The MOVEit Pattern

MOVEit—Progress Software's managed file transfer solution—illustrated the same blind spot at the application layer. The CL0P ransomware group exploited a zero-day SQL injection vulnerability in MOVEit Transfer in May 2023, ultimately affecting over 2,700 organizations and 95.8 million individuals.[5]

For financial institutions, the challenge was not that they used MOVEit directly (though some did). The challenge was that their vendors used MOVEit, often without disclosure. MOVEit is application-level infrastructure—a tool embedded in vendor operations to move files securely between systems. It is not a "subservice organization" in SOC 2 terminology. It does not fit cleanly into fourth-party risk frameworks. It simply existed, undisclosed, within vendor environments.

When the vulnerability became public, TPRM teams faced the same question they faced with Log4j: "Which of our vendors are exposed?" The answer required direct outreach to every vendor asking "Do you use MOVEit?" Many vendors did not know immediately. Some learned they were exposed only after their own subcontractors notified them. The dependency chain—financial institution → vendor → vendor's file transfer tool—was invisible until it became a crisis.

Victims included major financial services providers: PwC, Ernst & Young, TIAA, T. Rowe Price, pension systems, and payroll processors.[6] The estimated cost reached $15.8 billion.[7] The incident was entirely foreseeable from a technical perspective—file transfer applications are high-value targets, SQL injection vulnerabilities are a known threat class, and defense-in-depth principles should have limited exposure. But TPRM frameworks do not ask "What file transfer solutions do your vendors use?" They ask "Do you have a SOC 2?" and move on.

### The SolarWinds and 3CX Software Delivery Problem

SolarWinds (2020) and 3CX (2023) demonstrated dependency risk at a different layer entirely: the software delivery pipeline. Both incidents involved attackers compromising the build process to inject malicious code into legitimate software updates. Customers received signed, validated, legitimate-looking updates that contained sophisticated backdoors.

SolarWinds held SOC 2 Type II certification at the time of the attack.[8] The company had access controls, change management processes, vulnerability scanning, and incident response plans. None of these prevented Russian intelligence operatives (SVR) from injecting the SUNBURST malware into Orion platform updates. The compromise occurred in what SolarWinds described as a "millisecond window" during the build process—an attack vector SOC 2 controls are not designed to address.[9]

To be clear: this was a nation-state attack with essentially unlimited resources and sophistication. Better auditing almost certainly would not have detected it. The SVR maintained access for over a year while evading detection by one of the most security-conscious customer bases in the world. The lesson here: software delivery mechanisms represent a category of dependency risk that traditional TPRM frameworks do not address, and adversaries with nation-state capabilities can exploit gaps that even sophisticated security programs cannot close.

Approximately 18,000 organizations installed trojanized Orion updates, including nine federal agencies and numerous Fortune 500 companies.[10] The malware established command-and-control communications, exfiltrated data, and enabled lateral movement within victim networks. From a TPRM perspective, the incident was invisible until after the fact. Customers had performed due diligence, received attestations, and monitored vendor security posture. The dependency that mattered—the integrity of SolarWinds' build environment—was never in scope.

3CX extended the pattern to cascading supply chain compromise.[11] Attackers first trojanized X_TRADER, a trading software package from Trading Technologies. A 3CX employee downloaded the compromised software on a personal device, which led to VPN credential theft and ultimately compromise of both Windows and macOS build servers. Malicious updates were signed with valid 3CX certificates and distributed to customers.

This is supply chain attack as dependency chain: Attacker → Trading Technologies software → 3CX employee → 3CX build environment → 3CX customers. The dependency depth exceeded what any TPRM program is structured to see. Trading Technologies was not a fourth-party to 3CX's customers. The employee's personal software was not a disclosed subcontractor. Yet the dependency path was real and exploitable.

### The xz Utils Pattern: Deliberate Open Source Infiltration

The incidents above involve external attackers compromising vendor systems. But open source supply chain risk includes a more insidious pattern: patient adversaries who spend years building trust before attacking from within.

In early 2024, the xz Utils backdoor (CVE-2024-3094) exposed what security researchers called the most sophisticated open source supply chain attack ever documented.[12.1] An individual using the handle "Jia Tan" began contributing to the xz data compression library in October 2021. Over the next two years, Jia Tan submitted legitimate patches, fixed bugs, and built credibility with the project maintainer.

The social engineering was methodical. Multiple sockpuppet accounts—likely the same actor—pressured the original maintainer, who had publicly mentioned experiencing burnout, to accept more help. By November 2022, Jia Tan had been granted maintainer status. By January 2024, Jia Tan controlled the project's website. In February and March 2024, the backdoor was inserted—sophisticated code that would have enabled remote code execution on millions of Linux systems.

The attack was discovered only by accident: a Microsoft engineer noticed unusual CPU patterns during routine system monitoring. If not for this anomaly, the backdoor could have propagated to virtually every major Linux distribution.

The xz Utils pattern reveals that supply chain risk includes not just accidental vulnerabilities or external compromises, but deliberate infiltration by sophisticated adversaries willing to invest years building trust. The OpenSSF and OpenJS Foundation warned in April 2024 that xz Utils-style social engineering "may not be an isolated incident" and that similar infiltrations may already exist undetected.[12.2]

This attack vector is fundamentally different from the others discussed. Log4j was an accidental vulnerability. SolarWinds was an external compromise of build systems. xz Utils was insider access obtained through patient social engineering. No amount of vendor due diligence or SOC 2 review would detect an adversary who spends two years building legitimate credibility before attacking.

### The CrowdStrike Update Delivery Risk

The July 2024 CrowdStrike incident demonstrated a related but distinct problem: software update mechanisms as concentration points. CrowdStrike Falcon is an endpoint detection and response (EDR) solution deployed widely across enterprise environments, including financial institutions. On July 19, 2024, a faulty sensor configuration update caused Windows systems to crash with kernel errors, affecting approximately 8.5 million devices globally.[12]

The estimated cost exceeded $10 billion.[13] Airlines grounded flights, hospitals canceled procedures, banks experienced operational disruptions. The incident was not a security compromise—it was a quality assurance failure. But from a dependency risk perspective, the pattern is instructive.

CrowdStrike Falcon operates at the kernel level with privileged system access. Configuration updates deploy automatically to ensure rapid threat response. Customers cannot stage updates or test them in isolated environments before production deployment because the value proposition is real-time threat protection. This creates a structural dependency: organizations rely on CrowdStrike's internal quality assurance to prevent disruptions.

TPRM programs treat security tools as solutions that reduce risk, not as dependencies that introduce it. Vendor assessments focus on whether the security tool is effective—does it detect threats, respond to incidents, meet compliance requirements? They do not systematically assess the risk introduced by the tool itself—what happens if an update is faulty, if the vendor experiences an outage, if the software conflicts with system updates?

The CrowdStrike incident revealed concentration risk that was technically visible but operationally invisible. Many financial institutions use CrowdStrike across their entire Windows infrastructure. This concentration exists by design—it is efficient, provides unified visibility, and simplifies management. But it also means a single vendor update failure creates enterprise-wide disruption. TPRM frameworks missed this concentration because the dependency was on update delivery infrastructure, not on a "party."

### Why the Entity Model Persists

If the entity-centric TPRM model has such fundamental blind spots, why does it persist?

The answer is that it maps to the world as it existed when third-party risk management was formalized. In the 1990s, vendor management was an administrative function handling contracts and procurement.[14] Vendors provided discrete products or services—a payroll system, a card processor, a loan origination platform. Each vendor was a distinct entity with clear boundaries. Assessing vendor risk meant assessing the vendor as an organization.

Cloud computing introduced the concept of critical fourth parties, primarily infrastructure providers. TPRM evolved to recognize that a vendor's reliance on AWS or Azure was a risk factor worth evaluating. But this evolution maintained the entity-centric model—it simply added another layer of organizations to assess.

The transformation from "Vendor Management" to "Third-Party Risk Management" carried an implicit promise: by managing the risk of third parties, organizations would inherently manage the risks of their fourth parties, fifth parties, and all downstream dependencies. But this promise was based on a misinterpretation.

"Third-Party Risk Management" does not mean "management of third parties." It means "management of risks associated with third-party relationships." Those risks include the technical dependencies, software supply chains, operational systems, and delivery mechanisms that third parties rely upon. The entity model treats these as details within vendor risk assessment. In reality, they are the risks that matter most.

### The Dependency Model Alternative

A dependency-centric TPRM model would start from a different question: "What does our organization depend on to deliver services?" rather than "Who are our vendors?"

The answer includes:

- Infrastructure: cloud platforms, data centers, network providers, DNS services
- Applications: software systems, APIs, databases, middleware
- Code libraries: open source components, commercial SDKs, internal shared libraries
- Delivery mechanisms: CI/CD pipelines, package registries, artifact repositories, update channels
- Security tooling: monitoring platforms, EDR agents, SIEM systems, identity providers
- External expertise: development firms, consultants, managed service providers
- Operational systems: both organizational (our systems) and vendor-side (their systems)

Some of these map to legal entities that can be contracted with, assessed through due diligence, and held accountable through SLAs. Many do not. Open source libraries have communities, not vendors. Build pipelines have operators, not contracts. Update channels have trust models, not attestations.

A dependency-centric model would:

- **Inventory technical dependencies** across the application stack, not just contractual relationships
- **Map convergence points** where multiple critical systems depend on the same component or service
- **Assess substitutability** and switching costs for concentrated dependencies
- **Monitor vulnerability disclosures** for both direct and transitive dependencies
- **Evaluate delivery mechanisms** as part of vendor security assessment
- **Distinguish between parties and platforms**—AWS is both a vendor (legal entity) and a platform (dependency shared across many vendors)

This model does not replace entity-based TPRM. Contracts, attestations, and vendor governance remain essential. But it recognizes that legal relationships are an incomplete proxy for technical dependencies. Risk propagates through code, not through corporate structures.

The industry has spent twenty years refining entity-based TPRM. It has built sophisticated frameworks, hired specialized teams, and invested in vendor management platforms. Yet the incidents that cause the most damage—Log4j, SolarWinds, MOVEit, CrowdStrike—trace to dependencies the frameworks were never designed to see.

TPRM programs clearly need to evolve beyond the entity model. What's less clear is how quickly they can build the capability to see and manage dependencies at the scale and depth where risk actually exists.

The next chapter examines specifically where current compliance frameworks fall short against these dependency-level risks.

---

### Endnotes

[1] For detailed Log4j statistics and impact analysis, see Chapter 7. Medium analysis: "Throwback on the Log4Shell vulnerability," https://medium.com/@dolor3sh4ze/throwback-on-the-log4shell-vulnerability-5383d05c5e72

[1.1] Synopsys, "2024 Open Source Security and Risk Analysis (OSSRA) Report," https://www.synopsys.com/software-integrity/resources/analyst-reports/open-source-security-risk-analysis.html. The report found that 96% of audited commercial codebases contained open source components, with open source comprising 77% of total code on average.

[4] Cybersecurity and Infrastructure Security Agency (CISA): "Apache Log4j Vulnerability Guidance," https://www.cisa.gov/news-events/news/apache-log4j-vulnerability-guidance

[4.1] Cloudflare reported exploitation attempts began within 9 minutes of the Log4j vulnerability disclosure on December 9, 2021. Check Point documented over 800,000 attack attempts within the first 72 hours. Microsoft Threat Intelligence Center identified exploitation by nation-state actors from China, Iran, North Korea, and Turkey, as well as ransomware operators and cryptomining groups. See: Cloudflare Blog, "Exploitation of CVE-2021-44228 before public disclosure"; Check Point Research, "Log4j Exploitation Trends"; Microsoft Security Blog, "Guidance for preventing, detecting, and hunting for CVE-2021-44228 exploitation," December 2021.

[5] Emsisoft: "Unpacking the MOVEit Breach: Statistics and Analysis," https://www.emsisoft.com/en/blog/44123/unpacking-the-moveit-breach-statistics-and-analysis/

[6] American Banker: "15 banks, credit unions confirm MoveIt data breaches," https://www.americanbanker.com/news/15-banks-credit-unions-confirm-moveit-data-breaches

[7] Wikipedia: "2023 MOVEit data breach," https://en.wikipedia.org/wiki/2023_MOVEit_data_breach

[8] Venminder: "SolarWinds Data Hack Is a Reminder Why Third-Party Risk Management Is Important," https://www.venminder.com/blog/solarwinds-hack-third-party-risk-importance

[9] TechTarget: "SolarWinds hack explained: Everything you need to know," https://www.techtarget.com/whatis/feature/SolarWinds-hack-explained-Everything-you-need-to-know

[10] U.S. Senate Republican Policy Committee: "The SolarWinds Cyberattack," https://www.rpc.senate.gov/policy-papers/the-solarwinds-cyberattack

[11] Sonatype Blog: "Another SolarWinds? The Latest Software Supply Chain Attack on 3CX," https://www.sonatype.com/blog/another-solarwinds-the-latest-software-supply-chain-attack-on-3cx

[12.1] Wikipedia: "XZ Utils backdoor," https://en.wikipedia.org/wiki/XZ_Utils_backdoor; Securelist: "Social engineering aspect of the XZ incident," https://securelist.com/xz-backdoor-story-part-2-social-engineering/112476/; Dark Reading: "Attacker Social-Engineered Backdoor Code Into XZ Utils," https://www.darkreading.com/application-security/attacker-social-engineered-backdoor-code-into-xz-utils

[12.2] Nextgov: "Linux backdoor was a long con, possibly with nation-state support, experts say," https://www.nextgov.com/cybersecurity/2024/04/linux-backdoor-was-long-con-possibly-nation-state-support-experts-say/395511/; OpenSSF and OpenJS Foundation joint warning issued April 2024.

[12] Wikipedia: "2024 CrowdStrike-related IT outages," https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages

[13] Fortune: "CrowdStrike outage will cost Fortune 500 companies $5.4 billion in damages and uninsured losses," https://fortune.com/2024/08/03/crowdstrike-outage-fortune-500-companies-5-4-billion-damages-uninsured-losses/

[14] The evolution from "Vendor Management" to "Third-Party Risk Management" is documented in OCC guidance spanning 1996-2023. OCC Banking Circular 196 (1996) focused on basic vendor oversight; OCC Bulletin 2001-47 introduced "risk management" framing; OCC Bulletin 2013-29 formalized comprehensive TPRM expectations. Federal Reserve SR Letters followed similar evolution. See: OCC Comptroller's Handbook, "Third-Party Relationships: Risk Management Guidance," 2023.

\newpage
