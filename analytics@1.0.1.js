(function () {
  'use strict';
  // analytics@1.0.1.js — Loader דק לאנליטיקס first-party.
  // המימוש האמיתי נטען מהשירות שלנו (<endpoint>/analytics.js) — כך מתקנים באג
  // בלי לעלות גרסה אצל הלקוח.
  //
  // כתובת השירות (endpoint) באחת משתי דרכים:
  //   1. data-endpoint="https://..."    — מפורש (מדויק, אבל דומיין פנימי ב-HTML).
  //   2. data-platform="https://api..." — הכתובת נשלפת מהשרת (/api/sites/by-token/<token>
  //      → analyticsEndpoint). זו הדרך המומלצת: אין דומיין של שירות פנימי בהטמעה,
  //      ומעבר סביבה (staging/prod) לא נוגע באתר.
  //
  // דרוש data-token בכל מקרה. זה הרכיב למי שרוצה **מדידה בלי צ'אט**.
  function start(token, endpoint) {
    var s = document.createElement('script');
    s.src = endpoint + '/analytics.js';
    s.async = true;
    s.setAttribute('data-token', token);
    s.setAttribute('data-endpoint', endpoint);
    document.head.appendChild(s);
  }

  function load() {
    var current = document.currentScript || document.querySelector('script[src*="analytics@"]');
    if (!current) return;

    var token = current.getAttribute('data-token') || '';
    var endpoint = (current.getAttribute('data-endpoint') || '').replace(/\/+$/, '');
    var platform = (current.getAttribute('data-platform') || '').replace(/\/+$/, '');

    if (!token) return;

    if (endpoint) {
      start(token, endpoint);
      current.removeAttribute('data-token');
      return;
    }
    if (!platform) return;

    // להסיר מה-loader מיד — כדי שהמימוש יזהה את עצמו כ-script[data-token] היחיד.
    current.removeAttribute('data-token');

    var url = platform + '/api/sites/by-token/' + encodeURIComponent(token);
    fetch(url, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (site) {
        var resolved = site && site.analyticsEndpoint ? String(site.analyticsEndpoint).replace(/\/+$/, '') : '';
        if (resolved) start(token, resolved);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
