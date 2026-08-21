(function () {
  'use strict';
  // yellowbox@1.0.0.js — Loader דק.
  // ה-widget האמיתי חי ב-server: https://api.yellowbox.co.il/widget.js (מקור יחיד).
  // יוצר <script> שמוריד את ה-widget, מעביר אליו data-token + data-platform,
  // ומסיר את ה-data-token מה-loader כדי ש-querySelector('script[data-token]')
  // בתוך ה-widget ימצא את ה-widget עצמו (ולא את ה-loader) — וכך נגזר ה-URL הנכון.
  // תואם לקורדינטור (coordinator@1.0.0.js).

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