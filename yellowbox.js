(function () {
  'use strict';
  // yellowbox.js — alias **בלי גרסה**. תמיד הלואדר האחרון.
  // הקאש שלו קצר (ראה vercel.json) — ולכן תיקון בלואדר מגיע לכולם תוך דקות,
  // בלי להעלות מספר גרסה ובלי לגעת באתר של הלקוח.
  //
  // כל מאפיין data-* על התג עובר כמו שהוא לתג המוזרק (ה-widget קורא דגלים משם).
  // זו הסיבה שהמעבר כללי ולא רשימה: דגל חדש בעתיד לא ייבלע בשקט ולא ידרוש גרסה.
  //
  // (הגרסאות הממוספרות, למשל yellowbox@1.0.1.js, נשארות immutable לעמידות-לשעבר.)

  function loadWidget() {
    var current = document.currentScript || document.querySelector('script[src*="yellowbox"]');
    if (!current) return;

    var token = current.getAttribute('data-token') || '';
    // data-platform אופציונלי — מאפשר להצביע לשרת אחר (dev/staging). fallback ל-production.
    var platform = current.getAttribute('data-platform') || 'https://api.yellowbox.co.il';

    var s = document.createElement('script');
    s.src = platform + '/widget.js';
    s.async = true;
    s.setAttribute('data-platform', platform);
    if (token) s.setAttribute('data-token', token);

    // העברת כל data-* לתג המוזרק (data-token/data-platform כבר טופלו למעלה)
    for (var i = 0; i < current.attributes.length; i++) {
      var attr = current.attributes[i];
      if (attr.name.indexOf('data-') !== 0) continue;
      if (attr.name === 'data-token' || attr.name === 'data-platform') continue;
      s.setAttribute(attr.name, attr.value === null ? '' : attr.value);
    }

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
