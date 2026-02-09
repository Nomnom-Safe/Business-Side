# State Pattern

## Pattern Category
Behavioral

## Intent
Allow an object to alter its behavior when its internal state changes.

## Problem
Objects whose behavior depends on state often accumulate large conditional logic:
- if / else chains
- switch statements

This makes the code hard to extend and maintain.

## Solution
Encapsulate state-specific behavior in separate **State** objects.  
The context delegates behavior to the current state object.

## Structure
- **Context**: Maintains current state
- **State**: Interface for behavior
- **ConcreteState**: Implements behavior for a specific state

## Key Idea
The same method call produces different behavior depending on the current state object.

## Benefits
- Eliminates complex conditionals
- Clear state transitions
- Open/Closed Principle support

## Drawbacks
- Increased number of classes
- State logic distributed across objects

## When to Use
- Behavior varies significantly by state
- State transitions are explicit and frequent
