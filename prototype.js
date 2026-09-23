/* Radar prototype: a guided walkthrough in seven states.
   Nothing works behind the screen. Every button leads somewhere on purpose. */
(function () {
  var mount = document.getElementById('radar-proto');
  if (!mount) return;
  var FULL = mount.getAttribute('data-mode') === 'full';

  var ui = {
    i: 0, channel: 'slack', tab: 'slide', notes: true, edit: false, ask: -1, toastTimer: null,
    fb: null, reason: null, adjust: false, urgent: true,
    seg: { rh: 'daily', where: 'slack', out: 'talk' },
    agents: [true, true, true, true, true],
    presets: [false, false, false, false, false],
    phase: 0, created: false,
    chips: ['Competitor launches (magnesium, Target)', 'Price and promo moves (magnesium, Target)', 'Share drops (Kindroot Magnesium Glycinate, Target)', 'Negative review spikes (Kindroot Magnesium)'],
    nseg: { rh: 'daily', where: 'slack', out: 'talk' }
  };

  /* Icons: one small stroke set, currentColor */
  var P = {
    home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    ask: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.3A8 8 0 1 1 21 12z',
    radar: 'M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 12h.01M21 12a9 9 0 0 0-9-9',
    reports: 'M4 20V10M10 20V4M16 20v-7M2 20h20',
    brand: 'M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
    bell: 'M6 8a6 6 0 0 1 12 0v5l2 3H4l2-3zM10 20a2 2 0 0 0 4 0',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-3.5-3.5',
    clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
    calendar: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 3v4M16 3v4',
    week: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 10h18M8 3v4M16 3v4M7 14h2M11 14h2M15 14h2',
    sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    flag: 'M5 21V4M5 4h12l-2 4 2 4H5',
    slide: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM12 17v4M8 21h8',
    mail: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l9 6 9-6',
    users: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2 20a7 7 0 0 1 14 0M17 11.5a2.5 2.5 0 1 0 0-5M17 14a5 5 0 0 1 5 5',
    sparkle: 'M12 3l2 5.5 5.5 2-5.5 2L12 18l-2-5.5-5.5-2 5.5-2zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
    check: 'M5 12l4 4L19 7',
    chevd: 'M6 9l6 6 6-6',
    chevr: 'M9 6l6 6-6 6',
    x: 'M6 6l12 12M18 6L6 18',
    plus: 'M12 5v14M5 12h14',
    hash: 'M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18',
    bookmark: 'M6 3h12v18l-6-4-6 4z',
    at: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1',
    edit: 'M4 20h4l10-10-4-4L4 16zM13 7l4 4',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 4v12M8 8l4-4 4 4',
    zap: 'M13 2L4 14h7l-1 8 9-12h-7z',
    pin: 'M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
    link: 'M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
    download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
    thread: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    inbox: 'M22 12h-6l-2 3h-4l-2-3H2M5 5h14l3 7v7H2v-7z',
    draft: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6',
    help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01',
    smile: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
    clip: 'M21 12l-8.5 8.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 8',
    arrowl: 'M19 12H5M12 19l-7-7 7-7',
    arrowr: 'M5 12h14M12 5l7 7-7 7',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    shelf: 'M3 5h18M3 12h18M3 19h18M6 5v7M12 5v7M18 5v7M8 12v7M16 12v7',
    star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z',
    menu: 'M4 7h16M4 12h16M4 17h16',
    tune: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h.01',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    apps: 'M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01',
    archive: 'M3 4h18v4H3zM5 8v12h14V8M10 12h4',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    reply: 'M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v2',
    label: 'M3 6a2 2 0 0 1 2-2h10l6 6-6 6H5a2 2 0 0 1-2-2z',
    snooze: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2M18 2l3 3M3 5l3-3',
    task: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'
  };
  function ic(name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + P[name] + '"/></svg>';
  }

  /* Weekly velocity index at Target, weeks 28 to 37. Index 100 = category average. */
  function chart() {
    var xs = [48, 102.7, 157.3, 212, 266.7, 321.3, 376, 430.7, 485.3, 540];
    var y = function (v) { return (200 - (v - 60) / 180 * 184).toFixed(1); };
    var kr = [112, 110, 111, 109, 108, 104, 101, 99, 97, 95];
    var bw = [null, null, null, null, 90, 120, 150, 175, 200, 210];
    var pts = function (arr) {
      var out = [];
      for (var i = 0; i < arr.length; i++) if (arr[i] !== null) out.push(xs[i] + ',' + y(arr[i]));
      return out.join(' ');
    };
    return '<svg viewBox="0 0 560 240" role="img" aria-label="Weekly velocity index at Target, last 10 weeks. Bloomwell gummies rise to 2.1 times the category average since launch; Kindroot capsules drift down.">' +
      '<line class="grid" x1="48" y1="' + y(100) + '" x2="540" y2="' + y(100) + '"/>' +
      '<line class="grid" x1="48" y1="' + y(150) + '" x2="540" y2="' + y(150) + '"/>' +
      '<line class="grid" x1="48" y1="' + y(200) + '" x2="540" y2="' + y(200) + '"/>' +
      '<text x="40" y="' + (+y(100) + 4) + '" text-anchor="end">100</text>' +
      '<text x="40" y="' + (+y(150) + 4) + '" text-anchor="end">150</text>' +
      '<text x="40" y="' + (+y(200) + 4) + '" text-anchor="end">200</text>' +
      '<line class="launch" x1="266.7" y1="30" x2="266.7" y2="206"/>' +
      '<text x="272" y="30">Bloomwell on shelf</text>' +
      '<polyline class="l-cat" fill="none" stroke-width="1.5" points="48,' + y(100) + ' 540,' + y(100) + '"/>' +
      '<polyline class="l-kr" fill="none" stroke-width="2.5" stroke-linejoin="round" points="' + pts(kr) + '"/>' +
      '<polyline class="l-bw" fill="none" stroke-width="2.5" stroke-linejoin="round" points="' + pts(bw) + '"/>' +
      '<circle cx="540" cy="' + y(210) + '" r="3.5" style="fill: var(--risk)"/>' +
      '<circle cx="540" cy="' + y(95) + '" r="3.5" style="fill: var(--accent)"/>' +
      '<text class="lab-bw" x="536" y="' + (+y(210) - 8) + '" text-anchor="end">Bloomwell gummies, 2.1x</text>' +
      '<text class="lab-kr" x="536" y="' + (+y(95) + 16) + '" text-anchor="end">Kindroot capsules</text>' +
      '<text x="52" y="' + (+y(100) + 14) + '">category average</text>' +
      '<text x="48" y="226">W28</text><text x="212" y="226" text-anchor="middle">W31</text>' +
      '<text x="376" y="226" text-anchor="middle">W34</text><text x="540" y="226" text-anchor="end">W37</text>' +
      '</svg>';
  }

  function seg(obj, key, opts) {
    var h = '<div class="seg">';
    for (var i = 0; i < opts.length; i++) {
      h += '<button data-seg="' + obj + '|' + key + '|' + opts[i][0] + '" aria-pressed="' + (ui[obj][key] === opts[i][0]) + '">' + opts[i][1] + '</button>';
    }
    return h + '</div>';
  }
  var RHY = [['daily', 'Daily, 8:30'], ['weekly', 'Weekly, Monday'], ['periodic', 'Periodic, before the moment']];
  var WHERE = [['slack', 'Slack DM'], ['email', 'Email'], ['both', 'Both']];
  var OUT = [['talk', 'Insight + talking points'], ['slide', '+ slide'], ['email', '+ email draft']];
  var RH_ICON = { daily: 'sun', weekly: 'week', periodic: 'flag' };

  function urgencyBanner(text, src) {
    return '<div class="urg" role="status">' + ic('clock') + '<div><span class="urg-k">Window closing</span> ' + text + (src ? '<span class="src">' + src + '</span>' : '') + '</div><div class="date"><b>Oct 1</b><span>9 days</span></div></div>';
  }
  function urgencyToggle() {
    return '<div class="field"><span>Urgency</span><div class="urgrow"><button class="toggle" role="switch" aria-checked="' + ui.urgent + '" data-urgent aria-label="Break through when a window is closing"></button><span class="hint">Break through to today when a window is closing, whatever the rhythm.</span></div></div>';
  }

  /* The Block Kit card, shared by Slack and email */
  function blockKit(inSlack) {
    var btn = function (cls, attrs, label) { return '<button class="bk-btn' + (cls ? ' ' + cls : '') + '" ' + attrs + '>' + label + '</button>'; };
    return '<div class="bk">' +
      '<div class="bk-ctx">' + ic('radar') + '<span>Competitor launches</span><span>&middot;</span>' + ic('sun') + '<span>Daily</span><span>&middot;</span><span class="urgt">Breaks through: window closing</span></div>' +
      '<div class="bk-h">Bloomwell Magnesium Sleep Gummies is gaining fast at Target</div>' +
      '<div class="bk-s"><b>Why it matters to Kindroot:</b> it competes with your Magnesium Glycinate capsules on the same "sleep" claim and is winning on format. Your magnesium share at Target is down 1.4 pts in 8 weeks.</div>' +
      '<div class="bk-win">' + ic('clock') + '<span>Endcap requests for Target\'s Q4 reset close the day of your review.</span><span class="date">Oct 1 &middot; 9 days</span></div>' +
      '<div class="bk-fields">' +
      '<div class="bk-f"><div class="n">2.1x</div><div class="l">category velocity, Target, last 6 weeks</div></div>' +
      '<div class="bk-f"><div class="n">+38%</div><div class="l">"magnesium for sleep" searches, quarter over quarter</div></div>' +
      '<div class="bk-f"><div class="n risk">-1.4 pts</div><div class="l">your share of magnesium at Target, 8 weeks</div></div></div>' +
      '<div class="bk-actions">' + btn('primary', 'data-go="2"', 'Open insight') + btn('', 'data-go="3" data-tab="slide"', 'Create slide') + btn('', 'data-go="4"', 'Not relevant') + '</div>' +
      '<div class="bk-links"><a data-toast="You asked Competitor launches to watch magnesium at Target, in your daily. The window made it urgent.">Why you\'re seeing this</a><a data-go="4">Adjust this agent</a></div>' +
      '</div>';
  }

  function slackWin() {
    var side = function (icon, label, cls) { return '<div class="it' + (cls ? ' ' + cls : '') + '">' + (icon ? ic(icon) : '') + label + '</div>'; };
    return '<div class="sl" aria-label="Slack, desktop">' +
      '<div class="sl-top"><div class="lights"><i></i><i></i><i></i></div><div class="nav">' + ic('arrowl') + ic('arrowr') + ic('clock') + '</div>' +
      '<div class="search">' + ic('search') + ' Search Kindroot</div>' + ic('help') + '<div class="me"></div></div>' +
      '<div class="sl-body">' +
      '<div class="sl-rail"><div class="ws">K</div><div class="ws2">A</div><div class="plus">+</div></div>' +
      '<div class="sl-side"><div class="hd">Kindroot ' + ic('chevd') + '<span class="grow"></span><span class="ed">' + ic('edit') + '</span></div>' +
      side('thread', 'Threads') + side('inbox', 'All DMs') + side('draft', 'Drafts') + side('at', 'Mentions &amp; reactions') + side('bookmark', 'Saved items') + side('more', 'More') +
      '<div class="sec">' + ic('star') + ' Starred</div>' + side('hash', 'brand-kindroot', 'sub bold') + side('hash', 'retail-target', 'sub') +
      '<div class="sec">' + ic('chevd') + ' Channels</div>' + side('hash', 'launches', 'sub') + side('hash', 'announcements', 'sub') + side('plus', 'Add channel', 'sub') +
      '<div class="sec">' + ic('chevd') + ' Direct messages</div>' + '<div class="it sub"><span class="dm"></span>Dana</div><div class="it sub"><span class="dm b"></span>Omri</div>' +
      '<div class="sec">' + ic('chevd') + ' Apps</div>' + '<div class="it sub on"><span class="appic">R</span>Radar</div>' +
      '</div>' +
      '<div class="sl-main">' +
      '<div class="sl-head"><b>Radar</b><span class="apptag" style="font:700 10px var(--font-body);background:#E8E8E8;color:#616061;border-radius:3px;padding:1px 4px">APP</span>' + ic('chevd') + '<span class="desc">Agents that notice for Kindroot</span><span class="members"><i></i><i></i><i></i>3</span></div>' +
      '<div class="sl-tabs"><span class="on">' + ic('thread') + ' Messages</span><span>' + ic('help') + ' About</span><span>' + ic('plus') + '</span></div>' +
      '<div class="sl-msgs">' +
      '<div class="sl-day"><span>Monday, September 21</span></div>' +
      '<div class="sl-msg dim"><div class="av">R</div><div><div class="who"><b>Radar</b><span class="apptag">APP</span><span class="ts">8:30</span></div><div class="txt">Weekly, for Monday\'s status: your share at Target, CVS and Amazon held at 12.4%. Nothing urgent. 2 items for the management update.</div></div></div>' +
      '<div class="sl-day"><span>Today</span></div>' +
      '<div class="sl-msg"><div class="av">R</div><div><div class="who"><b>Radar</b><span class="apptag">APP</span><span class="ts">8:41</span></div>' +
      '<div class="txt">Good morning, Maya. One update in your daily, and it comes with a date.</div>' + blockKit(true) + '</div></div>' +
      '</div>' +
      '<div class="sl-comp"><div class="in">Message Radar</div><div class="bar">' + ic('zap') + '<span class="fmt"><span>B</span><span><i>I</i></span><span><s>S</s></span></span>' + ic('link') + ic('more') + '<span class="grow"></span>' + ic('at') + ic('smile') + ic('clip') + '<span class="send">' + ic('send') + '</span></div></div>' +
      '</div></div></div>';
  }

  function emailWin() {
    var nav = function (icon, label, on, n) { return '<div class="gm-it' + (on ? ' on' : '') + '">' + ic(icon) + '<span>' + label + '</span>' + (n ? '<b>' + n + '</b>' : '') + '</div>'; };
    var lab = function (color, label) { return '<div class="gm-it"><i class="lab" style="background:' + color + '"></i><span>' + label + '</span></div>'; };
    return '<div class="gm" aria-label="Gmail">' +
      '<div class="gm-top">' + ic('menu') + '<span class="gm-logo"><b>M</b>Gmail</span>' +
      '<div class="gm-search">' + ic('search') + '<span>Search mail</span><span class="grow"></span>' + ic('tune') + '</div>' +
      '<div class="gm-icons">' + ic('help') + ic('gear') + ic('apps') + '<span class="gm-me">M</span></div></div>' +
      '<div class="gm-body">' +
      '<div class="gm-nav"><div class="gm-compose">' + ic('edit') + 'Compose</div>' +
      nav('inbox', 'Inbox', true, '14') + nav('star', 'Starred') + nav('snooze', 'Snoozed') + nav('send', 'Sent') + nav('draft', 'Drafts') + nav('chevd', 'More') +
      '<div class="gm-labels">Labels ' + ic('plus') + '</div>' + lab('#5F6368', 'Categories') + lab('#188038', 'Team') + lab('#F9AB00', 'News') + lab('#1A73E8', 'Work') + lab('#D93025', 'Personal') + '</div>' +
      '<div class="gm-panel">' +
      '<div class="gm-tools">' + ic('arrowl') + '<span class="sep"></span>' + ic('archive') + ic('label') + ic('trash') + '<span class="sep"></span>' + ic('mail') + ic('snooze') + ic('task') + ic('more') + '<span class="grow"></span><span class="pager">2 of 16</span>' + ic('chevd') + '</div>' +
      '<div class="gm-subj">Competitor launches: Bloomwell gummies gaining fast at Target. Window closes Oct 1. <span class="gm-tag">Inbox</span></div>' +
      '<div class="gm-from"><span class="av">R</span><div><b>Radar</b> <span class="addr">&lt;radar@platform&gt;</span><div class="to">to me ' + ic('chevd') + '</div></div>' +
      '<div class="right"><span class="ts">8:41 AM (2 minutes ago)</span>' + ic('star') + ic('reply') + ic('more') + '</div></div>' +
      '<div class="gm-msg"><p>Good morning, Maya. One update in your daily, and it comes with a date.</p>' + blockKit(false) +
      '<p class="gm-foot">You get this because Competitor launches reports to email. <a>Adjust this agent</a> &middot; <a>Open Radar</a></p></div>' +
      '<div class="gm-reply"><span>' + ic('reply') + 'Reply</span><span>' + ic('arrowr') + 'Forward</span></div>' +
      '</div>' +
      '<div class="gm-side"><i style="background:#1A73E8"></i><i style="background:#F9AB00"></i><i style="background:#188038"></i><span>+</span></div>' +
      '</div></div>';
  }

  /* Product app shell */
  function app(crumb, body, opts) {
    opts = opts || {};
    var nav = function (icon, label, on, badge) { return '<a' + (on ? ' class="on"' : '') + '>' + ic(icon) + label + (badge ? '<span class="badge">' + badge + '</span>' : '') + '</a>'; };
    return '<div class="app" aria-label="The platform">' +
      '<div class="app-chrome"><div class="lights"><i></i><i></i><i></i></div><div class="url">app.platform/' + (opts.url || 'radar') + '</div></div>' +
      '<nav class="app-nav"><div class="ws"><span class="logo"><i></i></span>Kindroot' + ic('chevd') + '</div>' +
      nav('home', 'Home') + nav('ask', 'Ask') + nav('radar', 'Radar', true, '1') + nav('reports', 'Reports') + nav('brand', 'Brand profile') +
      '<div class="sec">Radar</div>' + '<a data-go="5">' + ic('sun') + 'Daily</a><a data-go="5">' + ic('week') + 'Weekly</a><a data-go="5">' + ic('flag') + 'Periodic</a>' +
      '<div class="me"><span class="av">M</span><div>Maya K.<span>Brand Manager</span></div></div></nav>' +
      '<div class="app-main"><div class="app-top"><div class="crumb">' + crumb + '</div><span class="ask">' + ic('sparkle') + 'Ask anything</span><span class="bell">' + ic('bell') + '<i></i></span></div>' +
      '<div class="app-body">' + body + '</div></div></div>';
  }
  function ph(eyebrow, title, meta, actions) {
    return '<div class="ph"><div><div class="eyebrow">' + eyebrow + '</div><h4>' + title + '</h4>' + (meta ? '<p class="meta">' + meta + '</p>' : '') + '</div>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div>';
  }
  var sep = ' ' + ic('chevr') + ' ';

  var AGENTS = [
    { name: 'Competitor launches', rh: 'daily', watch: 'Magnesium, sleep claims. Target, CVS, Amazon.', where: 'Slack', out: 'Insight + talking points', last: '<b>Today, 1 new</b>' },
    { name: 'My share at key retailers', rh: 'weekly', watch: 'Kindroot\'s 5 SKUs at Target, CVS, Amazon. For Monday\'s numbers.', where: 'Slack', out: 'Insight + chart', last: 'Monday' },
    { name: 'Claims and ingredients gaining traction', rh: 'weekly', watch: 'Claims and ingredients on the rise in natural supplements. For the management update.', where: 'Email', out: 'Insight + slide', last: 'Monday' },
    { name: 'Consumer trends: sleep, stress, gut', rh: 'periodic', watch: 'Consumer conversation and search in your three need states. Feeds the Q4 plan and the innovation pipeline.', where: 'Email', out: 'Insight + talking points', last: 'Sep 8' },
    { name: 'Retailer review prep', rh: 'periodic', watch: 'Everything for Target, Oct 1. Builds the deck as things change.', where: 'Email', out: 'Insight + slides', last: '<b>Draft deck: 4 slides</b>' }
  ];
  var RHYTHMS = [
    ['daily', 'Daily, 8:30', 'What needs a reaction today'],
    ['weekly', 'Weekly, Monday', 'What goes into Monday\'s status and the management update'],
    ['periodic', 'Periodic', 'What builds toward the review, the plan, the launch']
  ];
  var PRESETS = [['Format shifts', 'weekly', 'Monday, by email'], ['Price and promo moves', 'daily', 'tomorrow 8:30, in Slack'], ['GLP-1 companion', 'periodic', 'before the Q4 plan'], ['Regulatory and claims watch', 'weekly', 'Monday, by email'], ['Retailer assortment changes', 'daily', 'tomorrow 8:30, in Slack']];

  function agentCard(a, on, idx, extra) {
    return '<div class="agent' + (on ? '' : ' off') + '"><div class="top">' + ic(RH_ICON[a.rh] || 'radar') + '<span class="name">' + a.name + '</span>' + (extra || '') +
      (idx !== null ? '<button class="toggle" role="switch" aria-checked="' + on + '" data-agent="' + idx + '" aria-label="' + a.name + ' on or off"></button>' : '') + '</div>' +
      '<div class="watch">' + a.watch + '</div>' +
      '<div class="metar"><span>' + ic(a.where === 'Slack' ? 'hash' : 'mail') + a.where + '</span><span>' + ic('slide') + a.out + '</span></div>' +
      '<div class="last">' + (on ? (a.lastLabel || 'Last update: ') + a.last : 'Paused') + '</div></div>';
  }

  var STATES = [
    {
      title: 'Scene', desc: 'Her three rhythms', cap: 'Tuesday, 8:40. Her week runs in three rhythms.',
      where: 'Maya\'s week, not the product', when: 'Tuesday, September 22, 8:40',
      notes: ['Maya isn\'t in the product. The story starts in her day, not ours.', 'She works in three rhythms: daily, weekly, periodic. Radar reports in them, not on a schedule of its own (principle 3).'],
      render: function () {
        return '<div class="scene"><div class="scene-top"><div class="who"><span class="avatar-lg">M</span><div><h4>Maya is between meetings.</h4><p class="role">Brand Manager, Kindroot. Five SKUs. Measured on sales and launches.</p></div></div>' +
          '<div class="clock">8:40<small>Tue, Sep 22 &middot; last in the platform 3 weeks ago</small></div></div>' +
          '<div class="scene-body"><p>Her work runs in three rhythms. Radar will report in them.</p>' +
          '<div class="rhythms">' +
          '<div class="rh"><div class="k">' + ic('sun') + 'Daily</div><ul><li><span class="t">9:00</span>Brand team sync</li><li><span class="t">11:00</span>Agency review</li><li><span class="t">14:00</span>1:1 with Dana</li><li>Approvals, emails, questions from the team</li></ul></div>' +
          '<div class="rh"><div class="k">' + ic('week') + 'Weekly</div><ul><li><span class="t">Mon</span>Performance and sales</li><li>Project status</li><li>Management update</li></ul></div>' +
          '<div class="rh"><div class="k">' + ic('flag') + 'Periodic</div><ul><li class="hl"><span class="t">Oct 1</span>Target category review</li><li>Q4 plan</li><li>Innovation pipeline, launch brief</li></ul></div>' +
          '</div><button class="btn btn-primary" data-go="1">Start ' + ic('arrowr') + '</button></div></div>';
      }
    },
    {
      title: 'The moment', desc: 'Slack or email', cap: 'A daily update, made urgent by a closing window',
      where: 'Her phone, then Slack on her laptop', when: 'Tuesday, 8:41',
      notes: [
        'Every update opens with why it matters to her brand (principle 5).',
        'A closing window makes this urgent: it carries a date and it breaks through to today, whatever the rhythm (principle 4).',
        'Control lives in the message: Adjust, Not relevant (principle 6). Same structure in Slack and email (principle 9).'
      ],
      render: function () {
        return '<div class="moment">' +
          '<div class="phone"><div class="notch"></div><div class="clock">8:41</div><div class="date">Tuesday, September 22</div>' +
          '<div class="notif"><div class="appic' + (ui.channel === 'slack' ? '' : ' mail') + '">' + (ui.channel === 'slack' ? 'S' : 'M') + '</div><div><div class="nm"><span>' + (ui.channel === 'slack' ? 'SLACK' : 'MAIL') + '</span><span>now</span></div>' +
          '<b>Radar: window closes Oct 1</b>Bloomwell\'s Magnesium Sleep Gummies are gaining fast at Target. Here\'s why it matters for Kindroot.</div></div></div>' +
          '<div><div class="moment-top"><div class="channel-toggle" role="group" aria-label="View as">' +
          '<button data-channel="slack" aria-pressed="' + (ui.channel === 'slack') + '">Slack</button>' +
          '<button data-channel="email" aria-pressed="' + (ui.channel === 'email') + '">Email</button></div>' +
          '<span class="hint">Maya picked Slack for this agent. Same update either way.</span></div>' +
          (ui.channel === 'slack' ? slackWin() : emailWin()) + '</div></div>';
      }
    },
    {
      title: 'The insight', desc: 'Window, signal, why, moves', cap: 'The window first. Then signal, why it matters, evidence, three moves.',
      where: 'The platform, Radar', when: 'Tuesday, 8:43',
      notes: [
        'The window is the first thing on the page: what closes, when, and what it costs to miss it (principle 4).',
        'Every number carries a source and a timeframe. She can show this in a room (principle 8).',
        'The three moves map to Maya\'s three outcomes: the retailer meeting, the campaign, the next launch.'
      ],
      render: function () {
        var body = ph(ic('radar') + '<span>Competitor launches</span><span>&middot;</span>' + ic('sun') + '<span>Daily</span><span>&middot;</span><span class="pill warn">' + ic('clock') + 'Breaks through</span>',
          'Bloomwell Magnesium Sleep Gummies is gaining fast at Target',
          'Launched 6 weeks ago. Magnesium glycinate + L-theanine. Positioned "sleep + stress". <span class="pill">' + ic('check') + 'Confidence: high</span>',
          '<button class="btn btn-primary btn-sm" data-go="3" data-tab="slide">' + ic('slide') + 'Create slide</button><button class="btn btn-ghost btn-sm" data-go="3" data-tab="share">' + ic('share') + 'Share</button>') +
          urgencyBanner('Target locks Q4 planograms on <b>Oct 6</b>. Endcap requests close <b>Oct 1</b>, the day of your review. After that, the next shot at placement is January.', 'Target vendor calendar, Q4') +
          '<div class="tiles"><div class="tile"><div class="n">2.1x</div><div class="l">Category velocity at Target, last 6 weeks</div><div class="s">Retail sales data, weeks 32-37</div></div>' +
          '<div class="tile"><div class="n">+38%</div><div class="l">"Magnesium for sleep" searches, quarter over quarter</div><div class="s">Search data, US, Q3 vs Q2</div></div>' +
          '<div class="tile risk"><div class="n">-1.4 pts</div><div class="l">Your share of magnesium at Target, 8 weeks</div><div class="s">Retail sales data, Target</div></div></div>' +
          '<div class="g75"><div class="c"><div class="c-head">' + ic('trend') + 'Signal: what changed</div><ul class="ev">' +
          '<li>' + ic('shelf') + '<div>Velocity 2.1x the magnesium category average at Target over the last 6 weeks.<span class="src">Retail sales data, Target, weeks 32-37</span></div></li>' +
          '<li>' + ic('search') + '<div>"Magnesium for sleep" searches +38% quarter over quarter.<span class="src">Search data, US, Q3 vs Q2</span></div></li>' +
          '<li>' + ic('ask') + '<div>"Gummy" appears in 54% more magnesium conversations than 90 days ago.<span class="src">Social listening, US, 90 days</span></div></li>' +
          '<li>' + ic('star') + '<div>Reviews praise taste and "no pill fatigue". 4.6 stars.<span class="src">Review analysis, n=1,214</span></div></li>' +
          '</ul><div class="chart">' + chart() + '<div class="cap">Weekly velocity index at Target, weeks 28-37. Index 100 = category average. Illustrative.</div></div></div>' +
          '<div class="c"><div class="c-head">' + ic('brand') + 'Why it matters to Kindroot</div><ul class="why-list">' +
          '<li>Your Magnesium Glycinate capsules are your <b>#2 SKU</b>, 31% of range revenue.</li>' +
          '<li>Your share of magnesium at Target is <b>down 1.4 pts in 8 weeks</b>. The drop starts the week Bloomwell landed on shelf.</li>' +
          '<li>You win on <b>"no fillers"</b>: the most cited theme in your reviews (27% of mentions). You lose on format: "capsule" is your top negative theme (11%).</li>' +
          '</ul><span class="pill">' + ic('check') + 'Three independent sources agree</span></div></div>' +
          '<div class="c" style="margin-top:14px"><div class="c-head">' + ic('zap') + 'Suggested moves<span class="r">one per outcome: retailer, campaign, launch</span></div><div class="moves" style="margin-top:0">' +
          '<div class="move"><div class="k"><i>1</i>Target review, in 9 days</div><p>The category is up 22% YoY and sleep is the driver. Kindroot is the #1-reviewed clean-label magnesium at Target. Ask for the sleep endcap before the Oct 1 window, not just shelf defense.</p><button class="btn btn-primary btn-sm" data-go="3" data-tab="slide">' + ic('slide') + 'Create slide</button></div>' +
          '<div class="move"><div class="k"><i>2</i>Campaign angle</div><p>Lead with "sleep" on the existing capsule. Your product page mentions sleep once. Bloomwell\'s says it nine times.</p><button class="btn btn-ghost btn-sm" data-go="3" data-tab="email">' + ic('mail') + 'Draft email to the team</button></div>' +
          '<div class="move"><div class="k"><i>3</i>Launch consideration</div><p>The format gap is real. A gummy or powder extension keeps the clean-label story. Worth a 30-minute innovation discussion.</p><button class="btn btn-ghost btn-sm" data-go="3" data-tab="meeting">' + ic('calendar') + 'Schedule meeting</button></div>' +
          '</div></div>' +
          '<div class="also"><div class="c-head" style="margin-bottom:4px">' + ic('radar') + 'Also on your radar</div>' +
          '<div class="row">' + ic('flag') + '<div><span class="ag">Consumer trends &middot; periodic</span>"GLP-1 companion" searches (fiber, electrolytes) +61% in 6 months. For the Q4 plan.</div><span class="when">no window</span></div>' +
          '<div class="row">' + ic('week') + '<div><span class="ag">Claims and ingredients &middot; weekly</span>Ashwagandha conversation cooling, -12% in 90 days. Your Ashwagandha SKU.</div><span class="when">Monday</span></div></div>' +
          '<div class="ins-foot"><span>Why you\'re seeing this: you asked Competitor launches to watch magnesium at Target. The window made it urgent.</span><span class="grow"></span><a data-go="4">Adjust</a><a data-go="4">Not relevant</a><a data-go="4">More like this</a></div>';
        return app('<a data-go="5">Radar</a>' + sep + '<a data-go="5">Competitor launches</a>' + sep + '<b>September 22</b>', body, { url: 'radar/competitor-launches/sep-22' });
      }
    },
    {
      title: 'Act', desc: 'Slide, email, meeting', cap: 'Her artifacts, drafted. Nothing sent without her.',
      where: 'The platform, Radar, acting on the insight', when: 'Tuesday, 8:45',
      notes: ['Outputs are her artifacts: a slide, an email, a meeting. Editable, never auto-sent (principle 7).', 'The window travels with the output: the slide asks for a date, the invite lands before it.'],
      render: function () {
        var tabs = [['slide', 'slide', 'Create slide'], ['email', 'mail', 'Draft email'], ['meeting', 'calendar', 'Schedule meeting'], ['ask', 'ask', 'Ask a follow-up'], ['share', 'share', 'Share']];
        var t = '<div class="tabs" role="tablist">';
        for (var i = 0; i < tabs.length; i++) t += '<button role="tab" data-tab="' + tabs[i][0] + '" aria-selected="' + (ui.tab === tabs[i][0]) + '">' + ic(tabs[i][1]) + tabs[i][2] + '</button>';
        t += '</div>';
        var body = '';
        if (ui.tab === 'slide') {
          var thumbs = '';
          for (var n = 1; n <= 8; n++) thumbs += '<i data-n="' + n + '"' + (n === 7 ? ' class="on"' : '') + '></i>';
          body = '<div class="act-head"><h5>Slide, ready for the Target deck</h5><span class="hint">Q4 Target review.pptx, slide 7. Built from the insight. Edit anything before it goes in.</span></div>' +
            '<div class="deck"><div class="thumbs">' + thumbs + '</div>' +
            '<div class="slide"><h5>Sleep is reshaping magnesium at Target</h5><div class="chart">' + chart() + '</div>' +
            '<div><ul><li>Magnesium at Target is up 22% YoY. Sleep is the growth driver: +38% searches, quarter over quarter.</li>' +
            '<li>Bloomwell Sleep Gummies run at 2.1x category velocity since launch, winning on format.</li>' +
            '<li>Kindroot is the #1-reviewed clean-label magnesium at Target. 27% of reviews cite "no fillers".</li></ul>' +
            '<p class="ask">Proposal: place Kindroot Magnesium in the sleep endcap for Q4. Request by Oct 1, ahead of the Oct 6 reset.</p></div>' +
            '<div class="src">Retail sales data (Target, weeks 32-37), search data (US, Q3 vs Q2), review analysis (n=1,214), Target vendor calendar. Illustrative.</div></div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Added to Q4 Target review.pptx as slide 7.">' + ic('check') + 'Add to deck</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Saved to Downloads (prototype, no file behind this).">' + ic('download') + 'Download .pptx</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Opens the slide editor. Text and chart are editable.">' + ic('edit') + 'Edit</button></div>';
        } else if (ui.tab === 'email') {
          body = '<div class="act-head"><h5>Email to the team, drafted</h5><span class="hint">Her voice, her call. Edit, then send.</span></div>' +
            '<div class="draft"><div class="f"><span>To</span><div>Dana, Omri</div></div>' +
            '<div class="f"><span>Subject</span><div>Magnesium at Target: what changed and what we do before Oct 1</div></div>' +
            '<div class="body" id="draft-body" contenteditable="' + ui.edit + '">Hi both,\n\nRadar flagged that Bloomwell\'s Magnesium Sleep Gummies are running at 2.1x category velocity at Target, and our magnesium share there is down 1.4 pts in 8 weeks. Sleep is driving the category (+38% searches) and our product page barely says the word. Endcap requests for the Q4 reset close Oct 1, so this week matters.\n\nTwo things: Dana, can you draft a "sleep" lead for the capsule page by Thursday? Omri, I\'m bringing the attached slide to the Target review, let\'s align on the endcap ask.\n\nFull insight: radar/competitor-launches/sep-22\n\nMaya</div>' +
            '<div class="att">' + ic('clip') + 'Sleep-magnesium-Target.pptx (1 slide)</div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Sent to Dana and Omri.">' + ic('send') + 'Send</button>' +
            '<button class="btn btn-ghost btn-sm" data-edit>' + ic('edit') + (ui.edit ? 'Done editing' : 'Edit') + '</button>' +
            '<button class="btn btn-ghost btn-sm" data-copy="draft-body">' + ic('link') + 'Copy</button></div>';
        } else if (ui.tab === 'meeting') {
          body = '<div class="act-head"><h5>Meeting, ready to send</h5><span class="hint">Found a slot everyone has free, before the window. The brief travels with the invite.</span></div>' +
            '<div class="invite"><div class="datebox"><b>24</b><span>Thu, Sep</span></div><div class="in"><h5>Magnesium format response</h5>' +
            '<div class="row"><span>When</span><div>10:00-10:30 <span class="pill">everyone\'s free</span> <span class="pill warn">' + ic('clock') + '7 days before the window</span></div></div>' +
            '<div class="row"><span>Who</span><div class="people"><span class="person"><i>D</i>Dana</span><span class="person"><i>O</i>Omri</span><span class="person"><i>T</i>Tal, innovation</span></div></div>' +
            '<div class="row"><span>Agenda</span><ol><li>What Radar found (5 min)</li><li>Format options: gummy vs powder (15 min)</li><li>Decide: brief innovation, or wait (10 min)</li></ol></div>' +
            '<div class="row"><span>Attached</span><div>The insight and the slide</div></div></div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Invite sent. Thursday 10:00, 30 minutes.">' + ic('send') + 'Send invite</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Opens the invite in your calendar.">' + ic('edit') + 'Edit</button></div>';
        } else if (ui.tab === 'ask') {
          var qs = [
            ['How is Bloomwell doing at CVS?', 'Bloomwell gummies at CVS: 1.3x category velocity, on shelf for 3 weeks. Your magnesium share at CVS is flat so far. Worth watching, not acting.', 'Retail sales data, CVS, weeks 35-37'],
            ['Which claims are growing in sleep?', '"Magnesium glycinate" (+41%), "no melatonin" (+29%) and "non-habit forming" (+18%) lead sleep conversation this quarter. Kindroot already owns two of the three.', 'Social listening and search, US, Q3'],
            ['Show me our reviews that mention format', '132 of 1,180 Kindroot magnesium reviews mention format. 71% ask for a smaller capsule or a gummy. 4.1 stars in this group vs 4.6 overall.', 'Review analysis, all retailers, 12 months']
          ];
          body = '<div class="act-head"><h5>Ask a follow-up</h5><span class="hint">The pull is still here. Radar just made it optional.</span></div><div class="chips">';
          for (var q = 0; q < qs.length; q++) body += '<button class="chip" data-ask="' + q + '" aria-pressed="' + (ui.ask === q) + '">' + qs[q][0] + '</button>';
          body += '</div>';
          if (ui.ask >= 0) body += '<div class="answer">' + qs[ui.ask][1] + '<span class="src">' + qs[ui.ask][2] + '</span></div>';
        } else {
          body = '<div class="act-head"><h5>Share</h5><span class="hint">The team gets the same card, with the same sources and the same date.</span></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Posted to #brand-kindroot.">' + ic('hash') + 'Post to #brand-kindroot</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Link copied.">' + ic('link') + 'Copy link</button></div>';
        }
        var head = ph(ic('radar') + '<span>Competitor launches</span><span>&middot;</span><span>Bloomwell gummies at Target</span>', 'Act on it', 'Every output is a draft until Maya says so.');
        return app('<a data-go="5">Radar</a>' + sep + '<a data-go="2">Bloomwell gummies at Target</a>' + sep + '<b>Act</b>', head + t + body, { url: 'radar/competitor-launches/sep-22/act' });
      }
    },
    {
      title: 'Tune', desc: 'Feedback, adjust', cap: 'One tap teaches the agent, and it says what changed',
      where: 'The platform, Radar, the same insight', when: 'Tuesday, 8:47',
      notes: ['Feedback changes the next update and says so (principle 10).', '"Not urgent" teaches the agent to keep the rhythm unless the window is under a week (principle 4).', 'Adjusting happens right here, not in a settings page (principle 6).'],
      render: function () {
        var reasons = [['retailer', 'Wrong retailer'], ['product', 'Wrong product'], ['small', 'Too small'], ['urgent', 'Not urgent'], ['knew', 'Already knew']];
        var msg = {
          retailer: 'Competitor launches will focus on Target and CVS, where your magnesium sells.',
          product: 'Competitor launches will stay on your magnesium and probiotic lines.',
          small: 'Competitor launches will skip launches under 1x category velocity and stay on magnesium at Target.',
          urgent: 'Competitor launches will keep items like this in your daily rhythm, and only break through when a window is under a week.',
          knew: 'Competitor launches will report right away when it\'s big, instead of waiting for the digest.'
        };
        var fb = '<div class="c fb"><div class="c-head">' + ic('eye') + 'Was this worth your time?</div><div class="btns">' +
          '<button class="btn btn-ghost btn-sm" data-fb="no" aria-pressed="' + (ui.fb === 'no') + '">' + ic('x') + 'Not relevant</button>' +
          '<button class="btn btn-ghost btn-sm" data-fb="more" aria-pressed="' + (ui.fb === 'more') + '">' + ic('check') + 'More like this</button></div>';
        if (ui.fb === 'no') {
          fb += '<div><div class="hint" style="margin-bottom:6px">What was off?</div><div class="chips">';
          for (var r = 0; r < reasons.length; r++) fb += '<button class="chip" data-reason="' + reasons[r][0] + '" aria-pressed="' + (ui.reason === reasons[r][0]) + '">' + reasons[r][1] + '</button>';
          fb += '</div></div>';
          if (ui.reason) fb += '<div class="confirm"><b>Got it.</b> ' + msg[ui.reason] + ' Next update tomorrow, 8:30.</div>';
        }
        if (ui.fb === 'more') fb += '<div class="confirm"><b>Got it.</b> I\'ll also watch Bloomwell at CVS and Amazon, and flag format launches across the rest of your range.</div>';
        fb += '</div>';

        var learned = (ui.fb === 'no' && ui.reason === 'small') ? '<span class="tag">Skips launches under 1x</span>' :
          (ui.fb === 'no' && ui.reason === 'urgent') ? '<span class="tag">Breaks through only under a week</span>' :
          (ui.fb === 'more') ? '<span class="tag">Bloomwell at CVS, Amazon</span>' : '';
        var card = ui.adjust ?
          '<div class="c agent-card"><div class="top">' + ic('sun') + '<span class="name">Competitor launches</span>' + (learned ? '<span class="pill">Changed just now</span>' : '') + '<button class="toggle" role="switch" aria-checked="true" data-toast="Paused. Turn it back on any time from Radar home."></button></div>' +
          '<div class="field"><span>Watches</span><div class="tags"><span class="tag">Magnesium</span><span class="tag">Sleep claims</span><span class="tag">Target, CVS, Amazon</span><span class="tag">Bloomwell, Sunveil, Nature\'s Path</span>' + learned + '</div></div>' +
          '<div class="field"><span>Rhythm</span>' + seg('seg', 'rh', RHY) + '</div>' +
          urgencyToggle() +
          '<div class="field"><span>Where</span>' + seg('seg', 'where', WHERE) + '</div>' +
          '<div class="field"><span>You get</span>' + seg('seg', 'out', OUT) + '</div>' +
          '<div class="btns"><button class="btn btn-primary btn-sm" data-toast="Saved. Applies from the next update.">' + ic('check') + 'Save</button><button class="btn btn-ghost btn-sm" data-go="5">See all agents</button></div></div>' :
          '<div class="c agent-card"><div class="top">' + ic('sun') + '<span class="name">Competitor launches</span><span class="pill">On &middot; daily</span></div>' +
          '<p class="hint" style="margin:0">This update came from your Competitor launches agent, in your daily rhythm. The Oct 1 window is why it came with a date.</p>' +
          '<div class="btns"><button class="btn btn-ghost btn-sm" data-adjust>' + ic('edit') + 'Adjust this agent</button><button class="btn btn-quiet btn-sm" data-go="5">See all agents</button></div></div>';
        var head = ph(ic('radar') + '<span>Competitor launches</span><span>&middot;</span><span>Bloomwell gummies at Target</span>', 'Tune it', 'Tell the agent what was off. It says what it will do differently.');
        return app('<a data-go="5">Radar</a>' + sep + '<a data-go="2">Bloomwell gummies at Target</a>' + sep + '<b>Tune</b>', head + '<div class="g55">' + fb + card + '</div>', { url: 'radar/competitor-launches/sep-22/tune' });
      }
    },
    {
      title: 'Radar home', desc: 'Agents by rhythm', cap: 'Five agents, in her three rhythms. She turns off, not on.',
      where: 'The platform, Radar home', when: 'Tuesday, 8:48',
      notes: ['She starts full, not empty. The presets come from her brand profile, named by the job (principle 1).', 'Agents live in her three rhythms, so she reads this the way she reads her week (principle 3).', 'One rule for urgency, at the top: a closing window breaks through to today (principle 4).', 'The library is one tap away, and creating by prompt is behind it (principle 2).'],
      render: function () {
        var count = ui.agents.filter(Boolean).length + (ui.created ? 1 : 0);
        var h = ph(ic('radar') + '<span>Radar</span>', 'Your radar', count + ' agents watching Kindroot, in your three rhythms. Set up from your brand profile. Turn off anything you don\'t need.',
          '<button class="btn btn-primary btn-sm" data-go="6">' + ic('plus') + 'New agent</button>') +
          '<div class="rule">' + ic('clock') + '<span><b>Urgency breaks the rhythm.</b> When a window is closing, the update comes today, in Slack, with the date on it.' + (ui.urgent ? '' : ' <span class="pill warn">Off: windows wait for their rhythm</span>') + '</span><span class="grow"></span><button class="toggle" role="switch" aria-checked="' + ui.urgent + '" data-urgent aria-label="Urgent updates break through"></button></div>';
        for (var g = 0; g < RHYTHMS.length; g++) {
          var rh = RHYTHMS[g];
          h += '<div class="rgroup"><div class="rhead"><span class="k">' + ic(RH_ICON[rh[0]]) + rh[1] + '</span><span class="hint">' + rh[2] + '</span></div><div class="agents">';
          for (var i = 0; i < AGENTS.length; i++) if (AGENTS[i].rh === rh[0]) h += agentCard(AGENTS[i], ui.agents[i], i);
          if (ui.created && ui.nseg.rh === rh[0]) {
            h += agentCard({ name: 'Threats to magnesium at Target', rh: rh[0], watch: ui.chips.join('. ') + '.', where: ui.nseg.where === 'slack' ? 'Slack' : 'Email', out: 'Insight + talking points', last: '<b>' + firstUpdate() + '</b>', lastLabel: 'First update: ' }, true, null, '<span class="pill">New</span>');
          }
          h += '</div></div>';
        }
        h += '<div class="presets"><div class="c-head">' + ic('plus') + 'More to switch on</div><div class="row">';
        for (var p = 0; p < PRESETS.length; p++) {
          h += '<span class="preset' + (ui.presets[p] ? ' on' : '') + '">' + PRESETS[p][0] + ' <span class="rhx">&middot; ' + PRESETS[p][1] + '</span><button data-preset="' + p + '">' + (ui.presets[p] ? 'On' : 'Turn on') + '</button></span>';
        }
        h += '</div></div>';
        return app('<b>Radar</b>' + sep + 'Your radar', h, { url: 'radar' });
      }
    },
    {
      title: 'New agent', desc: 'Prompt to card', cap: 'A prompt becomes a card, with a sample before it starts',
      where: 'The platform, new agent', when: 'Tuesday, 8:50',
      notes: ['A prompt becomes a card she can edit: what, which rhythm, where, what she gets (principle 2).', 'Rhythm and urgency are choices on the card, in her words (principles 3 and 4).', 'A sample of the first update appears before she commits. No surprises, no noise (principle 2).'],
      render: function () {
        if (ui.phase === 2) {
          return '<div class="done"><div class="mark">' + ic('check') + '</div><div class="kicker">Running</div><h4>First update ' + firstUpdate() + '.</h4>' +
            '<p>That\'s the loop. Maya told Radar what matters, in her words and in her rhythm. From here on, it does the noticing, and she does the deciding.</p>' +
            '<div class="btns" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-go="5">See all agents</button><button class="btn btn-primary btn-sm" data-restart>Restart</button></div></div>';
        }
        var body;
        if (ui.phase === 0) {
          body = ph(ic('radar') + '<span>Radar</span><span>&middot;</span><span>New agent</span>', 'Tell Radar what to watch', 'In your words. Radar turns it into an agent you can edit, and shows you a sample before it starts.') +
            '<div class="prompt"><div class="in">' + ic('sparkle') + '<input id="np" value="anything that could hurt my magnesium line at Target" aria-label="What should Radar watch?"><button class="btn btn-primary btn-sm" data-phase="1">Ask Radar</button></div>' +
            '<div class="chips"><span class="hint" style="align-self:center">Try:</span>' +
            '<button class="chip" data-fill="who\'s launching in gut health">Who\'s launching in gut health</button>' +
            '<button class="chip" data-fill="price moves on my SKUs at Amazon">Price moves on my SKUs at Amazon</button>' +
            '<button class="chip" data-fill="claims growing in women\'s health">Claims growing in women\'s health</button></div></div>';
        } else {
          var chips = '';
          for (var c = 0; c < ui.chips.length; c++) chips += '<span class="tag">' + ui.chips[c] + '<button data-rmchip="' + c + '" aria-label="Remove">&times;</button></span>';
          chips += '<span class="tag add" data-toast="Type another thing to watch. Radar adds it to the list.">+ add</span>';
          body = ph(ic('radar') + '<span>Radar</span><span>&middot;</span><span>New agent</span>', 'Here\'s what I understood', 'Maya asked: <b>"anything that could hurt my magnesium line at Target"</b>. Edit anything, then start it.') +
            '<div class="c agent-card"><div class="top">' + ic(RH_ICON[ui.nseg.rh]) + '<span class="name">Threats to magnesium at Target</span><span class="pill neutral">Draft</span></div>' +
            '<div class="field"><span>I\'ll watch</span><div class="tags">' + chips + '</div></div>' +
            '<div class="field"><span>Rhythm</span>' + seg('nseg', 'rh', [['daily', 'Daily, 8:30'], ['weekly', 'Weekly, Monday'], ['periodic', 'Periodic, before the Target review']]) + '</div>' +
            urgencyToggle() +
            '<div class="field"><span>Where</span>' + seg('nseg', 'where', [['slack', 'Slack'], ['email', 'Email']]) + '</div>' +
            '<div class="field"><span>You get</span>' + seg('nseg', 'out', OUT) + '</div>' +
            '<div class="sample"><div class="k">' + ic('eye') + 'Sample of your first update, from last week\'s data</div>Sunveil cut its magnesium price 15% at Target this week. The promo runs to Oct 5. Your price gap is now 22%. Suggested move: hold price, add a value pack before the promo ends. <span class="pill warn">' + ic('clock') + 'Window: Oct 5</span><span class="src">Retail pricing data, Target, week 37. Illustrative.</span></div>' +
            '<div class="btns"><button class="btn btn-primary btn-sm" data-phase="2">' + ic('check') + 'Start watching</button><button class="btn btn-ghost btn-sm" data-phase="0">Edit the request</button></div></div>';
        }
        return app('<a data-go="5">Radar</a>' + sep + '<b>New agent</b>', body, { url: 'radar/new' });
      }
    }
  ];

  function firstUpdate() {
    var w = ui.nseg.where === 'slack' ? 'in Slack' : 'by email';
    if (ui.nseg.rh === 'weekly') return 'Monday, ' + w + ', in your weekly';
    if (ui.nseg.rh === 'periodic') return 'before the Target review, Oct 1, ' + w;
    return 'tomorrow, 8:30, ' + w + ', in your daily';
  }

  /* Shell */
  mount.className = 'proto' + (FULL ? ' full' : '');
  mount.setAttribute('tabindex', '0');
  mount.innerHTML =
    '<div class="proto-head"><span class="proto-brand"><i></i>Radar prototype</span><span class="proto-step" id="p-step"></span><span class="grow"></span>' +
    '<label class="switch"><input type="checkbox" id="p-notes" checked> Design notes</label>' +
    '<button class="btn btn-ghost btn-sm" data-restart>Restart</button>' +
    (FULL ? '<a class="btn btn-ghost btn-sm" href="index.html#prototype">Back to the write-up</a>' : '<a class="btn btn-ghost btn-sm" href="prototype.html" target="_blank" rel="noopener">Full screen</a>') +
    '</div>' +
    '<div class="prog" id="p-prog" aria-hidden="true"></div>' +
    '<div class="ctx" id="p-ctx"></div>' +
    '<div class="proto-body"><div class="stage" id="p-stage"></div>' +
    '<aside class="rail"><ol class="steps" id="p-steps"></ol><div class="notes" id="p-notes-box"></div></aside></div>' +
    '<div class="proto-foot"><button class="btn btn-ghost btn-sm" data-prev>' + ic('arrowl') + 'Back</button><span class="proto-cap" id="p-cap"></span><button class="btn btn-primary btn-sm" data-next>Next ' + ic('arrowr') + '</button></div>';

  var stage = mount.querySelector('#p-stage');
  var stepsEl = mount.querySelector('#p-steps');
  var notesBox = mount.querySelector('#p-notes-box');

  function render() {
    var s = STATES[ui.i];
    stage.innerHTML = s.render();
    mount.querySelector('#p-step').textContent = 'Step ' + (ui.i + 1) + ' of ' + STATES.length + ' · ' + s.title;
    mount.querySelector('#p-cap').textContent = s.cap;
    mount.querySelector('#p-ctx').innerHTML = '<span>' + ic('pin') + 'Where: <b>' + s.where + '</b></span><span>' + ic('clock') + 'When: <b>' + s.when + '</b></span>';
    var prog = '', html = '';
    for (var i = 0; i < STATES.length; i++) {
      prog += '<i class="' + (i < ui.i ? 'past' : i === ui.i ? 'here' : '') + '"></i>';
      html += '<li><button data-go="' + i + '"' + (i === ui.i ? ' aria-current="step"' : '') + '><span class="k">' + (i + 1) + '</span><span>' + STATES[i].title + '</span><span class="d">' + STATES[i].desc + '</span></button></li>';
    }
    mount.querySelector('#p-prog').innerHTML = prog;
    stepsEl.innerHTML = html;
    var n = '<h4>Why it\'s built this way</h4>';
    for (var j = 0; j < s.notes.length; j++) n += '<p>' + s.notes[j] + '</p>';
    notesBox.innerHTML = n;
    notesBox.hidden = !ui.notes;
    mount.querySelector('[data-prev]').disabled = ui.i === 0;
    mount.querySelector('[data-next]').innerHTML = ui.i === STATES.length - 1 ? 'Restart' : 'Next ' + ic('arrowr');
    stage.scrollTop = 0;
  }

  function go(i) {
    if (i < 0 || i >= STATES.length) return;
    ui.i = i; ui.edit = false; ui.ask = -1;
    ui.fb = null; ui.reason = null; ui.adjust = false; ui.phase = 0;
    if (FULL) { try { history.replaceState(null, '', '#step-' + (i + 1)); } catch (e) {} }
    render();
  }

  function toast(msg) {
    var old = stage.querySelector('.toast');
    if (old) old.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = msg;
    stage.appendChild(el);
    clearTimeout(ui.toastTimer);
    ui.toastTimer = setTimeout(function () { el.remove(); }, 2600);
  }

  mount.addEventListener('click', function (e) {
    var t = e.target.closest('[data-go],[data-channel],[data-tab],[data-toast],[data-edit],[data-copy],[data-ask],[data-prev],[data-next],[data-restart],[data-fb],[data-reason],[data-adjust],[data-agent],[data-preset],[data-phase],[data-fill],[data-rmchip],[data-seg],[data-urgent]');
    if (!t || !mount.contains(t)) return;
    if (t.hasAttribute('data-tab')) ui.tab = t.getAttribute('data-tab');
    if (t.hasAttribute('data-go')) { go(+t.getAttribute('data-go')); return; }
    if (t.hasAttribute('data-prev')) { go(ui.i - 1); return; }
    if (t.hasAttribute('data-next')) { go(ui.i === STATES.length - 1 ? 0 : ui.i + 1); return; }
    if (t.hasAttribute('data-restart')) { ui.channel = 'slack'; ui.tab = 'slide'; ui.created = false; ui.urgent = true; ui.agents = [true, true, true, true, true]; ui.presets = [false, false, false, false, false]; ui.nseg = { rh: 'daily', where: 'slack', out: 'talk' }; go(0); return; }
    if (t.hasAttribute('data-channel')) { ui.channel = t.getAttribute('data-channel'); render(); return; }
    if (t.hasAttribute('data-tab')) { ui.edit = false; ui.ask = -1; render(); return; }
    if (t.hasAttribute('data-ask')) { ui.ask = +t.getAttribute('data-ask'); render(); return; }
    if (t.hasAttribute('data-edit')) { ui.edit = !ui.edit; render(); if (ui.edit) { var b = stage.querySelector('#draft-body'); if (b) b.focus(); } return; }
    if (t.hasAttribute('data-fb')) { ui.fb = t.getAttribute('data-fb'); ui.reason = null; render(); return; }
    if (t.hasAttribute('data-reason')) { ui.reason = t.getAttribute('data-reason'); render(); return; }
    if (t.hasAttribute('data-adjust')) { ui.adjust = true; render(); return; }
    if (t.hasAttribute('data-urgent')) { ui.urgent = !ui.urgent; render(); toast(ui.urgent ? 'Urgent updates break through to today again.' : 'Urgent updates will wait for their rhythm. Windows can close.'); return; }
    if (t.hasAttribute('data-agent')) { var ai = +t.getAttribute('data-agent'); ui.agents[ai] = !ui.agents[ai]; render(); toast(ui.agents[ai] ? AGENTS[ai].name + ' is back on.' : AGENTS[ai].name + ' paused. Nothing from it until you turn it on.'); return; }
    if (t.hasAttribute('data-preset')) { var pi = +t.getAttribute('data-preset'); ui.presets[pi] = !ui.presets[pi]; render(); toast(ui.presets[pi] ? PRESETS[pi][0] + ' is on, in your ' + PRESETS[pi][1] + '. First update ' + PRESETS[pi][2] + '.' : PRESETS[pi][0] + ' is off.'); return; }
    if (t.hasAttribute('data-phase')) { ui.phase = +t.getAttribute('data-phase'); if (ui.phase === 2) ui.created = true; render(); return; }
    if (t.hasAttribute('data-fill')) { var inp = stage.querySelector('#np'); if (inp) { inp.value = t.getAttribute('data-fill'); inp.focus(); } return; }
    if (t.hasAttribute('data-rmchip')) { ui.chips.splice(+t.getAttribute('data-rmchip'), 1); render(); return; }
    if (t.hasAttribute('data-seg')) { var p = t.getAttribute('data-seg').split('|'); ui[p[0]][p[1]] = p[2]; render(); return; }
    if (t.hasAttribute('data-copy')) {
      var src = stage.querySelector('#' + t.getAttribute('data-copy'));
      var text = src ? src.innerText : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { toast('Copied.'); }, function () { toast('Select the text to copy it.'); });
      } else { toast('Select the text to copy it.'); }
      return;
    }
    if (t.hasAttribute('data-toast')) { toast(t.getAttribute('data-toast')); }
  });

  mount.querySelector('#p-notes').addEventListener('change', function (e) { ui.notes = e.target.checked; notesBox.hidden = !ui.notes; });

  var keyTarget = FULL ? document : mount;
  keyTarget.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'np') { ui.phase = 1; render(); e.preventDefault(); return; }
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight') { go(ui.i === STATES.length - 1 ? ui.i : ui.i + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(ui.i - 1); e.preventDefault(); }
  });

  window.radarProto = { go: go, count: STATES.length };
  var hm = (location.hash || '').match(/step-(\d)/);
  if (hm && +hm[1] >= 1 && +hm[1] <= STATES.length) ui.i = +hm[1] - 1;
  render();
})();
