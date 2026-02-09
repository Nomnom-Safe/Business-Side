# Iterator Pattern

## Intent
Provide a way to access elements of a collection sequentially without exposing its internal structure.

## Problem
Clients should traverse collections without knowing their representation.

## Solution
Introduce an Iterator object that encapsulates traversal logic.

## Key Participants
- **Iterator**: Defines traversal interface.
- **ConcreteIterator**: Implements traversal.
- **Aggregate**: Collection interface.
- **ConcreteAggregate**: Returns iterator.

## Structure
- Iterator separate from collection.

## Workflow
1. Client requests iterator.
2. Iterator tracks traversal state.
3. Client accesses elements sequentially.

## When to Use
- Multiple traversal strategies needed.
- Collection internals should be hidden.

## When Not to Use
- Simple iteration suffices.

## Related Patterns
- Composite
- Visitor

## One-Sentence Summary
Iterator decouples traversal from collection structure.
