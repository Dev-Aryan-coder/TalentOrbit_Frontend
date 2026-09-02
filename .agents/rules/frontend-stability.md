# Rule: Frontend Stability & Non-Regression Invariants

## 1. Single Canonical Export Invariant
- Never introduce duplicate export statements in JavaScript/JSX files.
- Each component file must contain exactly ONE canonical export pattern:
  - Prefer named export with matching default export: `export function Component() { ... }` and a single `export default Component;` at the bottom.
  - Never allow multiple `export default` declarations in the same file.
  - In consuming files, never import the same identifier as both default and named in the same statement (e.g. `import Foo, { Foo } from ...` is invalid).

## 2. Style Specificity & Single Source of Truth
- Avoid hardcoding conflicting inline styles in JSX if a corresponding CSS class is responsible for that property.
- When migrating styles from inline JSX to `.css` files, completely remove the inline style property from the JSX element.
- Never let high-specificity inline styles silently neutralize external `.css` modifications.

## 3. Parent-Child Theme & Background Hierarchy
- Always inspect root wrappers (`App.jsx`, `#root`, `index.css`, `body`) before implementing transparent or glassmorphic designs.
- Never leave rogue background colors (e.g., hardcoded dark utility classes like `bg-[#050811]`) in root wrappers that can leak through transparent child sections.
- When changing a section's theme to light, verify that all parent containers up to the document root support that background.

## 4. Zero Stacked Clutter / Clean Refactoring
- When replacing a visual approach (e.g., transitioning from an SVG wave to a CSS gradient fade), completely remove the previous experiment before introducing the new one.
- Never stack competing or overlapping transition elements on top of each other.
- Verify the entire element tree structure before testing in the browser.

## 5. Mandatory Verification Protocol
- Run `npm run build` synchronously on every single frontend code change before reporting completion to ensure zero parsing, syntax, or bundling errors.