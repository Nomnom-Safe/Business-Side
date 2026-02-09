# Visitor Pattern

## Pattern Category
Behavioral

## Intent
Separate operations from object structures using double dispatch.

## Problem
Adding new operations to a complex object structure:
- Requires modifying many classes
- Violates Open/Closed Principle

## Solution
Define **Visitor** objects that implement operations separately.  
Objects accept visitors and dispatch calls based on both object and visitor type.

## Structure
- **Visitor**: Declares visit methods
- **ConcreteVisitor**: Implements operations
- **Element**: Accepts visitors
- **ConcreteElement**: Calls appropriate visit method

## Key Idea
Operations vary independently from object structure.

## Benefits
- Easy to add new operations
- Related behavior grouped together

## Drawbacks
- Difficult to add new element types
- Can break encapsulation

## When to Use
- Stable object structure
- Frequently changing operations
