---
name: security-tdd
description: "Generates TDD logic for data modifications, ensuring that a unit test for unauthorized access is written before the implementation."
---

# Goal
Ensure all new features that modify data (like 'Archive') follow a Red-Green-Refactor cycle that prioritizes security and ownership checks.

# Instructions
1. **Analyze User Intent**: When asked to add a data-modifying feature, identify the target resource (e.g., Expense Report).
2. **Draft a Failing Test (RED)**: Write a Vitest or Jest test case that attempts to perform the action with a mismatched `userId`. 
   - *Example:* The test should mock a request where `session.user.id !== record.ownerId` and assert a `403 Forbidden` response.
3. **Wait for Approval**: Present the test code to the developer before writing the feature logic.
4. **Implement Implementation (GREEN)**: Once approved, write the minimal backend logic in the controller to pass the test by validating the owner's identity.

# Constraints
- **Do Not** implement the feature logic without first showing the failing security test.
- **Do Not** use hardcoded IDs; always use session-based context.

# Examples
User: "Add an archive button to the reports table."
Agent: "I'll start by writing a TDD security test to ensure users can't archive each other's reports. Once that fails, I'll implement the ownership check logic."