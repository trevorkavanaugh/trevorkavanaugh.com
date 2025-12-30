# Software Supply Chain Risk (Part 1)

**Date:** December 30, 2025
**Category:** TPRM
**Read Time:** 3 min
**Original:** LinkedIn Post #17

---

Your vendor didn't write most of their code. And that's not a secret—it's how modern software works.

The application you're relying on for core operations? Recent studies from the Linux Foundation show 70-90% of modern software is assembled from open source components—and that number keeps climbing.

Your vendor assembled it more than they built it.

This isn't a criticism. It's just reality. And it changes what TPRM should be looking at.

## Open Source Libraries Are the Building Blocks

Developers don't write everything from scratch anymore. They pull in pre-built components—logging tools, encryption libraries, authentication modules—written by other developers and shared freely. It's efficient. It's standard practice. It's also risk you've probably never assessed.

When you evaluate a vendor's software, you're evaluating the 10-30% they actually wrote. The other 70-90%? That came from open source projects maintained by... someone. Maybe a team at Google. Maybe one developer in Nebraska.

Your vendor may not even know everything that's in their own codebase.

## Why This Matters for TPRM

Remember Log4j? One open source logging library, embedded in thousands of products, created a vulnerability that took down half the internet. Your vendors were scrambling to figure out if they were even affected—because they didn't have full visibility into their own software supply chain.

That's not a one-time event. That's the new normal. The next Log4j is already out there, sitting in some dependency nobody's audited.

This is the same pattern we see with fourth-party dependencies—risk that exists beyond your direct vendor relationship, invisible until something breaks.

## The Gap in Traditional Due Diligence

We ask vendors about their security practices, their SOC 2, their policies. We don't ask what components are in their software or where those components came from.

Most TPRM questionnaires weren't built for this. They assess the vendor. They don't assess what the vendor assembled.

The structural gap is real: our frameworks focus on the organization while the risk lives in the code. Understanding how software is built—not just who builds it—is becoming essential.

## Where TPRM Is Headed

Modern third-party risk isn't just about who your vendor is. It's about what's inside the software they deliver. The supply chain underneath the product.

This isn't optional anymore. It's what the landscape demands.

More on this next week—including what visibility into software supply chains actually looks like.

> "Most TPRM questionnaires weren't built for this. They assess the vendor. They don't assess what the vendor assembled."

---

## Internal Links
- [Fourth-Party Risk (Part 1)](../../../src/articles/4th-party-risk-pt1.html)
- [Development of Third-Party Risk (Part 2)](../../../src/articles/development-third-party-risk-pt2.html)

## Series
This is Part 1 of the Software Supply Chain series. Part 2 coming January 6, 2026.
