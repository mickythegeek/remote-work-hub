# Design System Document

## 1. Overview & Creative North Star: "The Curated Authority"

This design system is built upon the philosophy of **"The Curated Authority."** In a world of digital noise, this system acts as a high-end lens—filtering out the extraneous to present only what is essential. We move beyond the "generic SaaS" look by adopting an editorial mindset: spacious, intentional, and authoritative.

The system rejects the rigid, "boxed-in" layout of standard web applications. Instead, it utilizes **Organic Asymmetry** and **Tonal Depth**. By overlapping elements and utilizing a sophisticated hierarchy of surfaces, we create an experience that feels less like a database and more like a premium physical portfolio or a high-end digital gallery.

**Creative North Star Principles:**
*   **Precision over Volume:** Every pixel must earn its place.
*   **Intentional Air:** White space is not "empty"; it is a luxury material used to frame the content.
*   **Layered Intelligence:** We use depth and surface shifts, rather than lines, to define structure.

---

## 2. Colors & Surface Architecture

The color palette is rooted in a deep, intellectual blue paired with a crystalline background. It communicates stability, intelligence, and elite efficiency.

### Surface Hierarchy & The "No-Line" Rule
To achieve a premium, custom feel, **1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely through background color shifts or subtle tonal transitions.

*   **The Foundation:** Use `surface` (#f9f9fd) for the primary application background.
*   **The Layering Principle:** Treat the UI as stacked sheets of fine paper. 
    *   Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f3f7) section to create a soft, natural lift.
    *   Use `surface-container-highest` (#e2e2e6) only for the most recessed or utility-based background elements (like a sidebar or a footer).
*   **The Glass & Gradient Rule:** For prominent elements like the "Hero" search bar or high-level navigation, use **Glassmorphism**. Apply `surface-container-lowest` at 80% opacity with a `24px` backdrop-blur. 
*   **Signature Textures:** Main CTAs should not be flat. Use a subtle linear gradient from `primary` (#003a63) to `primary_container` (#005288) at a 135-degree angle to provide a sense of "visual soul."

---

## 3. Typography: The Editorial Scale

We utilize two distinct sans-serifs to create a rhythmic, curated feel. **Manrope** provides a geometric, modern authority for headlines, while **Inter** ensures crystalline readability for data and body text.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) and `headline-md` (1.75rem) to create clear, unapologetic entry points. The generous tracking in headlines should be slightly tightened (-0.02em) to feel "locked-in" and professional.
*   **The Information Layer (Inter):** Use `body-md` (0.875rem) for the majority of the interface text. It is clean, neutral, and efficient.
*   **Hierarchy through Scale:** To convey an elite brand, lean into high contrast. A `display-sm` headline paired with a `label-md` category tag creates a sophisticated, boutique-level typographic hierarchy.

---

## 4. Elevation & Depth

We move away from traditional shadows in favor of **Tonal Layering**.

*   **Ambient Shadows:** When an element *must* float (e.g., a modal or a primary search bar), use an extra-diffused shadow.
    *   *Value:* `0px 24px 48px rgba(25, 28, 30, 0.06)`
    *   The shadow color is a tinted version of `on-surface` (#191c1e), mimicking natural light.
*   **The "Ghost Border" Fallback:** If a container sits on an identical color and needs definition (accessibility), use a "Ghost Border": `outline-variant` (#c1c7d1) at **15% opacity**. Never use 100% opaque borders.
*   **Vertical Momentum:** Content should feel like it is flowing upward. Use the `xl` (0.75rem) roundedness for large containers and `md` (0.375rem) for smaller interactive elements to maintain a soft but professional edge.

---

## 5. Components

### The Search Architecture (Primary Component)
Following the "Digital Curator" visual style, the search bar is the centerpiece. 
*   **Style:** Large, `surface-container-lowest` fill, `xl` corner radius, and a high-diffusion ambient shadow.
*   **Interaction:** On focus, the container should slightly expand (scale 1.01) and the `primary` color should appear as a 2px "glow" (using `primary_fixed` at 30% opacity).

### List Items & Job Cards
*   **No Dividers:** Forbid the use of horizontal lines between list items. 
*   **Separation:** Use `8px` of vertical white space and a subtle background shift on hover (`surface-container-low`).
*   **Metadata:** Use `label-md` in `on-surface-variant` (#41474f) for secondary details (location, salary) to keep the focus on the `title-lg` job name.

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `on-primary` text, `full` (pill) roundedness.
*   **Secondary:** `surface-container-high` background with `on-secondary-container` text. No border.
*   **Tertiary:** Ghost style. `on-surface` text with a background that appears only on hover (`surface-container-low`).

### Chips
*   **Style:** Small, `sm` (0.125rem) or `full` roundedness. Use `secondary_container` with `on-secondary-container` text for a subtle, high-end "tag" look.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. For example, a wider left margin for a headline to create an "editorial" layout.
*   **Do** utilize nested surfaces. A `surface-container-lowest` card inside a `surface-container-low` section is the standard for depth.
*   **Do** prioritize typography over icons. Let the words lead.

### Don’t:
*   **Don’t** use black (#000000) for text. Use `on-surface` (#191c1e) to maintain a premium, soft-contrast feel.
*   **Don’t** use 1px solid borders to separate sections. It breaks the "curated" aesthetic and feels like a template.
*   **Don’t** use standard "drop shadows." Only use the diffused, low-opacity Ambient Shadows specified in Section 4.