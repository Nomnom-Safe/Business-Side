# Facade Pattern

## Intent
Provide a simplified interface to a complex subsystem.

## Problem
Subsystems expose too many details, making usage and maintenance difficult.

## Solution
Create a Facade that offers high-level operations while delegating to subsystem components.

## Key Participants
- **Facade**: Simplified interface.
- **Subsystem Classes**: Perform actual work.
- **Client**: Uses the Facade.

## Structure
- Facade depends on subsystems.
- Subsystems remain unaware of the Facade.

## Workflow
1. Client calls Facade methods.
2. Facade coordinates subsystem interactions.
3. Subsystems perform operations.

## When to Use
- Subsystems are complex.
- You want loose coupling.
- You want clearer usage boundaries.

## When Not to Use
- Full subsystem flexibility is required.
- Facade becomes overly complex.

## Related Patterns
- Mediator
- Adapter

## One-Sentence Summary
Facade hides subsystem complexity behind a clean interface.
