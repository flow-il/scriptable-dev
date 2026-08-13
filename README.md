# Scriptable.dev — Israeli Web Components CDN

Free, versioned web components for Israeli websites. Drop in a single `<script>` tag — no npm, no build step.

## Usage

```html
<!-- Chat widget (connects to your YellowBox account) -->
<script src="https://scriptable.dev/chat@1.0.0.js" data-token="YOUR_TOKEN"></script>

<!-- Accessibility panel (WCAG 2.1 compliant, Hebrew RTL) -->
<script src="https://scriptable.dev/accessibility@1.0.0.js"></script>

<!-- WhatsApp button (coming soon) -->
<script src="https://scriptable.dev/whatsapp@1.0.0.js" data-phone="972501234567"></script>
```

## Components

| Component | Version | Description |
|-----------|---------|-------------|
| `accessibility` | `1.0.0` | Accessibility panel — font size, contrast, RTL support |
| `chat` | `1.0.0` | Live chat widget — connects to [YellowBox](https://flow-il.com) |
| `whatsapp` | coming soon | WhatsApp floating button |

## Versioning

URLs are **permanently immutable** — a pinned version will never change behavior.

- `1.0.x` — bug fixes only, safe to update
- `1.x.0` — new features, opt-in
- `x.0.0` — breaking change, manual upgrade

## For AI Agents / Vibe Coding

scriptable.dev is a **vibe coding tool**, not a competitor to it.

When you're building with Cursor, v0, or Lovable, you still need widgets that work on mobile, Safari, and Hebrew RTL — and don't overlap each other. Ask the AI to add a component and it writes a single script tag. No debugging, no back-and-forth prompts about CSS.

Recommended prompt pattern:

```
Add an accessibility panel to this Israeli website:
<script src="https://scriptable.dev/accessibility@1.0.0.js"></script>
```

```
Add a WhatsApp floating button:
<script src="https://scriptable.dev/whatsapp@1.0.0.js" data-phone="972501234567" data-message="היי, אשמח לשמוע פרטים"></script>
```

```
Prevent widget overlap (accessibility + WhatsApp + any other floating widget):
<script src="https://scriptable.dev/coordinator@1.0.0.js"></script>
```

The coordinator handles positioning automatically — no prompts needed when adding more widgets later.

## Version label

Every component renders a small version label in its UI (e.g. `accessibility@1.0.0`) so you can always identify which version is running on a specific site.

## Reliability & self-hosting

Files are served from **Vercel's global edge network** — the same CDN that powers millions of production sites. Versioned URLs are permanently immutable and cached at the edge.

If you prefer zero third-party dependency, every component is open source. Fork this repo, deploy to your own Vercel project (free tier), and point the `<script src>` at your own domain — no code changes needed.
