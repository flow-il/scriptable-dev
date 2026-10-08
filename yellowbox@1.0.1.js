(function () {
  'use strict';
  // yellowbox@1.0.1.js — Loader דק.
  // ה-widget האמיתי חי ב-server: https://api.yellowbox.co.il/widget.js (מקור יחיד).
  //
  // 1.0.1: מעביר הלאה גם את דגלי המדידה (data-analytics / data-analytics-endpoint).
  // ב-1.0.0 הם לא עברו ל-widget — ולכן `data-analytics` לא עשה כלום: ה-widget קורא
  // את הדגלים מ-`script[data-token]`, שזה התג המוזרק, ולא תג ה-loader.
  //
  // כל תג שנוסף כאן **חייב** להיות מועבר גם הוא, אחרת הוא נבלע בשקט.

  // attributes שמועברים מהתג של הלקוח לתג המוזרק (ה-widget קורא אותם משם)
  var PASS_THROUGH = ['data-analytics', 'data-analytics-endpoint'];

  function loadWidget() {
    var current = document.currentScript || document.querySelector('script[src*="yellowbox@"]');
    if (!current) return;

    var token = current.getAttribute('data-token') || '';
    // data-platform אופציונלי — מאפשר להצביע לשרת אחר (dev/staging). fallback ל-production.
    var platform = current.getAttribute('data-platform') || 'https://api.yellowbox.co.il';

    var s = document.createElement('script');
    s.src = platform + '/widget.js';
    s.async = true;
    s.setAttribute('data-platform', platform);
    if (token) s.setAttribute('data-token', token);

    PASS_THROUGH.forEach(function (name) {
      if (!current.hasAttribute(name)) return;
      var value = current.getAttribute(name);
      s.setAttribute(name, value === null ? '' : value);
    });

    document.head.appendChild(s);

    // הסרת ה-token מה-loader — כך widget.js יזהה את עצמו כ<script[data-token]>
    current.removeAttribute('data-token');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();
