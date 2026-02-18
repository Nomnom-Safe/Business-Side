# Abstract Factory Pattern

## Intent
Provide an interface for creating families of related objects without specifying concrete classes.

## Problem
You need to create related products that must work together, but want to avoid tight coupling.

## Solution
Define an abstract factory interface implemented by concrete factories for each product family.

## Key Participants
- **AbstractFactory**: Declares creation methods.
- **ConcreteFactory**: Creates specific product families.
- **AbstractProduct**: Declares product interfaces.
- **ConcreteProduct**: Implements product variants.
- **Client**: Uses factories via abstraction.

## Structure
- Factories create multiple related products.
- Products from the same factory are compatible.

## Workflow
1. Client selects a factory.
2. Factory creates related products.
3. Client assembles products consistently.

## When to Use
- Products must be used together.
- You want to switch product families easily.
- You want to enforce consistency.

## When Not to Use
- Product families rarely change.
- Adding new product types is frequent.

## Related Patterns
- Factory Method
- Builder

## One-Sentence Summary
Abstract Factory creates compatible families of objects without exposing concrete implementations.
