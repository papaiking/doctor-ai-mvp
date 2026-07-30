# Phase 1: Landing Page - Context

**Gathered:** 2026-07-30
**Status:** Ready for planning

<domain>
## Phase Boundary

A professional marketing landing page for Doctor Genie AI Healthcare Ecosystem. Communicates the ecosystem vision, showcases AI capabilities through embedded YouTube demos, and drives CTA conversions (co-founders, partners, investors, advisors). 10 sections as specified in REQUIREMENTS.md.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack & Project Structure
- **Location:** `landing-page/` subdirectory in the monorepo (alongside `doctor-mobile/`, `doctor-robot/`)
- **Stack:** Static HTML + CSS + JS (vanilla, no framework)
- **Tooling:** Vite dev server with vanilla HTML/CSS/JS template
- **Forms:** PHP scripts inside `landing-page/` directory for form handling
- **Deployment:** Any web server supporting static files + PHP

### Theme Direction
- **Theme:** Light theme (not dark)
- **Hero:** Static high-quality photorealistic hero image (no video background)
- **Hero image subject:** Robot AI caring for a multi-generational family (modern, warm, medical tech tones)
- **Color palette:** White (#FFFFFF), Blue (#2563EB), Green (#22C55E), Dark Gray (#1F2937)
- **Style:** Modern minimalism inspired by Apple, Tesla, Figure AI, OpenAI

### Section Layout & Navigation
- **Navigation:** Traditional scroll with sticky header
- **Section heights:** Content-determined (not full-viewport snap)
- **Section ordering:** As specified in REQUIREMENTS.md (Hero → Bác sĩ AI → My Doctor → Nền tảng AI → Trải nghiệm người bệnh → Hệ sinh thái → Chúng tôi đang tìm kiếm → Tầm nhìn → Tham gia liên minh → Liên hệ)
- **YouTube embeds:** Inline thumbnail with play button overlay (loads iframe on click)
- **Images:** Minimum 4K resolution, photorealistic or high-quality 3D

### CTA Interaction Model
- **Mechanism:** PHP form modals (open on CTA click)
- **Form structure:** Single unified form with role selector dropdown (Co-founder / Partner / Investor / Advisor)
- **Submission:** PHP sends notification email to thuc@gnixy.com AND sends confirmation email back to the submitter
- **CTAs:** Trở thành Đồng sáng lập, Trở thành Đối tác, Đồng hành đầu tư, Trở thành Cố vấn

### Claude's Discretion
- Exact sticky header design and breakpoint
- Section spacing and padding values
- Form field design (beyond role selector + name + email)
- PHP email templating
- Image selection/sourcing (within spec constraints)
- Responsive breakpoint specifics
- Loading states and transition timings

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Spec
- `.planning/REQUIREMENTS.md` — Full section list, visual identity constraints, CTA types, YouTube video URLs, contact info
- `.planning/PROJECT.md` — Design philosophy, core principles, color palette
- `.planning/ROADMAP.md` — Phase 1 deliverables list

### Existing Code Patterns (reference)
- `doctor-mobile/package.json` — Confirms Tailwind CSS v4, motion, lucide-react versions in the monorepo
- `doctor-mobile/src/index.css` — Existing Tailwind theme config (Inter font, color tokens)
- `doctor-mobile/vite.config.ts` — Vite + Tailwind plugin setup pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Tailwind CSS v4** (`@tailwindcss/vite`): Established in doctor-mobile — can reuse same build plugin for the landing page
- **Inter font**: Already used via Google Fonts import in doctor-mobile — consistent typography across the ecosystem
- **Lucide icons**: Available for any icon needs in the landing page

### Established Patterns
- **Styling**: Tailwind CSS utility classes (doctor-mobile uses extensively)
- **Animations**: `motion` library available if needed
- **Build**: Vite with Tailwind plugin — pattern already proven in doctor-mobile

### Integration Points
- `landing-page/` will be a new subdirectory — no direct code integration with doctor-mobile
- PHP form handler lives inside `landing-page/` — self-contained
- Contact email (thuc@gnixy.com) already defined in REQUIREMENTS.md

</code_context>

<specifics>
## Specific Ideas

- "I don't want to use Next.js" — static HTML/CSS/JS with Vite dev tooling
- "Use hero image instead of video" — static photorealistic hero image
- Light theme chosen over dark
- Thumbnail + play overlay for YouTube embeds (not always-visible iframes)
- Single form with role selector (not separate forms per CTA)
- PHP sends both notification email AND customer confirmation email

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-landing-page*
*Context gathered: 2026-07-30*
