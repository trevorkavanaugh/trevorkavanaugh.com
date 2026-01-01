\begin{center}
{\Large\bfseries Part III: Evidence from the Field}
\end{center}

---

# Chapter 7: Seven Incidents, One Pattern

The theory is compelling: traditional TPRM frameworks organize risk around legal entities while real-world technology failures propagate through technical dependencies. But theory requires proof. Between 2020 and 2024, seven major incidents provided that proof—demonstrating with painful clarity that vendor questionnaires and SOC 2 reports were not designed to address the risks that have since emerged as most material, while contract provisions (indemnification clauses, SLAs, notification requirements) manage liability allocation but do not prevent or mitigate operational failures.

This section examines each incident not as isolated failures but as systematic demonstrations of framework inadequacy. The pattern is consistent: attackers and accidents exploit layers of the technology stack that existing frameworks were never designed to see.

---

### Log4j (December 2021): The Transitive Dependency Blind Spot

On December 9, 2021, a vulnerability in Apache Log4j—a logging library used by the vast majority of Java applications globally[1]—achieved CVSS score 10.0 and the designation "one of the most serious vulnerabilities in the history of the internet."[2] Within nine minutes of public disclosure, exploitation began.[3] Within 72 hours, over 800,000 attack attempts were detected.[4] Three years later, 12% of Java applications still run vulnerable versions.[5]

**What happened technically**: CVE-2021-44228 allowed unauthenticated remote code execution through JNDI lookup functionality introduced in 2013.[6] Attackers could execute arbitrary code by including a specially crafted string in any logged message—including HTTP headers, usernames, or error messages. The vulnerability existed for eight years, maintained by 16 unpaid volunteers,[7] before weaponization.

**The dependency angle**: According to Google Open Source Insights, 17,000+ packages in Maven Central were affected.[8] Critically, 60% of impacted Java projects used Log4j as a *transitive dependency*—meaning they did not directly include Log4j but inherited it through other libraries.[9] Snyk confirmed: "A straightforward search to determine if you're using a vulnerable version of Log4j would not necessarily find all occurrences in your projects."[10]

Organizations without Software Bills of Materials (SBOMs) spent weeks manually examining applications to identify exposure. According to analysis from security researchers and incident response practitioners, "Organizations without SBOM capability often had to engage in time consuming manual searches and risked remaining vulnerable. Organizations with SBOMs were able to report a relatively straightforward and efficient response. Once the vulnerability was discovered, organizations spent weeks, and in some cases even months, trying to determine where and how they had been exposed. The difficulty could have been avoided had they had a SBOM to provide this information, enabling organizations to identify and mitigate exposure within hours instead of weeks."[11]

**Why frameworks did not detect it**: SOC 2 audits assess whether vendors *have* vulnerability management processes, not whether they maintain component inventories. Standard vendor questionnaires ask "Do you patch critical vulnerabilities?" but do not require disclosure of transitive dependencies. The vulnerability existed in a library most organizations did not know they used, provided by a volunteer project with no contractual relationship to anyone. Traditional TPRM focuses on commercial vendors with contracts and SLAs—open source dependencies like Log4j are "suppliers" without either.

The U.S. Department of Homeland Security estimates it will take at least a decade to find and fix every vulnerable Log4j instance.[12] This is not a vendor that can be assessed—it is a dependency that can only be inventoried.

### SolarWinds (December 2020): Build Process Integrity Failure

Between November 2019 and December 2020, Russian SVR operators (APT29/UNC2452) maintained persistent access to SolarWinds' development environment, ultimately compromising the build servers for Orion network management software. The attack affected 18,000+ organizations including nine federal agencies.[13] Attackers had 14+ months of undetected access.[14]

**What happened technically**: Attackers deployed SUNSPOT malware on build servers that monitored for Orion compilation processes. During builds, SUNSPOT temporarily replaced legitimate source code (`InventoryManager.cs`) with backdoored versions, waited for compilation to complete, then restored the original file.[15] The resulting malicious DLL (`SolarWinds.Orion.Core.BusinessLayer.dll`) was digitally signed with SolarWinds' legitimate code-signing certificate and distributed through official update channels.[16]

The malicious code created a backdoor named SUNBURST that established command-and-control communication through DNS beaconing to attacker-controlled infrastructure, disguised as normal Orion update checks.[17] Of the 18,000 affected organizations, attackers selectively activated the backdoor for approximately 100-250 high-value targets including the Departments of Treasury, Commerce, Homeland Security, Justice, Energy, and State.[18]

**The dependency angle**: Organizations using Orion had conducted standard vendor assessments of SolarWinds. Many had SOC 2 Type II reports. SolarWinds had undergone security audits and certifications. None of this prevented or detected the compromise. The attack succeeded because it bypassed all assessment layers by compromising the build environment—a system component that exists upstream of everything traditional TPRM evaluates.

**The nation-state reality**: It is important to acknowledge that this was a sophisticated intelligence operation by Russia's SVR with essentially unlimited resources and patience. The attackers maintained access for over 14 months while evading detection by security-conscious organizations including the U.S. government. Better auditing or enhanced due diligence almost certainly would not have detected this attack. The lesson is not that TPRM programs failed—it is that software delivery mechanisms represent a dependency category that traditional frameworks do not address, and that well-resourced nation-state adversaries will find and exploit such gaps regardless of how robust individual vendor security programs appear.

The attack exploited what one analysis called a "millisecond window"—the brief period during compilation when source code is transformed into executable binaries.[19] Even if customers had reviewed SolarWinds' source code (they could not—it is proprietary), the malicious code was not in the repository. It existed only transiently during builds.

**Why frameworks did not detect it**: SOC 2 evaluates controls over IT systems, not build pipeline integrity. Questionnaires ask about change management and code review but not about build environment isolation or artifact verification. Penetration tests assess production systems, not development infrastructure. The "solarwinds123" password incident—where an intern set a weak password on a production FTP server that remained unchanged for 2.5 years and was publicly exposed on GitHub for 17 months[20]—revealed deep cultural failures that compliant-looking policies masked.

Digital signatures confirmed the malware was "legitimately" from SolarWinds because attackers used SolarWinds' own signing infrastructure. Code signing provides *authenticity* (this came from SolarWinds) and *integrity in transit* (it was not modified after signing)—but cannot provide *build process integrity* (it matches reviewed source code). As one analysis noted, "Having a valid digital signature does not mean that the data itself is legitimate and was not compromised before the signature was generated and applied."[21]

### CrowdStrike (July 2024): Automatic Update Concentration Risk

On July 19, 2024, at 04:09 UTC, CrowdStrike distributed a faulty sensor configuration update through its Falcon endpoint security platform. Within 78 minutes, approximately 8.5 million Windows devices crashed simultaneously,[22] triggering the largest IT outage in history with estimated costs exceeding $10 billion globally.[23]

**What happened technically**: The Falcon sensor uses two update mechanisms—traditional software updates (Sensor Content) which undergo rigorous testing and customer-controlled deployment, and rapid threat detection updates (Rapid Response Content) which deploy automatically to respond to emerging threats.[24] A Rapid Response Content update included a configuration file (Channel File 291) containing a template with 21 input parameters, but the sensor's Content Interpreter code only provided 20 values.[25] When the interpreter attempted to evaluate the 21st parameter (which used non-wildcard matching criteria), it triggered an out-of-bounds memory read, causing a Windows kernel panic and Blue Screen of Death.[26]

The update affected only systems running Falcon sensor version 7.11+ on Windows that were online during the 78-minute distribution window. Yet this narrow window was sufficient to crash millions of devices across airlines, banks, hospitals, retailers, and critical infrastructure globally.[27]

**The dependency angle**: Organizations deployed CrowdStrike specifically because it is best-in-class endpoint protection. According to LinkedIn data, approximately 60% of Fortune 500 companies (298 of 500) trust CrowdStrike.[28] This concentration—driven by rational "best of breed" procurement decisions—created systemic risk. When the single best security tool failed, it failed everywhere simultaneously.

The security paradox: the tool meant to protect became the single point of failure. Organizations had granted Falcon administrative privileges and automatic update authority because effective endpoint protection requires both. When that privilege was combined with a faulty update that bypassed testing, there was no defense.

**Why frameworks did not detect it**: Vendor assessments confirmed CrowdStrike maintains sophisticated security operations, incident response capabilities, and quality assurance processes. The company's operational track record was exemplary. But no framework addressed:
- Pre-deployment testing requirements for security tool configuration updates
- Customer control over rapid response content deployment timing
- Staged rollout mandates for updates affecting kernel-level code
- Concentration risk assessment when a single vendor protects >50% of an industry

The recovery challenge demonstrated another gap: systems crashed before network connectivity, making remote recovery impossible. Organizations needed physical access to each device to boot into Safe Mode and delete the problematic file. For BitLocker-encrypted systems, this required manually entering unique 48-digit recovery keys.[29] The manual touch-every-machine recovery process took days to weeks, with some organizations still recovering systems months later.[30]

### MOVEit (May-June 2023): The Nth-Party Cascade

Between May 27 and June 5, 2023, the Cl0p ransomware group exploited a zero-day SQL injection vulnerability in Progress Software's MOVEit Transfer managed file transfer (MFT) platform. The campaign ultimately affected 2,773+ organizations and exposed 95.8 million individuals' data,[31] with estimated costs reaching $15.8 billion.[32]

**What happened technically**: Cl0p had researched the vulnerability since 2021, conducting reconnaissance and testing exploitation techniques over two years before mass deployment.[33] On Memorial Day weekend 2023—chosen strategically when IT security staffing is reduced[34]—they deployed the LEMURLOOT web shell to internet-facing MOVEit Transfer servers. The web shell enabled attackers to bypass authentication, access underlying databases, and exfiltrate sensitive data including names, Social Security numbers, financial information, and health records.[35]

The attack was sophisticated in its staging: deploy LEMURLOOT broadly to gather reconnaissance data, then selectively target high-value victims rather than deploying ransomware universally. Cl0p focused primarily on data theft and extortion rather than encryption, allowing faster operations with less detection risk.[36]

**The dependency angle**: According to Emsisoft's analysis, "For almost two-thirds of MOVEit victims, breaches occurred because their third-party vendors used MOVEit—or their vendor's vendors used the file-transfer service."[37] The most extensively documented cascade began with Pension Benefit Information (PBI Research Services), a death audit and participant location service provider. When Cl0p compromised PBI's MOVEit environment:
- PBI directly impacted: 1,209,825 individuals[38]
- Milliman (an actuarial firm affected through PBI) exposed records at 200+ additional organizations[39]
- TIAA (affected through PBI) exposed data from 60+ organizations[40]
- PBI's single compromise ultimately affected 354+ additional organizations[41]

The dependency chains looked like: **Bank → Retirement Plan Administrator (TIAA) → Death Audit Service (PBI) → MOVEit Transfer**. Banks had vendor relationships with retirement administrators. Those administrators used PBI. PBI used MOVEit. Banks' data was exposed through a file transfer platform they'd never heard of, provided by a company they had no relationship with.

Colorado State University exemplifies multiple exposure pathways: the university was breached six times by six different vendors (TIAA, National Student Clearinghouse, Corebridge Financial, Genworth Financial, Sunlife, and The Hartford)—each using MOVEit independently.[42] Single organizations experienced multiple distinct exposures because different vendor relationships converged on the same underlying infrastructure.

**Why frameworks did not detect it**: Banks that assessed TIAA received clean SOC 2 reports and vendor questionnaires. TIAA's relationship with PBI may have been disclosed as a subcontractor. But PBI's use of MOVEit Transfer for file handling was a technical implementation detail, not a vendor relationship requiring disclosure. Even if disclosed, banks had no contractual leverage to assess MOVEit is security posture or require Progress Software to implement specific controls.

The notification disaster compounded the problem: many organizations learned they were affected from news media or Cl0p's leak site rather than from their vendors.[43] Some received forensic details two months after initial exploitation,[44] violating regulatory notification requirements and preventing timely incident response. One breach notification letter documented: unauthorized access May 29-31, company learned July 12 (six weeks later), forensic report provided July 25 (nearly two months later).

### Kaseya VSA (July 2021): MSP Business Model as Attack Multiplier

On July 2, 2021—the Friday before July 4th weekend—the REvil ransomware group exploited zero-day vulnerabilities in Kaseya's VSA (Virtual System Administrator) remote monitoring and management platform. The attack affected 50-60 managed service providers and between 800-1,500 downstream businesses across 17 countries,[45] with REvil demanding $70 million for a universal decryption key.[46]

**What happened technically**: REvil exploited CVE-2021-30116 (authentication bypass) and CVE-2021-30117 (SQL injection) that Dutch researchers had responsibly disclosed to Kaseya on April 6, 2021.[47] Despite 87 days between disclosure and attack, on-premises VSA servers remained unpatched. Attackers extracted agent credentials from installer files, used them to obtain authenticated session tokens, escalated privileges through SQL injection, and deployed malicious "updates" through VSA's legitimate software distribution functionality.[48]

The malicious update disabled Microsoft Defender, dropped a vulnerable Microsoft binary, used DLL side-loading to execute REvil ransomware, and encrypted victim systems with SYSTEM-level privileges.[49] Because the ransomware deployed through the trusted RMM platform, it appeared to victim systems as legitimate IT management activity.

**The dependency angle**: The MSP business model created an attack multiplier effect. Compromising 50-60 MSPs instantly provided access to their collective 800-1,500 clients.[50] The average force multiplication: 15-25x. Each MSP manages IT infrastructure for dozens to hundreds of small businesses—dental practices, architecture firms, libraries, retailers—that cannot afford dedicated IT staff.

Coop Sweden illustrates the dependency chain: Coop (grocery chain) → Visma EssCom (payment systems supplier) → Kaseya VSA (RMM tool). When VSA was compromised, ransomware deployed to Visma EssCom's systems, which encrypted Coop's point-of-sale infrastructure. Result: 800 grocery stores closed because cash registers could not process payments.[51] Coop had no direct relationship with Kaseya and no visibility into their payment provider's IT management tools.

The "one throat to choke" vendor consolidation strategy that drives MSP adoption also creates the visibility gap. As industry guidance explains: "Most MSPs advertise that they will take full responsibility for the problem and get it solved for you. You do not need to call multiple vendors... you now have 'one throat to choke.'"[52] This arrangement means clients have no contractual visibility into the specific RMM platforms, backup solutions, or security tools their MSP employs.

**Why frameworks did not detect it**: Businesses using MSPs conduct vendor assessments of the MSP—reviewing their security policies, certifications, and incident response capabilities. But the MSP's choice of RMM platform is an operational decision, not typically disclosed or assessed. Even if disclosed, small businesses lack leverage to require MSPs to use alternative platforms or undergo additional security assessments.

The concentrated RMM market amplifies risk: as of Q4 2024, just three vendors (Kaseya 25.9%, ConnectWise 25.4%, NinjaOne rising to #3) command over 75% market share.[53] This concentration exists because RMM platforms require significant investment in training, scripting, and automation—switching costs are substantial. When a dominant platform is compromised, the impact propagates across thousands of MSPs and tens of thousands of end organizations.

### 3CX (March 2023): The First Cascading Supply Chain Attack

In March 2023, North Korean state-sponsored actors (Lazarus Group/UNC4736) executed the first documented "supply chain of a supply chain" attack. Attackers compromised Trading Technologies' decommissioned X_TRADER software, which led to compromise of a 3CX employee's personal computer, which enabled access to 3CX's build environment, which resulted in distribution of trojanized VoIP software to 600,000+ organizations with 12 million users.[54]

**What happened technically**: Between November 2021 and July 2022, fewer than 100 people downloaded X_TRADER from Trading Technologies' website. The software had been officially decommissioned in April 2020 but remained available for download.[55] In April 2022, a 3CX employee downloaded the trojanized X_TRADER installer on a personal computer. The malware (VEILEDSIGNAL) stole the employee's 3CX corporate credentials.[56] Two days later, attackers used those credentials via VPN to access 3CX's corporate network.[57]

After months of lateral movement, attackers compromised both Windows and macOS build servers in late 2022. They modified two DLLs in the 3CX DesktopApp: `ffmpeg.dll` (completely replaced) and `d3dcompiler_47.dll` (trojanized with appended encrypted shellcode).[58] On March 3 and March 13, 2023, trojanized builds were signed with legitimate 3CX certificates and distributed to customers.[59]

The malicious payload executed a sophisticated multi-stage attack: 7-day dormancy period to evade sandbox analysis,[60] ICONICSTEALER malware to gather browser history and credentials from all infected systems,[61] and selective deployment of GOPURAM backdoor to fewer than 10 cryptocurrency companies identified as high-value targets through the reconnaissance data.[62]

**The dependency angle**: The attack chain defies traditional vendor mapping:
- **Level 1**: Your organization uses 3CX VoIP software
- **Level 2**: 3CX (your vendor) had an employee who
- **Level 3**: Downloaded software from Trading Technologies (not a vendor, no business relationship)
- **Level 4**: X_TRADER (decommissioned legacy software, officially unsupported)
- **Level 5**: Compromised by UNC4736/Lazarus Group (nation-state attacker)

3CX was the victim, not a negligent vendor. Trading Technologies had no business relationship with 3CX and no way to know a 3CX employee downloaded their software on a personal device.[63] The employee downloaded unrelated financial trading software on a personal computer—completely outside 3CX's corporate IT visibility.

**Why frameworks did not detect it**: Organizations that assessed 3CX received SOC 2 reports covering 3CX's operational controls. Those reports could not reveal:
- That a 3CX employee had downloaded compromised trading software on a personal device
- That Trading Technologies' decommissioned software was serving malware
- That 3CX's build environment had been compromised for months
- That distributed updates contained sophisticated backdoors signed with legitimate certificates

The "week that mattered" compounded the failure: customers began reporting EDR alerts on March 22. 3CX initially dismissed these as false positives, with support staff recommending customers whitelist the application.[64] CrowdStrike publicly disclosed the compromise on March 29. 3CX officially acknowledged it March 30—eight days during which organizations actively disabled the security controls that were correctly detecting the threat.[65]

The fundamental challenge: even perfect vendor assessment cannot protect against threats originating from your vendor's vendor's decommissioned legacy software downloaded by an employee on a personal device. As Coalition Inc.'s retrospective noted, this demonstrates "complete supply chain visibility is practically impossible."[66]

### xz Utils (March 2024): Patient Adversary Infiltration

In early 2024, the xz Utils backdoor (CVE-2024-3094) was uncovered—what security researchers immediately recognized as the most sophisticated open source supply chain attack ever documented.[67] Unlike Log4j (accidental vulnerability), SolarWinds (external compromise of build systems), or MOVEit (exploitation of vendor software), the xz Utils incident demonstrated a fundamentally different attack pattern: **deliberate infiltration through patient social engineering to gain insider access**.

This incident deserves prominence because it proves that even perfect vendor due diligence cannot detect nation-state-level adversaries willing to invest years building trust before attacking. The OpenSSF and OpenJS Foundation issued warnings in April 2024 that this attack pattern "may not be an isolated incident" and similar infiltrations may already exist undetected in other critical open source projects.[68]

**What happened technically**: October 2021: An individual using the handle "Jia Tan" began contributing to xz Utils, a widely-used data compression library found in virtually every Linux distribution. The initial contributions were legitimate—bug fixes, performance improvements, documentation updates. Over the following months, Jia Tan established a pattern of helpful, technically competent participation.[69]

2022-2023: Multiple sockpuppet accounts—likely controlled by the same actor or coordinated team—began pressuring the original maintainer, Lasse Collin, to accept more help. These accounts referenced Collin's public statements about experiencing burnout and struggling to keep up with maintenance demands. The pressure campaign was methodical and sophisticated, designed to appear as organic community concern about project sustainability.[70]

November 2022: Jia Tan was granted commit access to the xz Utils repository. The promotion appeared reasonable—Jia Tan had demonstrated technical competence through months of legitimate contributions and multiple community members had vouched for bringing on additional maintainers.[71]

January 2024: Jia Tan gained control of the project's website and infrastructure. By this point, Jia Tan was trusted as a core maintainer with broad responsibilities across the project.[72]

February-March 2024: Sophisticated malicious code was inserted into xz Utils versions 5.6.0 and 5.6.1. The backdoor was designed to compromise OpenSSH sshd authentication, enabling remote code execution on systems running the affected versions. The implementation was technically remarkable—the malicious code was hidden in binary test files and obfuscated build scripts, making it nearly impossible to detect through standard code review.[73]

The backdoor targeted specifically the SSH daemon (sshd) used for remote system access. If undetected, it would have enabled attackers to bypass authentication and execute arbitrary code with root privileges on millions of Linux systems globally. Every major distribution—Debian, Ubuntu, Fedora, Red Hat, Arch—was either already affected or would have been within weeks as the compromised version propagated through their update channels.[74]

March 29, 2024: Andres Freund, a Microsoft engineer and PostgreSQL developer, noticed unusual CPU usage and behavioral anomalies during routine performance testing. The symptoms were subtle—slight delays in SSH connections, marginally increased CPU consumption during authentication. Freund's investigation traced the anomaly to the recently updated xz library.[75]

This discovery was entirely accidental. The backdoor was not detected by code review of pull requests (the malicious code was hidden in binary test files), automated vulnerability scanning (no known vulnerability signatures existed), security audits (xz Utils had no formal security audit program), or supply chain security tools (the maintainer credentials were legitimate).[76]

If not for Freund's curiosity about minor performance degradation—the kind of anomaly most engineers would ignore or attribute to normal system variance—the backdoor would likely have achieved widespread deployment. The timing suggests attackers intended the compromised version to be included in the upcoming Debian stable release (scheduled for mid-2024), which would have embedded the backdoor in one of the most widely-deployed Linux distributions for years.[77]

**The dependency angle**: The xz Utils attack represents a qualitatively different threat model than other supply chain incidents. Key distinctions include insider access vs. external compromise: SolarWinds attackers broke into build servers. Jia Tan was granted legitimate maintainer access through social engineering. From a security perspective, Jia Tan was an insider, not an intruder. All commits were properly authenticated. All code signing used legitimate credentials. All project governance processes were followed.[78]

Years of investment: Most cyberattacks operate on timescales of days to months. The xz Utils infiltration required 2.5 years of patient work—building reputation, earning trust, waiting for the right moment. This demonstrates nation-state-level commitment and sophistication. As security researcher Dan Lorenc noted, "This might be the best executed supply chain attack we've seen described in the open, and it is a nightmare scenario."[79]

Targeting volunteer-maintained infrastructure: xz Utils is maintained by unpaid volunteers. Lasse Collin, the original maintainer, was managing the project alone while dealing with burnout—a common situation in open source. The attackers exploited this vulnerability not through technical means but through social manipulation. They offered help to an overworked maintainer and used community pressure to make refusing that help appear unreasonable.[80]

The dependency is ubiquitous but invisible: According to census of open source usage, xz Utils is present in every major Linux distribution (Debian, Ubuntu, Fedora, Red Hat Enterprise Linux, Arch, openSUSE), container base images (affecting millions of containerized applications), cloud VM images from AWS, Azure, Google Cloud, embedded systems and network appliances, and virtually any system that handles compressed archives.[81] Yet no TPRM program inventories xz Utils as a dependency. It's not a vendor. It has no SOC 2 report. It has no commercial entity behind it. It's maintained by volunteers whom millions of organizations depend on but have no relationship with.

nth-party depth exceeds visibility: The dependency chain for a typical financial institution might look like: **Bank → SaaS Vendor → Cloud Provider (AWS/Azure) → Base Linux Distribution (Ubuntu/RHEL) → xz Utils (volunteer-maintained library)**. The bank assesses the SaaS vendor (third-party). The vendor discloses AWS in their SOC 2 (fourth-party). The cloud provider's Linux distribution is not disclosed (fifth-party). xz Utils is several layers beyond that (sixth-party+). Traditional TPRM sees three layers: vendor, cloud infrastructure, maybe the OS. The actual dependency chain extends far deeper.

**Why frameworks did not detect it**: The xz Utils attack exposed framework limitations that are architectural, not procedural. SOC 2 cannot audit social engineering over 2.5 years: Vendor security assessments evaluate controls at a point in time. They verify that change management processes exist, that commit access is controlled, that code review is performed. All of these controls existed for xz Utils. Jia Tan followed every process correctly because Jia Tan had legitimate access. The compromise was the granting of that access through patient manipulation, not a control failure after access was granted.[82]

Vendor due diligence cannot assess volunteer maintainer burnout: TPRM questionnaires ask commercial vendors about employee training, access controls, separation of duties, and incident response capabilities. These questions are meaningless for volunteer-maintained open source projects. Lasse Collin was not an employee—he was an unpaid maintainer managing a critical infrastructure component in his spare time. The attack exploited the structural vulnerability of open source sustainability, not a technical security gap.[83]

No contractual relationship = no assessment leverage: Financial institutions cannot audit Apache, Linux kernel developers, or xz Utils maintainers because there is no contract. You cannot send a vendor questionnaire to a volunteer. You cannot require SOC 2 certification from a GitHub repository. You cannot demand incident response SLAs from someone maintaining software for free. Yet your entire technology stack depends on these dependencies.[84]

Binary transparency gaps: The malicious code was hidden in binary test files (`.xz` compressed data) included in the repository. Code review focused on source code changes missed the backdoor because reviewers do not manually examine binary test data—they trust that test files are benign. This is a reasonable assumption that attackers exploited.[85] The build process further obfuscated detection: the backdoor activated only when specific build conditions were met (GNU/Linux, x86-64 architecture, glibc, systemd, GCC toolchain). In other environments, the malicious code remained dormant. This meant testing in development environments (often macOS or different Linux configurations) would not trigger suspicious behavior.[86]

Detection required forensic-level investigation: Andres Freund's discovery process involved noticing 500ms SSH connection delay (most engineers would ignore this), profiling to identify xz library as the cause, reverse-engineering obfuscated backdoor code hidden in binary files, and recognizing the pattern as deliberately malicious rather than a performance bug. This level of investigation is far beyond standard vulnerability scanning or security monitoring. It required deep technical expertise, specialized tools, significant time investment, and—critically—noticing an anomaly subtle enough that 99% of engineers would dismiss it as normal system variance.[87]

What makes this uniquely concerning is that the attack vector is reusable: Jia Tan's approach—build credibility over years, exploit maintainer burnout, use social engineering to gain access—is applicable to thousands of open source projects. According to analysis from Tidelift and the Linux Foundation, 60% of critical open source infrastructure is maintained by 1-2 individuals, many experiencing burnout.[88] Each represents a potential target for this attack pattern.

It may not be isolated: The OpenSSF (Open Source Security Foundation) and OpenJS Foundation issued joint guidance warning that "the xz Utils backdoor may not be an isolated incident" and that similar social engineering campaigns may already be underway targeting other critical projects.[89] Security researchers have begun re-examining commit histories of other infrastructure libraries, looking for similar patterns of new maintainers gaining access during original maintainer burnout, sockpuppet accounts applying pressure to accept help, long periods of legitimate contributions before any malicious activity, and sophisticated technical knowledge suggesting state-sponsored resources.

Defenders must trust but verify—with no good verification method: Open source depends on trust. Maintainers must trust contributors. Distributions must trust upstream maintainers. Organizations must trust distributions. The xz Utils attack shows patient adversaries can build trust systematically to exploit these chains. The industry has no good answer for how to verify trust at scale across thousands of volunteer-maintained dependencies.[90]

Nation-state adversaries have validated the approach: Intelligence agencies monitor security research carefully. The xz Utils attack demonstrated that patient social engineering can compromise even security-conscious projects, volunteer-maintained infrastructure is vulnerable to burnout-based manipulation, binary obfuscation can evade code review for months, and the attack was within hours of succeeding globally before accidental discovery. This proof-of-concept will inform future attacks. As security researcher Filippo Valsorda noted, "This is the sort of attack that intelligence agencies have been capable of for years but we've never seen documented in the open. Now that it is public, expect variations."[91]

**TPRM implications**: Dependency mapping must extend beyond vendor relationships: Financial institutions need capability to answer "Are we exposed to xz Utils?" as quickly as "Which vendors do we use?" This requires Software Bill of Materials (SBOM) for all critical applications, recursive dependency mapping (not just direct imports), continuous monitoring of vulnerability disclosures in transitive dependencies, and automated tooling to identify affected systems when vulnerabilities are disclosed.[92]

Open source dependencies are critical infrastructure: The industry treats commercial vendors as manageable risks (contracts, assessments, leverage) while treating open source as "free" and therefore not requiring risk management. The xz Utils incident proves this is backwards. The most critical dependencies—the ones everything else builds on—are often volunteer-maintained open source projects with no security budget, no formal governance, and no accountability structure.[93]

Vendor assessments should include software supply chain maturity: When assessing SaaS vendors, TPRM programs should evaluate whether the vendor maintains SBOMs for their products, how they monitor for vulnerabilities in dependencies, what is their process for responding to incidents like Log4j or xz Utils, whether they have capability to identify affected systems within hours vs. weeks, and how deep is their dependency visibility (direct vs. transitive). These questions address risk management capability, not just compliance checkbox completion.[94]

Industry coordination is required: Individual organizations cannot assess every open source maintainer. The solution requires industry funding for critical open source infrastructure (Google, Microsoft, Amazon have begun this through OpenSSF), shared intelligence on suspicious contribution patterns, coordinated security audits of high-impact libraries, standards for secure open source development practices, and support systems for burned-out maintainers (so accepting help from strangers is not the only option).[95]

After the xz Utils disclosure, security teams at financial institutions asked their vendors: "Are you affected by CVE-2024-3094?" Many vendors responded: "We're investigating." The correct answer required knowing which systems and containers use Linux distributions, identifying which distribution versions include xz Utils 5.6.0/5.6.1, determining whether those systems run sshd, assessing whether the vulnerable code path is reachable, and understanding build environment configurations (the backdoor activated conditionally). Organizations with mature software supply chain visibility answered within hours. Organizations without visibility spent days or weeks investigating. Some still do not know definitively.

This is the same pattern as Log4j in 2021. Three years later, the fundamental problem remains unsolved: TPRM programs built to assess vendors cannot answer questions about dependencies. The xz Utils attack adds a new dimension: those dependencies may be compromised not through accidental vulnerabilities or external attacks, but through patient adversaries who spend years earning the trust required to attack from within. No vendor questionnaire can detect that. No SOC 2 audit can prevent it. No contract can indemnify against it.

The question is whether the industry will treat the xz Utils near-miss as a warning that requires fundamental change, or as an anomaly that can be managed through existing frameworks. The early signs suggest the latter. That choice may define the next decade of supply chain security risk.

Each incident reveals specific gaps in existing frameworks. The next chapter maps these gaps systematically.

---

### Endnotes - Chapter 7

[1] Impact estimates vary by methodology. CISA Cyber Safety Review Board, "Review of the December 2021 Log4j Event," July 2022, documented that 35,000+ Java packages (8% of Maven Central) were affected. Industry analyses from Contrast Security and others estimated 60-64% of Java applications contained the vulnerability. The exact percentage depends on methodology (analyzing packages vs. deployed applications vs. vulnerable code paths), but all sources agree the impact was extraordinarily widespread. Available at: https://www.cisa.gov/sites/default/files/publications/CSRB-Report-on-Log4-July-11-2022_508.pdf

[2] Jen Easterly, CISA Director, quoted in "Apache Log4j Vulnerability Guidance," CISA News and Events, December 10, 2021.

[3] Matthew Prince, Cloudflare CEO, "Exploitation of CVE-2021-44228 Before Public Disclosure and Evolution of WAF Evasion Patterns," *Cloudflare Blog*, December 2021.

[4] Check Point Software, "Log4j Downloads Show Supply Chain Wake-Up Call Ignored," *Developer-Tech*, December 2021.

[5] "Log4j Downloads Show Supply Chain Wake-Up Call Ignored," *Developer-Tech*, December 2024.

[6] Apache Software Foundation, LOG4J2-313, July 18, 2013; "Inside the Log4j2 Vulnerability (CVE-2021-44228)," *Cloudflare Blog*, December 2021.

[7] Volkan Yazici, Apache Log4j maintainer, quoted in "Inside the Breach That Broke the Internet: The Untold Story of Log4Shell," *GitHub Blog*, Open Source, 2021; "Log4j: A New Chapter with STF Funding," *Apache Logging Blog*, December 14, 2023.

[8] Google Open Source Insights, "Dependencies of Dependencies: The Critical Challenge of Managing Software Supply Chain Risk," *ISMS.online*, 2021.

[9] "Dependencies of Dependencies: The Critical Challenge of Managing Software Supply Chain Risk," *ISMS.online*, Information Security, 2021.

[10] Snyk, quoted in "Navigating Cybersecurity with SBOMs: Lessons from Log4j and MOVEit," *LinkedIn Pulse*, Jack Lilley, 2023.

[11] Analysis compiled from: Jack Lilley (security researcher), "Navigating Cybersecurity with SBOMs: Lessons from Log4j and MOVEit," *LinkedIn Pulse*, 2023; ReversingLabs (software supply chain security firm), "Log4j: Why Your Organization Needs SBOM," *ReversingLabs Blog*, December 2021; CISA, "Review of the December 2021 Log4j Event," CSRB Report, July 2022. These sources document the substantial difference in incident response timelines between organizations with and without SBOM capability during the Log4j crisis.

[12] U.S. Department of Homeland Security, estimate documented in "Log4j Vulnerability Timeline," *Automox Blog*, 2021; "The Apache Log4j Vulnerabilities: A Timeline," *CSO Online*, December 2021.

[13] U.S. Senate Republican Policy Committee, "The SolarWinds Cyberattack," Policy Papers, 2021; U.S. Government Accountability Office, "SolarWinds Cyberattack Demands Significant Federal and Private-Sector Response," *GAO Blog*, Infographic, 2021.

[14] Palo Alto Networks Unit 42, "SolarStorm Timeline: Details of the Software Supply-Chain Attack," Unit 42 Blog, 2021; SecurityWeek, "SolarWinds Shares More Information on Cyberattack Impact, Initial Access Vector," December 2020.

[15] CrowdStrike, "SUNSPOT Malware: A Technical Analysis," CrowdStrike Blog, 2021; Bleeping Computer, "New Sunspot Malware Found While Investigating SolarWinds Hack," February 2021.

[16] Mandiant, "SUNBURST Additional Technical Details," Mandiant Resources Blog, December 2020.

[17] Security Boulevard, "SolarWinds/SUNBURST: DGA or DNS Tunneling?" December 2020; Varonis, "SolarWinds SUNBURST Backdoor: Inside the Stealthy APT Campaign," December 2020.

[18] U.S. Government Accountability Office, "SolarWinds Cyberattack Demands Significant Federal and Private-Sector Response," Infographic, 2021.

[19] ReversingLabs, "The Attack on SolarWinds: Next-Level Stealth Was Key," *ReversingLabs Blog*, December 2020.

[20] Specops Software, "SolarWinds Hack: Weak Password 'solarwinds123' Cause," *Specops Blog*, 2021; CNN, "Former SolarWinds CEO Blames Intern for 'solarwinds123' Password Leak," February 26, 2021.

[21] DigiCert, "SolarWinds Attack: Is Code Signing to Blame?" *DigiCert Blog*, December 2020; Cryptomathic, "Post SolarWinds Attack: Code-Signing Best Practices," *Cryptomathic Blog*, 2021.

[22] Wikipedia, "2024 CrowdStrike-Related IT Outages," accessed December 2024; Bitsight, "CrowdStrike Outage Timeline and Analysis," *Bitsight Blog*, July 2024.

[23] Fortune, "CrowdStrike Outage Will Cost Fortune 500 Companies $5.4 Billion in Damages," August 3, 2024; Guy Carpenter, "Unveiling the Global Impact of CrowdStrike Event," *Insights*, July 2024.

[24] CrowdStrike, "Falcon Content Update Preliminary Post Incident Report," *CrowdStrike Blog*, July 2024; Computer Weekly, "CrowdStrike Blames Outage on Content Configuration Update," July 2024.

[25] CrowdStrike, "External Technical Root Cause Analysis — Channel File 291," August 6, 2024.

[26] *Ibid.*

[27] Bitsight, "CrowdStrike Outage Timeline and Analysis," *Bitsight Blog*, July 2024.

[28] LinkedIn Data, "Over Half of Fortune 500 Companies Trust CrowdStrike," LinkedIn Corporate Post, 2024; NotebookCheck, "How and Why CrowdStrike Has a Massive Market Share," July 2024.

[29] TechTarget, "BitLocker Workaround May Offer Aid for CrowdStrike Customers," SearchSecurity News, July 2024; Wikipedia, "2024 CrowdStrike-Related IT Outages," accessed December 2024.

[30] Wikipedia, "2024 CrowdStrike-Related IT Outages," accessed December 2024; US Cloud, "Case Study: How US Cloud Led Clients Through the CrowdStrike Outage," Evidence/Client Case Studies, 2024.

[31] Emsisoft, "Unpacking the MOVEit Breach: Statistics and Analysis," *Emsisoft Blog*, 2023.

[32] *Ibid.*

[33] Kroll, "Clop Ransomware MOVEit Transfer Vulnerability Analysis," *Kroll Publications*, Cyber, 2023; SecurityWeek, "Evidence Suggests Ransomware Group Knew About MOVEit Zero-Day Since 2021," June 2023.

[34] CISA and FBI, "#StopRansomware: CL0P Ransomware Gang Exploits CVE-2023-34362," Cybersecurity Advisories AA23-158A, 2023; Kroll, "Clop Ransomware MOVEit Transfer Vulnerability Analysis," 2023.

[35] CISA, "#StopRansomware: CL0P Ransomware Gang Exploits CVE-2023-34362," July 8, 2023; Picus Security, "CVE-2023-34362: Cl0p Ransomware Exploits MOVEit Transfer SQLi Vulnerability," *Picus Security Blog*, 2023.

[36] Kolide, "MOVEit Hack: The Ransomware Attacks Explained," *Kolide Blog*, 2023; Wing Security, "Understanding the MOVEit Ransom Attack," *SaaS Security*, 2023.

[37] Emsisoft, "Unpacking the MOVEit Breach: Statistics and Analysis," *Emsisoft Blog*, 2023.

[38] HIPAA Journal, "Pension Benefit Information 371,359 Hack," 2023; TechTarget, "MOVEit Transfer Cyberattack Impacts 1.2M at Pension Benefit Information," HealthTech Security News, 2023.

[39] ORX News, "MOVEit Transfer Data Breaches Deep Dive," ORX Resource, 2023.

[40] *Ibid.*

[41] *Ibid.*

[42] Colorado State University, "MOVEit Software Cyberattack Notification," Source, July 12, 2023; Cybersecurity Dive, "Progress Software's MOVEit Meltdown: Uncovering the Fallout," News, 2023.

[43] Cybersecurity Dive, "MOVEit Mass Exploit Timeline," News, 2023.

[44] California Attorney General, "MOVEit Individual Notice Letter," Version 1, September 19, 2023.

[45] Kaseya, CEO Fred Voccola statement, quoted in "The Kaseya Ransomware Attack: A Timeline," *CSO Online*, July 2021; Varonis, "REvil MSP Supply Chain Attack," *Varonis Blog*, 2021.

[46] Wikipedia, "Kaseya VSA Ransomware Attack," accessed December 2024.

[47] Dutch Institute for Vulnerability Disclosure (DIVD), Case File DIVD-2021-00011, April 6, 2021.

[48] Tenable, "CVE-2021-30116: Multiple Zero-Day Vulnerabilities in Kaseya VSA Exploited to Distribute Ransomware," *Tenable Blog*, July 2021; Truesec, "How the Kaseya VSA Zero-Day Exploit Worked," *Truesec Hub*, Blog, 2021.

[49] Morphisec, "Real-Time Prevention of the Kaseya VSA Supply Chain REvil Ransomware Attack," *Morphisec Blog*, July 2021; ThreatLocker, "Why ThreatLocker: Kaseya VSA Use Cases," 2021.

[50] Kaseya CEO Fred Voccola statement, quoted in "The Kaseya Ransomware Attack: A Timeline," *CSO Online*, July 2021.

[51] The Record, "Supermarket Chain Coop Closes 800 Stores Following Kaseya Ransomware Attack," July 2021; Truesec, "Coop Back in Business After the Largest Ransomware Attack of All Time," Case Study, 2021.

[52] CharTec, "Have Only One Throat to Choke with Vendor Management," *CharTec Blog*, 2021.

[53] MSP Success, "Kaseya Surpasses ConnectWise in RMM PSA Market Shift," December 2024; Canalys, "RMM Vendors Must Reckon with the New Economic Narrative," Resources, 2024.

[54] Mandiant/Google Cloud, "3CX Software Supply Chain Compromise Initiated by a Prior Software Supply Chain Compromise," *Google Cloud Blog*, Topics/Threat Intelligence, April 2023.

[55] *Ibid.*; BleepingComputer, "3CX Hack Caused by Trading Software Supply Chain Attack," Security, April 2023.

[56] Mandiant/Google Cloud, "3CX Software Supply Chain Compromise," April 2023.

[57] *Ibid.*

[58] ReversingLabs, "The 3CX Attack Gets Wilder: Marks First Cascading Supply Chain Compromise," *ReversingLabs Blog*, April 2023; Fortinet FortiGuard Labs, "3CX Desktop App Compromised (CVE-2023-29059)," *Threat Research*, March 2023.

[59] Huntress, "3CX VoIP Software Compromise & Supply Chain Threats," *Huntress Blog*, March 2023; BleepingComputer, "3CX Confirms North Korean Hackers Behind Supply Chain Attack," April 2023.

[60] Kaspersky, "Gopuram Backdoor Deployed Through 3CX Supply Chain Attack," *Securelist*, April 2023; Volexity, "3CX Supply Chain Compromise Leads to ICONIC Incident," *Volexity Blog*, March 30, 2023.

[61] CISA, quoted in Volexity, "3CX Supply Chain Compromise Leads to ICONIC Incident," March 2023; Kaspersky, "Cryptocurrency Companies Targeted via Gopuram Malware Through the 3CX Attack," *Press Release*, April 2023.

[62] Kaspersky, "Gopuram Backdoor Deployed Through 3CX Supply Chain Attack," *Securelist*, April 2023.

[63] Trading Technologies statement, quoted in TechCrunch, "3CX's Supply Chain Attack Was Caused by Another Supply Chain Attack," April 20, 2023.

[64] The Register, "3CX Decided Supply Chain Attack Indicator Was False Positive," April 3, 2023.

[65] CrowdStrike, "CrowdStrike Detects and Prevents Active Intrusion Campaign Targeting 3CXDesktopApp," *CrowdStrike Blog*, March 29, 2023; 3CX CEO Nick Galea, "3CX DesktopApp Security Alert," *3CX Blog*, March 30, 2023.

[66] Coalition Inc., "Security Incident Retrospective: The 3CX Supply Chain Attack," *Coalition Blog*, 2023.

[67] Wikipedia, "XZ Utils backdoor," https://en.wikipedia.org/wiki/XZ_Utils_backdoor; Dan Lorenc (Chainguard CEO), quoted in The Verge, "The XZ Utils Backdoor: Everything You Need to Know," March 2024; Ars Technica, "What We Know About the XZ Utils Backdoor That Almost Infected the World," April 2024.

[68] Nextgov, "Linux Backdoor Was a Long Con, Possibly with Nation-State Support, Experts Say," April 2024, https://www.nextgov.com/cybersecurity/2024/04/linux-backdoor-was-long-con-possibly-nation-state-support-experts-say/395511/; OpenSSF and OpenJS Foundation, "Joint Statement on xz Utils Social Engineering Attack," April 2024; The Record, "Open Source Foundations Warn of More Attacks Like XZ Utils Backdoor," April 2024.

[69] Securelist by Kaspersky, "Social Engineering Aspect of the XZ Incident," https://securelist.com/xz-backdoor-story-part-2-social-engineering/112476/; Ars Technica, "How One Volunteer Stopped a Backdoor from Exposing Linux Systems Worldwide," April 2024.

[70] Dark Reading, "Attacker Social-Engineered Backdoor Code Into XZ Utils," https://www.darkreading.com/application-security/attacker-social-engineered-backdoor-code-into-xz-utils; Securelist, "Social Engineering Aspect of the XZ Incident," 2024; Ars Technica, "What We Know About the XZ Utils Backdoor," April 2024.

[71] Ars Technica, "What We Know About the XZ Utils Backdoor That Almost Infected the World," April 2024; GitHub xz repository commit history analysis, March-April 2024.

[72] Timeline documented in: Ars Technica, "What We Know About the XZ Utils Backdoor," April 2024; Openwall mailing list analysis, March-April 2024.

[73] CVE-2024-3094, NIST National Vulnerability Database, March 29, 2024; RedHat Security Advisory RHSA-2024:1590, March 2024; Ars Technica technical analysis, "The XZ Backdoor: A Technical Deep Dive," April 2024.

[74] RedHat Security Advisory RHSA-2024:1590; Debian Security Advisory DSA-5649-1, March 2024; Ubuntu Security Notice USN-6698-1, March 2024; Arch Linux security advisory, March 2024.

[75] Andres Freund, original disclosure post to openwall oss-security mailing list, March 29, 2024; The Verge, "How a Microsoft Engineer Helped Prevent a Massive Cyberattack," April 2024; Ars Technica, "How One Volunteer Stopped a Backdoor," April 2024.

[76] Analysis compiled from multiple sources documenting detection limitations: Ars Technica, "What We Know About the XZ Utils Backdoor," April 2024; RedHat Security Blog, "Analysis of CVE-2024-3094," March 2024.

[77] Debian release schedule, https://wiki.debian.org/DebianBookworm; analysis from The Register, "XZ Backdoor Was Weeks Away from Debian Stable," April 2024.

[78] Security analysis documenting insider access vs. external compromise: Ars Technica technical analysis, April 2024; OpenSSF commentary on the incident, April 2024.

[79] Dan Lorenc (Chainguard CEO), quoted in The Verge, "The XZ Utils Backdoor: Everything You Need to Know," March 2024.

[80] Lasse Collin statements documented in: Ars Technica, "What We Know About the XZ Utils Backdoor," April 2024; Securelist, "Social Engineering Aspect of the XZ Incident," 2024; analysis of public communications in xz-devel mailing list archives, 2021-2024.

[81] Census II of Free and Open Source Software, Linux Foundation & Harvard Lab for Innovation Science, 2020; Synopsys OSSRA Report 2024; analysis from Chainguard, "The Ubiquity of XZ Utils," April 2024.

[82] SOC 2 scope and limitations analysis from: AICPA, "SOC 2 Reporting on Controls at a Service Organization," 2023; Vanta, "What SOC 2 Does and Doesn't Cover," 2024.

[83] Nadia Eghbal (now Asparouhova), "Roads and Bridges: The Unseen Labor Behind Our Digital Infrastructure," Ford Foundation, 2016; Tidelift, "The 2023 State of the Open Source Maintainer Report," 2023.

[84] Open Source Security Foundation (OpenSSF), "The State of Software Bill of Materials (SBOM) and Cybersecurity Readiness," 2023; Linux Foundation, "A Summary of Census II: Free and Open Source Software," 2020.

[85] Technical analysis from: Ars Technica, "The XZ Backdoor: A Technical Deep Dive," April 2024; RedHat Security Blog, "Analysis of CVE-2024-3094 in xz/liblzma," March 2024; Gynvael Coldwind (Google Project Zero), xz backdoor technical analysis, April 2024.

[86] RedHat Security Blog, "Analysis of CVE-2024-3094 in xz/liblzma," March 2024; Technical analysis from Andres Freund's original disclosure, openwall oss-security mailing list, March 29, 2024.

[87] Andres Freund interview in The Verge, "How a Microsoft Engineer Helped Prevent a Massive Cyberattack," April 2024; detailed timeline from Ars Technica, "How One Volunteer Stopped a Backdoor from Exposing Linux Systems Worldwide," April 2024.

[88] Tidelift, "The 2023 State of the Open Source Maintainer Report," 2023; Linux Foundation & Harvard Innovation Lab, "Census II of Free and Open Source Software," 2020; analysis showing 41.8% of FOSS packages are maintained by single developers.

[89] OpenSSF and OpenJS Foundation, "Joint Statement on xz Utils Social Engineering Attack," April 2024; Nextgov, "Linux Backdoor Was a Long Con, Possibly with Nation-State Support, Experts Say," April 2024; The Record, "Open Source Foundations Warn of More Attacks Like XZ Utils Backdoor," April 2024.

[90] Filippo Valsorda (cryptographer, former Go security lead), commentary on xz backdoor, Twitter/X thread, March-April 2024; Bruce Schneier, "The XZ Backdoor and Trust in Open Source," Schneier on Security blog, April 2024.

[91] Filippo Valsorda, commentary on xz backdoor implications, Twitter/X and personal blog, April 2024.

[92] CISA, "Software Bill of Materials (SBOM)," https://www.cisa.gov/sbom; NTIA, "The Minimum Elements for a Software Bill of Materials," 2021; analysis from "Navigating Cybersecurity with SBOMs: Lessons from Log4j and MOVEit," LinkedIn Pulse, Jack Lilley, 2023.

[93] Nadia Eghbal, "Roads and Bridges: The Unseen Labor Behind Our Digital Infrastructure," Ford Foundation, 2016; Veracode, "State of Software Security: Open Source Edition," 2023.

[94] Shared Assessments, "SIG Questionnaire: Software Supply Chain Security," 2024; NIST Secure Software Development Framework (SSDF), SP 800-218, 2022.

[95] OpenSSF, "Securing Open Source Software: A Plan of Action," 2023; GitHub, "The State of Open Source Security 2024," 2024; analysis of industry funding commitments to critical open source infrastructure from Amazon, Google, Microsoft, and others through OpenSSF, 2021-2024.

\newpage
