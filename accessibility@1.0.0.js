(function () {
  'use strict';

  const STORAGE_KEY = 'a11y';
  const defaults = { fontSize: 0, highContrast: false, inverted: false, grayscale: false, underlineLinks: false, noAnimations: false, readableFont: false };
  let state = Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));

  function applyState() {
    const h = document.documentElement;
    h.classList.toggle('a11y-font-lg',  state.fontSize === 1);
    h.classList.toggle('a11y-font-xl',  state.fontSize === 2);
    h.classList.toggle('a11y-font-xxl', state.fontSize === 3);
    h.classList.toggle('a11y-high-contrast', state.highContrast);
    h.classList.toggle('a11y-inverted',      state.inverted);
    h.classList.toggle('a11y-grayscale',      state.grayscale);
    h.classList.toggle('a11y-underline-links', state.underlineLinks);
    h.classList.toggle('a11y-no-animations',   state.noAnimations);
    h.classList.toggle('a11y-readable-font',   state.readableFont);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      html.a11y-font-lg  * { font-size: 110% !important; }
      html.a11y-font-xl  * { font-size: 125% !important; }
      html.a11y-font-xxl * { font-size: 150% !important; }
      html.a11y-high-contrast { filter: contrast(150%); background: #000 !important; color: #ff0 !important; }
      html.a11y-inverted { filter: invert(100%) hue-rotate(180deg); }
      html.a11y-grayscale { filter: grayscale(100%); }
      html.a11y-underline-links a { text-decoration: underline !important; text-decoration-thickness: 2px !important; }
      html.a11y-no-animations *, html.a11y-no-animations *::before, html.a11y-no-animations *::after { animation: none !important; transition: none !important; }
      html.a11y-readable-font * { font-family: Arial, sans-serif !important; letter-spacing: .04em !important; line-height: 1.7 !important; }

      #a11y-btn { position: fixed; bottom: 80px; left: 16px; z-index: 99998; width: 44px; height: 44px; border-radius: 50%; background: #333; color: #fff; border: none; font-size: 20px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.3); }
      #a11y-panel { position: fixed; bottom: 134px; left: 16px; z-index: 99999; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,.2); padding: 16px; width: 220px; direction: rtl; }
      #a11y-panel h3 { font-size: 13px; color: #333; margin-bottom: 12px; font-family: sans-serif; }
      .a11y-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; font-family: sans-serif; color: #444; }
      .a11y-toggle { position: relative; width: 38px; height: 20px; }
      .a11y-toggle input { opacity: 0; width: 0; height: 0; }
      .a11y-slider { position: absolute; inset: 0; background: #ccc; border-radius: 20px; cursor: pointer; transition: .3s; }
      .a11y-slider::before { content: ''; position: absolute; width: 14px; height: 14px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: .3s; }
      .a11y-toggle input:checked + .a11y-slider { background: #0084ff; }
      .a11y-toggle input:checked + .a11y-slider::before { transform: translateX(18px); }
      .a11y-font-btns { display: flex; gap: 4px; }
      .a11y-font-btns button { padding: 3px 8px; font-size: 11px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background: #f5f5f5; }
      .a11y-font-btns button.active { background: #0084ff; color: #fff; border-color: #0084ff; }
      .a11y-reset { width: 100%; padding: 6px; font-size: 12px; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; background: #f5f5f5; margin-top: 4px; font-family: sans-serif; }
      .a11y-version { display: block; text-align: center; font-size: 10px; color: #bbb; margin-top: 8px; font-family: sans-serif; text-decoration: none; }
      .a11y-version:hover { color: #888; }
    `;
    document.head.appendChild(s);
  }

  function buildPanel() {
    const btn = document.createElement('button');
    btn.id = 'a11y-btn';
    btn.title = 'נגישות';
    btn.textContent = '♿';

    const panel = document.createElement('div');
    panel.id = 'a11y-panel';
    panel.hidden = true;

    function toggle(key, el) {
      el.checked = state[key];
      el.addEventListener('change', () => { state[key] = el.checked; applyState(); });
    }

    panel.innerHTML = `
      <h3>הגדרות נגישות</h3>
      <div class="a11y-row"><span>גודל גופן</span>
        <div class="a11y-font-btns">
          <button data-size="0">רגיל</button>
          <button data-size="1">+</button>
          <button data-size="2">++</button>
          <button data-size="3">+++</button>
        </div>
      </div>
      <div class="a11y-row"><span>ניגודיות גבוהה</span><label class="a11y-toggle"><input type="checkbox" id="a11y-contrast"><span class="a11y-slider"></span></label></div>
      <div class="a11y-row"><span>צבעים הפוכים</span><label class="a11y-toggle"><input type="checkbox" id="a11y-inverted"><span class="a11y-slider"></span></label></div>
      <div class="a11y-row"><span>גוונים אפורים</span><label class="a11y-toggle"><input type="checkbox" id="a11y-gray"><span class="a11y-slider"></span></label></div>
      <div class="a11y-row"><span>קו תחת לינקים</span><label class="a11y-toggle"><input type="checkbox" id="a11y-links"><span class="a11y-slider"></span></label></div>
      <div class="a11y-row"><span>ללא אנימציות</span><label class="a11y-toggle"><input type="checkbox" id="a11y-anim"><span class="a11y-slider"></span></label></div>
      <div class="a11y-row"><span>גופן קריא</span><label class="a11y-toggle"><input type="checkbox" id="a11y-font"><span class="a11y-slider"></span></label></div>
      <button class="a11y-reset" id="a11y-reset">איפוס</button>
      <a class="a11y-version" href="https://scriptable.dev" target="_blank" rel="noopener">accessibility@1.0.0 · scriptable.dev</a>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    btn.addEventListener('click', () => { panel.hidden = !panel.hidden; });

    panel.querySelectorAll('[data-size]').forEach(b => {
      if (parseInt(b.dataset.size) === state.fontSize) b.classList.add('active');
      b.addEventListener('click', () => {
        state.fontSize = parseInt(b.dataset.size);
        panel.querySelectorAll('[data-size]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        applyState();
      });
    });

    toggle('highContrast', panel.querySelector('#a11y-contrast'));
    toggle('inverted', panel.querySelector('#a11y-inverted'));
    toggle('grayscale', panel.querySelector('#a11y-gray'));
    toggle('underlineLinks', panel.querySelector('#a11y-links'));
    toggle('noAnimations', panel.querySelector('#a11y-anim'));
    toggle('readableFont', panel.querySelector('#a11y-font'));

    panel.querySelector('#a11y-reset').addEventListener('click', () => {
      state = Object.assign({}, defaults);
      applyState();
      panel.hidden = true;
    });
  }

  injectStyles();
  applyState();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }
})();
