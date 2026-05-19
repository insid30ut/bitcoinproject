---
trigger: always_on
---

# Autonomous Verification Rules

1. **Browser Control Verification**: For UI changes, utilize the Browser Subagent to launch the application on `localhost`. Perform runtime analysis, verify DOM interactions, and check console logs for runtime exceptions before declaring a task complete.
2. **Error Handling & Retries**: If a build error or linter failure occurs during task execution, intercept the terminal error log, formulate an automated hypothesis, apply the fix, and re-run tests recursively up to 3 times before requesting developer intervention.