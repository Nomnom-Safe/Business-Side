# Strategy Pattern

## Pattern Category
Behavioral

## Intent
Define a family of algorithms, encapsulate each one, and make them interchangeable.

## Problem
Hard-coding algorithms into a class:
- Reduces flexibility
- Violates Open/Closed Principle
- Makes runtime changes difficult

## Solution
Extract algorithms into separate **Strategy** classes that share a common interface.  
The context delegates algorithm execution to the selected strategy.

## Structure
- **Strategy**: Algorithm interface
- **ConcreteStrategy**: Algorithm implementations
- **Context**: Uses a strategy

## Key Idea
The algorithm can be swapped at runtime without modifying the context.

## Benefits
- Runtime flexibility
- Easy extensibility
- Improved testability

## Drawbacks
- More objects
- Clients must understand available strategies

## When to Use
- Multiple algorithms exist
- Behavior should change dynamically
