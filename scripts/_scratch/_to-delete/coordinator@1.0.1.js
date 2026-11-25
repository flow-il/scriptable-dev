(function () {
  'use strict';

  const script = document.currentScript || document.querySelector('script[src*="coordinator"]');
  const globalSize = parseInt(script && script.getAttribute('data-size')) || null;
  // היסט התחלתי מהתחתית — לאתרים שיש להם אלמנט קבוע בתחתית (למשל רצועת CTA צפה).
  // בלעדיו ברירת המחדל היא 24px, כמו ב-1.0.0.
  const baseBottom = parseInt(script && script.getAttribute('data-bottom'));
  const MARGIN = Number.isFinite(baseBottom) ? baseBottom : 24;
  const GAP = 8;     // px between buttons
  const stacks = { left: MARGIN, right: MARGIN };
  let zCounter = 99900;

  window.YBCoordinator = {
    globalSize: globalSize,
    register: function (id, options) {
      const side = (options && options.side) || 'left';
      const size = (options && options.size) || globalSize || 56;
      const bottom = stacks[side];
      stacks[side] += size + GAP;
      zCounter += 10;
      return { bottom: bottom, zIndex: zCounter };
    },
    // returns the top edge of the entire button stack — use for panel positioning
    getStackTop: function (side) {
      return stacks[(side || 'left')];
    }
  };
})();
