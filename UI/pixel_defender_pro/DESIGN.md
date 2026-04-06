```markdown
# Design System Strategy: The Neon Dungeon Master

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **"The Digital Dungeon Crawler."** 

We are moving away from the "flat and sterile" trend of modern SaaS. Instead, we are treating the privacy interface as a high-stakes arcade quest. The layout strategy rejects the standard 12-column grid in favor of **"Modular Loot Slots"**—asymmetrical, intentional clusters of information that feel like an RPG inventory screen rather than a corporate dashboard. We utilize overlapping elements and "floating sprite" icons to break the container walls, creating a sense of depth that feels like a multi-layered parallax background from a classic 16-bit side-scroller.

## 2. Colors & Surface Architecture
Our palette leverages a "Vibrant Dark Mode" logic. The depth is not found in shadows, but in the luminous glow of neon against the void.

*   **The "No-Line" Rule:** Standard 1px lines are strictly forbidden. In this system, boundaries are defined by **Surface Shifts**. A section of content (e.g., a "Quest Log") should be defined by transitioning from `surface` (#140727) to `surface-container-low` (#190b30). 
*   **Surface Hierarchy & Nesting:** Think of the UI as a series of stacked PC boards. 
    *   **Level 0:** `surface-dim` for the global backdrop.
    *   **Level 1:** `surface-container` for main navigation areas.
    *   **Level 2:** `surface-container-highest` for active "Inventory Slots" or Dialogue boxes.
*   **The "Glow & Gradient" Rule:** To achieve a premium arcade feel, CTAs should never be flat. Use a linear gradient from `primary` (#9cff93) to `primary-container` (#00fc40) at a 45-degree angle. This simulates a backlit LED button.
*   **Signature Textures:** Apply a subtle scanline overlay (2px horizontal stripes at 3% opacity) over `surface-container` elements to ground the retro aesthetic in a high-end "CRT" finish.

## 3. Typography: Editorial Pixelation
We balance nostalgia with extreme readability. The tension between the "Display" and "Body" fonts creates the premium editorial feel.

*   **The Display Scale (Space Grotesk):** While the prompt suggests pixel fonts, we use `spaceGrotesk` for all Display and Headline levels. Its geometric, slightly "tech" quirks provide a cleaner, more professional "High-End Arcade" look than a standard low-res pixel font. 
    *   *Usage:* Use `display-lg` for "Quest Titles" and `headline-md` for "Boss Encounters" (Privacy Threats).
*   **The Body Scale (Manrope):** All functional information—legal jargon, privacy policies, and instructions—must use `manrope`. This ensures that while the app looks like a game, the student’s privacy education is never compromised by poor legibility. 
    *   *Usage:* `body-md` for general text; `title-sm` for button labels.

## 4. Elevation & Depth: The Tonal Stack
We do not use drop shadows. Shadows in 8-bit games were usually just offset black shapes; we modernize this through **Tonal Layering**.

*   **The Layering Principle:** To "lift" a card, do not add a shadow. Instead, change the background to `surface-container-highest` (#2e1c4b) and apply a 4px "Ghost Border."
*   **The "Ghost Border":** While 1px lines are banned, "Chunky" borders are our signature. Use a 4px inset or outset border using the `outline-variant` (#4f4165) at 40% opacity. This mimics the "beveled" look of retro UI without looking cheap.
*   **Glassmorphism & Depth:** For floating "Power-Up" notifications or tooltips, use `surface-bright` (#352254) with a 60% opacity and a 12px backdrop blur. This makes the neon colors of the background bleed through, creating a "Poison Green" or "Electric Blue" frosted glass effect.

## 5. Components

### Buttons (The "Insert Coin" Variant)
*   **Primary:** A 4px "block-drop" style. Background: `primary` gradient. No rounded corners (`0px`). On hover, the button should shift 2px down and 2px right to simulate a physical "pressed" arcade switch.
*   **Secondary:** `secondary` (#00e3fd) outline (4px) with a transparent center.

### Cards (The "Dialogue Box")
*   Cards must use `surface-container-low`. 
*   **Rule:** No dividers. Separate the "Header" from the "Body" of the card by shifting the Header's background to `surface-container-high`.

### Input Fields (The "Command Line")
*   Background: `surface-container-lowest` (#000000). 
*   Border: 2px solid `outline` (#7e6f95).
*   Focus State: Border color switches to `secondary` (#00e3fd) with a subtle outer glow (4px blur, `secondary` color).

### Additional "Game-State" Components
*   **Health Bars (Progress):** Use `tertiary` (#ff6e81) for the "Health" (Privacy Score). As the score drops, the color transitions to `error` (#ff7351).
*   **XP Badges (Chips):** Use `secondary-container` with `on-secondary-container` text. These should be styled as "Inventory Items" with a small 8-bit icon prefix.

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Let a "Quest Card" be slightly wider than the one next to it if the content demands.
*   **Use High Contrast:** Place `primary` (#9cff93) text directly on `surface` (#140727) for maximum "vibrant dark" impact.
*   **Animate Transitions:** Use "Step" easing for animations (e.g., `transition: all 0.2s steps(4)`) to mimic retro frame rates.

### Don't:
*   **No Rounding:** Every `borderRadius` token is `0px`. Rounding breaks the pixel-perfect immersion.
*   **No Soft Gradients:** Avoid "smooth" multi-color washes. Use only two-step gradients or solid neon fills.
*   **No Standard Iconography:** Do not use generic thin-line icons. All icons must be "sprite-based" with a minimum stroke weight of 2px or composed of pixel-blocks.