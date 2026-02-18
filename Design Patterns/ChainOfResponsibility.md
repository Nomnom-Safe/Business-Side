# Chain of Responsibility Pattern

## Intent
Pass a request along a chain of handlers until one handles it.

## Problem
A request may be handled by multiple potential receivers, but the sender should not be coupled to them.

## Solution
Create a chain where each handler decides to process or forward the request.

## Key Participants
- **Handler**: Defines request handling interface.
- **ConcreteHandler**: Handles specific requests.
- **Client**: Sends requests to the chain.

## Structure
- Handlers hold a reference to the next handler.

## Workflow
1. Client sends request to first handler.
2. Handler processes or forwards request.
3. Request moves until handled or rejected.

## When to Use
- Multiple objects can handle a request.
- You want loose coupling.
- Handler order may change dynamically.

## When Not to Use
- Exactly one handler exists.
- Performance is critical.

## Related Patterns
- Decorator
- Composite

## One-Sentence Summary
Chain of Responsibility routes requests dynamically without sender knowing the receiver.
