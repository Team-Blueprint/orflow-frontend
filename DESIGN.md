```markdown
# 🎨 DESIGN.md

Use this brand token specification system when designing interfaces that require a professional, developer-first, and highly reliable technical aesthetic.

---

## 🏗️ Visual Theme & Atmosphere
The Orflow brand identity speaks with raw technical authority, structural security, and minimalist precision. The theme is configured as a **strict, high-contrast dark system** with a strong focus on asymmetrical layouts, sharp edges, and intentional whitespace.

### Key Characteristics
*   **The Sharp Cut Rule:** Every component uses completely flat edges (`radius: 0px`). Round boundaries are strictly forbidden.
*   **Zero Ambient Depth:** Drop shadows and elevation blurring are eliminated. Depth is established exclusively through thin borders and layer color separations.
*   **Branded Accent Contrast:** A high-contrast, energetic brand orange (`#f97316`) is applied exclusively to critical user interactions and core highlights.
*   **Tri-Typography Voice:** Clean, technical interface copy written in `Manrope` and code frames set to `Geist Mono` are contrasted against premium, editorial accent headings written in `Instrument Serif`.

---

## 🎨 Color Usage Rules
The palette is deeply focused to maintain strict visual compliance. UI compositions must read exclusively from these registered CSS variables:

```css
:root {
  --canvas: #09090b;          /* Absolute baseline surface for all pages */
  --background: #09090b;      /* Page background fallback */
  --paper: #18181b;           /* Lighter, flat panels for cards, fields, and code blocks */
  --card: #18181b;            /* Component background layer */
  --primary: #f97316;         /* Brand Accent Orange: Reserved for primary CTAs and highlights */
  --primary-hover: #ea580c;   /* Hover state for primary interactive elements */
  --primary-soft: #431407;    /* Low-opacity orange accent tint for background fills */
  
  --ink: #fafafa;             /* High-visibility white for primary text and headings */
  --ink-soft: #a1a1aa;        /* Low-contrast gray for subtitles, captions, and micro-labels */
  --on-ink: #ffffff;          /* Pure white elements over dark primitives */
  
  --hairline: #27272a;        /* Crisp structural border lines for elements and cards */
  --hairline-strong: #3f3f46; /* High-contrast border lines for input focus states */
}

```

* **`--primary` (`#f97316`)** is the brand's most powerful color. Reserve it for the single most important action within a viewport. Do not use it for long-form body text or non-interactive decorations.
* **`--canvas`** is the default background for all layout panels. Page bands should not alternate haphazardly; favor clean card divisions utilizing `--paper` sitting on top of a unified `--canvas` environment.

---

## 🔤 Typography Hierarchy

Always use the designated typographic mappings to ensure clear hierarchy and consistent cross-component rendering.

| Role | Font Family | Tailwind Class String | Application Target |
| --- | --- | --- | --- |
| **Editorial Display** | `Instrument Serif` | `font-serif text-3xl sm:text-5xl italic` | Editorial accent headers, highlighted editorial phrases, emotional claims. |
| **Display XL** | `Manrope` | `font-sans text-5xl sm:text-7xl font-extrabold tracking-tight` | Main page H1 hero headers (max one per page view). |
| **Display LG** | `Manrope` | `font-sans text-3xl font-bold tracking-tight` | Primary H2 section titles. |
| **Display MD** | `Manrope` | `font-sans text-xl font-bold tracking-tight` | Secondary H3 elements, large card titles. |
| **Body LG** | `Manrope` | `font-sans text-lg sm:text-xl text-ink-soft leading-relaxed` | Subtitles, intro paragraphs, and layout lead-ins. |
| **Body MD** | `Manrope` | `font-sans text-base text-ink leading-relaxed` | Default for standard body paragraphs, fields, and descriptions. |
| **Body SM** | `Manrope` | `font-sans text-xs font-semibold tracking-wider uppercase text-ink-soft` | Micro-captions, metadata tags, categories, and small utility elements. |
| **Code MD** | `Geist Mono` | `font-mono text-sm leading-6` | Technical terminal outputs, payload previews, and JSON logs. |

---

## 🛠️ Global Layout Constraints (Do's and Don'ts)

### ✅ Do:

* **Do** enforce `rounded-none` across all containers, inputs, buttons, and decorative badges.
* **Do** use `border border-hairline` instead of drop shadows to define individual card structures.
* **Do** ensure every single clickable entity (buttons, anchor links, active row selectors) explicitly declares `cursor-pointer`.
* **Do** wrap general page blocks inside a standardized container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
* **Do** isolate macro sections vertically using generous layout padding configurations: `py-16 sm:py-24`.
* **Do** maintain keyboard accessibility by applying a clean focus indicator wrapper using `--hairline-strong`.

### ❌ Don't:

* **Never** use any Tailwind box-shadow utility (`shadow-sm`, `shadow-md`, etc.). Visual depth must remain completely flat.
* **Never** allow standard browser arrow cursors to remain active over custom interactive element configurations.
* **Never** use `Instrument Serif` for interface copy, micro-labels, descriptions, or interactive buttons. It is reserved exclusively for editorial accent strings.
* **Never** mix random or arbitrary vertical spacing blocks. Stick strictly to a clean, balanced, 4px-based grid rhythm.

---

## 📦 Core Workspace Dependencies

Include these foundational styling utilities to handle multi-variant configurations cleanly without causing compilation conflicts:

* **`clsx`** — Tiny utility for conditionally joining class names.
* **`tailwind-merge`** — Merges Tailwind classes dynamically without layout compilation overrides.
* **`class-variance-authority` (CVA)** — Type-safe component style variants for building clean design primitives.
* **`shadcn`** — Unstyled, accessible UI components for copying logic directly into your local layout tree.

```

```
