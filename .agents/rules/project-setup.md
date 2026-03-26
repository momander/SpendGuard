---
trigger: always_on
---

# SpendGuard Project Architecture & Build Rules

## Directory Structure
- `/client`: React frontend. Runs on **Port 8080**.
- `/server`: Node.js/Express backend. Runs on **Port 3000**.

## Communication & Ports
- The Client communicates with the Server via `http://localhost:3000`.
- Do not change these ports; the Firestore emulator and Auth triggers are mapped specifically to these addresses.

## Build & Execution
- **Command**: `npm run start` 
- **Behavior**: Executes `node --watch`. 
- **Auto-Reload**: This enables native Node.js file watching. When files in `/server` change, the process reloads automatically.
- **Constraint**: When implementing features like the "Archive" button, do not manually restart the server. Rely on the `--watch` behavior for immediate feedback.
- **Constraint**: Assume that the user has started the app with "npm run start" in the terminal. Do not run "npm run start".

## Backend Architecture (server/src)
- **Framework**: Express.js
- **Database**: Firestore (Admin SDK)
- **API Base Path**: `/api`
- **Authentication**: JWT-based middleware (`verifyToken`) handles user identity. User info is attached to `req.user`.
- **Endpoints**:
    - `POST /api/requests`: Creates a request for the authenticated user.
    - `GET /api/requests`: Returns filtered requests based on user role (Managers see all, Employees see own).
    - `PATCH /api/requests/:id`: Manager-only endpoint to update request status (`APPROVED`/`REJECTED`).

## Frontend Architecture (client/src)
- **API Service (`api.js`)**: Centralized `authFetch` wrapper handles Firebase token injection and base URL management.
- **UI Logic (`ui.js`)**: 
    - Uses event delegation for performance and simplicity (e.g., table action buttons).
    - Separates concerns between data fetching (`loadRequests`) and rendering (`renderPersonalHistory`).
- **Styling**: Vanilla CSS in `styles.css`.

## Data Model (Firestore)
- **Requests Collection**:
    - `uid`: Unique identifier of the owner.
    - `email`: User email for record keeping.
    - `amount`: Numeric value of the request.
    - `description`: String description.
    - `status`: Enum (`PENDING`, `APPROVED`, `REJECTED`).
    - `archived`: Boolean flag for filtering.
    - `createdAt`: ISO timestamp string.

## Development Constraints
- Use relative paths for internal module imports within their respective directories.
- Always check both the `/client` and `/server` directories when implementing features that require full-stack changes.
