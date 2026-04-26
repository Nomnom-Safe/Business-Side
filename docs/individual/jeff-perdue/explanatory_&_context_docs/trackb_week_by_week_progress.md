# Sprint 2 — Track B Retrospective
## Food Allergen Ontology Research (Phases 0–2)

**Project:** NomNomSafe
**Sprint:** 2 (Weeks 10–15, 3/16–4/26/2026)
**Author:** Jeff Perdue
**Track:** B — Ontology Research

---

## Overview

Track B of Sprint 2 was scoped to complete ontology research Phases 0 through 2, producing five deliverable documents (R3.1–R3.5) mapped to the semester Feature 3 requirements. All five deliverables were completed. This document provides a comprehensive account of what was produced in each phase, what decisions were made and why, what tradeoffs were considered, and the state of the research after each week's work.

The five deliverables produced are:

| Requirement | Deliverable | File |
|---|---|---|
| R3.1 | Allergen Safety Failure Taxonomy | `allergen_safety_failure_taxonomy.md` |
| R3.2 | Structural Evidence Requirements | `structural_evidence_requirements.md` |
| R3.3 | Core Exposure-State Ontology | `core_exposure_state_ontology.md` |
| R3.4 | Scenario Test Suite | `scenario_test_suite.md` |
| R3.5 | Phase 2 Epistemic Extension | `phase2_epistemic_extension.md` |

All files are located at `docs/individual/jeff-perdue/ontology/`.

---

## Week 10 (3/16–3/22) — Phase 0 Data Collection

### Sprint Plan Goal
Begin Phase 0: collect 20–30 allergen-related prompts across diverse scenarios and run them against baseline LLMs, recording raw responses.

### What Was Done

Phase 0 — Failure & Evidence Analysis — was designed as the empirical foundation of the entire research track. Its purpose was to understand how current AI systems fail when reasoning about allergen safety, so that Phase 1 could be designed to solve a specific and well-grounded problem rather than a hypothetical one.

Twenty-eight prompts were designed across four hypothesized failure categories:

- **Category 1 — Overconfident Safety (OCS):** Prompts 1–6. Designed to test whether models would assert safety on insufficient evidence, particularly when a question presented a positive claim as its premise.
- **Category 2 — Omission-as-Absence (OAA):** Prompts 7–12. Designed to test whether models would treat the absence of an allergen mention as evidence of absence.
- **Category 3 — Cross-Contact Blindness (CCB):** Prompts 13–19. Designed to test whether models would recognize shared equipment and kitchen environment as independent allergen introduction pathways.
- **Category 4 — Preparation-Context Blindness (PCB):** Prompts 20–28. Designed to test whether models would identify allergen risk embedded in cooking method and culinary convention rather than ingredient listing.

The prompts were run against two LLMs. The sprint plan had originally specified OpenAI models, but the models initially planned were unavailable at the time of testing. The tests were conducted using **Gemini 3 Fast** (via AI Studio) and **GPT-5.3 Instant** (via ChatGPT) as the two comparison models. This was a pragmatic substitution — availability drove the decision — but both models are capable, recent systems whose performance is analytically meaningful.

All 28 responses were annotated using a structured failure flag system:
- `[OCS]` Overconfident Safety Claim
- `[OAA]` Omission-as-Absence
- `[CCB]` Cross-Contact Blindness
- `[PCB]` Preparation-Context Blindness
- `[AU]` Acknowledged Uncertainty
- `[SAFE]` No failure observed

The full annotation log was recorded in `phase0_annotation_failure_notes.txt`, covering all 28 prompts with summaries, flags, and failure notes for both models.

### Key Findings from Data Collection

**Finding 1:** Both models were well-calibrated on explicit uncertainty signals. When questions framed the scenario around obvious gaps or missing information, both models avoided all four failure categories without exception.

**Finding 2:** Gemini 3 Fast produced two OCS failures — Prompts 17 and 18 — both sharing the same structural pattern: the question presented a positive claim rather than an explicit gap, and Gemini conditionally accepted the framing before qualifying it. GPT-5.3 Instant produced zero failures across all 28 prompts.

**Finding 3:** GPT-5.3 Instant produced consistently cleaner epistemic framing throughout. Several of its phrasings mapped directly onto ontology concepts that had not yet been defined: "treat 'not listed' as 'unknown,' not 'safe'" (Prompt 7), "you're really evaluating process, not ingredients" (Prompt 11), "don't ask if it's labeled gluten-free — ask how it's prepared" (Prompt 14), and "a naked burger solves the ingredient problem, but not the kitchen problem" (Prompt 27).

**Finding 4 — Most important:** The structural gap is not knowledge, it is constraint. Both models know the relevant allergen risks. Neither has a formal mechanism requiring evidence sufficiency before permitting a safety inference. This finding became the central justification for the Phase 1 ExposureState framework.

### Status at End of Week 10

Phase 0 data collection was complete. All 28 prompts had been run, all responses had been annotated, and the five key findings had been identified. The two deliverable documents (R3.1 and R3.2) had not yet been drafted — that work was scoped for Week 11. The raw data and annotation log were in hand and ready for analysis.

---

## Week 11 (3/23–3/29) — Phase 0 Deliverables

### Sprint Plan Goal
Complete Phase 0: categorize all LLM failures into the taxonomy and produce R3.1 (Allergen Safety Failure Taxonomy) and R3.2 (Structural Evidence Requirements).

### What Was Done

#### R3.1 — Allergen Safety Failure Taxonomy

The taxonomy document required a significant framing decision before drafting could begin: three of the four failure categories — OAA, CCB, and PCB — produced zero failures in the Phase 0 dataset. Both models handled every prompt in those categories correctly. The question was how to write taxonomy sections for failure modes that the data didn't actually show.

Two options were considered:

- **Option A — Definitional:** Define what each failure mode is and what it would look like, using the prompts as illustrations of the risk scenario rather than documented failures. Honest to the data, but establishes the categories for future phases.
- **Option B — Prospective risk framing:** Frame the clean results as prompt-dependent rather than model-general. The models avoided these failures because the prompts made the inference gap explicit — a production system cannot rely on that mechanism.

**Option B was chosen.** The reasoning: clean results on well-formed, explicit prompts are not evidence that the failure modes don't exist. They are evidence that good prompt framing suppresses them. A production allergen safety system cannot rely on prompt quality as its safety mechanism. This framing also set up R3.2 cleanly — the structural evidence requirements aren't just "what was missing from failures" but "what's required to make the system safe regardless of how the question is asked."

The document was structured in prose throughout — no bullet points — consistent with the prose rationale format established as the preferred style for all research deliverables. Sections covered: Introduction (establishing the constraint gap finding), one section per failure category (definition, evidence from the dataset, analytical implication), and a summary section with the failure flag results table and the five key findings.

The two OCS failures were treated as a documentable pattern rather than isolated incidents. The shared structural feature — positive-claim framing producing conditional safety acceptance — is what makes them analytically useful. The GPT-5.3 quote from Prompt 27 ("a naked burger solves the ingredient problem, but not the kitchen problem") was used as a conceptual anchor in the PCB section.

#### R3.2 — Structural Evidence Requirements

R3.2 was drafted to answer the follow-on question that Finding 5 demanded: what structured knowledge would have prevented each failure? The document connected each of the four failure categories to a specific missing ontological node, named the reasoning requirement that node would enforce, and explained why natural language reasoning alone cannot substitute for it in a production system.

A key architectural decision in R3.2 was to close the document with a synthesis section laying out the complete four-step evidence pathway: ingredient composition assessment (prevents OAA), CrossContactSource assessment (prevents CCB), PreparationContext evaluation (prevents PCB), and Safety Inference Gate (prevents OCS). This synthesis section effectively produced a functional specification for what Phase 1 needed to build, making R3.2 a direct justification for Phase 1 rather than just a retrospective on Phase 0.

R3.2 also incorporated the four quotes from the GPT-5.3 Instant annotation data as natural language expressions of the ontology concepts they mapped onto — each quote used once, anchoring the specific section it was most relevant to.

### Status at End of Week 11

Phase 0 was fully complete. R3.1 and R3.2 were drafted, reviewed, and finalized. Both documents were ready to be placed in the project file structure. The five key findings were documented, the four failure categories were formally defined, and the structural evidence requirements had produced a clear specification for Phase 1. The research track was on schedule.

---

## Week 12 (3/30–4/5) — Phase 1 Draft Begun

### Sprint Plan Goal
Begin Phase 1: draft the Core Exposure-State Ontology defining FoodItem, Ingredient, Substance, Allergen, PreparationContext, CrossContactSource, and ExposureState, and write the Safety Inference Principle.

### What Was Done

#### R3.3 — Core Exposure-State Ontology (Drafted and Completed)

The sprint plan scoped Phase 1 as a draft begun in Week 12 and completed in Week 13. In practice, the planning and drafting work moved quickly enough that R3.3 was completed in this phase rather than carried over.

Before drafting began, one significant design decision was worked through: the **Modification Request Rule**. The Phase 0 data had surfaced two clear cases — pan-seared scallops (Prompt 25) and risotto (Prompt 26) — where a diner's proposed modification ("leave off the butter," "make it dairy-free") addressed only the ingredient-composition dimension while leaving the PreparationContext dimension unresolved. This was a real, empirically grounded gap in the exposure logic that wasn't anticipated in the roadmap.

The question was whether to include it in R3.3 or hold it for the test suite to surface and address in a revision. The tradeoffs were:

- **Including it in R3.3:** Defensible because it was grounded in Phase 0 data, not speculation. Makes R3.3 more complete as a standalone document. Risk: committing a rule before the test suite has stress-tested it.
- **Holding it for R3.4:** Keeps R3.3 tight and minimal; the test suite produces a concrete evaluated case before the rule is formalized. Risk: leaves a genuine gap in the core ontology document.

**The decision was to include it in R3.3**, flagged explicitly as a rule that the test suite is designed to validate. This was the right call because the empirical grounding was sufficient and because leaving it out would have created a hole in the ontology that anyone applying the framework to modification scenarios would immediately encounter.

The Modification Request Rule as formalized: a modification request that does not alter the PreparationContext dimension does not change ExposureState. A modification can only move ExposureState toward ConfirmedAbsent when it resolves all three evidence dimensions — ingredient composition, CrossContactSource, and PreparationContext — and the kitchen has confirmed execution. A recorded request without kitchen confirmation is evidence of intent, not evidence of outcome.

The full R3.3 document was structured in six parts:

- **Part 1 — Core Concepts:** Definitions of all seven Phase 1 nodes, written with precision about what each concept captures and why it exists as a distinct node.
- **Part 2 — Exposure States:** Definitions of all four ExposureState values, with emphasis on ConfirmedAbsent as an affirmative finding in the negative — not the absence of evidence of presence, but the presence of evidence of absence across all three dimensions.
- **Part 3 — Exposure Logic:** Five ordered rules for determining ExposureState, including state precedence rules and the Modification Request Rule. Rules are evaluated in order; the first matching condition determines the state; the most conservative applicable state always wins.
- **Part 4 — Safety Inference Principle:** The gate that connects ExposureState to safety conclusions. ExposureState = ConfirmedAbsent is the only state that permits a positive safety inference.
- **Part 5 — Relationship to Phase 0 Findings:** Maps each of the four failure categories to the specific ontology node that closes it, making R3.3 explicitly traceable back to R3.1 and R3.2.
- **Part 6 — Scope and Limitations:** Defines what the ontology does not attempt, and explicitly names the Phase 2 concepts to establish a clean handoff.

### Status at End of Week 12

R3.3 was complete, not merely drafted. Phase 1's primary conceptual document was finalized. The Modification Request Rule was incorporated with its empirical grounding documented. The research track was running slightly ahead of the sprint plan schedule, which created room for the R3.4 and R3.5 work in subsequent weeks.

---

## Week 13 (4/6–4/12) — Phase 1 Complete

### Sprint Plan Goal
Complete Phase 1: apply the ontology to 15–20 stress-test scenarios and produce the scenario test suite (R3.4) and remaining Phase 1 deliverables.

### What Was Done

#### R3.4 — Scenario Test Suite

Before designing the test cases, a format decision was made: structured fields with prose rationale per case, or purely structured test specification format. **Prose rationale format was chosen**, consistent with the style of R3.1 through R3.3. The reasoning: R3.4 functions as both a validation instrument and a research artifact, and prose rationale makes the analytical reasoning visible in a way that a structured format alone does not.

The suite was designed around two validation targets: justified inference is permitted when evidence is genuinely sufficient, and unjustified inference is blocked when the assessment is incomplete, when a plausible introduction pathway remains unresolved, or when allergen presence is confirmed. The distribution of outcomes was intentional: three permitted inferences and fifteen blocked. That ratio reflects the suite's primary job — stress-testing the blocking conditions, where safety failures occur — while the three permitted cases validate that the ontology doesn't over-block.

Eighteen scenarios were produced across six categories:

- **Category A — Simple Dishes with Complete Evidence (3 scenarios):** Baseline behavior; establishes that ConfirmedAbsent is correctly assigned when all three dimensions are cleared, and ConfirmedPresent is correctly assigned when presence is known.
- **Category B — Shared Fryer and Cross-Contact Cases (3 scenarios):** Validates CrossContactSource as a mandatory independent dimension. Includes a paired design — Scenario 4 (shared fryer, PotentiallyPresent) and Scenario 5 (dedicated fryer, ConfirmedAbsent) — to isolate exactly what changes the outcome.
- **Category C — Oil and Ingredient Ambiguity Cases (3 scenarios):** Validates handling of partially known ingredient compositions and the Unknown default state.
- **Category D — Bakery and Dessert Products (3 scenarios):** Validates behavior in high-complexity preparation environments with numerous undisclosed introduction pathways.
- **Category E — Modification Request Cases (3 scenarios):** Directly validates the Modification Request Rule, including both empirically grounded cases from Phase 0 (scallops and risotto). Paired design: Scenario 13 (insufficient modification) and Scenario 14 (confirmed full modification) isolate the difference between a recorded request and a confirmed execution.
- **Category F — Missing Preparation Context Cases (3 scenarios):** Validates Unknown assignment when evidence is incomplete and that commercial labels (vegan, all-natural) do not substitute for completed evidence pathways.

The summary section closed with an explicit Phase 1 validation statement: justified inference is permitted and unjustified inference is blocked consistently across the full scenario set. This functions as a formal phase gate — a documented record that Phase 1 conditions were met before Phase 2 began.

**Note on the draft backend-friendly output structure:** The Phase 1 roadmap listed this as a deliverable alongside the ontology document and test suite. It was not included in the semester requirements (R3.1–R3.5) and was not produced this sprint. It remains an open item to be addressed before Phase 4 formalization work begins.

### Status at End of Week 13

Phase 1 was fully complete. R3.1 through R3.4 were all finalized. The ontology was defined, stress-tested, and validated. The Modification Request Rule was integrated and validated through two dedicated test scenarios. The research track had completed its Phase 0 and Phase 1 scope with one week to spare before the Phase 2 deliverable was due.

---

## Week 14 (4/13–4/19) — Phase 2

### Sprint Plan Goal
Phase 2 — Epistemic Extension: model how allergen risk is communicated; add Mention, Omission, Disclaimer, RoleType, CertaintyLevel, and Scope to the ontology; map real-world menu language patterns onto exposure states.

### What Was Done

#### R3.5 — Phase 2 Epistemic Extension

Phase 2 required significant upfront planning before drafting. The roadmap named six concepts (Mention, Omission, Disclaimer, RoleType, CertaintyLevel, Scope) and a seventh — Purpose — without defining it clearly. Each of the three most structurally complex concepts required an explicit design decision before the document could be written.

**RoleType decision:** Three options were evaluated.

- Option A — Binary (Ingredient vs. Flavor): Too coarse to support the Modification Request Rule. A garnish and a structural emulsifier are both "ingredient references" under a binary system, but they have completely different implications for whether a modification resolves the PreparationContext dimension.
- Option B — Three-Value (Structural, Incidental, Flavor): Connects directly to the Modification Request Rule. Structural ingredients are embedded in preparation method and cannot be removed by a simple modification. Incidental ingredients are present but removable without altering the preparation. Flavor references may or may not indicate actual allergen presence.
- Option C — Four-Value (adds Marketing): Captures the "whipped with olive oil" pattern from Phase 0 but introduces definitional fuzziness between Incidental and Marketing.

**Option B was chosen.** The direct connection to the Modification Request Rule was the decisive factor — it means Phase 2 RoleType and Phase 1's Modification Request Rule are mechanically linked, making the full framework internally coherent.

**Scope decision:** Three options were evaluated.

- Option A — Metadata Tag Only: Scope identifies the level of a claim but doesn't affect ExposureState. Loses the distinction between a dish-level absence claim and a kitchen-level absence claim, which carry different evidential weight for different evidence dimensions.
- Option B — Scope as ExposureState Modifier: Scope maps directly onto the three Phase 1 evidence dimensions. Dish-level → ingredient composition. Kitchen-level → CrossContactSource. Facility-level → supplier risk outside kitchen control.
- Option C — Hierarchical Scope with Inheritance: Kitchen-level claims inherit downward to dish level. Conceptually accurate but operationally complex and potentially error-prone.

**Option B was chosen.** Mapping Scope directly onto the Phase 1 evidence dimensions keeps Phase 2 structurally connected to Phase 1 rather than introducing a parallel reasoning layer. It also makes the framework's behavior predictable: you always know which evidence dimension a communication act is addressing based on its Scope.

**CertaintyLevel decision:** Three options were evaluated.

- Option A — Three-Level (High, Medium, Low): Too coarse; a regulatory label and a chef's direct confirmation are both "high" but carry different institutional weight.
- Option B — Four-Value Mapped to ExposureState Transitions (Verified, Asserted, Implied, Disclaimed): Each level is defined by its effect on ExposureState assignments. Verified supports ConfirmedAbsent or ConfirmedPresent. Asserted contributes to evidence pathway construction but is insufficient alone for ConfirmedAbsent. Implied flags plausible pathways without resolving them. Disclaimed maps to PotentiallyPresent and blocks ConfirmedAbsent for the relevant dimension.
- Option C — Source-Type Classification (Regulatory, Institutional, Staff Verbal, Menu Language): More objectively assignable than a certainty scale. Could be combined with Option B.

**Option B was chosen**, with the observation that DeclarationBasis (see below) captures the source-type dimension separately, meaning Option B and Option C can coexist — DeclarationBasis identifies the source type, and CertaintyLevel captures the epistemic weight that source type confers.

**Purpose / DeclarationBasis decision:** The roadmap listed "Purpose" as a Phase 2 concept without defining it. It was identified as semantically ambiguous — "purpose" in English can mean intent, function, goal, or reason, none of which precisely captures what the concept needs to represent. Four alternatives were evaluated:

- **DisclosureType:** Precise in food safety contexts but doesn't cover all communication acts — a menu description isn't a disclosure.
- **CommunicationRole:** Broad enough to cover all acts but risks confusion with RoleType, which is already defined.
- **StatementIntent:** Precise but implies knowable intent, which may not always be determinable from the statement itself.
- **DeclarationBasis:** Captures the institutional grounding of a claim — what the statement is made on the basis of, rather than why it was made in a motivational sense. Regulatory, Institutional, Commercial, Conversational.

**DeclarationBasis was chosen.** It is the most analytically precise option and does not overlap semantically with any other Phase 2 concept. Crucially, it connects directly to CertaintyLevel: the basis of a declaration is what determines the epistemic weight the system assigns to it. A Commercially grounded declaration carries Implied CertaintyLevel at best. A Regulatorily grounded declaration carries Verified or Asserted CertaintyLevel. DeclarationBasis is the mechanism by which the system knows which CertaintyLevel to assign when it isn't explicitly stated.

The decision was also made to include DeclarationBasis in R3.5 rather than set it aside. It fills a genuine gap in the communication layer — the intent vs. content vs. confidence dimensions of a communication act are all necessary for a complete characterization — and its inclusion makes the framework significantly more precise without adding structural complexity.

#### Document Structure

R3.5 was structured in six parts:

- **Part 1 — The Communication Act:** Establishes the communication act as the fundamental unit of Phase 2 analysis, giving all seven concepts a concrete subject to be properties of.
- **Part 2 — The Seven Phase 2 Concepts:** Definitions of all seven concepts — Mention, Omission, Disclaimer, RoleType, CertaintyLevel, Scope, DeclarationBasis — each written with sufficient precision to support unambiguous application.
- **Part 3 — The Translation Framework:** A three-step process for translating a communication act into an ExposureState contribution: characterize the act, map to an evidence dimension using Scope, determine ExposureState contribution using the combination of act type, RoleType, CertaintyLevel, and DeclarationBasis.
- **Part 4 — Communication Act Mapping Table:** Seventeen common real-world communication patterns mapped to their Phase 2 characterization and resulting ExposureState contribution. Explicitly illustrative rather than exhaustive.
- **Part 5 — Worked Examples:** Four complete worked examples showing how multiple communication acts combine to produce a final ExposureState determination. Cases chosen to validate: (1) that a marketing claim cannot substitute for an institutional one, (2) that justified inference is possible when all dimensions are genuinely cleared, (3) that a hedged verbal assurance does not advance the evidence pathway, and (4) that a Disclaimer overrides a clean ingredient list.
- **Part 6 — Relationship to Phase 1 and Forward Compatibility:** Bridges to Phases 3 and 4, explicitly stating that Phase 2 is additive — it does not modify the Phase 1 exposure logic or Safety Inference Principle.

### Status at End of Week 14

All five semester deliverables — R3.1 through R3.5 — were complete. Phase 0, Phase 1, and Phase 2 of the research roadmap were fully documented. The research track finished on schedule with one week remaining before the sprint close.

---

## Week 15 (4/20–4/26) — Sprint Close

### Sprint Plan Goal
Post-celebration documentation; sprint retrospective.

### Track B Status at Sprint Close

Track B delivered all five Feature 3 requirements within the sprint window. The full research arc from empirical failure analysis (Phase 0) through core ontology definition (Phase 1) through communication layer modeling (Phase 2) is documented in a cohesive, traceable set of five documents. Each deliverable builds directly on the previous, and the document set as a whole constitutes a self-contained research artifact that can support both academic presentation and the Phase 3 and Phase 4 work planned for future sprints.

---

## Open Items and Forward Considerations

**Draft backend-friendly output structure:** Listed in the Phase 1 roadmap deliverables but not captured in the semester requirements. Not produced this sprint. This remains an open item before Phase 4 formalization work begins. It should define how ExposureState assessments are represented as structured JSON or similar format for consumption by the NomNomSafe backend.

**Phase 3 — LLM Grounding & Evaluation:** The next phase of the research roadmap. Scoped to empirically test whether ontology-grounded reasoning reduces unsafe LLM behavior by comparing baseline LLM responses against ontology-informed responses. The Phase 2 translation framework is the input mechanism for ontology-grounded reasoning in Phase 3 experiments.

**Phase 4 — Formalization & Layered Implementation:** Formalizes the ontology using a layered architecture including configuration, description, and RDF layers. The Phase 2 concepts and their relationships to Phase 1 nodes will need to be represented in an RDF-compatible format.

**Modification Request Rule — continued stress testing:** The rule was incorporated into R3.3 on the basis of two Phase 0 cases and validated through three R3.4 test scenarios. As the framework is applied to more complex modification scenarios in Phase 3, additional edge cases may surface that require rule refinement. The most likely complexity: partial modifications that address some but not all introduction pathways, and kitchen confirmation protocols that confirm some dimensions but not others.

---

## Deliverable Summary

| Requirement | Deliverable | Phase | Status |
|---|---|---|---|
| R3.1 | Allergen Safety Failure Taxonomy | 0 | Complete |
| R3.2 | Structural Evidence Requirements | 0 | Complete |
| R3.3 | Core Exposure-State Ontology | 1 | Complete |
| R3.4 | Scenario Test Suite (18 scenarios) | 1 | Complete |
| R3.5 | Phase 2 Epistemic Extension | 2 | Complete |
