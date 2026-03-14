# Frontend Documentation Rules

Documentation is crucial for maintaining long-term projects. All changes affecting architecture, major features, or installation must be documented.

## JSDoc and Code Comments
- Use JSDoc format (`/** ... */`) to document:
  - Complex components (explain main props if there are edge cases).
  - Custom React Hooks (explain the return value and input parameters).
  - Utility functions in `src/lib/` or `src/services/` folders.
- Do not write comments explaining *WHAT* the code does if the code is already semantically clear (Clean Code). Write comments to explain *WHY* a strange/unique logic was implemented (e.g., a workaround for a library bug, or specific business reasons).

## Updating README.md
The `README.md` file in the root directory is the primary Source of Truth.
- **Local Setup**: Ensure instructions for running the local project (`npm install`, `npm run dev`) are always relevant and up-to-date.
- **Environment Variables**: If there are additions to `.env.example`, document these new properties in the Environment setup section of `README.md`.
- **Core Features**: If a new submodule or global library is introduced (e.g., adding Zustand or migrating to React Query v5), add release notes or a brief architectural explanation in `README.md`.
- **Additional Scripts**: Every new script in `package.json` (`npm run ...`) must have its function explained in `README.md`.

## Mock API Documentation
- Because this is a frontend project (Vite), if there are mock APIs or endpoint specifications that are incomplete, use files in `mock/...` or clear JSDoc comments detailing the request payload and response to facilitate integration when the real API (.yaml from Swagger/Postman) becomes available.
