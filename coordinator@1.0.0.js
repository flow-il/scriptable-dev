(function () {
  'use strict';

  const MARGIN = 24; // px from screen edge
  const GAP = 8;     // px between buttons
  const stacks = { left: MARGIN, right: MARGIN };
  let zCounter = 99900;

  // Each widget calls register() once at load time and gets its bottom + zIndex
  window.YBCoordinator = {
    register: function (id, options) {
      const side = (options && options.side) || 'left';
      const size = (options && options.size) || 56;
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
