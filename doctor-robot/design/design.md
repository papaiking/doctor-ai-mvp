# design.md: Gnixy Healthcare Voice AI Agent

## 1. Design System Tokens (Gnixy Platform Standard)
*   **Color Palette:**
    *   `--color-primary`: #0052CC (Gnixy Blue)
    *   `--color-background`: #FFFFFF (White)
    *   `--color-surface`: #F4F7FA (Light Gray/Blue tint)
    *   `--color-text-main`: #111827 (Deep Slate)
    *   `--color-text-muted`: #6B7280 (Gray)
    *   `--color-error`: #EF4444 (Red)
    *   `--color-success`: #10B981 (Green)
*   **Typography:**
    *   `font-family`: "Inter", -apple-system, sans-serif
    *   `base-size`: 16px
    *   `heading-weight`: 600
*   **Shapes & Spacing:**
    *   `border-radius`: 8px (Standard buttons/inputs)
    *   `container-padding`: 24px
    *   `input-border`: 1px solid #E5E7EB

## 2. Global Components
*   **Header:** 
    *   Left-aligned Gnixy Logo (SVG/Image).
    *   Sticky positioning at the top.
*   **Footer:**
    *   Centrally aligned links: `Contact us` | `Privacy policy`.
    *   Font size: 12px; Color: `--color-text-muted`.

## 3. Core Application Layout
### A. The Voice Canvas (Hero Component)
*   **Visualizer:** A dynamic, centered canvas element.
*   **Behavior:** 
    *   `Idle`: Static brand-colored circle.
    *   `Listening`: Multi-layered pulsing rings or fluid wave animation.
    *   `Speaking`: Waveform bars reacting to audio frequencies.

### B. Chat Interface
*   **Container:** Centered, maximum width of 800px.
*   **Message Bubbles:**
    *   `User`: Right-aligned, `--color-primary` background, white text.
    *   `AI Agent`: Left-aligned, `--color-surface` background, `--color-text-main` text.
*   **Scrolling:** Automatic "scroll-to-bottom" on new message generation.

### C. Controls & Inputs
*   **Action Button:** 
    *   Primary "Pill" shape.
    *   State 1 (Start): "Start Conversation" with a Microphone icon.
    *   State 2 (Stop): "Stop Conversation" with a Stop/Square icon (Danger/Red variant).
*   **Text Input:** Standard Gnixy text field for fallback typing, located below the chat history.

## 4. State Management Visuals
*   **Loading:** Skeleton UI for message bubbles; pulsing "Thinking" state on the canvas.
*   **Error:** Inline alert messages using `--color-error` with a small warning icon.
*   **Success:** Temporary toast notifications for confirmed actions.

## 5. Metadata for Stitch
*   **Platform Target:** Mobile-first, Responsive Web.
*   **URL Context:** Inherit styles from `https://business.gnixy.com/`.
*   **Interaction Model:** Voice-first, Text-secondary.