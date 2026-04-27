# Ontology Research Deliverables — Guide for Non-Technical Presentations

**Purpose:** This document is a **briefing pack** for another AI agent (or a human presenter) building a presentation for a **non-technical audience**—for example stakeholders, classmates, or product partners who care about *outcomes and safety ideas*, not software or formal logic.

**What it covers:** What each **semester ontology deliverable** (R3.1–R3.5) *means in plain language*, what is *inside each artifact*, and *why each step matters* for food-allergen ontology research and for safer AI-assisted decisions in apps like NomNomSafe.

**Where the files live:** The canonical copies of the five deliverable write-ups are under  
`Learning-With-AI-ASE485/ontology/jeff-perdue/deliverables/`  
(organized by `phase_0/`, `phase_1/`, and `phase_2/`). Phase 0 also includes **raw research inputs** (prompts and annotation notes) that support R3.1 and R3.2 but are not separate “requirements” themselves.

**Related planning documents:**  
- `ontology_research_roadmap.md` — multi-phase research plan (Phases 0–4).  
- `sprint2_trackb_retrospective.md` — how R3.1–R3.5 were produced, week by week, and design decisions.

---

## 1. One-Sentence Framing for Any Audience

This research is **not** “make a list of allergens.” It is **design a disciplined way to represent what we actually know vs. what we assume** about a dish and an allergen—so that an AI or an app **cannot call something ‘safe’ unless the evidence truly supports that conclusion**.

---

## 2. What “Ontology” Means Here (Non-Technical)

In everyday terms, an **ontology** in this project is a **shared picture of the situation**: the kinds of things that matter (dish, kitchen, label, “maybe contains”), how they connect, and **rules** that say when you are allowed to draw a strong conclusion.

Think of it as:

- **A checklist of dimensions** (ingredients, how it is cooked, shared equipment—not just the menu text).
- **Labeled states of knowledge** (for example: confirmed present, might be present, we truly don’t know yet—not the same as “probably fine”).
- **A single safety rule** at the end: only one of those states is allowed to support “safe for this allergen.”

That structure exists so **helpful language from an AI does not accidentally become a false safety guarantee**.

---

## 3. How the Five Deliverables Fit Together (Story Arc)

The work is intentionally **sequential**. Each document answers a question the previous one raised.

| Order | ID | Plain-language question it answers |
|------:|-----|-------------------------------------|
| 1 | **R3.1** | *How do AI systems get this wrong today?* |
| 2 | **R3.2** | *What would “enough evidence” even mean, structurally?* |
| 3 | **R3.3** | *What is our minimal, clear model of exposure and proof?* |
| 4 | **R3.4** | *Does the model behave correctly on realistic stories?* |
| 5 | **R3.5** | *Menus and labels are messy words—how do we translate them into that model?* |

**Presentation tip:** Show this as a **staircase** or **pipeline**: observe failures → specify evidence → build core model → stress-test → connect to real-world wording.

---

## 4. Deliverable R3.1 — Allergen Safety Failure Taxonomy

**Formal name:** Allergen Safety Failure Taxonomy  
**File:** `jeff-perdue/deliverables/phase_0/allergen_safety_failure_taxonomy.md`  
**Research phase:** Phase 0 — Failure & Evidence Analysis

### What it means (plain language)

This document is a **field guide to mistake patterns**: ways an AI (or a person using quick heuristics) can sound reasonable while reaching a **risky or overconfident** conclusion about allergen safety.

### What is included

- **Context:** Why allergen mistakes matter; how Phase 0 was run (prompts, two models, structured flags).
- **Four failure categories** (each explained in prose, with implications):
  1. **Overconfident Safety (OCS)** — saying or implying “safe” (or opening with a “yes, but…”) before the evidence is actually there.
  2. **Omission-as-Absence (OAA)** — treating “not mentioned on the menu” as proof the allergen is not there.
  3. **Cross-Contact Blindness (CCB)** — ignoring shared fryers, grills, pasta water, surfaces, etc.
  4. **Preparation-Context Blindness (PCB)** — missing risks embedded in *how* something is cooked (classical sauces, finishing techniques, unstated kitchen norms).
- **Evidence from the study:** Which failure types actually showed up in the logged tests; honest discussion of cases where prompts were explicit and models behaved well anyway.
- **Central finding:** Models often **know** the risks; the gap is **lack of a hard rule** that blocks a safety conclusion until evidence is sufficient.

### Why it matters for ontology development

You cannot design a good structure for “safe vs. not safe” without naming **the exact ways reasoning fails**. This document **grounds the ontology in observed behavior**, not abstract theory, and it motivates **gates and defaults** (do not infer safety from silence; do not skip kitchen context).

### Supporting material (same folder)

- `phase0_prompts.md` — the prompt set used in the study.  
- `phase0_annotation_failure_notes.txt` — per-prompt notes and failure flags.  

These support R3.1’s credibility but are **raw inputs**, not the numbered deliverable itself.

---

## 5. Deliverable R3.2 — Structural Evidence Requirements

**Formal name:** Structural Evidence Requirements  
**File:** `jeff-perdue/deliverables/phase_0/structural_evidence_requirements.md`  
**Research phase:** Phase 0 (second deliverable)—bridges into Phase 1

### What it means (plain language)

This document answers: **If we want failures to be impossible—not just unlikely—what pieces of structured information must exist?** It turns each failure pattern into a **required reasoning step** and a **placeholder for knowledge** (later formalized as ontology “nodes”).

### What is included

- For **each failure category**, a consistent structure:
  - What the failure looked like.
  - What structured knowledge was missing (not “more trivia,” but **missing buckets** like environment, process, or a safety gate).
  - What Phase 1 must therefore **build in**.
- A **synthesis section**: the **complete evidence pathway**—ingredient truth, cross-contact environment, preparation process, then a **safety inference gate**—that together prevent OAA, CCB, PCB, and OCS respectively.

### Why it matters for ontology development

R3.1 says *what goes wrong*; R3.2 says *what must always be checked*. It is effectively a **mini specification** for Phase 1: it explains **why** the later ontology has separate dimensions instead of one big “ingredient list” field.

---

## 6. Deliverable R3.3 — Core Exposure-State Ontology

**Formal name:** Core Exposure-State Ontology  
**File:** `jeff-perdue/deliverables/phase_1/core_exposure_state_ontology.md`  
**Research phase:** Phase 1 — Core Exposure-State Ontology

### What it means (plain language)

This is the **heart blueprint**: a small set of ideas that describe **how an allergen could reach a specific dish** and **how sure we are**. It ends with a strict rule: **only one “exposure state” allows calling the dish safe for that allergen.**

### What is included

- **Part 1 — Core concepts** (each defined and justified), including:
  - **FoodItem** — the actual dish as offered, in a real kitchen context (not an abstract recipe name floating in a vacuum).
  - **Ingredient / Substance / Allergen** — composition at a useful level of detail (including “hidden” carriers like sauces).
  - **PreparationContext** — cooking method, sequence, culinary conventions (where “not on the menu” still matters).
  - **CrossContactSource** — equipment and environment paths separate from intended ingredients.
  - **ExposureState** — the main output for “this dish vs. this allergen.”
- **Part 2 — Four exposure states** (plain-language intent):
  - **ConfirmedPresent** — we have positive reason to believe the allergen is there (or confirmed cross-contact).
  - **PotentiallyPresent** — a **specific** plausible path exists but is not nailed down (“may contain,” shared fryer not ruled out, canonical technique not confirmed for this kitchen).
  - **Unknown** — **default** when the work is incomplete; **not** the same as safe.
  - **ConfirmedAbsent** — **affirmative** “we checked the real pathways”; the only state that can support a positive safety inference.
- **Part 3 — Ordered exposure logic** — rules evaluated in order; **more conservative** interpretations win ties; includes the **Modification Request Rule** (asking to remove a topping does not magically fix butter-in-the-pan technique unless the kitchen truly changes execution and that is confirmed).
- **Part 4 — Safety Inference Principle** — the hard gate connecting states to any “safe” message.
- **Parts 5–6** — Traceability back to Phase 0 and explicit scope limits (what this ontology is *not* trying to be).

### Why it matters for ontology development

This is the **first complete, testable conceptual ontology** for the project: it encodes **evidence-based safety**, **separation of “facts about the dish” from “how cautious the app policy is,”** and **honest uncertainty**. Everything after Phase 1 either **implements** this (software, formal languages) or **extends** it (how language maps in—Phase 2).

---

## 7. Deliverable R3.4 — Scenario Test Suite

**Formal name:** Scenario Test Suite (18 scenarios)  
**File:** `jeff-perdue/deliverables/phase_1/scenario_test_suite.md`  
**Research phase:** Phase 1 (validation artifact)

### What it means (plain language)

This document is a **story-based exam** for the Phase 1 model: realistic dishes and kitchens where the **right answer is not “sound smart,”** but **assign the correct exposure state and allow or block “safe” correctly**.

### What is included

- **Eighteen scenarios** in six groups, for example:
  - Simple cases with **complete** evidence (shows the system is not cynically “always no”).
  - **Shared fryer** vs **dedicated fryer** pairs (isolates what changes the outcome).
  - **Ambiguous oils / partial disclosure** (unknown vs. guessed).
  - **Bakery / dessert complexity** (many hidden paths).
  - **Modification requests** (tests the Modification Request Rule against real-feeling diner asks).
  - **Missing preparation context** (labels like “vegan” not substituting for a finished evidence path).
- For each scenario: **food + allergen**, **which rules apply**, **final exposure state**, **whether “safe” is allowed**, and a **short rationale** tying the case to Phase 0 failure themes.

### Why it matters for ontology development

Ontologies are easy to **write** and hard to **trust**. This suite is the **documented proof** that the definitions and precedence rules behave as intended—especially that **blocking** happens where real life is ambiguous. It is also a **phase gate** in the research story: Phase 2 was not started until Phase 1 had this validation on paper.

**Note (for accuracy in Q&A):** The broader roadmap also mentions a **draft backend-friendly output structure** (e.g., JSON-shaped outputs). That item was **not** part of the R3.1–R3.5 semester set and is **planned ahead of formal implementation work** (see roadmap and retrospective).

---

## 8. Deliverable R3.5 — Phase 2 Epistemic Extension (Communication Layer)

**Formal name:** Phase 2 Epistemic Extension — Communication Layer  
**File:** `jeff-perdue/deliverables/phase_2/phase2_epistemic_extension.md`  
**Research phase:** Phase 2 — Epistemic Extension

### What it means (plain language)

Phase 1 assumes you somehow already have structured facts. In life, most signals arrive as **language**: menus, disclaimers, staff assurances, regulatory labels, marketing phrases. Phase 2 is a **translator manual**: **how to read a statement** and turn it into **evidence for one of the Phase 1 dimensions**—without changing Phase 1’s core safety rule.

### What is included

- **The communication act** as the basic unit (anything that carries allergen-relevant info—or structured silence).
- **Seven concepts** that characterize a real-world statement:
  - **Mention / Omission / Disclaimer** — said, not said, or hedged (“may contain…”).
  - **RoleType** — structural vs. incidental vs. flavor reference (connects to whether a diner request can actually fix the risk).
  - **CertaintyLevel** — verified vs. asserted vs. implied vs. disclaimed (what the statement can and cannot justify).
  - **Scope** — dish vs. kitchen vs. facility vs. supplier (which part of the system the words actually speak to).
  - **DeclarationBasis** — regulatory vs. institutional vs. commercial vs. conversational grounding (why “peanut-free kitchen” on a menu is not the same weight as a verified kitchen protocol).
- **A three-step translation framework** — characterize → map to evidence dimension → contribution to exposure state (then Phase 1 combines multiple acts conservatively).
- **Mapping table** — common restaurant patterns illustrated (not claiming to list every phrase on earth).
- **Worked examples** — multi-sentence / multi-signal cases (e.g., marketing claim vs. institutional confirmation; disclaimer overriding a clean-looking list).
- **Explicit non-goals** — Phase 2 is **additive**; it does **not** rewrite Phase 1 logic or the safety gate.

### Why it matters for ontology development

This is what makes the research **operationally relevant**: it connects **messy human communication** to a **structured risk model**. It also protects future engineering: **labeling norms can change** without forcing a rewrite of the core exposure math—because the **layers are separated on purpose**.

---

## 9. What Exists Beyond the Five Deliverables (Context Only)

These items help the story but are **not** the R3.1–R3.5 documents:

| Artifact | Role |
|----------|------|
| `ontology_research_roadmap.md` | Explains **Phases 3–4** next: experiments on whether grounding in this ontology reduces unsafe AI answers; formal RDF-style implementation layers. |
| `sprint2_trackb_retrospective.md` | Explains **process, tradeoffs, and sequencing** (good for “how we worked” slides). |
| `ontology/README.md` | Earlier **learning-focused** repo note; the **NomNomSafe research track** evolved into the formal phased deliverables above—do not confuse the README’s “exploratory / no deliverables” tone with the completed R3 work. |

---

## 10. Suggested Slide Themes for a Non-Technical Deck (Optional)

1. **The human problem** — allergies + menus + kitchens = high stakes + noisy information.  
2. **The AI problem** — fluent language without a **required evidence checklist** can **sound safe too soon**.  
3. **Phase 0** — we studied failures and turned them into **named patterns** (R3.1) and **required evidence steps** (R3.2).  
4. **Phase 1** — a **simple core model** of exposure + a **strict safety gate** (R3.3), **proven on stories** (R3.4).  
5. **Phase 2** — **words become evidence** with explicit scope and trust level (R3.5).  
6. **What’s next** — experiments and formal encoding (roadmap Phases 3–4), still grounded in the same safety philosophy.

---

## 11. Glossary (Short)

| Term | Plain meaning |
|------|----------------|
| **Exposure state** | A label for “how this allergen relates to this dish” given current evidence. |
| **Confirmed absent** | “We actively checked the real pathways”; the only state that supports “safe.” |
| **Unknown** | “We have not completed the checks”; **not** “probably fine.” |
| **Cross-contact** | Allergen introduced by **shared** equipment/environment, not as an intended ingredient. |
| **Preparation context** | Risks implied by **how** something is cooked or finished, not only what is listed. |
| **Epistemic** | About **what we know and how we know it**—confidence, source, and scope of a claim. |

---

## 12. File Quick Reference

| ID | Deliverable | Path under `ontology/jeff-perdue/deliverables/` |
|----|-------------|---------------------------------------------------|
| R3.1 | Allergen Safety Failure Taxonomy | `phase_0/allergen_safety_failure_taxonomy.md` |
| R3.2 | Structural Evidence Requirements | `phase_0/structural_evidence_requirements.md` |
| R3.3 | Core Exposure-State Ontology | `phase_1/core_exposure_state_ontology.md` |
| R3.4 | Scenario Test Suite | `phase_1/scenario_test_suite.md` |
| R3.5 | Phase 2 Epistemic Extension | `phase_2/phase2_epistemic_extension.md` |

---

*Document generated to support presentation planning; it summarizes the roadmap, sprint retrospective, and deliverable contents as of the Sprint 2 Track B scope.*
