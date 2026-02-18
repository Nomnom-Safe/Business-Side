# Command Pattern

## Intent
Encapsulate a request as an object, allowing parameterization, queuing, and undoable operations.

## Problem
You want to decouple request senders from request receivers.

## Solution
Create Command objects that bind a receiver and an action.

## Key Participants
- **Command**: Declares execute interface.
- **ConcreteCommand**: Implements action.
- **Receiver**: Performs the action.
- **Invoker**: Triggers command.
- **Client**: Creates and configures commands.

## Structure
- Command references Receiver.
- Invoker triggers commands.

## Workflow
1. Client creates command.
2. Invoker executes command.
3. Command calls receiver logic.

## When to Use
- You need undo/redo.
- You want macro commands.
- Requests must be logged or queued.

## When Not to Use
- Simple direct method calls suffice.

## Related Patterns
- Memento
- Strategy

## One-Sentence Summary
Command turns requests into objects.
