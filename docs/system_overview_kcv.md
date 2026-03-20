# NomNom Safe — Technology Briefing (Research #3)

## Purpose of This Briefing

This document provides a high-level explanation of the NomNom Safe system so that all team members understand the technology well enough to contribute to the Research #3 analysis.

Research #3 focuses on **technology readiness**, which means understanding:

- how the system works
- what inputs and outputs exist
- what constraints affect the system
- what failure modes could occur
- how those issues can be resolved

This briefing is not meant to explain the full implementation. Instead, it explains the **system architecture and behavior** so the team can build diagrams like the P-Diagram, Failure Mode analysis, and Technology Readiness assessment.

---

# System Overview

NomNom Safe is a system designed to help restaurants manage and communicate allergen-related menu information in a structured and reliable way.

Instead of relying on scattered notes or disclaimers, the system treats menu information as **structured safety data** that can be maintained by restaurant staff and safely displayed to customers.

The goal is to reduce uncertainty for customers with allergies while helping restaurants maintain consistent menu safety information.

---

# Core System Concept

At a high level, the system performs the following transformation:

Restaurant Menu Knowledge → Structured Allergen Data → Safe Customer Menu Display

Restaurants define and maintain their menu information inside the system. That information includes menu items and associated allergens. The system stores and manages this information in a structured way and then presents it to consumers so they can identify food options that may be safe for them.

---

# Core System Components

The system can be thought of as four major components.

## 1. Restaurant Administration Interface

This interface is used by restaurant staff to manage menu information.

Responsibilities include:

- creating and editing menu items
- assigning allergen attributes
- updating menu information when ingredients or recipes change
- managing disclaimers related to allergen risks

This component is responsible for maintaining the **accuracy of the data** in the system.

---

## 2. Structured Menu Data Model

All menu information is stored as structured data rather than unstructured text.

Each menu item contains attributes such as:

- name
- description
- allergens associated with the item
- disclaimers related to preparation or cross-contamination

This structured data model allows the system to treat allergens as **first-class attributes** rather than free-text notes.

---

## 3. Validation and Safety Logic

The system includes rules and constraints designed to ensure that the menu data remains usable and understandable.

Examples include:

- ensuring allergen information is explicitly attached to menu items
- maintaining consistent structure across menu entries
- preventing unauthorized changes to safety data

This layer helps maintain **consistency and reliability** of the information.

---

## 4. Consumer Menu Interface

Customers access the menu through a consumer-facing interface.

The interface allows customers to:

- view menu items
- see allergen information associated with each item
- read relevant disclaimers about food preparation and potential cross-contamination

The goal is to help customers make **more informed decisions** about what they order.

---

# Simplified System Architecture

A simplified architecture for the system looks like this:

Restaurant Staff  
↓  
Menu Administration Interface  
↓  
Structured Menu & Allergen Data  
↓  
Validation / Safety Rules  
↓  
Customer Menu Display

This flow represents the path from internal restaurant knowledge to external customer information.

---

# Key Inputs to the System

The system relies on several important inputs.

Examples include:

- restaurant menu data
- ingredient information
- allergen attributes assigned to menu items
- disclaimer statements provided by the restaurant
- menu updates from restaurant staff

These inputs are typically provided and maintained by authorized restaurant users.

---

# Key Outputs of the System

The system produces several outputs that customers interact with.

Examples include:

- menu item listings
- allergen indicators associated with each item
- safety disclaimers related to food preparation
- structured menu information that can be displayed consistently

The most important output is **clear allergen awareness for customers**.

---

# System Constraints

Several constraints influence how the system operates.

Examples include:

- restaurants are responsible for maintaining accurate data
- the system must avoid implying allergen-free guarantees
- menu information must remain editable by authorized users
- data must remain structured and consistent across menu items

These constraints ensure the system remains responsible and realistic in how it communicates safety information.

---

# Sources of Variability or Noise

Like any real-world system, NomNom Safe operates in an environment with variability.

Examples include:

- menu items changing over time
- ingredient substitutions by restaurants
- staff entering data incorrectly
- customers misinterpreting allergen information

These factors represent **external noise** that can affect system reliability.

---

# Potential Failure Modes

Several types of failures could occur in the system.

Examples include:

- incorrect allergen labeling on a menu item
- menu data becoming outdated after a recipe change
- missing or unclear disclaimers about cross-contamination
- customers misunderstanding the level of allergen risk

Identifying these potential failures is important for assessing technology readiness.

---

# Technology Readiness Context

Research #3 evaluates whether the technology can be developed into a reliable product.

This involves understanding:

- the system architecture
- the possible failure modes
- the root causes of those failures
- the steps required to mitigate them

The goal is to demonstrate that the system can be developed on a **predictable schedule with manageable risks**.

---

# How This Briefing Supports Research #3

This briefing will support the following slides in the Research #3 presentation:

- P-Diagram — defining inputs, outputs, and constraints  
- Failure Mode analysis — identifying what could go wrong  
- Fishbone diagram — identifying root causes  
- Problem assessment matrix — prioritizing risks  
- Technology readiness level — evaluating maturity of the system  
- Problem resolution plan — identifying how to address key risks  

Together, these analyses will demonstrate a clear path toward technology readiness.