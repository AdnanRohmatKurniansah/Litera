---
name: create_ui_component
description: Steps to create a frontend UI component (React, Tailwind, Shadcn)
---

# Skill: Creating Frontend UI Components

Use this skill when asked to create a new reusable UI component.

## Basic Instructions
1. **Understand Requirements**: Analyze what props the component needs dynamically.
2. **Check Shadcn UI**: If this is a base component (Button, Input, Select, Card, Modal, Tooltip), ASK THE USER TO INSTALL SHADCN first via CLI `npx shadcn@latest add [component-name]`, or find references in the `src/components/ui/` directory.
3. **File Location**: Create a new `.tsx` file in `src/components/` (can be in a subdirectory if related to a specific feature, e.g., `src/components/dashboard/StatCard.tsx`).
4. **Extension & TypeScript**: Always use the `.tsx` extension. Must define an Interface or Type for `props`.
5. **Styling**: 
   - Use Tailwind utility classes.
   - Merge classes using the `cn()` helper function from `tailwind-merge` & `clsx` packages (usually in `src/lib/utils.ts`):
     ```tsx
     import { cn } from "@/lib/utils"; // Ensure absolute/alias paths

     interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
       isActive?: boolean;
     }

     export function MyComponent({ isActive, className, ...props }: MyComponentProps) {
       return (
         <div 
           className={cn("p-4 rounded-md bg-white", isActive && "border-primary", className)}
           {...props}
         >
           {/* Content */}
         </div>
       );
     }
     ```
6. **Exporting**: Always use Named Exports and avoid Default Exports (for consistency with IDE auto-imports).
7. **Avoid Strong State Dependencies**: Make UI components as stateless as possible. Use props to receive state from the parent page/component (Smart & Dumb Component Pattern).
