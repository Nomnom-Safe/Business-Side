---
marp: true
theme: default
paginate: true

---

## Spring 2026 · Jeffrey Perdue

# Learning With AI
How AI helped me with my learning topics | How I use AI today



---
<!-- _class: light -->
<style scoped>section { font-size: 115%; }</style>

## Learning With AI Topics - Menu Import / Parsing

# Prompting AI to Understand How AI Fails

**The discovery:** When I asked LLMs to extract allergens from menu text,
they would often infer safety from absence — *"gluten not mentioned, so probably fine."*

**How I used AI to study this:**
- Generated a list of prompts who's goal was to surface AI assumptions
- Ran controlled prompts across four failure categories, asking the model to explain its reasoning
- Used AI to help articulate the patterns once spotted: *Omission-as-Absence*
- Asked for counterexamples and edge cases to test whether the pattern was structural, not just occasional

---

**The four failure modes that emerged:**
1. Overconfident Safety — asserts "safe for X" without evidence
2. Omission-as-Absence — treats no mention as confirmed absence ← the most dangerous
3. Cross-Contact Blindness — ignores shared equipment risk
4. Preparation-Context Blindness — ignores how a dish is cooked

**What I did with it:** encoded the constraints directly into the production system prompt, so the lesson from the research became a rule in the system.

---

<!-- _class: light -->

## Learning With AI Topics - Menu Import / Parsing

# The Critical Rule in the Prompt

AI's default behavior on allergens: *"not listed = probably safe."*
That's called **Omission-as-Absence** and it's wrong.

The fix lived in the system prompt itself:

> *"For `possible_allergens`, only include allergens that are explicitly stated
> in the source text. If allergen information is absent or ambiguous, return `[]`.
> Do NOT guess or assume based on ingredients."*

**Design principle:** AI suggestions are surfaced for human confirmation.
Nothing is saved without explicit review. "Unknown" is never collapsed to "safe."

---
<!-- _class: light -->
<style scoped>section { font-size: 115%; }</style>

## Learning With AI Topics - Ontology (Process)

# How AI Helps Me Solve the Problem

**My role:** define the problem, evaluate outputs, and decide what counts as valid evidence.

**AI's role:**
- Identify and categorize failure patterns across controlled prompts
- Generate counterexamples and edge cases that stress-tested my assumptions
- Help convert informal menu ambiguity into structured ontology concepts
- Rephrase technical ideas clearly so I could iterate faster and communicate better

**Process outcome:**
AI accelerated iteration, important to keep decision boundary: no rule was accepted without justification.

---
<!-- _class: light -->
<style scoped>section { font-size: 115%; }</style>

## Learning With AI Topics — Ontology (Outcome)

# Food Allergen Ontology · Evidence Before Safety

**What I built from that process:**
- Core entities: `FoodItem`, `Ingredient`, `Allergen`, `PreparationContext`, `CrossContactSource`
- Exposure states: `ConfirmedPresent`, `PotentiallyPresent`, `Unknown`, `ConfirmedAbsent`
- Scenario-based validation on ambiguous real-menu style cases

**Safety inference gate:** Infer "safe" **only if** `ExposureState = ConfirmedAbsent`. All other states block the inference.

**What this prevents:**
- "Not listed = safe" assumptions
- Ignoring shared equipment / cross-contact pathways
- Confident answers when evidence is incomplete

---


# The AI Tools I Use and Their Primary Personal Use Cases

| Tool | Share | Primary Use |
|---|---|---|
| **Claude** | ~65% | Primary reasoning & validation, idea refinement, code review via Cursor/Sonnet, first stop for LLM output checks |
| **ChatGPT** | ~15% | Large-context project files, initial reasoning partner, high file-size document work |
| **NotebookLM** | ~10% | Research synthesis, audio overview / podcast generation |
| **Gemini / Perplexity / etc.** | ~10% | Image creation, research verification, specialized micro-tools |

---
<style scoped>section { font-size: 115%; }</style>

# How My Coding Sessions Evolved

| Stage | When | What Changed |
|---|---|---|
| 1 — One-Shot | Spring '25 | "Implement X." Pure vibe coding. |
| 2 — + Requirements | Summer '25 | SRS doc first, then implement with it as context. |
| 3 — + Design Review | Fall '25 | SOLID & GoF check before coding. Two or more LLMs debate the approach. |
| 4 — + Edge Cases | Winter '26 | Critical edge-case analysis and self-debugging. |
| **5 — + Narrow scope considerably per "prompt"** | **Spring '26** | **Single-function scope. Precision over breadth.** |

---
<!-- _class: light -->


# A Typical Session Loop

1. **Get the concept** — Definition + concrete example. No abstract, nebulous, or formal rules without worked cases first.
2. **Ask lots of questions, adjusting scope as needed** — "Show me step-by-step." "What law is used here?" Demand granularity until you truly comprehend.
3. **Stress test it** — "Why isn't this the same as X?" "What are the edge cases?" "What are other alternatives and why did you not choose them?" Try to make it fail.
4. **Extract the pattern** — "When do I use this?" "When should I avoid this?" Build the decision rule, instead of a solution in isolation.
5. **Take comprehensive notes** — Flashcards / Notion blocks. Documentation-driven retention combined with spaced repetition.

---
<!-- _class: light -->

# How I Stay Calibrated

- **Verify before I trust** — Cross-check non-trivial outputs against docs, a second model, or your own reasoning before acting on them.
- **Start fresh when the conversation drifts** — Long sessions degrade. When responses get vague, a new conversation with clean context usually fixes it faster than correcting course.
- **Front-load context** — The more relevant context you give upfront (what I'm building, what I tried, your constraints), the less time wasted on generic answers.
- **Ask it to justify its choices** — "Why this approach and not X?" if familiar with alternatives.
---
<!-- _class: light -->

# Personal Takeaways / Best Practices

- **Always ask for examples / use cases first** — Don't move on from an explanation until you've seen it applied to something real. Examples make abstract ideas stick.
- **Say it back / type it out in your own words** — After getting an explanation, try to summarize it yourself. If you struggle, you probably need another pass at it.
- **Use structure** — Having a clear set of steps &/or clear context to follow gets you further much faster than open-ended tinkering. 
- **Write things down as you learn them** — You'll remember more if you capture the idea somewhere while it's fresh, rather than trusting you'll recall it later.
- **Design as big as you need/want, but start small** — Picking a narrow, specific thing to build teaches you more than trying to build something big all at once.
