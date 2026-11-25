(function () {
  'use strict';
  // bidex@1.1.0.js — Loader דק (מבוסס על 1.0.1).

  // ping first-seen (best-effort) — איזה דומיין טוען את ה-bidex loader. data-ping מחליף את היעד.
  var PING_URL = (document.currentScript && document.currentScript.getAttribute('data-ping')) || 'https://api.bidex.co.il/api/scriptable/ping';
  var PING_SCRIPT = document.currentScript || document.querySelector('script[src*="bidex@"]');
  var BIDEX_VERSION = (PING_SCRIPT && (PING_SCRIPT.src.match(/@([\d.]+)\.js/) || [])[1]) || '';
  try {
    fetch(PING_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ addon: 'bidex', host: location.hostname, version: BIDEX_VERSION }), keepalive: true }).catch(function () {});
  } catch (e) { /* לא קריטי */ }

  // ה-widget האמיתי חי ב-server: https://api.bidex.co.il/widget.js (מקור יחיד).
  //
  // חדש ב-1.1.0:
  //   · data-embed="panel" — הווידג'ט נטמע כחלונית inline במקום כפתור צף.
  //   · data-page="/contact" — הווידג'ט נטען רק בעמוד הזה (pathname).
  //   · data-container="#chat-box" — סלקטור להטמעה בתוך קונטיינר קיים (אופציונלי).
  //   · ברירת מחדל (בלי הפרמטרים החדשים) = התנהגות 1.0.1 ✓.
  //
  // כל תג שנוסף כאן **חייב** להיות מועבר גם הוא, אחרת הוא נבלע בשקט.

  // attributes שמועברים מהתג של הלקוח לתג המוזרק (ה-widget קורא אותם משם)
  var PASS_THROUGH = ['data-analytics', 'data-analytics-endpoint', 'data-embed', 'data-page', 'data-container'];

  function loadWidget() {
    var current = document.currentScript || document.querySelector('script[src*="bidex@"]');
    if (!current) return;

    var token = current.getAttribute('data-token') || '';
    // data-platform אופציונלי — מאפשר להצביע לשרת אחר (dev/staging). fallback ל-production.
    var platform = current.getAttribute('data-platform') || 'https://api.bidex.co.il';

    // data-page — טוען רק בעמוד המבוקש. ריק = טוען בכל עמוד.
    var page = current.getAttribute('data-page');
    if (page && window.location.pathname !== page) return;

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
