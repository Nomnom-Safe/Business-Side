# Learning With AI: Menu Parsing & Allergen Awareness

## Context

This learning topic explores how AI might support **business users** in managing restaurant menu data within the context of *NomNomSafe*. Rather than focusing on customer-facing features, this effort centers on how AI could assist restaurant owners, managers, or staff when importing and reviewing menu information.

The broader motivation is to understand whether AI can meaningfully reduce friction, surface potential issues, and improve clarity during menu maintenance—without removing human judgment from safety-critical decisions.

## Learning Focus

Menus are often imported from existing sources such as PDFs, spreadsheets, or third-party platforms. These imports frequently contain inconsistencies, spelling errors, or ambiguous language that can make allergen-related review more difficult than it needs to be.

This learning effort explores whether AI can help:

- Improve the overall user experience for business users during menu import and review
- Catch misspellings and regional spelling variants (e.g., “sesame” vs. “sesamé,” “soy” vs. “soya”)
- Identify *possible* allergens in menu text and surface them for explicit human confirmation

The emphasis is not on automation for its own sake, but on understanding where AI might act as a helpful assistant during a process that is currently manual and error-prone.

Potential uses include:

- Parsing imported menu text into more structured representations
- Highlighting words or phrases that may warrant closer attention
- Prompting business users to confirm, clarify, or correct information before it becomes part of the system

Importantly, this exploration assumes that any AI-identified allergens or corrections would remain *reviewable* and *editable* by the business user. The goal is to support better decisions, not replace them (at least that's my initial conception)

## What I Am Exploring

Through this topic, I am learning:

- How reliably AI can interpret real-world menu text, which is often informal and inconsistent
- Where AI struggles with ambiguity, context, or incomplete information
- How AI-assisted suggestions might be presented in a way that feels helpful rather than intrusive
- How to balance efficiency gains with the need for careful human oversight in safety-related domains

This is an exploratory design and learning effort rather than a finalized feature plan.

## Open Questions

Some questions guiding this exploration include:

- How often would AI suggestions be useful versus noisy?
- What kinds of false positives or false negatives might emerge when identifying possible allergens?
- How should uncertainty be communicated to business users in a clear and responsible way?
- Where should the boundary be drawn between AI assistance and explicit human responsibility?

## Why This Matters

Menu data in NomNomSafe is treated as **living, safety-relevant information**, not static text. Small errors or ambiguities can have outsized consequences for both businesses and customers.

By exploring AI-assisted menu parsing through a learning lens, this topic aims to better understand how AI might responsibly augment business workflows—improving clarity and confidence without undermining trust or accountability.