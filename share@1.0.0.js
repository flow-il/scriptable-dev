(function () {
  'use strict';

  const script        = document.currentScript || document.querySelector('script[src*="share"]');
  const networksRaw   = (script && script.getAttribute('data-networks'))  || 'whatsapp,facebook,telegram,twitter';
  const shareText     = (script && script.getAttribute('data-text'))       || document.title;
  const shareUrl      = (script && script.getAttribute('data-url'))        || window.location.href;
  const target        = (script && script.getAttribute('data-target'))     || null;
  const layout        = (script && script.getAttribute('data-layout'))     || 'horizontal'; // inline: horizontal | vertical
  const direction     = (script && script.getAttribute('data-direction'))  || 'up';         // floating: up | left
  const noCoordinator = !!(script && script.hasAttribute('data-no-coordinator'));
  const localSize     = parseInt(script && script.getAttribute('data-size')) || 0;
  const color         = (script && script.getAttribute('data-color')) || '#1a1a1a';

  const selected = networksRaw.split(',').map(s => s.trim()).filter(Boolean);
  const isInline = !!target;
  const enc = encodeURIComponent;

  const size = localSize || (window.YBCoordinator && window.YBCoordinator.globalSize) || 56;
  const pos = (!isInline && !noCoordinator && window.YBCoordinator)
    ? window.YBCoordinator.register('share', { side: 'right', size: size })
    : { bottom: 24, zIndex: 99997 };

  const NETWORKS = {
    facebook: {
      label: 'Facebook', color: '#1877F2',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>`,
      url: () => `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`
    },
    whatsapp: {
      label: 'WhatsApp', color: '#25D366',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.846L.057 23.571a.75.75 0 0 0 .906.928l5.919-1.55A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.694-.516-5.228-1.415l-.374-.22-3.868 1.013 1.04-3.793-.242-.388A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`,
      url: () => `https://wa.me/?text=${enc(shareText + ' ' + shareUrl)}`
    },
    telegram: {
      label: 'Telegram', color: '#0088cc',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.36l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.983.199z"/></svg>`,
      url: () => `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(shareText)}`
    },
    twitter: {
      label: 'X (Twitter)', color: '#000000',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      url: () => `https://twitter.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(shareText)}`
    },
    linkedin: {
      label: 'LinkedIn', color: '#0A66C2',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
      url: () => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`
    },
    email: {
      label: 'Email', color: '#555555',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
      url: () => `mailto:?subject=${enc(shareText)}&body=${enc(shareUrl)}`
    },
    copy: {
      label: 'העתק קישור', color: '#444444',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`,
      action: (btn) => {
        navigator.clipboard.writeText(shareUrl).then(() => {
          btn.style.background = '#22c55e';
          setTimeout(() => { btn.style.background = NETWORKS.copy.color; }, 2000);
        });
      }
    }
  };

  function makeNetworkBtn(key, size) {
    const net = NETWORKS[key];
    if (!net) return null;
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', net.label);
    btn.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${net.color};border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,opacity .15s;`;
    btn.innerHTML = `<span style="width:${Math.round(size*0.5)}px;height:${Math.round(size*0.5)}px;display:flex;align-items:center;justify-content:center;color:#fff">${net.icon}</span>`;
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.1)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    btn.addEventListener('click', () => {
      if (window.__sAnalytics) window.__sAnalytics.track('share_click', { network: key });
      if (net.action) { net.action(btn); }
      else { window.open(net.url(), '_blank', 'noopener,noreferrer'); }
    });
    return btn;
  }

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      #share-toggle {
        position: fixed; right: 24px; bottom: ${pos.bottom}px;
        width: ${size}px; height: ${size}px; border-radius: 50%;
        background: ${color}; color: #fff; border: none; cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,.3);
        display: flex; align-items: center; justify-content: center;
        transition: transform .2s; z-index: ${pos.zIndex};
      }
      #share-toggle:hover { transform: scale(1.08); }
      #share-toggle svg { width: 22px; height: 22px; }
      #share-panel {
        position: fixed; display: flex; gap: 8px;
        z-index: ${pos.zIndex};
        transition: opacity .2s, transform .2s;
      }
      #share-panel.dir-up    { flex-direction: column-reverse; right: 24px; bottom: ${pos.bottom + size + 8}px; align-items: center; }
      #share-panel.dir-left  { flex-direction: row-reverse;   right: ${24 + size + 8}px; bottom: ${pos.bottom}px; align-items: center; }
      #share-panel.hidden { opacity: 0; pointer-events: none; transform: scale(0.85); }
    `;
    document.head.appendChild(s);
  }

  function renderFloating() {
    injectStyles();

    const toggle = document.createElement('button');
    toggle.id = 'share-toggle';
    toggle.setAttribute('aria-label', 'שיתוף');
    toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;

    const panel = document.createElement('div');
    panel.id = 'share-panel';
    panel.classList.add(direction === 'left' ? 'dir-left' : 'dir-up', 'hidden');

    selected.forEach(key => {
      const btn = makeNetworkBtn(key, 44);
      if (btn) panel.appendChild(btn);
    });

    let open = false;
    toggle.addEventListener('click', () => {
      open = !open;
      panel.classList.toggle('hidden', !open);
    });
    document.addEventListener('click', (e) => {
      if (open && !toggle.contains(e.target) && !panel.contains(e.target)) {
        open = false;
        panel.classList.add('hidden');
      }
    });

    document.body.appendChild(toggle);
    document.body.appendChild(panel);
  }

  function renderInline() {
    const container = document.querySelector(target);
    if (!container) { console.warn('[share] data-target not found:', target); return; }
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.flexDirection = layout === 'vertical' ? 'column' : 'row';
    container.style.flexWrap = 'wrap';
    container.style.alignItems = 'flex-start';
    selected.forEach(key => {
      const btn = makeNetworkBtn(key, 44);
      if (btn) { btn.style.position = 'static'; container.appendChild(btn); }
    });
  }

  function init() {
    if (isInline) renderInline();
    else renderFloating();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
