(function () {
  'use strict';

  const script     = document.currentScript || document.querySelector('script[src*="coordinator"]');
  const globalSize = parseInt(script && script.getAttribute('data-size')) || null;

  const MARGIN = 24; // px from screen edge
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
