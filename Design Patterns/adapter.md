# Adapter Pattern

## Intent
Convert the interface of an existing class into another interface clients expect.

## Problem
You want to reuse an existing class, but its interface is incompatible with the one required by new client code.

## Solution
Introduce an Adapter that translates calls from the expected interface (Target) into calls the existing class (Adaptee) understands.

## Key Participants
- **Target**: The interface the client expects.
- **Adapter**: Translates Target requests to the Adaptee.
- **Adaptee**: Existing class with an incompatible interface.
- **Client**: Uses the Target interface.

## Structure
- Adapter implements Target.
- Adapter either inherits from or delegates to Adaptee.

## Workflow
1. Client calls a method on Target.
2. Adapter receives the call.
3. Adapter translates and forwards the call to Adaptee.
4. Adaptee performs the work.

## When to Use
- You want to reuse legacy code.
- You cannot modify the existing class.
- You need compatibility without refactoring.

## When Not to Use
- Interfaces are already compatible.
- Adaptee and Target are conceptually mismatched.

## Related Patterns
- Bridge
- Decorator

## One-Sentence Summary
Adapter makes incompatible interfaces work together without changing existing code.
