---
name: code-quality
description: "Enforces organizational coding standards, architectural patterns, and dependency hygiene for the SpendGuard project."
---

# Goal
Ensure all new features, such as the 'Archive' functionality, are implemented using existing project patterns rather than introducing inconsistent 'one-off' logic.

# Instructions
1. **Pattern Matching**: After writing code, scan the existing codebase for similar patterns (e.g., look at how 'Approve' or 'Reject' is implemented).
2. **Mandatory Constants**: Do not use "magic strings" or hardcoded status values. You must use the existing `ExpenseStatus` enum or constants file.
3. **Service Layer Isolation**: All business logic must reside in the `services/` directory. Do not place database logic directly in the UI components.
4. **Dependency Check**: Do not add new npm packages.

# Constraints
- **Compliance Warning**: If the proposed implementation violates a pattern, you must generate a 'Compliance Warning' artifact first and show it to the user.
- **Refactor After Approval**: Refactor the code to use the existing patterns after the user approves the changes.

# Examples
User: "Add an archive button."
Agent: "I've drafted the logic. However, I noticed I was about to use a string. I will refactor this to use `ExpenseStatus.ARCHIVED` to match your organizational standards".
