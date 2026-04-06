```markdown
# Design System Specification: The Village Ledger

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Ledger."** 

This system rejects the cold, sterile nature of modern enterprise software in favor of the tactile warmth found in high-end stationary and cozy simulation games. It is a "Stardew Valley" aesthetic filtered through a sophisticated, Neo-Brutalist lens. We achieve this by marrying the heavy, confident linework of architectural drafting with the soft, organic textures of a sun-drenched village office.

The design breaks the "SaaS template" look by utilizing **intentional asymmetry** and **exaggerated physical depth**. We are not building a flat web interface; we are composing a series of layered paper artifacts.

---

## 2. Colors & Surface Architecture
The palette is rooted in high-contrast clarity, softened by a "Paper & Ink" philosophy. 

### The Palette
- **Core Surface:** `background` (#fffbff) and `surface_container` (#f7f4e5) form the base of our "sunny office."
- **The Ink:** `on_surface` (#39382b) is our primary "ink"—a deep, warm charcoal that provides high contrast without the harshness of pure hex-black.
- **Accent Tones:** `secondary` (#75604e) provides earthy, wood-like warmth, while `tertiary` (#4e6e00) acts as our "meadow green" for positive actions and success states.

### The "Layered Paper" Rule
To move beyond generic UI, we prohibit the use of 1px dividers. Boundaries must be defined through:
1.  **Thick Neo-Brutalist Outlines:** Use `primary` (#5f5e5e) at 2pt or 3pt for primary containers.
2.  **Tonal Shifts:** Place a `surface_container_lowest` (#ffffff) card inside a `surface_container` (#f7f4e5) section to create a soft, natural lift.
3.  **Signature Textures:** Apply a subtle noise or "paper grain" SVG overlay to the `background` to give the digital space a physical soul.

---

## 3. Typography
Our typography is a conversation between **readability** and **character**.

- **The Voice (Display & Headlines):** We use `spaceGrotesk` to mimic a sophisticated, modern interpretation of pixel-art geometry. It feels structural yet charming. Use `display-lg` (3.5rem) for hero moments to command the page like a newspaper header.
- **The Hand (Body & Labels):** We use `inter` for all functional text. It provides the "trustworthy" and "organized" counter-balance to the playful headlines.
- **Editorial Contrast:** Always pair a `headline-lg` in `spaceGrotesk` with a `body-md` in `inter`. The stark difference in "personality" between the two fonts is what creates the high-end editorial feel.

---

## 4. Elevation & Depth
In this system, depth is **tactile**, not digital.

- **The Stacking Principle:** Rather than using 20% opacity black shadows, use "Ambient Tint Shadows." If a card needs to float, its shadow should be a blurred version of `secondary_container` (#faddc7) at 40% opacity. This mimics sunlight hitting a physical object.
- **Glassmorphism:** For floating menus or "privacy audit" overlays, use a semi-transparent `surface_bright` with a `20px` backdrop blur. This keeps the UI feeling "sunny" and airy rather than heavy and enclosed.
- **The Ghost Border:** For low-priority grouping, use the `outline_variant` (#bcbaa7) at 20% opacity. Never use a solid, high-contrast line for secondary elements.

---

## 5. Components

### Buttons (The "Village Stamps")
- **Primary:** `on_primary` text on `primary` background. Must have a 2pt solid black border and `md` (0.75rem) rounded corners.
- **Secondary:** `on_secondary_container` text on `secondary_container`. Use this for "warm" but non-critical actions.
- **Interaction:** On hover, buttons should shift 2px up and to the left, with a "hard" shadow appearing behind them to mimic a physical stamp being pressed.

### Input Fields (The "Ledger Entries")
- **Base:** High-contrast `2pt` borders using `outline`.
- **Focus State:** Border color shifts to `tertiary` (#4e6e00) with a subtle `tertiary_container` outer glow.
- **Labels:** Always use `label-md` in `on_surface_variant`, positioned slightly "off-axis" (2px left) for a hand-aligned feel.

### Cards & Lists
- **Rule:** Forbid divider lines. 
- **Execution:** Use vertical white space from the `xl` spacing scale. For lists, use alternating background tints between `surface_container_low` and `surface_container_lowest`.
- **Corners:** Use `lg` (1rem) roundedness for outer containers and `sm` (0.25rem) for internal chips to create a "nested" visual hierarchy.

### Signature Component: The "Audit Ribbon"
A decorative vertical banner using `tertiary` that sticks to the side of cards to indicate a "Verified" or "Secure" status, utilizing hand-drawn 8-bit iconography.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** It’s okay if a layout feels slightly "weighted" to one side; it mimics a hand-organized desk.
- **Use "Human" Spacing:** Favor generous padding (`xl`: 1.5rem) to ensure the UI feels "approachable" and "cozy."
- **Layer Textures:** Apply a 2% opacity grain texture to all `surface` layers to break the digital flatness.

### Don’t:
- **Don't use 1px lines:** They feel "default" and "cheap." If a line is needed, make it 2pt and intentional.
- **Don't use pure Greys:** Always use our warm, earthy `on_surface` or `on_surface_variant`. Cold greys kill the "sunny village" mood.
- **Don't over-animate:** Transitions should be "snappy" (200ms) rather than "slippery." Think of a page turning, not a fluid moving.

---

## 7. Iconography
Icons must be **simple and "student-loving."** Use 2pt stroke weights to match the UI borders. Avoid sharp 90-degree corners in icons; keep them slightly rounded and "hand-drawn" in appearance to maintain the friendly, trustworthy vibe of a "sunny village office."