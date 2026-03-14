---
description: Workflow to create a new page or sub-feature in the application
---

# Create Feature Workflow

Use this workflow when creating a new page and integrating its routes.

1. **Analyze UI Requirements:**
   Open the documentation files or read the User specifications. Understand what components are required (Tables, Forms, Cards) and prepare the appropriate UI library (shadcn).

2. **Create Component Folder:**
   If this feature is complex, create a dedicated folder inside `src/components/[feature-name]/`.
   
// turbo
3. **Generate Shadcn UI Components (If Needed):**
   Use the CLI to add any missing components. (Replace `[component]` with the relevant name).
   ```bash
   npx shadcn@latest add [component]
   ```

4. **Create Main Page:**
   Create a `[PageName].tsx` file inside the `src/pages/` directory. Import and assemble the created components or shadcn components.

5. **Add to Routing:**
   Register the `[PageName].tsx` component in the routing system in `App.tsx` or the related router file. Define the *path* (e.g., `/dashboard/settings`) and wrap it in a layout if needed.

6. **Define Fetching Service/API:**
   If the page requires dynamic data, create a hook using React Query in `src/hooks/` or a fetcher in `src/services/`. Call these hooks in the newly created page.
