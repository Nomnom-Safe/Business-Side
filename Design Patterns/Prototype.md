# Prototype Pattern

## Pattern Category
Creational

## Intent
Create new objects by copying existing ones instead of instantiating from scratch.

## Problem
Object creation may be:
- Expensive
- Complex
- Repetitive

## Solution
Define a prototype interface with a clone method.  
Objects create copies of themselves.

## Structure
- **Prototype**: Declares clone operation
- **ConcretePrototype**: Implements cloning
- **Client**: Uses prototypes

## Key Idea
Copy first, then customize.

## Benefits
- Improved performance
- Reduced complexity
- Runtime flexibility

## Drawbacks
- Deep vs shallow copy complexity
- Circular reference issues

## When to Use
- Object creation is costly
- Many similar objects are needed
