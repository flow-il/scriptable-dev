(function () {
  'use strict';

  const script        = document.currentScript || document.querySelector('script[src*="navigate"]');
  const address       = (script && script.getAttribute('data-address')) || '';
  const lat           = (script && script.getAttribute('data-lat'))     || '';
  const lng           = (script && script.getAttribute('data-lng'))     || '';
  const appsRaw       = (script && script.getAttribute('data-apps'))    || 'google,waze';
  const label         = (script && script.getAttribute('data-label'))   || 'נווט אלינו';
  const target        = (script && script.getAttribute('data-target'))  || null;
  const noCoordinator = !!(script && script.hasAttribute('data-no-coordinator'));
  const localSize     = parseInt(script && script.getAttribute('data-size')) || 0;

  if (!address && !(lat && lng)) { console.warn('[navigate] missing data-address or data-lat/data-lng'); return; }

  const apps     = appsRaw.split(',').map(s => s.trim()).filter(Boolean);
  const isInline = !!target;
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const size = localSize || (window.YBCoordinator && window.YBCoordinator.globalSize) || 56;
  const pos = (!isInline && !noCoordinator && window.YBCoordinator)
    ? window.YBCoordinator.register('navigate', { side: 'right', size: size })
    : { bottom: 24, zIndex: 99996 };

  const APPS = {
    google: {
      label: 'Google Maps',
      color: '#4285F4',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
      url: () => {
        const q = lat && lng ? `${lat},${lng}` : encodeURIComponent(address);
        return isMobile
          ? `https://maps.google.com/?q=${q}`
          : `https://maps.google.com/?q=${q}`;
      }
    },
    waze: {
      label: 'Waze',
      color: '#00C8FF',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.54 6.63C19.67 3.93 17.29 2 14.5 2c-1.89 0-3.59.78-4.82 2.03C8.84 3.38 7.7 3 6.5 3 3.46 3 1 5.46 1 8.5c0 1.93.96 3.63 2.43 4.67L4.5 19h15l1.07-5.83C21.69 12.11 23 10.29 23 8.18c0-.58-.09-1.13-.25-1.65zM12 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>`,
      url: () => {
        if (lat && lng) return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
        return `https://waze.com/ul?q=${encodeURIComponent(address)}&navigate=yes`;
      }
    }
  };

  let popupOpen = false;

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      #nav-btn {
        position: fixed; right: 24px; bottom: ${pos.bottom}px;
        width: ${size}px; height: ${size}px; border-radius: 50%;
        background: #4285F4; color: #fff; border: none; cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,.28);
        display: flex; align-items: center; justify-content: center;
        transition: transform .2s; z-index: ${pos.zIndex};
      }
      #nav-btn.nav-inline { position: static; box-shadow: none; }
      #nav-btn:hover { transform: scale(1.08); }
      #nav-btn.nav-inline:hover { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,0,0,.25); }
      #nav-btn svg { width: ${Math.round(size * 0.46)}px; height: ${Math.round(size * 0.46)}px; }

      #nav-popup {
        position: fixed; right: ${24 + size + 8}px; bottom: ${pos.bottom}px;
        background: #fff; border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0,0,0,.18);
        display: flex; flex-direction: column; gap: 0;
        overflow: hidden; z-index: ${pos.zIndex};
        opacity: 0; pointer-events: none; transform: scale(0.9) translateX(8px);
        transition: opacity .18s, transform .18s;
        font-family: system-ui, sans-serif;
      }
      #nav-popup.open { opacity: 1; pointer-events: all; transform: scale(1) translateX(0); }
      .nav-app-btn {
        display: flex; align-items: center; gap: 10px;
        padding: 12px 16px; border: none; background: #fff;
        cursor: pointer; white-space: nowrap; font-size: 14px; color: #111;
        transition: background .12s; text-align: right;
      }
      .nav-app-btn:not(:last-child) { border-bottom: 1px solid #f0f0f0; }
      .nav-app-btn:hover { background: #f8f8f8; }
      .nav-app-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .nav-app-icon svg { width: 16px; height: 16px; }

      #nav-inline-wrap { display: flex; gap: 8px; flex-wrap: wrap; }
      .nav-inline-btn {
        display: flex; align-items: center; gap: 8px;
        padding: 10px 16px; border: none; border-radius: 8px;
        cursor: pointer; font-size: 14px; color: #fff; font-weight: 500;
        transition: transform .15s, opacity .15s; font-family: system-ui, sans-serif;
      }
      .nav-inline-btn:hover { transform: scale(1.04); opacity: .9; }
      .nav-inline-btn svg { width: 18px; height: 18px; }
    `;
    document.head.appendChild(s);
  }

  function openApp(key) {
    if (window.__sAnalytics) window.__sAnalytics.track('navigate_click', { app: key });
    window.open(APPS[key].url(), '_blank', 'noopener');
  }

  function renderFloating() {
    injectStyles();

    const btn = document.createElement('button');
    btn.id = 'nav-btn';
    btn.setAttribute('aria-label', label);
    btn.style.bottom = pos.bottom + 'px';
    btn.innerHTML = APPS.google.icon;

    if (apps.length === 1) {
      btn.addEventListener('click', () => openApp(apps[0]));
      document.body.appendChild(btn);
      return;
    }

    // multiple apps → popup
    const popup = document.createElement('div');
    popup.id = 'nav-popup';
    apps.forEach(key => {
      const app = APPS[key];
      if (!app) return;
      const row = document.createElement('button');
      row.className = 'nav-app-btn';
      row.innerHTML = `<span class="nav-app-icon" style="background:${app.color}">${app.icon}</span>${app.label}`;
      row.addEventListener('click', () => { openApp(key); closePopup(); });
      popup.appendChild(row);
    });

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      popupOpen = !popupOpen;
      popup.classList.toggle('open', popupOpen);
    });
    document.addEventListener('click', closePopup);

    document.body.appendChild(btn);
    document.body.appendChild(popup);
  }

  function closePopup() {
    popupOpen = false;
    const p = document.getElementById('nav-popup');
    if (p) p.classList.remove('open');
  }

  function renderInline() {
    const container = document.querySelector(target);
    if (!container) { console.warn('[navigate] data-target not found:', target); return; }

    const wrap = document.createElement('div');
    wrap.id = 'nav-inline-wrap';
    injectStyles();

    apps.forEach(key => {
      const app = APPS[key];
      if (!app) return;
      const btn = document.createElement('button');
      btn.className = 'nav-inline-btn';
      btn.style.background = app.color;
      btn.setAttribute('aria-label', app.label);
      btn.innerHTML = `${app.icon}<span>${app.label}</span>`;
      btn.addEventListener('click', () => openApp(key));
      wrap.appendChild(btn);
    });

    container.appendChild(wrap);
  }

  function init() {
    if (isInline) renderInline();
    else renderFloating();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
