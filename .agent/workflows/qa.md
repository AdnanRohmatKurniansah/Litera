---
description: QA (Quality Assurance) workflow for frontend code before merging/deployment
---

# Frontend QA Workflow

Use this flow to ensure code is error-free (lint) and can be compiled (build) by TypeScript.

// turbo
1. Code Linting (ESLint)
Ensure code complies with standard rules and ReactX type checking.
```bash
npm run lint
```
*Tip: If ESLint messages cannot be auto-fixed logically, immediately correct the TypeScript/Typing section.*

// turbo
2. Build Mode (TypeScript & Vite)
Ensure there are no compilation errors that will fail during CI/CD (like Vercel). This runs `tsc -b` and `vite build`.
```bash
npm run build
```

3. Production Preview (Optional)
If the build succeeds, you can preview the production build locally to verify bundler performance.
```bash
npm run preview
```
