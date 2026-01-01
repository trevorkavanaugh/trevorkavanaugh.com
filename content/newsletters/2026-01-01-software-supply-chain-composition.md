---
title: "Software Supply Chain Composition"
date: 2026-01-01
article_slug: software-supply-chain-composition
article_url: https://trevorkavanaugh.com/articles/software-supply-chain-composition.html
sent_date: 2026-01-01
test_sends: 2
production_send: false
---

# Software Supply Chain Composition

Dell sources chips from Intel and processors from AMD. Your vendor sources code from open source libraries—and the people maintaining them have no legal obligation to your vendor at all.

**The difference matters.**

Hardware supply chains have contracts, warranties, and liability. Software supply chains often don't. When a tire fails on a Dell laptop, there's a clear chain of accountability. When a vulnerability is discovered in a library your vendor uses, the path to resolution is far murkier.

## The Accountability Gap

Open source maintainers, many doing this work without compensation, increasingly face the consequences. When critical vulnerabilities emerge, they face pressure to drop everything and patch—often for projects they maintain in their spare time. The log4j vulnerability highlighted this: maintainers scrambled over holidays while companies worth billions waited for fixes.

## The Complexity Trap

Modern software isn't just code your vendor wrote—it's an assembly of dependencies, each with their own dependencies, creating trees of complexity. Your vendor's app might directly use 50 libraries, but those 50 might pull in 500 more.

## Why This Matters for TPRM

This is why software supply chain risk represents something new—not just "vendor risk" recycled. The accountability structures of physical supply chains don't exist here. The complexity exceeds what traditional assessments capture.

Understanding this distinction is the first step toward managing it.

---

## Newsletter Metadata

- **Subject Line**: Software Supply Chain Composition
- **Test Sends**: 2 (template iteration for Outlook compatibility)
- **Production Send**: Pending (article not yet published)
- **Template Version**: Table-based HTML v1 (Outlook-compatible)

### Notes

First newsletter using the new table-based HTML template designed for Outlook compatibility. Initial div-based template had rendering issues (stripped background colors, button styling, border on logo). Converted to table-based layout per email best practices.
