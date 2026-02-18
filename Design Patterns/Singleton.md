# Singleton Pattern

## Pattern Category
Creational

## Intent
Ensure a class has only one instance and provide a global access point to it.

## Problem
Multiple instances of certain objects can cause:
- Wasted resources
- Inconsistent global state
- Coordination problems

Examples include loggers, configuration objects, or database connections.

## Solution
The class itself controls instance creation:
- Prevents external instantiation
- Stores a single static instance
- Provides a method to access it

## Structure
- **Singleton**: Class that manages its sole instance

## Key Characteristics
- Private constructor
- Static instance reference
- Global access method
- Often lazily initialized

## Benefits
- Controlled access
- Reduced memory usage
- Consistent shared state

## Drawbacks
- Hidden dependencies
- Difficult testing
- Global state issues
- Thread-safety concerns

## Modern Perspective
Often replaced by **Dependency Injection** to improve testability and clarity.
