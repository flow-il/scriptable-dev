(function () {
  'use strict';
  // analytics@1.0.0.js — Loader דק לאנליטיקס first-party.
  // המימוש האמיתי נטען מהשירות שלנו (<endpoint>/analytics.js) — כך מתקנים באג
  // בלי לעלות גרסה אצל הלקוח. דרוש data-token + data-endpoint.
  function load() {
    var current = document.currentScript || document.querySelector('script[src*="analytics@"]');
    if (!current) return;

    var token = current.getAttribute('data-token') || '';
    var endpoint = (current.getAttribute('data-endpoint') || '').replace(/\/+$/, '');

    // בלי טוקן/יעד — אין עם מה לדווח, לא נטען כלום.
    if (!token || !endpoint) return;

    var s = document.createElement('script');
    s.src = endpoint + '/analytics.js';
    s.async = true;
    s.setAttribute('data-token', token);
    s.setAttribute('data-endpoint', endpoint);
    document.head.appendChild(s);

    // להסיר מה-loader — כדי שהמימוש יזהה את עצמו כ-script[data-token] היחיד.
    current.removeAttribute('data-token');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
