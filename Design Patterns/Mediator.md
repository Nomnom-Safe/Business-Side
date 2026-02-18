# Mediator Pattern

## Intent
Define an object that encapsulates how a set of objects interact.

## Problem
Direct object communication leads to tight coupling.

## Solution
Objects communicate through a Mediator instead of directly.

## Key Participants
- **Mediator**: Coordination interface.
- **ConcreteMediator**: Implements coordination.
- **Colleague**: Communicating objects.

## Structure
- Colleagues reference Mediator.
- Mediator knows colleagues.

## Workflow
1. Colleague sends event to mediator.
2. Mediator coordinates responses.
3. Other colleagues react indirectly.

## When to Use
- Many-to-many object interactions.
- Behavior changes frequently.

## When Not to Use
- Mediator becomes overly complex.

## Related Patterns
- Facade
- Observer

## One-Sentence Summary
Mediator centralizes communication logic.
