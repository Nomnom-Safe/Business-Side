# Flyweight Pattern

## Intent
Use sharing to support large numbers of fine-grained objects efficiently.

## Problem
Many similar objects consume excessive memory.

## Solution
Separate intrinsic (shared) state from extrinsic (context-specific) state and reuse shared objects.

## Key Participants
- **Flyweight**: Shared interface.
- **ConcreteFlyweight**: Stores intrinsic state.
- **FlyweightFactory**: Manages shared instances.
- **Client**: Supplies extrinsic state.

## Structure
- FlyweightFactory caches instances.
- Clients reuse objects.

## Workflow
1. Client requests Flyweight.
2. Factory returns existing or creates new.
3. Client provides extrinsic state at runtime.

## When to Use
- Large numbers of similar objects exist.
- Memory usage is critical.

## When Not to Use
- Objects have significant unique state.

## Related Patterns
- Factory Method
- Composite

## One-Sentence Summary
Flyweight reduces memory by sharing common object state.
