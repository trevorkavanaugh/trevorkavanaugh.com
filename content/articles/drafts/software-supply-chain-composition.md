# Software Supply Chain Composition

**Date:** January 1, 2026
**Category:** Software Supply Chain Risk
**Read Time:** 4 min
**Original:** LinkedIn Post #18

---

Dell doesn't make their own processors. They buy them from Intel. They don't make their own graphics cards either—those come from Nvidia.

This is supply chain. Components sourced from specialized manufacturers, assembled into a final product. You already understand this.

Modern software works the same way. Your vendor didn't write every line of code in their application. They assembled it from pre-built components—open source libraries written by other developers.

This is normal. This is efficient. This is how virtually all software gets built today.

But here's where the analogy breaks down, and where the risk profile fundamentally changes.

## The Accountability Gap

Intel is a $200 billion company. They have contracts, warranties, legal liability, and a reputation to protect. When Dell sources a processor, there's a corporate entity on the other end with skin in the game.

That open source encryption library your vendor is using? It might be maintained by a single volunteer in their spare time. No contract. No SLA. No legal entity. No warranty.

If something breaks, there's no one to call.

This isn't theoretical. The reality of open source maintenance is that critical infrastructure often rests on the shoulders of individual contributors who have no formal obligation to maintain, secure, or support their code. They do it because they want to, not because they're contractually required to.

When a hardware component fails, you have recourse. When an open source dependency fails, you have a GitHub issue tracker and hope someone's paying attention.

## The Complexity Gap

A laptop has maybe a few dozen major components. Complex, sure—but countable. You can map the supply chain. You can audit the suppliers.

A modern software application might pull in hundreds or even thousands of open source components. Each one written by different people, maintained on different schedules, with different levels of security rigor.

And each of those components might pull in other components. Layers on layers. Dependencies on dependencies.

Your vendor's application might use a web framework, which uses a templating engine, which uses a string parsing library, which uses a character encoding module. Four layers deep, and your vendor only chose the first one directly. The rest came along for the ride.

This complexity isn't an implementation flaw—it's structural. It's how modern software development works. But it creates a risk surface that's exponentially larger than traditional hardware supply chains.

## Why This Matters for TPRM

Hardware supply chain risk is corporate. There are contracts, audits, quality standards, and legal recourse. When something goes wrong, there's a company to hold accountable.

Software supply chain risk is structural. The dependencies exist whether anyone's managing them or not. The volunteers maintaining critical libraries don't answer to your vendor—and your vendor might not even know they're there.

This isn't a criticism. It's just the reality of how modern software gets built.

But it's a reality that fundamentally changes the nature of third-party risk.

Traditional TPRM assumes that when you assess a vendor, you're assessing what they control. In hardware supply chains, that's mostly true. The vendor selected their suppliers, negotiated contracts, and maintains business relationships.

In software supply chains, your vendor controls only the top layer. Everything underneath is inherited, transitive, and often invisible until something breaks.

## The Questions We're Not Asking

Does your vendor maintain a Software Bill of Materials (SBOM) that lists every component in their application?

Do they monitor security advisories for all their dependencies, not just their own code?

Do they have a process for updating dependencies when vulnerabilities are discovered?

Do they know how many layers deep their dependency tree goes?

Can they tell you who maintains the critical libraries they depend on?

These aren't standard TPRM questions yet. But they're becoming essential.

## Where TPRM Hasn't Caught Up

Most third-party risk assessments were designed for a world where vendors build products, not assemble them from a complex web of external components.

We ask about the vendor's development practices, their security controls, their incident response. All important. All necessary.

But we don't ask about the composition of their software. We don't assess the dependencies. We don't evaluate the maintainers of the libraries that make up 70-90% of the application.

We're auditing the assembly line but ignoring the parts supply.

## The Path Forward

Understanding software supply chain composition isn't about adding another checklist to your due diligence process. It's about recognizing that the risk model has fundamentally changed.

The accountability and complexity gaps are real. The dependencies exist. The volunteers maintaining critical infrastructure are doing their best, but they're not bound by the same obligations as corporate suppliers.

Your vendors are navigating this reality every day. The question is whether your TPRM program reflects it.

Does your due diligence account for the difference between hardware and software supply chains—or does it assume they work the same way?

> "The volunteers maintaining critical libraries don't answer to your vendor—and your vendor might not even know they're there."

---

## Related
- [Software Supply Chain Risk](../published/2025-12/software-supply-chain-risk.md) - The "wait, what?" introduction
