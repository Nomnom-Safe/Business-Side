# Observer Pattern

## Pattern Category
Behavioral

## Intent
Define a one-to-many dependency so that when one object changes state, all dependents are notified.

## Problem
Tightly coupling objects that depend on shared state leads to rigid designs.

## Solution
Introduce a **Subject** that maintains observers.  
Observers register interest and are notified automatically on state changes.

## Structure
- **Subject**: Maintains observers
- **ConcreteSubject**: Stores state
- **Observer**: Notification interface
- **ConcreteObserver**: Reacts to updates

## Key Idea
Loose coupling through notification.

## Benefits
- Dynamic subscription
- Loose coupling
- Scalable event handling

## Drawbacks
- Update order not guaranteed
- Potential performance issues

## Variants
- Push model
- Pull model
