# Template Method Pattern

## Pattern Category
Behavioral

## Intent
Define the skeleton of an algorithm in a superclass, deferring some steps to subclasses.

## Problem
Multiple classes follow the same algorithm structure but differ in specific steps.

Duplicating the algorithm leads to:
- Code duplication
- Maintenance difficulties

## Solution
Place the algorithm structure in a **template method**.  
Subclasses implement specific steps without altering the algorithm order.

## Structure
- **AbstractClass**: Defines template method and abstract steps
- **ConcreteClass**: Implements step details

## Key Idea
The superclass controls the algorithm; subclasses fill in the details.

## Benefits
- Code reuse
- Enforced algorithm structure
- Controlled extension

## Drawbacks
- Inheritance coupling
- Limited flexibility compared to composition

## Design Principle
Hollywood Principle: *“Don’t call us — we’ll call you.”*
