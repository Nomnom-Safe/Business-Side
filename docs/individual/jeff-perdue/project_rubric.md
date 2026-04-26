---
marp: true
size: 4:3
paginate: true
title: Final Project Rubric
---

# Final Project Rubric

- This is a **self-evaluation** rubric. Evaluate yourself as a professional problem solver.
- **Note:** This rubric covers the 700-point self-evaluation portion and the 100-point evaluation of peers. HW (200 points) is graded separately.
- All-or-nothing grading for each item (No partial points)
- Make sure to change the rubric file name correctly before submission
- Make sure you fill in all the (?) or ? marks with correct information
  - Use (V) for OK and (X) for not OK

---

## Information

- Name: Jeffrey Perdue
- Email: perduej7@nku.edu

---

## Summary

- One-line description of your project (focus on the problem you solved): NomNomSafe solves unsafe, error-prone restaurant menu/allergen management by combining reliable business workflows with evidence-based allergen reasoning.
- Why solving this problem is important: Allergen miscommunication can cause severe harm or death for individuals with food allergies; accurate, human-confirmed allergen data on menus is both an ethical and legal requirement for food businesses.
- Your approach/solution: Delivered a two-track solution: (1) a stable business MVP extended with AI-assisted menu import plus mandatory human allergen confirmation, and (2) a formal ontology that defines when allergen-safety inferences are justified, validated through structured scenarios.
- Technology stack used: React, Node.js/Express, Firebase, Gemini API (swappable LLM provider abstraction)
- Your two Learning with AI topics:
  - Topic 1: AI-assisted structured data extraction from unstructured text
  - Topic 2: Ontological modeling for safety-critical inference
- Link to your Canvas page: https://nku.instructure.com/courses/87393/pages/individual-progress-jeffrey-perdue-2
- Link to your GitHub repository: https://github.com/Nomnom-Safe/Business-Side

For Grading 1 & 2, you self-evaluate your problem definitions & solutions uploaded to GitHub & Canvas pages.

---

## Grading 1 - Project (500 points total)

### 1.1 Solving Problems (100 points)

#### Problem Domain (50 points)

* Use the answer for your resume
* Use this question/answer format for your future problem-solving

- (V) I clearly defined the problem I am solving.
- (V) I explained why this problem is important to solve.
- (V) My problem definition is accessible to my managers via Canvas or GitHub.

Describe your problem domain in your own words:
Restaurants need to keep menu and allergen data accurate, but updates are frequent and usually manual across messy sources (files, URLs, inconsistent menu language). That creates safety risk when missing or unclear allergen info is treated as “safe.” Over the semester, the core problem stayed the same across both tracks: build a practical system for reliable menu management (Sprint 1 foundation + Sprint 2 AI-assisted import) while also defining a formal reasoning model so allergen safety conclusions are made only when evidence is sufficient, not assumed.

**Grading Scale:**
- 90–100%: I am confident that I clearly defined a meaningful problem and convincingly explained its importance; my managers can easily find and understand it.
- 70–89%: I defined the problem and explained its importance, but some parts could be clearer or more accessible to my managers.
- 50–69%: I attempted to define the problem, but the definition is vague or the importance is not well explained.
- 30–49%: My problem definition is incomplete or unclear, and my managers would struggle to understand it.
- 0–29%: I did not define the problem, or the definition is missing entirely.

**Points in Percentage**: (100)/100%
**Points:** (50)/50

---

#### Solution Domain (50 points)

* Use the answer for your resume
* Use this question/answer format for your future problem-solving

- (V) I clearly described my proposed solution.
- (V) I explained how my solution addresses the problem.
- (V) My solution design is documented and accessible to my managers.

Describe your solution domain in your own words:
Delivered a two-track solution: (1) a stable business MVP extended with AI-assisted menu import plus mandatory human allergen confirmation, and (2) a formal ontology that defines when allergen-safety inferences are justified, validated through structured scenarios.

**Grading Scale:**
- 90–100%: I am confident that I proposed a well-designed solution that clearly addresses the problem; it is fully documented and accessible.
- 70–89%: I described a reasonable solution and how it addresses the problem, but documentation or accessibility could be improved.
- 50–69%: I described a solution, but the connection to the problem is weak, or the documentation is incomplete.
- 30–49%: My solution description is vague, and it is unclear how it solves the problem.
- 0–29%: I did not describe a solution, or the description is missing entirely.

**Points in Percentage**: (100)/100%
**Points:** (50)/50

---

### 1.2 Implementation (200 points)

#### Technology Stack (50 points)

- (V) I clearly described the technology stack I used.
- (V) I explained why I chose this technology stack for this problem.
- The technology stack I used: React, Node.js/Express, Firebase, Gemini API (swappable LLM provider abstraction), pdf-parse, mammoth (DOCX), csv-parse, cheerio, multer, express-rate-limit

**Grading Scale:**
- 90–100%: I am confident that I clearly described the technology stack and provided a strong justification for why it was the right choice for my problem.
- 70–89%: I described the technology stack and gave a reasonable justification, but the reasoning could be more specific or thorough.
- 50–69%: I listed the technology stack, but the justification for choosing it is weak or missing.
- 30–49%: My technology stack description is incomplete or the choice seems unrelated to the problem.
- 0–29%: I did not describe the technology stack or it is missing entirely.

**Points in Percentage**: (100)/100%
**Points:** (50)/50

---

#### Usage of AI for Solving the Problem (50 points)

- (V) I used AI tools to assist in solving my problem.
- (V) I documented how I used AI in my implementation process.
- AI tools I used and how I used them: 
Gemini API (2.5 Flash): The core AI tool in the implementation. Menu text extracted from files/URLs is passed to the LLM with a structured prompt; the model returns a JSON array of menu items (name, price, description, ingredients, category, possible allergens). Model output is explicitly treated as untrusted: every response is validated, normalized, and gated behind human review before any data is saved.
LLM provider abstraction: Implemented a swappable provider layer so the AI backend (OpenAI or otherwise) can be changed without cascading changes to controllers or UI.
AI coding assistants (Cursor/Claude): Used during development for implementation guidance, code review, and documentation drafting — usage is reflected in the weekly recap documents.
Track B — AI as research context: The ontology for Track B formalizes how AI-generated allergen suggestions should be evaluated, which was itself informed by studying how LLMs express uncertainty and how to design human-in-the-loop confirmation safeguards.

**Grading Scale:**
- 90–100%: I am confident that I effectively used AI tools as a problem-solving assistant and thoroughly documented how AI contributed to my implementation.
- 70–89%: I used AI tools and documented their use, but the documentation could be more detailed or the usage more intentional.
- 50–69%: I used AI tools, but my documentation of how I used them is limited or unclear.
- 30–49%: I mention using AI, but there is little evidence of meaningful or documented usage.
- 0–29%: I did not use AI tools or there is no documentation of AI usage.

**Points in Percentage**: (100)/100%
**Points:** (50)/50

---

#### Demonstration Video (50 points)

- (V) I created a demonstration video clip showing my project results.
- (V) The video is accessible to my managers and the class.
- The link to my demonstration video: (https://youtu.be/MfqT1rB7Udw)

**Grading Scale:**
- 90–100%: I am confident that my demonstration video clearly shows working project results and is easily accessible to anyone.
- 70–89%: I created a demonstration video showing results, but it could be clearer or more complete in what it demonstrates.
- 50–69%: I created a video, but it is difficult to follow, incomplete, or hard to access.
- 30–49%: My video is very rough, does not clearly demonstrate results, or has accessibility issues.
- 0–29%: I did not create a demonstration video or the link is missing/broken.

**Points in Percentage**: (100)/100%
**Points:** (50)/50

---

#### Marp Presentation (50 points)

- (V) I created a Marp presentation PDF for my final presentation.
- (V) The presentation PDF is uploaded to GitHub and accessible to anyone.
- The link to my Marp presentation PDF: ?

**Grading Scale:**
- 90–100%: I am confident that my Marp presentation is professional, clearly communicates my project, and is publicly accessible on GitHub.
- 70–89%: I created a Marp presentation that covers the key points, but it could be more polished or better organized.
- 50–69%: I created a presentation, but it is missing important content or does not fully represent my project results.
- 30–49%: My presentation is incomplete, hard to follow, or not properly uploaded and accessible.
- 0–29%: I did not create a Marp presentation or the link is missing/broken.

**Points in Percentage**: (100)/100%
**Points:** (50)/50

---

### 1.3 Progress According to the Plan (200 points)

#### Weekly Updates (100 points)

- (V) I have regularly updated my individual progress on Canvas.
- (V) I have regularly updated my project artifacts (code, documents) on GitHub.
- (V) My weekly updates are clearly accessible by my managers.

Provide a brief summary of your weekly progress:

-Week 10 (Sprint 2 start): Finalized Sprint 2 scope and requirements. Decided on and implemented the swappable LLM provider architecture. Implemented menuParseService.js and scaffolded menuImportController.js.
-Week 11: Wired file-parsing libraries (pdf-parse, mammoth, csv-parse, multer). Implemented and tested POST /api/menu/import/file. Mounted menuImportRoutes.js. Fixed menuParseService env-init bug. Wired menuImportApi.importFile on the client.
-Week 12: Completed full import review/edit/select/save UX. Fixed PDF runtime compatibility issue (class-style vs. function-style pdf-parse export). Added allergen suggestion assist controls with R2.8 human-confirmation gating. Cleaned up save-result messaging. Fixed post-save menu context drift. Track B: Completed R3.3 core ontology (ahead of schedule) — ExposureState model, Safety Inference Principle, and Modification Request Rule finalized.
-Week 13: Robustness hardening pass — LLM timeout/retry, parse quality classification (ok/low/none), zero-valid-item dedicated error path, import rate limiting, stricter MIME/extension mismatch guard, structured telemetry. Regression suite confirmed no breakage. Track B: Completed R3.4 scenario test suite — 18 scenarios across 6 categories (3 inference-permitted, 15 blocked), Phase 1 fully validated.
-Week 14: UX polish — stage-based progress messaging, aria-live/aria-busy accessibility, improved error/fallback microcopy for all failure codes. Created week14_demo_validation_checklist.md and week14_tracka_known_limitations.md. Full manual regression (CRUD/search/filter/sort) and automated backend suite (67/67) passed. Track B: Completed R3.5 Phase 2 epistemic extension — Communication Act model, 7 new concepts (RoleType, Scope, CertaintyLevel, DeclarationBasis, etc.), translation framework, mapping table, worked examples. All R3.1–R3.5 deliverables complete.
-Week 15: Presentation at NKU Celebration of Research

**Grading Scale:**
- 90–100%: I am confident that I updated my progress and artifacts consistently every week; my managers could always track my work without asking.
- 70–89%: I updated my progress most weeks, but there were a few gaps or updates were not always detailed enough.
- 50–69%: I updated my progress, but updates were irregular, incomplete, or hard for managers to find.
- 30–49%: My updates were very infrequent and managers would have had difficulty tracking my progress.
- 0–29%: I did not provide regular updates or there are no visible updates on Canvas or GitHub.

**Points in Percentage**: (100)/100%
**Points:** (100)/100

---

#### Meeting Changes as a Professional Problem Solver (100 points)

- (V) When I encountered changes (scope, direction, technology), I updated my managers promptly.
- (V) I did not surprise my managers with unexpected changes at the end.
- (V) I demonstrated adaptability and professional problem-solving throughout the project.

Describe any significant changes you made during the project and how you handled them:
I made four major, communicated adjustments during the semester:
1) Scope-first in Sprint 1: archived non-MVP features early to stabilize core business workflows before expansion.
2) Track B acceleration in Sprint 2: ontology Phase 1 was completed earlier than planned, then validated with scenario testing before extending to Phase 2.
3) Quality pivot in Week 13: shifted from adding features to hardening reliability/security/observability after core import flow was working.
4) Week 14 scope freeze: stopped feature growth, documented known limitations, and focused on regression checks and demo readiness to avoid end-of-term surprises.

**Grading Scale:**
- 90–100%: I am confident that I handled all changes professionally; I communicated changes promptly and never surprised my managers.
- 70–89%: I communicated most changes in a timely manner, but there were minor instances where communication could have been earlier or clearer.
- 50–69%: I communicated some changes, but managers may have been surprised by some shifts in scope or direction.
- 30–49%: I made significant changes without properly informing my managers, creating confusion about my project status.
- 0–29%: I did not communicate changes to my managers or there is no evidence of professional adaptability.

**Points in Percentage**: (100)/100%
**Points:** (100)/100

---

## Grading 2 - Learning with AI (200 points)

### Topic 1 (100 points)

- Topic name: AI-Assisted Structured Data Extraction from Unstructured Text
- (V) I clearly explained what I learned from AI about this topic.
- (V) I interpreted the topic in my own words (not just copy-pasting from AI).
- (V) I created a Marp PDF slide for this topic.
- (V) The slide is publicly accessible (anyone can download it).
- The link to my Topic 1 Marp PDF slide: ?

What I learned and my interpretation:
LLMs are capable of extracting structured records (name, price, description, ingredients, allergens) from the kinds of messy, unformatted text that real-world menus contain — but this only works reliably if you treat the model output as untrusted input, not ground truth. The key insight from building Track A is that AI extraction and human safety confirmation are not competing approaches; they are complementary layers. The AI handles the tedious structuring work; the human confirms anything safety-critical before it is persisted. I also learned that the extraction pipeline needs explicit quality signals (not just success/fail) — a "low confidence" parse is actionable information for the user, not just a silent partial result. Wrapping the LLM in a swappable provider abstraction meant I was building against the concept of AI extraction, not a specific vendor, which is a pattern worth carrying forward.

**Grading Scale:**
- 90–100%: I am confident that I deeply understood the topic, expressed it in my own words, and created a clear, publicly accessible Marp slide that others can learn from.
- 70–89%: I explained the topic and created a slide, but the interpretation could be more original or the slide could be more polished and accessible.
- 50–69%: I covered the topic, but my explanation heavily relies on AI-generated text rather than my own interpretation.
- 30–49%: My explanation is superficial or mostly copied from AI with little evidence of personal understanding.
- 0–29%: I did not submit a slide or the explanation is missing entirely.

**Points:** (100)/100

---

### Topic 2 (100 points)

- Topic name: Formal Allergen Exposure State Ontology
- (V) I clearly explained what I learned from AI about this topic.
- (V) I interpreted the topic in my own words (not just copy-pasting from AI).
- (V) I created a Marp PDF slide for this topic.
- (V) The slide is publicly accessible (anyone can download it).
- The link to my Topic 2 Marp PDF slide: ?

What I learned and my interpretation:
This research taught me that "is this dish safe for someone allergic to X" is not a binary question answerable by automation alone — it is an inference problem with explicit evidence requirements. Building the ontology forced me to define what counts as evidence for an ExposureState and what gaps in evidence mean: not "safe" but "unknown." The Modification Request Rule was a specific insight — a patron asking to "remove the butter" does not change the safety inference until all evidence dimensions (preparation, cross-contact, execution confirmation) are resolved. Phase 2 extended this into the communication layer: a staff verbal declaration, a menu description, and a verified allergen label all contribute differently to evidence strength — I formalized this with CertaintyLevel and DeclarationBasis. The broader lesson is that safety-critical AI-adjacent systems need explicit reasoning rules, not just fuzzy pattern matching, and human confirmation must be architecturally enforced, not left as a UI option.

**Grading Scale:**
- 90–100%: I am confident that I deeply understood the topic, expressed it in my own words, and created a clear, publicly accessible Marp slide that others can learn from.
- 70–89%: I explained the topic and created a slide, but the interpretation could be more original or the slide could be more polished and accessible.
- 50–69%: I covered the topic, but my explanation heavily relies on AI-generated text rather than my own interpretation.
- 30–49%: My explanation is superficial or mostly copied from AI with little evidence of personal understanding.
- 0–29%: I did not submit a slide or the explanation is missing entirely.

**Points:** (100)/100

---

## Grading 3 - Evaluating Peers (100 points)

### Self-Evaluation as a Manager

- I am managing these three peers:
  - Student 1: Austin Shelton
  - Student 2: Dillon Carpenter
  - Student 3: Joseph Ampfer
  
- (V) I have kept track of my three peers' progress regularly throughout the project.
- (V) I monitored both their project results and progress reports on Canvas.
- (V) I will submit my peer evaluation using the peer evaluation rubric.
- (V) I will submit my peer evaluation before the deadline.
- (V) I understand that failure to submit peer evaluations may result in failure of this course.
- (V) I will evaluate my peers professionally, fairly, and honestly.

**Grading Scale:**
- 90–100%: I am confident that I actively tracked all three peers throughout the project and will submit a thorough, fair, and professional evaluation.
- 70–89%: I tracked my peers' progress for most of the project, but my monitoring was not fully consistent.
- 50–69%: I checked on my peers occasionally but did not maintain regular tracking throughout the project.
- 30–49%: I did minimal peer monitoring and my evaluation will be based on limited observation.
- 0–29%: I did not track my peers or I do not plan to submit the peer evaluation.

**Points:** (100)/100

---

## Total Self-Grading Summary

| Category                          | Points           | Comment |
| --------------------------------- | ---------------- | ------- |
| 1.1 Solving Problems              | ( (100) / 100)     |         |
| 1.2 Implementation                | ( (200) / 200)     |         |
| 1.3 Progress According to Plan    | ( (200) / 200)     |         |
| 2. Learning with AI               | ( (200) / 200)     |         |
| **Total Points**                  | **( (700) / 700)** |         |

| Category                          | Points           | Comment |
| --------------------------------- | ---------------- | ------- |
| 3. Evaluating Peers               | ( (100) / 100)     |         |
| **Total Points**                  | **( (100) / 100)** |         |


---

## Checklist Before Submission

- (V) I checked that all rubric items are graded; no ? marks remain.
- (V) I filled in all the requested links (Canvas, GitHub, video, slides).
- (V) I understand the grading rules and have followed the rubric guidelines.
- (V) I uploaded this rubric file with the correct name: `Doe_John_project_rubric.md`
- (V) I will upload my peer evaluation using the peer evaluation rubric file.
- (V) I understand this assignment will be regraded and points can be deducted (up to 100%) if:
  - Any violation of academic integrity is detected
  - The rubric guidelines are not followed
  - The content is of low quality
