# Bridge Pattern

## Intent
Decouple an abstraction from its implementation so the two can vary independently.

## Problem
Inheritance leads to a combinatorial explosion of classes when both abstractions and implementations vary.

## Solution
Split the system into two hierarchies: Abstraction and Implementation, connected by composition.

## Key Participants
- **Abstraction**: Defines high-level control logic.
- **RefinedAbstraction**: Extends abstraction behavior.
- **Implementor**: Defines low-level operations.
- **ConcreteImplementor**: Implements specific behaviors.

## Structure
- Abstraction holds a reference to Implementor.
- Both hierarchies evolve independently.

## Workflow
1. Client works with Abstraction.
2. Abstraction delegates work to Implementor.
3. Implementor executes platform-specific logic.

## When to Use
- You expect multiple dimensions of variation.
- You want runtime flexibility.
- You want to avoid class explosion.

## When Not to Use
- Only one implementation is needed.
- Added complexity outweighs benefits.

## Related Patterns
- Abstract Factory
- Adapter

## One-Sentence Summary
Bridge separates what a system does from how it does it.
