# AGENTS — scriptable-dev (אתר הווידג'טים)

> **למעלה:** קודם קוראים את [`../AGENTS.md`](../AGENTS.md) — המטרייה (כללים כלליים + מפת פרויקטים).
> **כאן:** אתר הווידג'טים scriptable.dev. (שלד — יועשר בהמשך.)

## מה זה
אתר Vercel שמארח ווידג'טים (`accessibility` · `analytics` · `bidex` · `coordinator` · `navigate` · `share` · `whatsapp`). נפרס ל-scriptable.dev.

## ⚠️ cache — זמני (להחזיר ביום העלייה)
`vercel.json` שונה ל-`public, max-age=0, must-revalidate` (לפני עלייה לאוויר). **ביום העלייה להחזיר ל-`public, max-age=31536000, immutable`.**
