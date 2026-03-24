---
trigger: always_on
---

# SpendGuard Project Architecture & Build Rules

## Directory Structure
- `/client`: React frontend. Runs on **Port 8080**.
- `/server`: Node.js/Express backend. Runs on **Port 3000**.

## Communication & Ports
- The Client communicates with the Server via `http://localhost:3000`.
- Do not swap these ports; the Firestore emulator and Auth triggers are mapped specifically to these addresses.

## Build & Execution
- **Command**: `npm run start` 
- **Behavior**: Executes `node --watch`. 
- **Auto-Reload**: This enables native Node.js file watching. When files in `/server` change, the process reloads automatically.
- **Constraint**: When implementing features like the "Archive" button, do not manually restart the server. Rely on the `--watch` behavior for immediate feedback.
- **Constraint**: Assume that the user has run "npm run start" in the terminal.

## Development Constraints
- Use relative paths for internal module imports within their respective directories.
- Always check both the `/client` and `/server` directories when implementing features that require full-stack changes.