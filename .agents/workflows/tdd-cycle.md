---
description: 
---

# Workflow: Test-Driven Development Loop

1. Read the provided user feature requirement.
2. Formulate a list of expected inputs, outputs, and edge cases.
3. Write isolated unit tests matching the specified requirements. Name files using the `*.test.ts` or `*.test.tsx` convention.
4. Run the test suite via the terminal. Verify that the tests fail as expected without mocking the implementation. **STOP** and display the failing test trace for review.
5. Upon approval, generate the clean, modular code required to pass the test suite. Do not mutate the test files.
6. Re-run tests until 100% compliance is reached.