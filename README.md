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

Each component is a single script tag. Recommended prompt pattern:

```
Add an accessibility panel to this Israeli website:
<script src="https://scriptable.dev/accessibility@1.0.0.js"></script>
```

```
Add a live chat widget (requires a free account at flow-il.com):
<script src="https://scriptable.dev/chat@1.0.0.js" data-token="TOKEN"></script>
```

## Version label

Every component renders a small version label in its UI (e.g. `accessibility@1.0.0`) so you can always identify which version is running on a specific site.
