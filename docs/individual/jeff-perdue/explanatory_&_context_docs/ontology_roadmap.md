# Food Allergy Ontology Research Roadmap  
## Building a Structured Exposure-State Framework for AI-Safe Allergen Reasoning

---

## 1. Why This Research Exists

The long-term goal of this research is to build:

> A structured model of allergen risk that improves how AI systems reason about food safety — while also serving as the foundation for real-world applications such as NomNomSafe.

This is not just about listing allergens.

It is about solving a deeper problem:

Large language models often make unsafe or overconfident assumptions about allergen safety because they lack structured knowledge about how allergen exposure actually works.

For example:

- “It doesn’t list peanuts, so it must be safe.”
- “The menu mentions nuts in one item, but not this one, so this one is safe.”
- “It’s grilled, so cross-contact probably isn’t an issue.”

These inferences may sound reasonable, but they are not structurally justified.

This research aims to design a formal system that:

- Requires positive structural evidence before declaring something safe.
- Explicitly represents uncertainty when information is incomplete.
- Prevents AI systems from collapsing ambiguity into false confidence.

The result should be both:

- Publishable academic research.
- Practical reasoning infrastructure usable in applications.

---

## 2. Core Design Philosophy

This roadmap follows several guiding principles:

### Evidence-Based Safety

Safety should never be inferred from absence alone.  
It must require structural evidence.

### Practical First, Elegant Enough

Early phases prioritize testability and real-world scenarios over perfect formalism.

### Layer Separation

We clearly separate:

- Ontology Layer (what exists and how exposure works)
- Policy Layer (how conservative we choose to be in applications)

This protects both academic rigor and product flexibility.

### Graceful Handling of Incomplete Data

If detailed information exists → strong inference.  
If information is limited → structured uncertainty.

We do not collapse “unknown” into either “safe” or “unsafe.”

---

## 3. Roadmap Overview

The research proceeds in structured phases:

1. Phase 0 — Failure & Evidence Analysis  
2. Phase 1 — Core Exposure-State Ontology  
3. Phase 2 — Epistemic Extension (Communication Layer)  
4. Phase 3 — LLM Grounding & Evaluation  
5. Phase 4 — Formalization & Layered Implementation  

Each phase produces tangible artifacts and informs the next.

---

# Phase 0 — Failure & Evidence Analysis

### Objective

Understand how AI systems currently fail when reasoning about allergen safety and identify what structural knowledge is missing.

### Activities

- Collect 20–30 allergen-related prompts.
- Record LLM responses.
- Categorize failure types:
  - Overconfident safety claims
  - Ignoring preparation context
  - Assuming omission equals absence
  - Failing to model cross-contact
- Identify what structural evidence would have prevented each failure.

### Deliverables

- Allergen Safety Failure Taxonomy  
- Structural Evidence Requirements Document  

This phase clarifies what Phase 1 must structurally solve.

---

# Phase 1 — Core Exposure-State Ontology

This is the foundational phase.

### Objective

Create a minimal but expressive structural model that:

- Allows justified safety inference when sufficient evidence exists.
- Blocks unjustified inference when evidence is incomplete.
- Can be tested immediately in realistic scenarios.
- Is usable in backend systems.

---

## Core Concepts (v0.1)

We intentionally keep the model tight and understandable.

### FoodItem  
A prepared dish or product.

### Ingredient  
A component intentionally included in a FoodItem.

### Substance  
A physical material contained within an Ingredient.

### Allergen  
A type of Substance capable of causing allergic reaction.

### PreparationContext  
How the FoodItem is prepared, including equipment and environment.

### CrossContactSource  
Shared equipment or environmental source that may introduce allergens.

### ExposureState  
The modeled relationship between a FoodItem and a specific Allergen.

---

## Exposure States

For a given FoodItem and Allergen:

- ConfirmedPresent  
- ConfirmedAbsent  
- PotentiallyPresent  
- Unknown  

This allows nuance without excessive complexity.

---

## Conceptual Exposure Logic

For Allergen A:

1. If directly included → ConfirmedPresent  
2. Else if cross-contact possible → PotentiallyPresent  
3. Else if all introduction paths explicitly absent → ConfirmedAbsent  
4. Else → Unknown  

---

## Safety Inference Principle

A FoodItem may be inferred safe for Allergen A only if:

ExposureState(A) = ConfirmedAbsent

All other states block safety inference.

This prevents unjustified confidence.

---

## Stress Testing

The model is applied to 15–20 varied scenarios, including:

- Simple grilled dishes  
- Shared fryer cases  
- Oil ambiguity  
- Bakery products  
- “May contain” labels  
- Missing preparation context  

Phase 1 succeeds when:

- Justified safety inference works.
- Unjustified inference is blocked.
- The model remains stable and explainable.

---

## Phase 1 Deliverables

- Conceptual ontology document  
- Exposure-state framework  
- Safety inference principle  
- Scenario test suite  
- Draft backend-friendly output structure  

---

# Phase 2 — Epistemic Extension (Communication Layer)

### Objective

Model how allergen risk is communicated and how language maps onto structural exposure states.

This layer captures ambiguity explicitly.

---

## Added Concepts

- Mention  
- Omission  
- Disclaimer  
- RoleType (ingredient vs flavor reference)  
- CertaintyLevel  
- Scope  

---

## Purpose

Translate menu language and labeling into structural exposure states.

Examples:

- Explicit ingredient listing → ConfirmedPresent  
- Omission → Unknown  
- “May contain” → PotentiallyPresent  

This layer bridges real-world structure and communication.

---

# Phase 3 — LLM Grounding & Evaluation

### Objective

Empirically test whether ontology-grounded reasoning reduces unsafe LLM behavior.

---

## Experimental Approach

Compare:

- Baseline LLM responses  
- Ontology-informed responses  

Measure:

- Reduction in unjustified safety claims  
- Reduction in overconfidence  
- Proper handling of uncertainty  
- Correct inference when evidence exists  

---

## Deliverables

- Experimental results  
- Evaluation protocol  
- Publishable findings  

---

# Phase 4 — Formalization & Layered Implementation

### Objective

Implement the ontology using a layered abstraction approach.

This includes:

- Configuration layer (reusable exposure patterns)  
- Description layer (human-readable scenarios)  
- RDF layer (machine-readable ontology)  
- Validation constraints  

This aligns with a multi-layer ontology methodology.

---

# What Exists at the End

At the conclusion of this roadmap, we will have:

- A principled exposure-state ontology  
- An epistemic communication extension  
- A formal machine-readable implementation  
- Empirical validation of improved AI reasoning  
- Backend-ready reasoning infrastructure suitable for NomNomSafe  

This is both a research contribution and practical foundation.

---

# What This Research Does Not Attempt

- Full biochemical modeling  
- Regulatory compliance automation  
- A finished SaaS product  
- Universal food science ontology  

It builds foundational reasoning infrastructure.

---

# Closing Framing

This research is not about creating a static allergen list.

It is about designing:

> A structured model of evidence sufficiency that constrains AI reasoning under uncertainty in allergen-sensitive contexts.

It is intentionally:

- Incremental  
- Distinction-driven  
- Concept-first  
- Tool-later  
- Practical but principled  

If executed carefully, it can contribute to academic discourse while powering real-world systems that help prevent dangerous assumptions about food safety.