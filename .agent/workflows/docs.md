---
description: Workflow for updating project documentation (especially README.md)
---

# Documentation Update Workflow

Documentation is the lifeblood of this project. Use this workflow when you add major features, new utilities, or modify frontend architectural configurations.

1. **Identify Changes:**
   Determine what you just built. Is it a new global UI component? A change to the API schema (React Query keys)? Or a change to how to run the project (new `package.json` scripts)?

2. **Update README.md:**
   Open the main `README.md` file in the root directory (`/`).
   - If there are new environment variables (`.env`), add their explanations in the **Environment Variables** block.
   - If there is a new third-party library (e.g., adding Zustand, Recharts, etc.), mention it in the **Core Tech Stack** block.
   - If you modify the folder structure in `src/`, update the directory tree list in the README.

3. **Verify Markdown (Syntax):**
   Ensure markdown formatting stays clean. Use double backticks for code blocks, and avoid typos in explanations.

4. **Function Comments / JSDoc (Optional but Recommended):**
   Besides the README, ensure any complex utility functions you just created are properly annotated with adequate JSDoc comments.

// turbo
5. **Run Markdown Linter (Optional):**
   Use ESLint for markdown formatting if configured, or run the standard QA (Quality Assurance) command to ensure file changes do not break build tools/linters.
   ```bash
   npm run lint
   ```
