/* Radar prototype: a guided walkthrough in seven states.
   Nothing works behind the screen. Every button leads somewhere on purpose. */
(function () {
  var mount = document.getElementById('radar-proto');
  if (!mount) return;
  var FULL = mount.getAttribute('data-mode') === 'full';

  var ui = {
    i: 0, channel: 'slack', tab: 'slide', notes: true, edit: false, ask: -1, toastTimer: null,
    fb: null, reason: null, urgent: true,
    agents: [true, true, true, true, true],
    presets: [false, false, false, false, false],
    phase: 0, created: false, createdAgent: null,
    liked: false, ed: null, editAgent: 0, menu: -1, prompt: 'anything that could hurt my magnesium line at Target'
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
    tune: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h.01M14 4v4M8 10v4M16 16v4',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    apps: 'M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01',
    archive: 'M3 4h18v4H3zM5 8v12h14V8M10 12h4',
    trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    reply: 'M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v2',
    label: 'M3 6a2 2 0 0 1 2-2h10l6 6-6 6H5a2 2 0 0 1-2-2z',
    snooze: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2M18 2l3 3M3 5l3-3',
    task: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
    pause: 'M8 5v14M16 5v14',
    play: 'M7 4l12 8-12 8z',
    copy: 'M9 9h10v10H9zM5 15V5h10',
    tag: 'M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
    dollar: 'M12 2v20M17 6.5a4 4 0 0 0-4-2.5H11a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-2a4 4 0 0 1-4-2.5',
    back: 'M15 5l-7 7 7 7',
    fwd: 'M9 5l7 7-7 7',
    history: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2',
    up: 'M7 11v10H3V11zM7 11l4-8a2 2 0 0 1 2 2v4h5a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 16.6 21H7',
    down: 'M17 13V3h4v10zM17 13l-4 8a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2.3l1.4-7A2 2 0 0 1 7.4 3H17'
  };
  function ic(name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + P[name] + '"/></svg>';
  }
  var AVA = '<img class="ava" src="assets/maya.jpg" alt="Maya" onerror="this.onerror=null;this.src=\'assets/maya.svg\'">';

  /* Weekly velocity index at Target, weeks 28 to 37. Index 100 = category average. */
  function chart(id) {
    id = id || 'c';
    var xs = [48, 102.7, 157.3, 212, 266.7, 321.3, 376, 430.7, 485.3, 540];
    var BASE = 190;
    var y = function (v) { return +(BASE - (v - 60) / 180 * 172).toFixed(1); };
    var kr = [112, 110, 111, 109, 108, 104, 101, 99, 97, 95];
    var bw = [null, null, null, null, 90, 120, 150, 175, 200, 210];
    function curve(arr) {
      var pts = [];
      for (var i = 0; i < arr.length; i++) if (arr[i] !== null) pts.push([xs[i], y(arr[i])]);
      var d = 'M' + pts[0][0] + ',' + pts[0][1];
      for (var k = 0; k < pts.length - 1; k++) {
        var p0 = pts[k - 1] || pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] || p2;
        d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
          (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ',' + p2[1];
      }
      return { d: d, first: pts[0], last: pts[pts.length - 1] };
    }
    var K = curve(kr), B = curve(bw);
    var area = function (c) { return c.d + ' L' + c.last[0] + ',' + BASE + ' L' + c.first[0] + ',' + BASE + ' Z'; };
    return '<div class="chart-legend"><span><i class="sw bw"></i>Bloomwell gummies <b>2.1x</b></span><span><i class="sw kr"></i>Kindroot capsules <b>0.95x</b></span><span><i class="sw cat"></i>Category average <b>1.0x</b></span></div>' +
      '<svg viewBox="0 0 560 226" role="img" aria-label="Weekly velocity index at Target, last 10 weeks. Bloomwell gummies rise to 2.1 times the category average since launch; Kindroot capsules drift down to 0.95.">' +
      '<defs><linearGradient id="gbw' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--risk);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--risk);stop-opacity:0"/></linearGradient>' +
      '<linearGradient id="gkr' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent);stop-opacity:.18"/><stop offset="1" style="stop-color:var(--accent);stop-opacity:0"/></linearGradient></defs>' +
      '<line class="grid" x1="44" y1="' + y(200) + '" x2="548" y2="' + y(200) + '"/><line class="grid" x1="44" y1="' + y(150) + '" x2="548" y2="' + y(150) + '"/>' +
      '<line class="grid base" x1="44" y1="' + BASE + '" x2="548" y2="' + BASE + '"/>' +
      '<text x="36" y="' + (y(200) + 4) + '" text-anchor="end">200</text><text x="36" y="' + (y(150) + 4) + '" text-anchor="end">150</text><text x="36" y="' + (y(100) + 4) + '" text-anchor="end">100</text>' +
      '<path class="area kr" d="' + area(K) + '" fill="url(#gkr' + id + ')"/>' +
      '<path class="area bw" d="' + area(B) + '" fill="url(#gbw' + id + ')"/>' +
      '<line class="l-cat" x1="44" y1="' + y(100) + '" x2="548" y2="' + y(100) + '"/>' +
      '<line class="launch" x1="266.7" y1="18" x2="266.7" y2="' + BASE + '"/>' +
      '<rect class="chip" x="204" y="2" width="126" height="17" rx="8.5"/><text class="chipt" x="267" y="13.5" text-anchor="middle">Bloomwell on shelf</text>' +
      '<path class="l-kr" d="' + K.d + '" fill="none" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path class="l-bw" d="' + B.d + '" fill="none" stroke-width="2.5" stroke-linecap="round"/>' +
      '<circle class="dot kr" cx="' + K.last[0] + '" cy="' + K.last[1] + '" r="4.5"/><circle class="dot bw" cx="' + B.last[0] + '" cy="' + B.last[1] + '" r="4.5"/>' +
      '<text x="48" y="211">W28</text><text x="212" y="211" text-anchor="middle">W31</text><text x="376" y="211" text-anchor="middle">W34</text><text x="540" y="211" text-anchor="end">W37</text>' +
      '</svg>';
  }

  function seg(obj, key, opts) {
    var h = '<div class="seg">';
    for (var i = 0; i < opts.length; i++) {
      h += '<button data-seg="' + obj + '|' + key + '|' + opts[i][0] + '" aria-pressed="' + (ui[obj][key] === opts[i][0]) + '">' + (opts[i][2] ? ic(opts[i][2]) : '') + opts[i][1] + '</button>';
    }
    return h + '</div>';
  }
  var RHY = [['daily', 'Daily', 'sun'], ['weekly', 'Weekly', 'week'], ['periodic', 'Periodic', 'flag']];
  var RH_HINT = { daily: 'Every morning at 8:30, before her first meeting.', weekly: 'Monday morning, before the status and the management update.', periodic: 'Builds toward the moment: the Target review on Oct 1, the Q4 plan, the launch brief.' };
  var RH_ICON = { daily: 'sun', weekly: 'week', periodic: 'flag' };
  var REASONS = [['retailer', 'Wrong retailer'], ['product', 'Wrong product'], ['small', 'Too small'], ['urgent', 'Not urgent'], ['knew', 'Already knew']];
  var REASON_MSG = {
    retailer: 'Competitor launches will focus on Target and CVS, where your magnesium sells.',
    product: 'Competitor launches will stay on your magnesium and probiotic lines.',
    small: 'Competitor launches will skip launches under 1x category velocity and stay on magnesium at Target.',
    urgent: 'Competitor launches will keep items like this in your daily rhythm, and only break through when a window is under a week.',
    knew: 'Competitor launches will report right away when it\'s big, instead of waiting for the digest.'
  };
  function feedbackRow() {
    var h = '<div class="thumbs"><button class="btn btn-ghost btn-ic" data-like aria-pressed="' + !!ui.liked + '" aria-label="Relevant">' + ic('up') + '</button><button class="btn btn-ghost btn-ic" data-fb="no" aria-pressed="' + (ui.fb === 'no') + '" aria-label="Not relevant">' + ic('down') + '</button></div>';
    if (ui.fb === 'no') {
      h += '<div class="whyoff"><span class="hint">What was off?</span><div class="chips">';
      for (var r = 0; r < REASONS.length; r++) h += '<button class="chip" data-reason="' + REASONS[r][0] + '" aria-pressed="' + (ui.reason === REASONS[r][0]) + '">' + REASONS[r][1] + '</button>';
      h += '</div>' + (ui.reason ? '<div class="confirm"><b>Got it.</b> ' + REASON_MSG[ui.reason] + ' Next update tomorrow, 8:30.</div>' : '') + '</div>';
    }
    return h;
  }
  var RH_LABEL = { daily: 'Daily', weekly: 'Weekly', periodic: 'Periodic' };

  var TIMES = ['7:00', '7:30', '8:00', '8:30', '9:00', '12:00', '17:00'];
  var WDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  var DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  var DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var EVENTS = [['target', 'Target category review', 'Oct 1'], ['q4', 'Q4 plan', 'Oct 15'], ['innovation', 'Innovation pipeline review', 'Nov 3'], ['launch', 'Launch brief', 'Nov 20']];
  var LEADS = [3, 7, 14, 21];
  function sel(field, opts, value, fmt) {
    var h = '<select class="sel" data-ed="' + field + '" aria-label="' + field + '">';
    for (var i = 0; i < opts.length; i++) {
      var v = fmt ? fmt(opts[i]) : opts[i];
      h += '<option value="' + v[0] + '"' + (String(v[0]) === String(value) ? ' selected' : '') + '>' + v[1] + '</option>';
    }
    return h + '</select>';
  }
  function schedule(e) {
    if (e.rh === 'daily') {
      var d = '<div class="days">';
      for (var i = 0; i < 7; i++) d += '<button class="day" data-day="' + i + '" aria-pressed="' + !!e.days[i] + '" aria-label="' + DAY_NAMES[i] + '">' + DAYS[i] + '</button>';
      d += '</div>';
      return '<div class="sched"><span>At</span>' + sel('time', TIMES, e.time, function (t) { return [t, t]; }) + '<span>on</span>' + d + '</div>';
    }
    if (e.rh === 'weekly') {
      return '<div class="sched"><span>Every</span>' + sel('wday', WDAYS, e.wday, function (t) { return [t, t]; }) + '<span>at</span>' + sel('time', TIMES, e.time, function (t) { return [t, t]; }) + '</div>';
    }
    return '<div class="sched">' + sel('lead', LEADS, e.lead, function (n) { return [n, n + ' days']; }) + '<span>before</span>' + sel('event', EVENTS, e.event, function (ev) { return [ev[0], ev[1] + ', ' + ev[2]]; }) + '<span>then as things change</span></div>';
  }
  function eventOf(e) { for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i][0] === e.event) return EVENTS[i]; return EVENTS[0]; }
  function schedHint(e) {
    if (e.rh === 'daily') {
      var on = []; for (var i = 0; i < 7; i++) if (e.days[i]) on.push(DAY_NAMES[i]);
      var when = (on.length === 5 && !e.days[5] && !e.days[6]) ? 'Every weekday' : on.length === 7 ? 'Every day' : on.length ? on.join(', ') : 'No days picked';
      return when + ' at ' + e.time + '. Her first meeting is at 9:00.';
    }
    if (e.rh === 'weekly') return 'Every ' + e.wday + ' at ' + e.time + ', before the status and the management update.';
    var ev = eventOf(e);
    return 'First brief ' + e.lead + ' days before the ' + ev[1] + ' (' + ev[2] + '), then whenever something changes until the day.';
  }

  function urgencyBanner(text, src) {
    return '<div class="urg" role="status">' + ic('clock') + '<div><span class="urg-k">Window closing</span> ' + text + (src ? '<span class="src">' + src + '</span>' : '') + '</div><div class="date"><b>Oct 1</b><span>9 days</span></div></div>';
  }
  function urgencyToggle() {
    return '<div class="field"><span>Urgency</span><div class="urgrow"><button class="toggle" role="switch" aria-checked="' + ui.urgent + '" data-urgent aria-label="Break through when a window is closing"></button><span class="hint">Break through to today when a window is closing, whatever the rhythm.</span></div></div>';
  }

  /* Agents: the presets, in Maya's words */
  var AGENTS = [
    { name: 'Competitor launches', rh: 'daily', slack: true, email: false, ask: 'who\'s launching against my magnesium line at Target, CVS and Amazon', chips: ['Magnesium', 'Sleep claims', 'Target, CVS, Amazon', 'Bloomwell, Sunveil, Nature\'s Path'], watch: 'Magnesium, sleep claims. Target, CVS, Amazon.', last: '<b>Today, 1 new</b>' },
    { name: 'My share at key retailers', rh: 'weekly', slack: true, email: false, ask: 'how my five SKUs are doing at Target, CVS and Amazon, every Monday', chips: ['Kindroot, 5 SKUs', 'Share and velocity', 'Target, CVS, Amazon'], watch: 'Kindroot\'s 5 SKUs at Target, CVS, Amazon. For Monday\'s numbers.', last: 'Monday' },
    { name: 'Claims and ingredients gaining traction', rh: 'weekly', slack: false, email: true, ask: 'which claims and ingredients are rising in natural supplements', chips: ['Natural supplements', 'Claims', 'Ingredients'], watch: 'Claims and ingredients on the rise in natural supplements. For the management update.', last: 'Monday' },
    { name: 'Consumer trends: sleep, stress, gut', rh: 'periodic', slack: false, email: true, ask: 'what consumers say and search in sleep, stress and gut health, for the Q4 plan', chips: ['Sleep', 'Stress', 'Gut health', 'Conversation and search'], watch: 'Consumer conversation and search in your three need states. Feeds the Q4 plan and the innovation pipeline.', last: 'Sep 8' },
    { name: 'Retailer review prep', rh: 'periodic', slack: false, email: true, ask: 'everything I need for the Target review on Oct 1', chips: ['Target', 'Kindroot range', 'Category and competitors', 'Deck, built over time'], watch: 'Everything for Target, Oct 1. Builds the deck as things change.', last: '<b>Draft deck: 4 slides</b>' }
  ];
  var RHYTHMS = [
    ['daily', 'Daily, 8:30', 'What needs a reaction today'],
    ['weekly', 'Weekly, Monday', 'What goes into Monday\'s status and the management update'],
    ['periodic', 'Periodic', 'What builds toward the review, the plan, the launch']
  ];
  var PRESETS = [['Format shifts', 'weekly', 'Monday, by email'], ['Price and promo moves', 'daily', 'tomorrow 8:30, in Slack'], ['GLP-1 companion', 'periodic', 'before the Q4 plan'], ['Regulatory and claims watch', 'weekly', 'Monday, by email'], ['Retailer assortment changes', 'daily', 'tomorrow 8:30, in Slack']];
  var EXAMPLES = [
    ['who\'s launching in gut health', 'Who\'s launching in gut health', 'Competitor launches, weekly', 'shelf'],
    ['price moves on my SKUs at Amazon', 'Price moves on my SKUs at Amazon', 'Price and promo, daily', 'dollar'],
    ['claims growing in women\'s health', 'Claims growing in women\'s health', 'Claims and ingredients, weekly', 'tag']
  ];

  function fromAgent(i) {
    var a = AGENTS[i];
    return { name: a.name, ask: a.ask, chips: a.chips.slice(), rh: a.rh, slack: a.slack, email: a.email, src: i, time: '8:30', days: [true, true, true, true, true, false, false], wday: 'Monday', event: a.name === 'Retailer review prep' ? 'target' : 'q4', lead: 7 };
  }
  function fromPrompt(text) {
    var t = (text || '').toLowerCase();
    var base = { src: 'new', time: '8:30', days: [true, true, true, true, true, false, false], wday: 'Monday', event: 'target', lead: 7 };
    var out;
    if (t.indexOf('gut') >= 0) out = { name: 'Launches in gut health', ask: text, chips: ['Competitor launches (gut health)', 'Probiotics, fiber, prebiotics', 'Target, CVS, Amazon'], rh: 'weekly', slack: true, email: false };
    else if (t.indexOf('price') >= 0) out = { name: 'Price moves on my SKUs at Amazon', ask: text, chips: ['Price and promo moves (your SKUs)', 'Competitor prices (magnesium, probiotic)', 'Promo calendars at your retailers'], rh: 'daily', slack: true, email: false };
    else if (t.indexOf('claim') >= 0) out = { name: 'Claims growing in women\'s health', ask: text, chips: ['Claims (women\'s health)', 'Ingredients on the rise', 'Search and conversation'], rh: 'weekly', slack: false, email: true };
    else out = { name: 'Threats to magnesium at Target', ask: text || ui.prompt, chips: ['Competitor launches (magnesium, Target)', 'Price and promo moves (magnesium, Target)', 'Share drops (Kindroot Magnesium Glycinate, Target)', 'Negative review spikes (Kindroot Magnesium)'], rh: 'daily', slack: true, email: false };
    for (var k in base) out[k] = base[k];
    return out;
  }
  function whereText(e) {
    if (e.slack && e.email) return 'in Slack and by email';
    return e.slack ? 'in Slack' : 'by email';
  }
  function firstUpdate() {
    var e = ui.ed || fromPrompt(ui.prompt);
    var w = whereText(e);
    if (e.rh === 'weekly') return e.wday + ' at ' + e.time + ', ' + w;
    if (e.rh === 'periodic') { var ev = eventOf(e); return e.lead + ' days before the ' + ev[1] + ', ' + w; }
    return 'tomorrow at ' + e.time + ', ' + w;
  }

  /* The editor: "Here's what I understood", for a new agent and for an existing one */
  function editor(o) {
    var e = ui.ed;
    var chips = '';
    for (var c = 0; c < e.chips.length; c++) chips += '<span class="tag">' + e.chips[c] + '<button data-rmchip="' + c + '" aria-label="Remove">&times;</button></span>';
    if (o.learned) chips += o.learned;
    chips += '<span class="tag add" data-toast="Type another thing to watch. Radar adds it to the list.">+ add</span>';
    var bothOff = !e.slack && !e.email;
    return '<div class="c agent-card">' +
      '<div class="ed-sec"><div class="ed-title">' + ic('sparkle') + 'Your prompt' + (o.pill ? '<span class="r">' + o.pill + '</span>' : '') + '</div>' +
      '<div class="ed-prompt">' + ic('edit') + '<input id="edq" value="' + e.ask.replace(/"/g, '&quot;') + '" aria-label="Your prompt" spellcheck="false"></div>' +
      '<span class="hint">Edit the words here. When you leave the field, Radar reads it again and the card below follows.</span></div>' +
      '<div class="ed-sec"><div class="ed-title">' + ic('radar') + 'The agent</div>' +
      '<div class="field"><span>Name</span><div><span class="name" contenteditable="true" spellcheck="false">' + e.name + '</span></div></div>' +
      '<div class="field"><span>Watches</span><div class="tags">' + chips + '</div></div></div>' +
      '<div class="ed-sec"><div class="ed-title">' + ic('clock') + 'When and where</div>' +
      '<div class="field"><span>Rhythm</span><div>' + seg('ed', 'rh', RHY) + '</div></div>' +
      '<div class="field"><span>Schedule</span><div>' + schedule(e) + '<span class="hint seg-hint">' + schedHint(e) + '</span></div></div>' +
      '<div class="field"><span>Where</span><div><div class="wsel"><button class="wopt" data-where="slack" aria-pressed="' + e.slack + '">' + ic('hash') + 'Slack DM</button><button class="wopt" data-where="email" aria-pressed="' + e.email + '">' + ic('mail') + 'Email</button></div><span class="hint">' + (bothOff ? 'Pick at least one.' : 'One or both.') + '</span></div></div>' +
      urgencyToggle() + '</div>' +
      (o.sample ? '<div class="ed-sec"><div class="ed-title">' + ic('eye') + 'Sample of the first update</div>' + o.sample + '</div>' : '') +
      '<div class="ed-foot">' + o.cta + (o.secondary || '') + '</div></div>';
  }

  /* The Block Kit card, shared by Slack and email */
  function blockKit() {
    var btn = function (cls, attrs, label) { return '<button class="bk-btn' + (cls ? ' ' + cls : '') + '" ' + attrs + '>' + label + '</button>'; };
    var item = function (title, why, urg, cls, actions) {
      return '<div class="bk-item"><div class="bk-h">' + title + '</div><div class="bk-s"><b>Why it matters:</b> ' + why + '</div>' +
        '<div class="bk-urg ' + cls + '">' + ic('clock') + '<span>' + urg + '</span></div><div class="bk-actions">' + actions + '</div></div>';
    };
    var other = 'data-toast="Opens that insight. This walkthrough follows the Bloomwell one."';
    return '<div class="bk">' +
      '<div class="bk-ctx">' + ic('radar') + '<span>Competitor launches</span><span>&middot;</span>' + ic('sun') + '<span>Daily</span><span>&middot;</span><span>3 updates</span></div>' +
      item('Bloomwell Magnesium Sleep Gummies is gaining fast at Target',
        'it competes with your Magnesium Glycinate capsules on the same "sleep" claim and is winning on format. Your magnesium share at Target is down 1.4 pts in 8 weeks.',
        '<b>Window closing: Oct 1, 9 days.</b> Endcap requests for Target\'s Q4 reset close the day of your review.', 'hot',
        btn('primary', 'data-go="2"', 'Open insight') + btn('', 'data-go="3" data-tab="slide"', 'Create slide') + btn('', 'data-go="4"', 'Tune this agent')) +
      item('Sunveil cut its magnesium price 15% at Target',
        'your price gap is now 22%, on the shelf where you\'re already losing share.',
        '<b>Promo ends Oct 5, 12 days.</b> Worth a decision before then.', 'warm',
        btn('primary', other, 'Open insight') + btn('', 'data-go="4"', 'Tune this agent')) +
      item('Nature\'s Path launched Ashwagandha Calm Gummies at CVS',
        'your Ashwagandha SKU sits on the same shelf. 0.9x category velocity in week one.',
        'No window. Worth watching, not acting.', 'none',
        btn('primary', other, 'Open insight') + btn('', 'data-go="4"', 'Tune this agent')) +
      '<div class="bk-links"><a data-toast="You asked Competitor launches to watch magnesium at Target, in your daily. The window made the first one urgent.">Why you\'re seeing this</a><a data-go="2" data-fb="no">Not relevant</a></div>' +
      '</div>';
  }

  function slackWin() {
    var side = function (icon, label, cls) { return '<div class="it' + (cls ? ' ' + cls : '') + '">' + (icon ? ic(icon) : '') + label + '</div>'; };
    return '<div class="sl" aria-label="Slack, desktop">' +
      '<div class="sl-top"><div class="lights"><i></i><i></i><i></i></div><div class="sl-nav">' + ic('back') + ic('fwd') + ic('history') + '</div>' +
      '<div class="search">' + ic('search') + ' Search Kindroot</div>' + ic('help') + '<div class="me">' + AVA + '</div></div>' +
      '<div class="sl-body">' +
      '<div class="sl-rail"><div class="ws">K</div><div class="ws2">A</div><div class="plus">+</div></div>' +
      '<div class="sl-side"><div class="hd">Kindroot ' + ic('chevd') + '<span class="grow"></span><span class="ed">' + ic('edit') + '</span></div>' +
      side('thread', 'Threads') + side('inbox', 'All DMs') + side('draft', 'Drafts') + side('at', 'Mentions &amp; reactions') + side('bookmark', 'Saved items') + side('more', 'More') +
      '<div class="sec">' + ic('star') + ' Starred</div>' + side('hash', 'brand-kindroot', 'sub bold') + side('hash', 'retail-target', 'sub') +
      '<div class="sec">' + ic('chevd') + ' Channels</div>' + side('hash', 'launches', 'sub') + side('hash', 'announcements', 'sub') + side('plus', 'Add channel', 'sub') +
      '<div class="sec">' + ic('chevd') + ' Direct messages</div>' + '<div class="it sub"><span class="dm"></span>Dana</div><div class="it sub"><span class="dm b"></span>Omri</div>' +
      '<div class="sec">' + ic('chevd') + ' Apps</div>' + '<div class="it sub on"><span class="appic rmark"><i></i></span>Radar</div>' +
      '</div>' +
      '<div class="sl-main">' +
      '<div class="sl-head"><b>Radar</b><span class="apptag">APP</span>' + ic('chevd') + '<span class="desc">Agents that notice for Kindroot</span><span class="members"><i></i><i></i><i></i>3</span></div>' +
      '<div class="sl-tabs"><span class="on">' + ic('thread') + ' Messages</span><span>' + ic('help') + ' About</span><span>' + ic('plus') + '</span></div>' +
      '<div class="sl-msgs">' +
      '<div class="sl-day"><span>Monday, September 21</span></div>' +
      '<div class="sl-msg dim"><div class="av rmark"><i></i></div><div><div class="who"><b>Radar</b><span class="apptag">APP</span><span class="ts">8:30</span></div><div class="txt">Weekly: your share held at 12.4% across Target, CVS and Amazon. Nothing urgent. Two items for the management update.</div></div></div>' +
      '<div class="sl-day"><span>Today</span></div>' +
      '<div class="sl-msg"><div class="av rmark"><i></i></div><div><div class="who"><b>Radar</b><span class="apptag">APP</span><span class="ts">8:41</span></div>' +
      '<div class="txt">Good morning, Maya. Three updates in your daily.</div>' + blockKit() + '</div></div>' +
      '</div>' +
      '<div class="sl-comp"><div class="in">Message Radar</div><div class="bar">' + ic('zap') + '<span class="fmt"><span>B</span><span><i>I</i></span><span><s>S</s></span></span>' + ic('link') + ic('more') + '<span class="grow"></span>' + ic('at') + ic('smile') + ic('clip') + '<span class="send">' + ic('send') + '</span></div></div>' +
      '</div></div></div>';
  }

  function slackLogo() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="6" y="1.5" width="4" height="11" rx="2" fill="#36C5F0"/><path d="M5 9.5v3H3a2 2 0 1 1 0-4h2z" fill="#36C5F0"/>' +
      '<rect x="11.5" y="6" width="11" height="4" rx="2" fill="#2EB67D"/><path d="M14.5 5h-3V3a2 2 0 1 1 4 0v2z" fill="#2EB67D"/>' +
      '<rect x="14" y="11.5" width="4" height="11" rx="2" fill="#E01E5A"/><path d="M19 11.5v3h2a2 2 0 1 0 0-4h-2z" fill="#E01E5A"/>' +
      '<rect x="1.5" y="14" width="11" height="4" rx="2" fill="#ECB22E"/><path d="M9.5 19h3v2a2 2 0 1 1-4 0v-2z" fill="#ECB22E"/></svg>';
  }
  function gmailLogo() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 8v10h4V11l6 4.5L18 11v7h4V8l-10 7.5z" fill="#EA4335"/><path d="M2 8V6.5a1.5 1.5 0 0 1 2.4-1.2L12 11 2 8z" fill="#4285F4"/><path d="M22 8V6.5a1.5 1.5 0 0 0-2.4-1.2L12 11l10-3z" fill="#34A853"/><path d="M2 8v10h4v-7z" fill="#4285F4"/><path d="M22 8v10h-4v-7z" fill="#34A853"/></svg>';
  }
  function phone() {
    var slack = ui.channel === 'slack';
    return '<div class="phone"><div class="notch"></div><div class="clock">8:41</div><div class="date">Tuesday, September 22</div>' +
      '<div class="notif"><div class="appic">' + (slack ? slackLogo() : gmailLogo()) + '</div>' +
      '<div class="nt"><div class="nm"><span>Time sensitive</span><span>now</span></div><b>' + (slack ? 'Slack' : 'Gmail') + '</b>' +
      '<p>Radar: your daily is ready. 3 updates, one with a window closing Oct 1.</p></div></div></div>';
  }

  function emailWin() {
    var nav = function (icon, label, on, n) { return '<div class="gm-it' + (on ? ' on' : '') + '">' + ic(icon) + '<span>' + label + '</span>' + (n ? '<b>' + n + '</b>' : '') + '</div>'; };
    var lab = function (color, label) { return '<div class="gm-it"><i class="lab" style="background:' + color + '"></i><span>' + label + '</span></div>'; };
    return '<div class="gm" aria-label="Gmail">' +
      '<div class="gm-top">' + ic('menu') + '<span class="gm-logo"><b>M</b>Gmail</span>' +
      '<div class="gm-search">' + ic('search') + '<span>Search mail</span><span class="grow"></span>' + ic('tune') + '</div>' +
      '<div class="gm-icons">' + ic('help') + ic('gear') + ic('apps') + '<span class="gm-me">' + AVA + '</span></div></div>' +
      '<div class="gm-body">' +
      '<div class="gm-nav"><div class="gm-compose">' + ic('edit') + 'Compose</div>' +
      nav('inbox', 'Inbox', true, '14') + nav('star', 'Starred') + nav('snooze', 'Snoozed') + nav('send', 'Sent') + nav('draft', 'Drafts') + nav('chevd', 'More') +
      '<div class="gm-labels">Labels ' + ic('plus') + '</div>' + lab('#5F6368', 'Categories') + lab('#188038', 'Team') + lab('#F9AB00', 'News') + lab('#1A73E8', 'Work') + lab('#D93025', 'Personal') + '</div>' +
      '<div class="gm-panel">' +
      '<div class="gm-tools">' + ic('arrowl') + '<span class="sep"></span>' + ic('archive') + ic('label') + ic('trash') + '<span class="sep"></span>' + ic('mail') + ic('snooze') + ic('task') + ic('more') + '<span class="grow"></span><span class="pager">2 of 16</span>' + ic('chevd') + '</div>' +
      '<div class="gm-subj">Competitor launches: Bloomwell gummies gaining fast at Target. Window closes Oct 1. <span class="gm-tag">Inbox</span></div>' +
      '<div class="gm-from"><span class="av rmark"><i></i></span><div><b>Radar</b> <span class="addr">&lt;radar@platform&gt;</span><div class="to">to me ' + ic('chevd') + '</div></div>' +
      '<div class="right"><span class="ts">8:41 AM (2 minutes ago)</span>' + ic('star') + ic('reply') + ic('more') + '</div></div>' +
      '<div class="gm-msg"><p>Good morning, Maya. Three updates in your daily.</p>' + blockKit() +
      '<p class="gm-foot">You get this because Competitor launches reports to email. <a data-go="4">Tune this agent</a> &middot; <a data-go="5">Open Radar</a></p></div>' +
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
      '<div class="me"><span class="av">' + AVA + '</span><div>Maya K.<span>Brand Manager</span></div></div></nav>' +
      '<div class="app-main"><div class="app-top"><div class="crumb">' + crumb + '</div><span class="ask">' + ic('sparkle') + 'Ask anything</span><span class="bell">' + ic('bell') + '<i></i></span></div>' +
      '<div class="app-body">' + body + '</div></div></div>';
  }
  function ph(eyebrow, title, meta, actions, right, sub) {
    return '<div class="ph"><div class="eyebrow">' + eyebrow + '</div><div class="ph-r">' + (right || '') + '</div>' +
      '<div class="ph-t"><h4>' + title + '</h4>' + (meta ? '<p class="pm">' + meta + '</p>' : '') + '</div><div class="actions">' + (actions || '') + '</div>' +
      (sub ? '<div class="ph-sub">' + sub + '</div>' : '') + '</div>';
  }
  var sep = ' ' + ic('chevr') + ' ';

  /* Radar home: one list, grouped by rhythm */
  function row(a, on, idx, isNew) {
    var chans = (a.slack ? '<span>' + ic('hash') + 'Slack</span>' : '') + (a.email ? '<span>' + ic('mail') + 'Email</span>' : '');
    return '<div class="arow' + (on ? '' : ' off') + '"' + (idx !== null ? ' data-editagent="' + idx + '" role="link" tabindex="0" aria-label="Open ' + a.name + '"' : '') + '>' +
      '<span class="ai" title="' + RH_LABEL[a.rh] + '">' + ic(RH_ICON[a.rh]) + '</span>' +
      '<div class="an"><div class="anl"><b>' + a.name + '</b><span class="pill neutral">' + (isNew ? 'Yours' : 'Preset') + '</span>' + (isNew ? '<span class="pill">New</span>' : '') + '</div><div class="aw">' + a.watch + '</div></div>' +
      '<div class="ach">' + chans + '</div>' +
      '<div class="al">' + (on ? (a.lastLabel || 'Last: ') + a.last : 'Paused') + '</div>' +
      (idx !== null ? '<button class="toggle" role="switch" aria-checked="' + on + '" data-agent="' + idx + '" aria-label="' + a.name + ' on or off"></button>' : '<span></span>') +
      (idx !== null ? '<button class="more" data-menu="' + idx + '" aria-haspopup="menu" aria-expanded="' + (ui.menu === idx) + '" aria-label="More for ' + a.name + '">' + ic('more') + '</button>' : '<span></span>') +
      (idx !== null && ui.menu === idx ? menu(idx, on) : '') +
      '</div>';
  }
  function menu(i, on) {
    return '<div class="menu" role="menu">' +
      '<button role="menuitem" data-editagent="' + i + '">' + ic('tune') + 'Adjust</button>' +
      '<button role="menuitem" data-agent="' + i + '">' + ic(on ? 'pause' : 'play') + (on ? 'Pause' : 'Resume') + '</button>' +
      '<button role="menuitem" data-toast="Duplicated as \'' + AGENTS[i].name + ' (copy)\'. Edit it from the list.">' + ic('copy') + 'Duplicate</button>' +
      '<button role="menuitem" class="danger" data-toast="Deleted ' + AGENTS[i].name + '. Undo stays in this toast for ten seconds (prototype).">' + ic('trash') + 'Delete</button></div>';
  }

  var STATES = [
    {
      title: 'Scene', desc: 'Her three rhythms', cap: 'Tuesday, 8:40. This is Maya.',
      where: 'Maya\'s desk, between meetings', when: 'Tuesday, September 22, 8:40',
      notes: ['Maya isn\'t in the product. The story starts with her, not with us.', 'Her week already has three rhythms. Radar fits into them instead of adding a fourth.'],
      render: function () {
        return '<div class="scene"><div class="scene-top"><div class="who"><span class="avatar-lg">' + AVA + '</span><div><h4>Maya K.</h4><p class="role">Brand Manager at Kindroot, a mid-size natural supplements brand. Five SKUs.</p></div></div>' +
          '<div class="clock">8:40<small>Tue, Sep 22 &middot; between meetings</small></div></div>' +
          '<div class="scene-body"><div class="persona-mini">' +
          '<div><div class="k">Measured on</div><p>Sales of her range, and new products that win.</p></div>' +
          '<div><div class="k">Her day</div><p>Meetings, email, spreadsheets, decks. Not an analyst, not a power user.</p></div>' +
          '<div><div class="k">The platform today</div><p>Twice a month, when something forces her in. Last time: three weeks ago.</p></div>' +
          '<div><div class="k">What she needs</div><p>Defend her shelf at Target. Pick the next launch. Never get caught off guard.</p></div>' +
          '</div><p class="scene-lead">Her week runs in three rhythms. Radar fits into them.</p>' +
          '<div class="rhythms">' +
          '<div class="rh"><div class="k">' + ic('sun') + 'Daily</div><ul><li><span class="t">9:00</span>Brand team sync</li><li><span class="t">11:00</span>Agency review</li><li><span class="t">14:00</span>1:1 with Dana</li><li>Approvals, emails, questions from the team</li></ul></div>' +
          '<div class="rh"><div class="k">' + ic('week') + 'Weekly</div><ul><li><span class="t">Mon</span>Performance and sales</li><li>Project status</li><li>Management update</li></ul></div>' +
          '<div class="rh"><div class="k">' + ic('flag') + 'Periodic</div><ul><li class="hl"><span class="t">Oct 1</span>Target category review</li><li>Q4 plan</li><li>Innovation pipeline, launch brief</li></ul></div>' +
          '</div><button class="btn btn-primary" data-go="1">Start ' + ic('arrowr') + '</button></div></div>';
      }
    },
    {
      title: 'The moment', desc: 'Slack or email', cap: 'Three updates in her daily. She picks the one with a date on it.',
      where: 'Her phone, then Slack on her laptop', when: 'Tuesday, 8:41',
      notes: [
        'Three updates in her daily. The one with a closing window comes first, and she picks it.',
        'Each update opens with why it matters to her, before any numbers.',
        'She can tune the agent or say "not relevant" right here, without leaving Slack.'
      ],
      render: function () {
        return '<div class="moment"><div class="moment-top"><div class="channel-toggle" role="group" aria-label="View as">' +
          '<button data-channel="slack" aria-pressed="' + (ui.channel === 'slack') + '">Slack</button>' +
          '<button data-channel="email" aria-pressed="' + (ui.channel === 'email') + '">Email</button></div>' +
          '<span class="hint">Maya picked Slack for this agent. The email says the same.</span></div>' +
          '<div class="moment-row"><div class="phone-wrap">' + phone() + '</div>' +
          '<div class="hop" aria-hidden="true"><svg viewBox="0 0 96 300"><defs><marker id="hopArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10z"/></marker></defs>' +
          '<circle cx="6" cy="112" r="3.5"/><path d="M6 112 C 64 112, 44 158, 101 158" marker-end="url(#hopArrow)"/></svg></div>' +
          '<div class="moment-screen">' + (ui.channel === 'slack' ? slackWin() : emailWin()) + '</div></div></div>';
      }
    },
    {
      title: 'The insight', desc: 'Window, signal, why, moves', cap: 'The window first. Then what changed, why it matters, and what to do.',
      where: 'The platform, Radar', when: 'Tuesday, 8:43',
      notes: [
        'The window comes first: what closes, when, and what it costs to miss it.',
        'Every number says where it came from. She can put this in front of a buyer.',
        'Three moves, one for each thing she\'s measured on: the retailer, the campaign, the next launch.',
        'Thumbs under the title. A thumbs-down asks what was off, and the agent answers with what it will do differently.'
      ],
      render: function () {
        var body = ph(ic('radar') + '<span>Competitor launches</span><span>&middot;</span>' + ic('sun') + '<span>Daily</span><span>&middot;</span><span class="pill warn">' + ic('clock') + 'Window closes Oct 1</span>',
          'Bloomwell Magnesium Sleep Gummies is gaining fast at Target',
          'Launched 6 weeks ago. Magnesium glycinate + L-theanine. Positioned "sleep + stress".',
          '<button class="btn btn-primary btn-sm" data-go="3" data-tab="slide">' + ic('slide') + 'Create slide</button><button class="btn btn-ghost btn-sm" data-go="3" data-tab="share">' + ic('share') + 'Share</button>',
          '<button class="btn btn-ghost btn-ic" data-go="4" aria-label="Tune this agent" title="Tune this agent">' + ic('tune') + '</button>',
          feedbackRow()) +
          urgencyBanner('Target locks Q4 planograms on <b>Oct 6</b>. Endcap requests close <b>Oct 1</b>, the day of your review. After that, the next shot at placement is January.', 'Target vendor calendar, Q4') +
          '<div class="tiles"><div class="tile"><div class="n">2.1x</div><div class="l">Category velocity at Target, last 6 weeks</div><div class="s">Retail sales data, weeks 32-37</div></div>' +
          '<div class="tile"><div class="n">+38%</div><div class="l">"Magnesium for sleep" searches, quarter over quarter</div><div class="s">Search data, US, Q3 vs Q2</div></div>' +
          '<div class="tile risk"><div class="n">-1.4 pts</div><div class="l">Your share of magnesium at Target, 8 weeks</div><div class="s">Retail sales data, Target</div></div></div>' +
          '<div class="g75"><div class="c"><div class="c-head">' + ic('trend') + 'Signal: what changed</div><ul class="ev">' +
          '<li>' + ic('shelf') + '<div>Velocity 2.1x the magnesium category average at Target over the last 6 weeks.<span class="src">Retail sales data, Target, weeks 32-37</span></div></li>' +
          '<li>' + ic('search') + '<div>"Magnesium for sleep" searches +38% quarter over quarter.<span class="src">Search data, US, Q3 vs Q2</span></div></li>' +
          '<li>' + ic('ask') + '<div>"Gummy" appears in 54% more magnesium conversations than 90 days ago.<span class="src">Social listening, US, 90 days</span></div></li>' +
          '<li>' + ic('star') + '<div>Reviews praise taste and "no pill fatigue". 4.6 stars.<span class="src">Review analysis, n=1,214</span></div></li>' +
          '</ul><div class="chart">' + chart('i') + '<div class="cap">Weekly velocity index at Target, weeks 28-37. Index 100 = category average. Illustrative.</div></div></div>' +
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
          '<div class="ins-foot"><span>Why you\'re seeing this: you asked Competitor launches to watch magnesium at Target. The window made it urgent.</span></div>';
        return app('<a data-go="5">Radar</a>' + sep + '<a data-go="5">Competitor launches</a>' + sep + '<b>September 22</b>', body, { url: 'radar/competitor-launches/sep-22' });
      }
    },
    {
      title: 'Act', desc: 'Slide, email, meeting', cap: 'Radar drafts. Maya sends.',
      where: 'The platform, Radar, acting on the insight', when: 'Tuesday, 8:45',
      notes: ['Radar drafts. Maya sends. Nothing goes out without her.', 'The date travels with the work: the slide asks for it, the meeting lands before it.'],
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
            '<div class="slide"><h5>Sleep is reshaping magnesium at Target</h5><div class="chart">' + chart('s') + '</div>' +
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
        var head = ph(ic('radar') + '<span>Competitor launches</span><span>&middot;</span><span>Bloomwell gummies at Target</span>', 'Act on it', 'Everything here is a draft until Maya sends it.');
        return app('<a data-go="5">Radar</a>' + sep + '<a data-go="2">Bloomwell gummies at Target</a>' + sep + '<b>Act</b>', head + t + body, { url: 'radar/competitor-launches/sep-22/act' });
      }
    },
    {
      title: 'Tune', desc: 'Feedback, adjust', cap: 'One card: what the agent watches, and how it reaches her.',
      where: 'The platform, Radar, the same insight', when: 'Tuesday, 8:47',
      notes: ['The same card she saw when she created an agent. One place to change things, and she can get here from Slack, from email, or from the insight.', 'What she taught it from the insight shows up here as a tag, so she can see that it learned.'],
      render: function () {
        var a = AGENTS[ui.editAgent];
        var fb = '';
        var learned = (ui.reason === 'small') ? '<span class="tag learned">Skips launches under 1x</span>' :
          (ui.reason === 'urgent') ? '<span class="tag learned">Breaks through only under a week</span>' : '';
        var card = editor({
          pill: learned ? '<span class="pill">Changed just now</span>' : '<span class="pill">On &middot; ' + RH_LABEL[ui.ed.rh].toLowerCase() + '</span>',
          learned: learned,
          cta: '<button class="btn btn-primary btn-sm" data-toast="Saved. Applies from the next update.">' + ic('check') + 'Save</button>',
          secondary: '<button class="btn btn-ghost btn-sm" data-go="5">See all agents</button>'
        });
        var head = ph(ic('radar') + '<span>Radar</span><span>&middot;</span>' + ic(RH_ICON[a.rh]) + '<span>' + RH_LABEL[a.rh] + '</span>', 'Here\'s what I understood', 'What ' + a.name + ' is watching, and how it reaches you. Change anything you like.',
          '<button class="btn btn-ghost btn-sm" data-go="5">' + ic('radar') + 'All agents</button>');
        return app('<a data-go="5">Radar</a>' + sep + '<a data-go="2">' + a.name + '</a>' + sep + '<b>Tune</b>', head + '<div class="one">' + fb + card + '</div>', { url: 'radar/' + a.name.toLowerCase().replace(/[^a-z]+/g, '-') + '/tune' });
      }
    },
    {
      title: 'Radar home', desc: 'Agents by rhythm', cap: 'Five agents, three rhythms. She switches things off, not on.',
      where: 'The platform, Radar home', when: 'Tuesday, 8:48',
      notes: ['She doesn\'t start from zero. Five agents came with her brand profile, named the way she\'d say them.', 'One list, in her three rhythms, so it reads like her week.', 'One rule at the top: a closing window is allowed to interrupt. Nothing else is.', 'Three dots on every agent: adjust, pause, duplicate, delete.'],
      render: function () {
        var count = ui.agents.filter(Boolean).length + (ui.created ? 1 : 0);
        var h = ph(ic('radar') + '<span>Radar</span>', 'Your radar', count + ' agents are watching Kindroot for you, in your three rhythms. We set them up from your brand profile. Switch off anything you don\'t need.',
          '<button class="btn btn-primary btn-sm" data-go="6">' + ic('plus') + 'New agent</button>') +
          '<div class="rule">' + ic('clock') + '<span><b>A closing window is allowed to interrupt.</b> When one is closing, you hear today, in Slack, with the date. Everything else waits for its rhythm.' + (ui.urgent ? '' : ' <span class="pill warn">Off: windows wait for their rhythm</span>') + '</span><span class="grow"></span><button class="toggle" role="switch" aria-checked="' + ui.urgent + '" data-urgent aria-label="Urgent updates break through"></button></div>';
        for (var g = 0; g < RHYTHMS.length; g++) {
          var rh = RHYTHMS[g];
          h += '<div class="rgroup"><div class="rhead"><span class="k">' + ic(RH_ICON[rh[0]]) + rh[1] + '</span><span class="hint">' + rh[2] + '</span></div><div class="alist">';
          for (var i = 0; i < AGENTS.length; i++) if (AGENTS[i].rh === rh[0]) h += row(AGENTS[i], ui.agents[i], i, false);
          if (ui.created && ui.createdAgent && ui.createdAgent.rh === rh[0]) h += row(ui.createdAgent, true, null, true);
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
      title: 'New agent', desc: 'Prompt to card', cap: 'Say it in your words. Get a card you can edit, and a sample first.',
      where: 'The platform, new agent', when: 'Tuesday, 8:50',
      notes: ['She writes what she wants in her own words. Radar turns it into a card she can edit.', 'Slack, email, or both.', 'She sees a sample of the first update before anything starts. No surprises.'],
      render: function () {
        if (ui.phase === 2) {
          return '<div class="done"><div class="mark">' + ic('check') + '</div><div class="kicker">Running</div><h4>First update ' + firstUpdate() + '.</h4>' +
            '<p>That\'s it. Maya said what matters, in her words. From here on, Radar notices and she decides.</p>' +
            '<div class="btns" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-go="5">See all agents</button><button class="btn btn-primary btn-sm" data-restart>Restart</button></div></div>';
        }
        var body;
        if (ui.phase === 0) {
          var ex = '';
          for (var x = 0; x < EXAMPLES.length; x++) ex += '<button class="excard" data-fill="' + EXAMPLES[x][0] + '">' + ic(EXAMPLES[x][3]) + '<b>' + EXAMPLES[x][1] + '</b><span>' + EXAMPLES[x][2] + '</span></button>';
          body = ph(ic('radar') + '<span>Radar</span><span>&middot;</span><span>New agent</span>', 'Tell Radar what to watch', 'Say it the way you\'d say it to a colleague. Radar turns it into an agent you can edit, and shows you a sample first.') +
            '<div class="composer"><div class="c-in">' + ic('sparkle') + '<input id="np" value="' + ui.prompt.replace(/"/g, '&quot;') + '" aria-label="What should Radar watch?" placeholder="e.g. anything that could hurt my magnesium line at Target"></div>' +
            '<div class="c-foot"><span class="hint">You\'ll get a card to check before anything starts.</span><button class="btn btn-primary btn-sm" data-phase="1">Ask Radar ' + ic('arrowr') + '</button></div></div>' +
            '<div class="c-head" style="margin-top:22px">' + ic('users') + 'Or start from what other brand managers watch</div><div class="examples">' + ex + '</div>';
        } else {
          var e = ui.ed;
          var sample = '<div class="mini"><div class="sl-msg"><div class="av rmark"><i></i></div><div><div class="who"><b>Radar</b><span class="apptag">APP</span><span class="ts">' + (e.rh === 'weekly' ? 'Mon 8:30' : e.rh === 'periodic' ? 'Sep 29, 8:30' : 'Thu 8:30') + '</span></div>' +
            '<div class="txt">' + e.name + ', ' + RH_LABEL[e.rh].toLowerCase() + ', ' + whereText(e) + '.</div>' +
            '<div class="bk"><div class="bk-h">Sunveil cut its magnesium price 15% at Target</div>' +
            '<div class="bk-s"><b>Why it matters:</b> your price gap is now 22%, and the promo runs to Oct 5.</div>' +
            '<div class="bk-urg warm">' + ic('clock') + '<span><b>Promo ends Oct 5, 12 days.</b> Worth a decision before then.</span></div>' +
            '<div class="bk-actions"><span class="bk-btn primary">Open insight</span><span class="bk-btn">Draft email</span></div></div></div></div></div>' +
            '<span class="hint">What your first update would look like, from last week\'s data. Illustrative.</span>';
          body = ph(ic('radar') + '<span>Radar</span><span>&middot;</span><span>New agent</span>', 'Here\'s what I understood', 'Check it, change what you like, then start.') +
            '<div class="one">' + editor({
              isNew: true, pill: '<span class="pill neutral">Draft</span>', sample: sample,
              cta: '<button class="btn btn-primary btn-sm" data-phase="2"' + (!e.slack && !e.email ? ' disabled' : '') + '>' + ic('check') + 'Start watching</button>',
              secondary: '<button class="btn btn-ghost btn-sm" data-phase="0">Edit the request</button>'
            }) + '</div>';
        }
        return app('<a data-go="5">Radar</a>' + sep + '<b>New agent</b>', body, { url: 'radar/new' });
      }
    }
  ];

  /* Shell */
  mount.className = 'proto' + (FULL ? ' full' : '');
  mount.setAttribute('tabindex', '0');
  mount.innerHTML =
    '<div class="proto-head"><span class="proto-brand"><i></i>Radar prototype</span><span class="proto-step" id="p-step"></span><span class="grow"></span>' +
    '<label class="switch"><input type="checkbox" id="p-notes" checked> Design notes</label>' +
    '<button class="btn btn-ghost btn-sm" data-restart>Restart</button>' +
    (FULL ? '<a class="btn btn-ghost btn-sm" href="index.html">Back to the write-up</a>' : '<a class="btn btn-ghost btn-sm" href="prototype.html" target="_blank" rel="noopener">Full screen</a>') +
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
    var n = '<h4>Design note</h4>';
    for (var j = 0; j < s.notes.length; j++) n += '<p>' + s.notes[j] + '</p>';
    notesBox.innerHTML = n;
    notesBox.hidden = !ui.notes;
    mount.querySelector('[data-prev]').disabled = ui.i === 0;
    mount.querySelector('[data-next]').innerHTML = ui.i === STATES.length - 1 ? 'Restart' : 'Next ' + ic('arrowr');
    stage.scrollTop = 0;
    var m = stage.querySelector('.sl-msgs');
    if (m) { var days = m.querySelectorAll('.sl-day'); var t = days[days.length - 1]; if (t) m.scrollTop = t.getBoundingClientRect().top - m.getBoundingClientRect().top - 4; }
  }

  function go(i, keepFb) {
    if (i < 0 || i >= STATES.length) return;
    ui.i = i; ui.edit = false; ui.ask = -1; ui.menu = -1; ui.phase = 0;
    if (!keepFb) { ui.fb = null; }
    if (i === 4) ui.ed = fromAgent(ui.editAgent);
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
    var t = e.target.closest('[data-go],[data-channel],[data-tab],[data-toast],[data-edit],[data-copy],[data-ask],[data-prev],[data-next],[data-restart],[data-fb],[data-reason],[data-agent],[data-preset],[data-phase],[data-fill],[data-rmchip],[data-seg],[data-urgent],[data-menu],[data-editagent],[data-where],[data-like],[data-day]');
    var menuWasOpen = ui.menu !== -1;
    if (!t || !mount.contains(t)) { if (menuWasOpen) { ui.menu = -1; render(); } return; }
    if (t.hasAttribute('data-tab')) ui.tab = t.getAttribute('data-tab');
    if (t.hasAttribute('data-fb') && t.hasAttribute('data-go')) { ui.fb = t.getAttribute('data-fb'); ui.reason = null; ui.editAgent = 0; go(+t.getAttribute('data-go'), true); return; }
    if (t.hasAttribute('data-go')) { var gi = +t.getAttribute('data-go'); if (gi === 4) ui.editAgent = 0; go(gi); return; }
    if (t.hasAttribute('data-editagent')) { ui.editAgent = +t.getAttribute('data-editagent'); go(4); return; }
    if (t.hasAttribute('data-prev')) { go(ui.i - 1); return; }
    if (t.hasAttribute('data-next')) { go(ui.i === STATES.length - 1 ? 0 : ui.i + 1); return; }
    if (t.hasAttribute('data-restart')) { ui.channel = 'slack'; ui.tab = 'slide'; ui.created = false; ui.createdAgent = null; ui.urgent = true; ui.agents = [true, true, true, true, true]; ui.presets = [false, false, false, false, false]; ui.ed = null; ui.editAgent = 0; ui.prompt = 'anything that could hurt my magnesium line at Target'; go(0); return; }
    if (t.hasAttribute('data-channel')) { ui.channel = t.getAttribute('data-channel'); render(); return; }
    if (t.hasAttribute('data-tab')) { ui.edit = false; ui.ask = -1; render(); return; }
    if (t.hasAttribute('data-ask')) { ui.ask = +t.getAttribute('data-ask'); render(); return; }
    if (t.hasAttribute('data-edit')) { ui.edit = !ui.edit; render(); if (ui.edit) { var b = stage.querySelector('#draft-body'); if (b) b.focus(); } return; }
    if (t.hasAttribute('data-fb')) { ui.fb = ui.fb === 'no' ? null : t.getAttribute('data-fb'); ui.liked = false; if (!ui.fb) ui.reason = null; render(); return; }
    if (t.hasAttribute('data-reason')) { ui.reason = t.getAttribute('data-reason'); render(); return; }
    if (t.hasAttribute('data-day')) { var di = +t.getAttribute('data-day'); ui.ed.days[di] = !ui.ed.days[di]; render(); return; }
    if (t.hasAttribute('data-like')) { ui.liked = !ui.liked; if (ui.liked) { ui.fb = null; } render(); toast(ui.liked ? 'Thanks. More like this in your daily.' : 'Noted.'); return; }
    if (t.hasAttribute('data-urgent')) { ui.urgent = !ui.urgent; render(); toast(ui.urgent ? 'Urgent updates break through to today again.' : 'Urgent updates will wait for their rhythm. Windows can close.'); return; }
    if (t.hasAttribute('data-menu')) { var mi = +t.getAttribute('data-menu'); ui.menu = ui.menu === mi ? -1 : mi; render(); return; }
    if (t.hasAttribute('data-agent')) { var ai = +t.getAttribute('data-agent'); ui.agents[ai] = !ui.agents[ai]; ui.menu = -1; render(); toast(ui.agents[ai] ? AGENTS[ai].name + ' is back on.' : AGENTS[ai].name + ' paused. Nothing from it until you turn it on.'); return; }
    if (t.hasAttribute('data-preset')) { var pi = +t.getAttribute('data-preset'); ui.presets[pi] = !ui.presets[pi]; render(); toast(ui.presets[pi] ? PRESETS[pi][0] + ' is on, in your ' + PRESETS[pi][1] + '. First update ' + PRESETS[pi][2] + '.' : PRESETS[pi][0] + ' is off.'); return; }
    if (t.hasAttribute('data-phase')) {
      var np = +t.getAttribute('data-phase');
      if (np === 1) { var inp = stage.querySelector('#np'); if (inp) ui.prompt = inp.value.trim() || ui.prompt; ui.ed = fromPrompt(ui.prompt); }
      if (np === 2) { var ed = ui.ed; ui.created = true; ui.createdAgent = { name: ed.name, rh: ed.rh, slack: ed.slack, email: ed.email, watch: ed.chips.join('. ') + '.', last: '<b>' + firstUpdate() + '</b>', lastLabel: 'First update: ' }; }
      ui.phase = np; render(); return;
    }
    if (t.hasAttribute('data-fill')) { var inp2 = stage.querySelector('#np'); if (inp2) { inp2.value = t.getAttribute('data-fill'); ui.prompt = inp2.value; inp2.focus(); } return; }
    if (t.hasAttribute('data-rmchip')) { ui.ed.chips.splice(+t.getAttribute('data-rmchip'), 1); render(); return; }
    if (t.hasAttribute('data-seg')) { var p = t.getAttribute('data-seg').split('|'); ui[p[0]][p[1]] = p[2]; render(); return; }
    if (t.hasAttribute('data-where')) { var w = t.getAttribute('data-where'); ui.ed[w] = !ui.ed[w]; render(); return; }
    if (t.hasAttribute('data-copy')) {
      var src = stage.querySelector('#' + t.getAttribute('data-copy'));
      var text = src ? src.innerText : '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { toast('Copied.'); }, function () { toast('Select the text to copy it.'); });
      } else { toast('Select the text to copy it.'); }
      return;
    }
    if (t.hasAttribute('data-toast')) { if (menuWasOpen) { ui.menu = -1; render(); } toast(t.getAttribute('data-toast')); }
  });

  mount.querySelector('#p-notes').addEventListener('change', function (e) { ui.notes = e.target.checked; notesBox.hidden = !ui.notes; });
  mount.addEventListener('change', function (e) {
    if (!e.target) return;
    if (e.target.id === 'edq') { reread(); return; }
    var f = e.target.getAttribute && e.target.getAttribute('data-ed');
    if (f && ui.ed) { ui.ed[f] = e.target.value; render(); }
  });

  function reread() {
    var q = stage.querySelector('#edq');
    if (!q || !ui.ed) return;
    var text = q.value.trim();
    if (!text) return;
    var n = fromPrompt(text);
    ui.ed.ask = text; ui.ed.chips = n.chips;
    if (ui.ed.src === 'new') ui.ed.name = n.name;
    render();
    toast('Read it again. Check what changed.');
  }

  var keyTarget = FULL ? document : mount;
  keyTarget.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'edq') { reread(); e.preventDefault(); return; }
    if (e.key === 'Enter' && e.target.id === 'np') { ui.prompt = e.target.value.trim() || ui.prompt; ui.ed = fromPrompt(ui.prompt); ui.phase = 1; render(); e.preventDefault(); return; }
    if (e.key === 'Escape' && ui.menu !== -1) { ui.menu = -1; render(); return; }
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight') { go(ui.i === STATES.length - 1 ? ui.i : ui.i + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(ui.i - 1); e.preventDefault(); }
  });

  window.radarProto = { go: go, count: STATES.length };
  var hm = (location.hash || '').match(/step-(\d)/);
  if (hm && +hm[1] >= 1 && +hm[1] <= STATES.length) ui.i = +hm[1] - 1;
  if (ui.i === 4) ui.ed = fromAgent(0);
  render();
})();
