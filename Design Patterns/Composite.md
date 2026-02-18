# Composite Pattern

## Intent
Compose objects into tree structures to represent part–whole hierarchies, allowing clients to treat individual objects and compositions uniformly.

## Problem
You have objects that form hierarchical structures, but client code must distinguish between single objects and collections.

## Solution
Define a common interface for both leaf objects and composite objects. Composites store children and delegate operations to them.

## Key Participants
- **Component**: Declares the common interface.
- **Leaf**: Represents individual objects.
- **Composite**: Stores child Components and implements child-related operations.
- **Client**: Works with Components uniformly.

## Structure
- Tree-like hierarchy.
- Composite contains a collection of Components.

## Workflow
1. Client calls operation on Component.
2. If Leaf, operation executes directly.
3. If Composite, operation propagates to children.

## When to Use
- You need to represent hierarchical data.
- Clients should not care about object granularity.
- Tree structures are central to the domain.

## When Not to Use
- Object hierarchies are shallow or simple.
- Uniformity hides important distinctions
