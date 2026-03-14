# Frontend UI & Design System Rules

The Litera Web application focuses on modern, aesthetic, and responsive design. This document explains the rules for using styling, CSS frameworks, and UI Libraries.

## Core Technologies
- **CSS Framework**: Tailwind CSS v4 (`@tailwindcss/vite`).
- **UI Components**: Shadcn UI (based on `radix-ui`), and additional assets (`lucide-react` for icons, `embla-carousel-react`).
- **Class Merging**: Must use the `clsx` and `tailwind-merge` packages (via a helper lib usually called `cn` / `lib/utils.ts`) to merge dynamic classes.

## Design Implementation Rules (CSS & Tailwind)
- **Vanilla Tailwind First**: As much as possible, use Tailwind utility classes for styling. Avoid writing pure CSS in external files unless highly specific (like complex animations or Shadcn theme variables configuration in `index.css`).
- **Theme Variables**: Color variables (primary, secondary, background, foreground) must refer to the CSS variables set up by Shadcn in the `index.css` file (accessed with Tailwind classes like `bg-primary`, `text-muted-foreground`).
- **Responsiveness**: Design must be Mobile First. Use Tailwind prefixes (`sm:`, `md:`, `lg:`, `xl:`) to adjust layouts for different screen sizes.
- **Animations and Transitions**: Apply Tailwind classes like `transition-all`, `duration-200`, `hover:scale-105` on interactive elements for a smooth user experience (smooth micro-animations). The `tw-animate-css` package is also used to manage additional animations.

## UI Component Implementation
- **Shadcn UI**: When needing standard static/interactive components (Button, Input, Dialog, Select, Dropdown, etc.), you **Must** prioritize Shadcn components. Do not build from scratch if available.
- **Component Isolation**: Components must not depend on external layouts. Abstract UI components (Button, Input) should not have outer *margin* properties (use flex/grid from the parent container to control spacing).

## Forms and Validation
Form UI design must follow these standards:
- Use `react-hook-form`.
- Use `zod` for validation.
- Display error indicators visually with appropriate typography (e.g., red text below input fields).
- Display loading states (Spinner/Disable Button) when the form is submitted (connected to `.isPending` from React Query).

## Accessibility (a11y)
- Use HTML5 semantic roles and elements (`<main>`, `<section>`, `<nav>`, `<article>`).
- If using icons (`lucide-react`) on buttons without text, make sure to add `aria-label`.
- Background and text colors must have sufficient visual contrast. Shadcn UI provides a foundation for this; ensure you do not weaken the contrast.
