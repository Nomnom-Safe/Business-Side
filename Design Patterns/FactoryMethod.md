# Factory Method Pattern

## Intent
Define an interface for creating objects while letting subclasses decide which class to instantiate.

## Problem
Object creation logic should be flexible and extensible.

## Solution
Defer object instantiation to subclasses via factory methods.

## Key Participants
- **Creator**: Declares factory method.
- **ConcreteCreator**: Creates products.
- **Product**: Interface.
- **ConcreteProduct**: Implementation.

## Structure
- Creator uses Product abstraction.

## Workflow
1. Client calls factory method.
2. Subclass creates product.
3. Client uses product via interface.

## When to Use
- Creation logic varies.
- Loose coupling is required.

## When Not to Use
- Object creation is fixed.

## Related Patterns
- Abstract Factory
- Template Method

## One-Sentence Summary
Factory Method lets subclasses decide what to create.
