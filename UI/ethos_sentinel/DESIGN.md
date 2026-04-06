# Design System Specification: The Architectural Intelligence System

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**

This design system moves beyond the utility of a standard SaaS dashboard to embrace the authority of a high-end legal-tech journal. It is built on the principle of **Informed Serenity**. In a world of chaotic data privacy and complex educational compliance, our UI serves as a calm, editorial voice—organizing chaos into precise, actionable intelligence.

To break the "template" look, we utilize **Intentional Asymmetry**. Large, bold display type is often offset against generous negative space, creating a rhythmic flow that guides the eye. We reject the "boxy" nature of traditional software by favoring layered depth and tonal transitions over rigid containers.

---

## 2. Colors & Surface Philosophy

### Tonal Hierarchy
We utilize a sophisticated palette of greys and muted blues to establish a "Precision Aesthetic." 

- **Primary (`#005ac2`):** Reserved for core actions and critical brand moments. It is a "Muted Electric Blue"—authoritative yet calm.
- **Secondary & Tertiary:** Used to distinguish data types without competing for attention.
- **Surface Strategy:** We move away from the "border-everything" mentality.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning or layout divisions. Boundaries must be defined solely through background color shifts.
*   **Action:** Use `surface-container-low` for the page background and `surface-container-lowest` (Pure White) for card elements. The contrast between these two tokens is our "invisible" divider.

### The "Glass & Gradient" Rule
To add "soul" to the security-focused interface, use semi-transparent surfaces for floating navigation elements.
*   **Implementation:** Apply `surface` at 80% opacity with a `24px` backdrop-blur. 
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` to `primary_dim` (135° angle). This adds a tactile, premium weight that a flat hex code cannot achieve.

---

## 3. Typography: The Editorial Voice

We utilize a dual-font strategy to balance technical precision with approachable modernism.

| Level | Token | Font | Size | Weight | Intent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | 3.5rem | 700 | Large, bold metric highlights. |
| **Headline**| `headline-md`| Manrope | 1.75rem | 600 | Section headers; sharp and decisive. |
| **Title**   | `title-md`   | Inter | 1.125rem | 500 | Card titles and sub-navigation. |
| **Body**    | `body-md`    | Inter | 0.875rem | 400 | The workhorse for legal text/data. |
| **Label**   | `label-md`   | Inter | 0.75rem | 600 | Small-caps or meta-data. |

**Editorial Spacing:** Paragraphs (`body-lg`) should utilize a line-height of 1.6 to ensure legibility during long-form privacy policy reviews.

---

## 4. Elevation & Depth

### The Layering Principle
Instead of shadows, we stack surfaces.
1.  **Base:** `surface` (The foundation)
2.  **Sectioning:** `surface-container-low` (Subtle inset areas)
3.  **Active Content:** `surface-container-lowest` (The "Sheet of Paper" card)

### Ambient Shadows
When a component must "float" (e.g., a modal or dropdown), use an **Ambient Glow** rather than a drop shadow.
*   **Specs:** `0px 20px 40px rgba(43, 52, 55, 0.06)`. 
*   **Shadow Color:** Use a tinted version of `on_surface` to maintain a natural, photographic feel.

### The "Ghost Border" Fallback
If a border is required for high-risk data containment (accessibility), it must be a **Ghost Border**:
*   **Token:** `outline-variant` at 20% opacity. 
*   **Restriction:** Never use 100% opaque borders for decorative separation.

---

## 5. Components

### Buttons: The Tactile Primary
*   **Primary:** Gradient of `primary` to `primary_dim`. Roundedness: `md` (0.375rem).
*   **Secondary:** `surface-container-high` background with `on_surface` text. No border.
*   **State:** On hover, a subtle `1.02x` scale-up with a smooth `200ms` cubic-bezier transition.

### Cards & Intelligence Lists
*   **Rule:** Forbid divider lines. Use `1.5rem` (24px) of vertical white space to separate list items.
*   **Interactivity:** On hover, list items shift from `surface` to `surface-container-highest`.

### Status Micro-Chips
*   **Safe/Success:** `on_tertiary_container` (text) on `tertiary_container` (fill).
*   **Risk/Danger:** `on_error_container` (text) on `error_container` (fill).
*   **Shape:** `full` (pill) for a softer, human-centric feel in a legal context.

### Data Inputs
*   **Resting:** `surface-container-low` background, no border.
*   **Focus:** `outline` (Ghost Border at 20%) and a subtle glow of `primary` at 5% opacity.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional tool. If a screen feels cluttered, increase the padding to the next step in the scale.
*   **DO** use `Manrope` for all numbers and metrics. It is designed for clarity in high-density data.
*   **DO** favor "nested" containers (a card inside a section) over side-by-side boxes.

### Don't
*   **DON'T** use pure black (#000) for text. Use `on_surface` (#2B3437) to keep the contrast "sophisticated" rather than "harsh."
*   **DON'T** use standard "Drop Shadows." If it doesn't look like ambient light hitting a surface, it's too heavy.
*   **DON'T** use 90-degree corners. Even the "sharpest" element should have the `sm` (0.125rem) radius to feel modern and premium.