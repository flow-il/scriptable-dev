(function () {
  'use strict';

  const script        = document.currentScript || document.querySelector('script[src*="whatsapp"]');
  const phone         = (script && script.getAttribute('data-phone'))    || '';
  const message       = (script && script.getAttribute('data-message'))  || '';
  const label         = (script && script.getAttribute('data-label'))    || 'שלחו לנו הודעה';
  const target        = (script && script.getAttribute('data-target'))   || null;
  const noCoordinator = !!(script && script.hasAttribute('data-no-coordinator'));
  const localSize     = parseInt(script && script.getAttribute('data-size')) || 0;
  const color         = (script && script.getAttribute('data-color'))   || '#25D366';
  const showTooltip   = (script && script.getAttribute('data-tooltip')) !== 'false';

  if (!phone) { console.warn('[whatsapp] missing data-phone'); return; }

  const isInline = !!target;
  const size = localSize || (window.YBCoordinator && window.YBCoordinator.globalSize) || 56;
  const pos = (!isInline && !noCoordinator && window.YBCoordinator)
    ? window.YBCoordinator.register('whatsapp', { side: 'right', size: size })
    : { bottom: 24, zIndex: 99998 };

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      #wa-btn {
        position: fixed;
        right: 24px;
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: ${color};
        border: none; cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,.25);
        display: flex; align-items: center; justify-content: center;
        transition: transform .2s, box-shadow .2s;
        z-index: ${pos.zIndex};
      }
      #wa-btn.wa-inline {
        position: static;
        box-shadow: none;
      }
      #wa-btn:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(0,0,0,.32); }
      #wa-btn.wa-inline:hover { transform: scale(1.08); box-shadow: 0 4px 16px rgba(0,0,0,.25); }
      #wa-btn svg { width: ${Math.round(size * 0.5)}px; height: ${Math.round(size * 0.5)}px; }
      #wa-tooltip {
        position: fixed; right: ${size + 34}px;
        background: #fff; color: #111;
        font-family: system-ui, sans-serif;
        font-size: 13px; font-weight: 500;
        padding: 7px 12px; border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,.15);
        white-space: nowrap; pointer-events: none;
        opacity: 0; transition: opacity .2s;
        z-index: ${pos.zIndex};
      }
      #wa-btn:not(.wa-inline):hover + #wa-tooltip { opacity: 1; }
    `;
    document.head.appendChild(s);
  }

  function buildURL() {
    const base = 'https://wa.me/' + phone.replace(/\D/g, '');
    return message ? base + '?text=' + encodeURIComponent(message) : base;
  }

  function render() {
    const btn = document.createElement('button');
    btn.id = 'wa-btn';
    btn.setAttribute('aria-label', label);

    if (isInline) {
      btn.classList.add('wa-inline');
    } else {
      btn.style.bottom = pos.bottom + 'px';
    }

    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.846L.057 23.571a.75.75 0 0 0 .906.928l5.919-1.55A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.516-5.228-1.415l-.374-.22-3.868 1.013 1.04-3.793-.242-.388A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>`;

    btn.addEventListener('click', function () {
      if (window.__sAnalytics) window.__sAnalytics.track('whatsapp_click', { phone: phone });
      window.open(buildURL(), '_blank', 'noopener');
    });

    if (isInline) {
      const container = document.querySelector(target);
      if (container) { container.innerHTML = ''; container.appendChild(btn); }
      else { console.warn('[whatsapp] data-target not found:', target); document.body.appendChild(btn); }
    } else {
      document.body.appendChild(btn);
      if (showTooltip) {
        const tooltip = document.createElement('div');
        tooltip.id = 'wa-tooltip';
        tooltip.style.bottom = (pos.bottom + 14) + 'px';
        tooltip.textContent = label;
        document.body.appendChild(tooltip);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { injectStyles(); render(); });
  } else {
    injectStyles();
    render();
  }
})();
