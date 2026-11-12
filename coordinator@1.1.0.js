(function () {
  'use strict';

  // coordinator@1.1.0.js — מנהל מיקומי ווידג'טים + עיצוב חופשי (כמו DIV).
  //
  // חדש ב-1.1.0 (לעומת 1.0.1):
  //   · data-style       — מחרוזת CSS חופשית שמוחלת על הכפתורים (שקיפות/צבע/רדיוס/כל דבר).
  //   · data-color / data-padding / data-radius / data-opacity / data-gap — קיצורי-דרך.
  //   · register() מחזיר גם style — הווידג'טים מורחים אותו על הכפתור שלהם.
  //   · hide(id) / show(id) — הסתרה/הצגה של ווידג'ט עם סידור-מחדש של המחסנית (re-stack).
  //   · ברירת מחדל (בלי פרמטרים) = בדיוק ההתנהגות של 1.0.1 — אפס שבירה ✓.
  //
  // גרסאות 1.0.x נשארות ללא שינוי (URLs אימוטביליים).

  const script = document.currentScript || document.querySelector('script[src*="coordinator"]');
  const globalSize = parseInt(script && script.getAttribute('data-size')) || null;

  // היסט התחלתי מהתחתית — לאתרים עם אלמנט קבוע בתחתית (כמו 1.0.1).
  const baseBottom = parseInt(script && script.getAttribute('data-bottom'));
  const MARGIN = Number.isFinite(baseBottom) ? baseBottom : 24;

  // ריווח בין כפתורים — היה GAP=8 קשיח, עכשיו ניתן לשינוי.
  const GAP = parseInt(script && script.getAttribute('data-gap')) || 8;

  // עיצוב חופשי — מחרוזת CSS גולמית (זוכה על הקיצורים).
  const styleStr = (script && script.getAttribute('data-style')) || '';

  const stacks = { left: MARGIN, right: MARGIN };
  const registered = {}; // id -> { id, side, size, hidden, order }
  let zCounter = 99900;

  /** אוסף עיצוב — קיצורי-הדרך + ה-CSS הגולמי (ה-CSS הגולמי מנצח). */
  function buildStyle() {
    const style = {};
    const color = script && script.getAttribute('data-color');
    const padding = parseInt(script && script.getAttribute('data-padding'));
    const radius = parseInt(script && script.getAttribute('data-radius'));
    const opacity = parseFloat(script && script.getAttribute('data-opacity'));
    if (color) style.background = color;
    if (Number.isFinite(padding)) style.padding = padding + 'px';
    if (Number.isFinite(radius)) style.borderRadius = radius + 'px';
    if (Number.isFinite(opacity)) style.opacity = String(opacity);
    if (styleStr) style.cssText = styleStr;
    return style;
  }

  /** מחשב מחדש את המיקומים — לפי סדר הרישום, מדלג על מוסתרים. */
  function recompute() {
    stacks.left = MARGIN;
    stacks.right = MARGIN;
    let z = 99900;
    const order = Object.keys(registered).sort((a, b) => registered[a].order - registered[b].order);
    for (const id of order) {
      const w = registered[id];
      if (w.hidden) {
        w.bottom = null;
        continue;
      }
      w.bottom = stacks[w.side];
      stacks[w.side] += w.size + GAP;
      z += 10;
      w.zIndex = z;
    }
  }

  const style = buildStyle();

  window.YBCoordinator = {
    globalSize: globalSize,
    style: style,
    register: function (id, options) {
      const side = (options && options.side) || 'left';
      const size = (options && options.size) || globalSize || 56;
      registered[id] = { id: id, side: side, size: size, hidden: false, order: Object.keys(registered).length };
      recompute();
      const w = registered[id];
      return { bottom: w.bottom, zIndex: w.zIndex, style: style };
    },
    /** הסתרת ווידג'ט — סוגרת את הרווח (הבאים עולים למעלה). מחזיר false אם לא קיים. */
    hide: function (id) {
      if (!registered[id]) return false;
      registered[id].hidden = true;
      recompute();
      return true;
    },
    /** הצגה מחדש של ווידג'ט מוסתר. מחזיר false אם לא קיים. */
    show: function (id) {
      if (!registered[id]) return false;
      registered[id].hidden = false;
      recompute();
      return true;
    },
    // הקצה העליון של המחסנית — למיקום פאנלים (כמו 1.0.1).
    getStackTop: function (side) {
      return stacks[side || 'left'];
    }
  };
})();
