# TaskGuard project guidance

- Keep the app Angular standalone and use strict TypeScript.
- Put Firebase Auth operations in `AuthService` and Firestore task operations in `TaskService`.
- Protect authenticated views with Angular route guards.
- Preserve per-user task ownership in Firestore queries and `firestore.rules`.
- Keep visible copy and validation messages in Spanish.
- Use Bootstrap for shared CSS conventions and Sass for application styling.
- Never commit real Firebase configuration or credentials.
- Run `npm run build` after changes that affect application code.

## Setup status

- [x] Angular standalone project scaffolded with routing and Sass.
- [x] Firebase Auth, Firestore task CRUD, and protected routes implemented.
- [x] Bootstrap and Sass styling added for responsive login, registration, and task views.
- [x] Dependencies installed; `npm run build` produces `dist/taskguard/browser`.
- [x] README and Firestore security rules added.
- [x] No extra VS Code extensions required.
- [x] Development preview verified at `http://127.0.0.1:4300`.
- [ ] Replace the empty Firebase values in `src/environments/environment.ts` before testing account flows.
