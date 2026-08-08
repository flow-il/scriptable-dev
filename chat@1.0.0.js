(function () {
  'use strict';

  const YB = '#f7ec0c';    // YellowBox primary color — לשינוי מקום אחד בלבד
  const YB_TEXT = '#111';  // טקסט על רקע צהוב

  const style = document.createElement('style');
  style.textContent = `
    #cp-widget { position: fixed; bottom: 24px; left: 24px; z-index: 99999; font-family: system-ui, sans-serif; direction: rtl; }
    #cp-toggle { width: 56px; height: 56px; border-radius: 50%; background: ${YB}; color: ${YB_TEXT}; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 16px rgba(247,236,12,.4); transition: transform .2s; }
    #cp-toggle:hover { transform: scale(1.08); }
    #cp-window { position: absolute; bottom: 70px; left: 0; width: 320px; height: 420px; background: #fff; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,.15); display: flex; flex-direction: column; overflow: hidden; }
    #cp-header { background: ${YB}; color: ${YB_TEXT}; padding: 14px 16px; font-weight: 600; font-size: 15px; display: flex; justify-content: space-between; align-items: center; }
    #cp-close { background: none; border: none; color: ${YB_TEXT}; font-size: 20px; cursor: pointer; line-height: 1; padding: 0; }
    #cp-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    .cp-msg { max-width: 80%; padding: 9px 13px; border-radius: 16px; font-size: 14px; line-height: 1.5; word-break: break-word; }
    .cp-msg--visitor { background: #e8e8e8; align-self: flex-end; border-radius: 16px 16px 4px 16px; }
    .cp-msg--business { background: ${YB}; color: ${YB_TEXT}; align-self: flex-start; border-radius: 16px 16px 16px 4px; }
    .cp-msg--bot { background: #f0f0f0; align-self: flex-start; border-radius: 16px 16px 16px 4px; font-style: italic; color: #555; }
    #cp-input-row { display: flex; padding: 10px; border-top: 1px solid #eee; gap: 8px; }
    #cp-input { flex: 1; padding: 9px 12px; border: 1px solid #ddd; border-radius: 24px; font-size: 14px; outline: none; }
    #cp-send { padding: 9px 16px; background: ${YB}; color: ${YB_TEXT}; border: none; border-radius: 24px; cursor: pointer; font-size: 14px; }
    #cp-version { display: block; text-align: center; font-size: 10px; color: #ccc; padding: 4px 0 6px; font-family: sans-serif; text-decoration: none; }
    #cp-version:hover { color: #aaa; }
  `;
  document.head.appendChild(style);

  const scriptTag = document.querySelector('script[data-token]');
  // data-platform מאפשר להגיש את הwidget מ-CDN נפרד (scriptable.dev) תוך חיבור לפלטפורמה הנכונה
  const PLATFORM_URL = scriptTag.dataset.platform || new URL(scriptTag.src).origin;

  let socket = null;
  let conversationId = null;
  let siteId = null;
  let guestToken = localStorage.getItem('cp_guest_token');

  function createWidget(siteName) {
    const el = document.createElement('div');
    el.id = 'cp-widget';
    el.innerHTML = `
      <button id="cp-toggle" title="צ'אט עם ${siteName}">💬</button>
      <div id="cp-window" style="display:none">
        <div id="cp-header"><span>${siteName}</span><button id="cp-close">✕</button></div>
        <div id="cp-messages"></div>
        <div id="cp-input-row">
          <input id="cp-input" type="text" placeholder="כתוב הודעה..." autocomplete="off" />
          <button id="cp-send">שלח</button>
        </div>
        <a id="cp-version" href="https://scriptable.dev/chat/" target="_blank" rel="noopener">chat@1.0.0 · scriptable.dev</a>
      </div>`;
    document.body.appendChild(el);

    document.getElementById('cp-close').addEventListener('click', () => {
      document.getElementById('cp-window').style.display = 'none';
    });
    document.getElementById('cp-toggle').addEventListener('click', () => {
      const w = document.getElementById('cp-window');
      w.style.display = w.style.display === 'none' ? 'flex' : 'none';
    });
    document.getElementById('cp-send').addEventListener('click', sendMessage);
    document.getElementById('cp-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function appendMessage(msg) {
    const el = document.createElement('div');
    el.className = 'cp-msg cp-msg--' + msg.sender.toLowerCase();
    el.textContent = msg.content;
    const container = document.getElementById('cp-messages');
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function sendMessage() {
    const input = document.getElementById('cp-input');
    const content = input.value.trim();
    if (!content || !socket || !conversationId) return;
    socket.emit('message:send', { conversationId, content });
    input.value = '';
  }

  function loadScript(src) {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  async function init() {
    const widgetToken = scriptTag?.dataset.token;
    if (!widgetToken) return;

    const siteRes = await fetch(`${PLATFORM_URL}/api/sites/by-token/${widgetToken}`);
    if (!siteRes.ok) return;
    const site = await siteRes.json();
    siteId = site.id;

    createWidget(site.name);
    await loadScript(`${PLATFORM_URL}/socket.io/socket.io.js`);

    socket = window.io(PLATFORM_URL, { auth: { siteId, guestToken } });
    socket.on('message:new', appendMessage);

    if (guestToken) {
      const convRes = await fetch(`${PLATFORM_URL}/api/conversations/by-token/${guestToken}`);
      if (convRes.ok) {
        const conv = await convRes.json();
        conversationId = conv.id;
        conv.messages.forEach(appendMessage);
        return;
      }
      localStorage.removeItem('cp_guest_token');
      guestToken = null;
    }

    const convRes = await fetch(`${PLATFORM_URL}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId }),
    });
    const conv = await convRes.json();
    conversationId = conv.id;
    guestToken = conv.guestToken;
    localStorage.setItem('cp_guest_token', guestToken);
  }

  init();
})();
