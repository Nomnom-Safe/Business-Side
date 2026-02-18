# Decorator Pattern

## Intent
Attach additional responsibilities to an object dynamically without altering its structure.

## Problem
Subclassing leads to rigid and combinatorial class hierarchies when adding features.

## Solution
Wrap objects in decorator classes that implement the same interface and delegate calls while adding behavior.

## Key Participants
- **Component**: Common interface.
- **ConcreteComponent**: Base object.
- **Decorator**: Wraps a Component.
- **ConcreteDecorator**: Adds behavior.

## Structure
- Decorators reference a Component.
- Multiple decorators can be stacked.

## Workflow
1. Client wraps object with decorator(s).
2. Calls pass through decorators.
3. Each decorator adds behavior before/after delegation.

## When to Use
- Behavior should be added dynamically.
- Subclassing is impractical.
- You want flexible feature composition.

## When Not to Use
- Object identity must remain simple.
- Debugging layered behavior is undesirable.

## Related Patterns
- Composite
- Strategy

## One-Sentence Summary
Decorator adds behavior to objects without changing their class.
