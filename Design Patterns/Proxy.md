# Proxy Pattern

## Pattern Category
Structural

## Intent
Provide a surrogate or placeholder for another object to control access to it.

## Problem
Sometimes direct access to an object is undesirable because:
- The object is expensive to create
- The object resides remotely
- Access needs to be controlled, logged, or delayed

Embedding this logic directly in the client tightly couples concerns and increases complexity.

## Solution
Introduce a **Proxy** object that implements the same interface as the real object.  
The proxy controls access and decides when and how requests are forwarded to the real object.

## Structure
- **Subject**: Common interface
- **RealSubject**: Performs the actual work
- **Proxy**: Controls access to RealSubject
- **Client**: Uses Subject interface

## Key Idea
The proxy acts as an intermediary that looks identical to the real object from the client’s perspective.

## Common Variants
- Virtual Proxy (lazy loading)
- Protection Proxy (access control)
- Remote Proxy (network access)
- Caching Proxy

## Benefits
- Controlled access
- Lazy initialization
- Separation of concerns

## Drawbacks
- Additional indirection
- Increased design complexity

## When to Use
- Object creation is expensive
- Access must be restricted or monitored
- Remote resources are involved
