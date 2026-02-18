# Memento Pattern

## Intent
Capture and restore an object’s internal state without violating encapsulation.

## Problem
Objects need undo/restore functionality but should hide internal details.

## Solution
Store snapshots of state in Memento objects accessible only to the originator.

## Key Participants
- **Originator**: Creates/restores state.
- **Memento**: Stores state.
- **Caretaker**: Manages mementos.

## Structure
- Caretaker treats mementos as opaque.

## Workflow
1. Originator creates memento.
2. Caretaker stores it.
3. Originator restores state later.

## When to Use
- Undo/redo needed.
- Encapsulation is critical.

## When Not to Use
- State is large or expensive.

## Related Patterns
- Command

## One-Sentence Summary
Memento enables safe state rollback.
