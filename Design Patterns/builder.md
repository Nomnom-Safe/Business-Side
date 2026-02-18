# Builder Pattern

## Intent
Separate the construction of a complex object from its representation.

## Problem
Complex objects require many construction steps, and different representations share the same process.

## Solution
Introduce a Builder interface and a Director to control the construction sequence.

## Key Participants
- **Director**: Orchestrates construction steps.
- **Builder**: Defines construction steps.
- **ConcreteBuilder**: Implements specific representations.
- **Product**: The final object.

## Structure
- Director uses Builder via composition.
- Builders produce different products.

## Workflow
1. Client selects a Builder.
2. Director invokes construction steps.
3. Builder assembles the Product.
4. Client retrieves the result.

## When to Use
- Object creation is complex.
- Same process yields different products.
- Construction order matters.

## When Not to Use
- Object creation is simple.
- Few configuration options exist.

## Related Patterns
- Template Method
- Abstract Factory

## One-Sentence Summary
Builder controls how complex objects are built without fixing their final form.
