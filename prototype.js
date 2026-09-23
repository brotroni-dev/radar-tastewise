/* Radar prototype: a guided walkthrough in seven states.
   Nothing works behind the screen. Every button leads somewhere on purpose. */
(function () {
  var mount = document.getElementById('radar-proto');
  if (!mount) return;
  var FULL = mount.getAttribute('data-mode') === 'full';

  var ui = { i: 0, channel: 'slack', tab: 'slide', notes: true, edit: false, ask: -1, toastTimer: null };

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
      '<circle cx="540" cy="' + y(210) + '" r="3.5" class="l-bw" fill="currentColor" stroke="none" style="fill: var(--risk)"/>' +
      '<circle cx="540" cy="' + y(95) + '" r="3.5" style="fill: var(--accent)"/>' +
      '<text class="lab-bw" x="536" y="' + (+y(210) - 8) + '" text-anchor="end">Bloomwell gummies, 2.1x</text>' +
      '<text class="lab-kr" x="536" y="' + (+y(95) + 16) + '" text-anchor="end">Kindroot capsules</text>' +
      '<text x="52" y="' + (+y(100) + 14) + '">category average</text>' +
      '<text x="48" y="226">W28</text><text x="212" y="226" text-anchor="middle">W31</text>' +
      '<text x="376" y="226" text-anchor="middle">W34</text><text x="540" y="226" text-anchor="end">W37</text>' +
      '</svg>';
  }

  function update(withButtons) {
    return '<div class="update">' +
      '<div class="agent">Competitor launches &middot; daily digest &middot; 1 update today</div>' +
      '<h5>Bloomwell Magnesium Sleep Gummies is gaining fast at Target</h5>' +
      '<p class="why"><b>Why it matters to Kindroot:</b> it competes with your Magnesium Glycinate capsules on the same "sleep" claim and is winning on format. Your magnesium share at Target is down 1.4 pts in 8 weeks.</p>' +
      '<div class="stats">' +
      '<div class="stat"><div class="n">2.1x</div><div class="l">category velocity, Target, last 6 weeks</div></div>' +
      '<div class="stat"><div class="n">+38%</div><div class="l">"magnesium for sleep" searches, quarter over quarter</div></div>' +
      '<div class="stat risk"><div class="n">-1.4 pts</div><div class="l">your share of magnesium at Target, 8 weeks</div></div>' +
      '</div>' +
      (withButtons ?
        '<div class="btns"><button class="btn btn-primary btn-sm" data-go="2">Open insight</button>' +
        '<button class="btn btn-ghost btn-sm" data-go="3" data-tab="slide">Create slide</button>' +
        '<button class="btn btn-ghost btn-sm" data-go="4">Not relevant</button></div>' :
        '<div class="btns"><button class="btn btn-primary btn-sm" data-go="2">Open insight</button></div>') +
      '<div class="foot-links"><a data-toast="You asked Competitor launches to watch magnesium at Target. It reports daily at 8:30.">Why you\'re seeing this</a><a data-go="4">Adjust this agent</a></div>' +
      '</div>';
  }

  function slack() {
    return '<div class="slack">' +
      '<div class="slack-side"><div class="ws">Kindroot</div>' +
      '<div class="grp">Channels</div><div class="ch"># brand-kindroot</div><div class="ch"># retail-target</div><div class="ch"># launches</div>' +
      '<div class="grp">Apps</div><div class="ch on"><span class="dot"></span>Radar</div>' +
      '<div class="grp">Direct</div><div class="ch">Dana</div><div class="ch">Omri</div></div>' +
      '<div class="slack-main"><div class="chan">Radar</div>' +
      '<div class="msg"><div class="avatar">R</div><div><div class="who">Radar<span class="tag">APP</span><span class="ts">8:41</span></div>' +
      update(true) + '</div></div></div></div>';
  }

  function email() {
    return '<div class="email">' +
      '<div class="email-head"><div class="subj">Competitor launches: Bloomwell gummies gaining fast at Target</div>' +
      '<div class="meta-row"><span><b>From</b> Radar</span><span><b>To</b> Maya</span><span>Tue 8:41</span></div></div>' +
      '<div class="email-body"><p class="pre">Why it matters for Kindroot, and three moves.</p>' + update(false) + '</div></div>';
  }

  var STATES = [
    {
      title: 'Scene', cap: 'Tuesday, 8:40',
      notes: ['Maya isn\'t in the product. The story starts in her day, not ours.'],
      render: function () {
        return '<div class="scene"><div class="kicker">Tuesday, September 22, 8:40</div>' +
          '<h4>Maya is between meetings.</h4>' +
          '<p>Brand Manager, Kindroot. Owns five SKUs, measured on sales and launches. Target category review in 9 days. She last opened the platform three weeks ago.</p>' +
          '<ul class="agenda">' +
          '<li><span class="t">9:00</span><span>Brand team sync</span></li>' +
          '<li><span class="t">11:00</span><span>Agency review</span></li>' +
          '<li><span class="t">14:00</span><span>1:1 with Dana</span></li>' +
          '<li><span class="t">16:00</span><span>Q4 deck, draft</span></li>' +
          '<li><span class="t">Oct 1</span><span class="hl">Target category review</span></li>' +
          '</ul><button class="btn btn-primary" data-go="1">Start</button></div>';
      }
    },
    {
      title: 'The moment', cap: 'An update reaches Maya where she already is',
      notes: [
        'Every update opens with why it matters to her brand (principle 4).',
        'Control lives in the message: Adjust, Not relevant (principle 5).',
        'Same structure in Slack and email. Channel is a preference, not a product (principle 8).'
      ],
      render: function () {
        return '<div class="moment">' +
          '<div class="phone"><div class="notch"></div><div class="clock">8:41</div><div class="date">Tuesday, September 22</div>' +
          '<div class="notif"><div class="app"><span>' + (ui.channel === 'slack' ? 'SLACK &middot; RADAR' : 'MAIL &middot; RADAR') + '</span><span>now</span></div>' +
          '<b>Competitor launches</b>Bloomwell\'s Magnesium Sleep Gummies are gaining fast at Target. Here\'s why it matters for Kindroot.</div></div>' +
          '<div><div class="moment-top"><div class="channel-toggle" role="group" aria-label="View as">' +
          '<button data-channel="slack" aria-pressed="' + (ui.channel === 'slack') + '">Slack</button>' +
          '<button data-channel="email" aria-pressed="' + (ui.channel === 'email') + '">Email</button></div>' +
          '<span class="hint">Maya picked Slack for this agent. Same update either way.</span></div>' +
          (ui.channel === 'slack' ? slack() : email()) + '</div></div>';
      }
    },
    {
      title: 'The insight', cap: 'Signal, why it matters, evidence, three moves',
      notes: [
        'Every number carries a source and a timeframe. She can show this in a room (principle 7).',
        'The three moves map to Maya\'s three outcomes: the retailer meeting, the campaign, the next launch.'
      ],
      render: function () {
        return '<div class="win"><div class="win-bar"><div class="dots"><i></i><i></i><i></i></div>' +
          '<span class="crumb"><a data-go="5">Radar</a> &rsaquo; <a data-go="5">Competitor launches</a> &rsaquo; <b>September 22</b></span></div>' +
          '<div class="win-body">' +
          '<h4 class="ins-title">Bloomwell Magnesium Sleep Gummies is gaining fast at Target</h4>' +
          '<p class="ins-sub">Launched 6 weeks ago. Magnesium glycinate + L-theanine. Positioned "sleep + stress".</p>' +
          '<div class="cols"><div class="block"><h6>Signal: what changed</h6><ul class="ev">' +
          '<li>Velocity 2.1x the magnesium category average at Target over the last 6 weeks.<span class="src">Retail sales data, Target, weeks 32-37</span></li>' +
          '<li>"Magnesium for sleep" searches +38% quarter over quarter.<span class="src">Search data, US, Q3 vs Q2</span></li>' +
          '<li>"Gummy" appears in 54% more magnesium conversations than 90 days ago.<span class="src">Social listening, US, 90 days</span></li>' +
          '<li>Reviews praise taste and "no pill fatigue". 4.6 stars.<span class="src">Review analysis, n=1,214</span></li>' +
          '</ul><div class="chart">' + chart() + '<div class="cap">Weekly velocity index at Target, weeks 28-37. Index 100 = category average. Illustrative.</div></div></div>' +
          '<div class="block"><h6>Why it matters to Kindroot</h6><ul class="why-list">' +
          '<li>Your Magnesium Glycinate capsules are your <b>#2 SKU</b>, 31% of range revenue.</li>' +
          '<li>Your share of magnesium at Target is <b>down 1.4 pts in 8 weeks</b>. The drop starts the week Bloomwell landed on shelf.</li>' +
          '<li>You win on <b>"no fillers"</b>: the most cited theme in your reviews (27% of mentions). You lose on format: "capsule" is your top negative theme (11%).</li>' +
          '</ul><span class="pill">Confidence: high. Three independent sources agree.</span></div></div>' +
          '<div class="moves">' +
          '<div class="move"><div class="k">1 &middot; For the Target review, in 9 days</div><p>The category is up 22% YoY and sleep is the driver. Kindroot is the #1-reviewed clean-label magnesium at Target. Ask for the sleep endcap, not just shelf defense.</p><button class="btn btn-primary btn-sm" data-go="3" data-tab="slide">Create slide</button></div>' +
          '<div class="move"><div class="k">2 &middot; Campaign angle</div><p>Lead with "sleep" on the existing capsule. Your product page mentions sleep once. Bloomwell\'s says it nine times.</p><button class="btn btn-ghost btn-sm" data-go="3" data-tab="email">Draft email to the team</button></div>' +
          '<div class="move"><div class="k">3 &middot; Launch consideration</div><p>The format gap is real. A gummy or powder extension keeps the clean-label story. Worth a 30-minute innovation discussion.</p><button class="btn btn-ghost btn-sm" data-go="3" data-tab="meeting">Schedule meeting</button></div>' +
          '</div>' +
          '<div class="also"><h6 class="kicker" style="margin-bottom:4px">Also on your radar</h6>' +
          '<div class="row"><span class="ag">Consumer trends</span><span>"GLP-1 companion" searches (fiber, electrolytes) +61% in 6 months.</span><span class="when">Monday</span></div>' +
          '<div class="row"><span class="ag">Claims and ingredients</span><span>Ashwagandha conversation cooling, -12% in 90 days. Your Ashwagandha SKU.</span><span class="when">Monday</span></div></div>' +
          '<div class="ins-foot"><span>Why you\'re seeing this: you asked Competitor launches to watch magnesium at Target.</span><span class="grow"></span><a data-go="4">Adjust</a><a data-go="4">Not relevant</a><a data-go="4">More like this</a></div>' +
          '</div></div>';
      }
    },
    {
      title: 'Act', cap: 'Her artifacts, drafted. Nothing sent without her.',
      notes: ['Outputs are her artifacts: a slide, an email, a meeting. Editable, never auto-sent (principle 6).'],
      render: function () {
        var tabs = [['slide', 'Create slide'], ['email', 'Draft email'], ['meeting', 'Schedule meeting'], ['ask', 'Ask a follow-up'], ['share', 'Share']];
        var t = '<div class="tabs" role="tablist">';
        for (var i = 0; i < tabs.length; i++) t += '<button role="tab" data-tab="' + tabs[i][0] + '" aria-selected="' + (ui.tab === tabs[i][0]) + '">' + tabs[i][1] + '</button>';
        t += '</div>';
        var body = '';
        if (ui.tab === 'slide') {
          body = '<div class="act-head"><h5>Slide, ready for the Target deck</h5><span class="hint">Built from the insight. Edit anything before it goes in.</span></div>' +
            '<div class="slide"><h5>Sleep is reshaping magnesium at Target</h5><div class="chart">' + chart() + '</div>' +
            '<div><ul><li>Magnesium at Target is up 22% YoY. Sleep is the growth driver: +38% searches, quarter over quarter.</li>' +
            '<li>Bloomwell Sleep Gummies run at 2.1x category velocity since launch, winning on format.</li>' +
            '<li>Kindroot is the #1-reviewed clean-label magnesium at Target. 27% of reviews cite "no fillers".</li></ul>' +
            '<p class="ask">Proposal: place Kindroot Magnesium in the sleep endcap for Q4.</p></div>' +
            '<div class="src">Retail sales data (Target, weeks 32-37), search data (US, Q3 vs Q2), review analysis (n=1,214). Illustrative.</div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Added to Q4 Target review.pptx as slide 7.">Add to deck</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Saved to Downloads (prototype, no file behind this).">Download .pptx</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Opens the slide editor. Text and chart are editable.">Edit</button></div>';
        } else if (ui.tab === 'email') {
          body = '<div class="act-head"><h5>Email to the team, drafted</h5><span class="hint">Her voice, her call. Edit, then send.</span></div>' +
            '<div class="draft"><div class="f"><span>To</span><div>Dana, Omri</div></div>' +
            '<div class="f"><span>Subject</span><div>Magnesium at Target: what changed and what we do this week</div></div>' +
            '<div class="body" id="draft-body" contenteditable="' + ui.edit + '">Hi both,\n\nRadar flagged that Bloomwell\'s Magnesium Sleep Gummies are running at 2.1x category velocity at Target, and our magnesium share there is down 1.4 pts in 8 weeks. Sleep is driving the category (+38% searches) and our product page barely says the word.\n\nTwo things this week: Dana, can you draft a "sleep" lead for the capsule page by Thursday? Omri, I\'m bringing the attached slide to the Target review, let\'s align on the endcap ask.\n\nFull insight: radar/competitor-launches/sep-22\n\nMaya</div>' +
            '<div class="att">Attached: Sleep-magnesium-Target.pptx (1 slide)</div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Sent to Dana and Omri.">Send</button>' +
            '<button class="btn btn-ghost btn-sm" data-edit>' + (ui.edit ? 'Done editing' : 'Edit') + '</button>' +
            '<button class="btn btn-ghost btn-sm" data-copy="draft-body">Copy</button></div>';
        } else if (ui.tab === 'meeting') {
          body = '<div class="act-head"><h5>Meeting, ready to send</h5><span class="hint">Found a slot everyone has free. The brief travels with the invite.</span></div>' +
            '<div class="invite"><h5>Magnesium format response</h5>' +
            '<div class="row"><span>When</span><div>Thursday, 10:00-10:30 <span class="pill">everyone\'s free</span></div></div>' +
            '<div class="row"><span>Who</span><div class="people"><span class="person"><i>D</i>Dana</span><span class="person"><i>O</i>Omri</span><span class="person"><i>T</i>Tal, innovation</span></div></div>' +
            '<div class="row"><span>Agenda</span><ol><li>What Radar found (5 min)</li><li>Format options: gummy vs powder (15 min)</li><li>Decide: brief innovation, or wait (10 min)</li></ol></div>' +
            '<div class="row"><span>Attached</span><div>The insight and the slide</div></div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Invite sent. Thursday 10:00, 30 minutes.">Send invite</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Opens the invite in your calendar.">Edit</button></div>';
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
          body = '<div class="act-head"><h5>Share</h5><span class="hint">The team gets the same card, with the same sources.</span></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Posted to #brand-kindroot.">Post to #brand-kindroot</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Link copied.">Copy link</button></div>';
        }
        return '<div class="win"><div class="win-bar"><div class="dots"><i></i><i></i><i></i></div>' +
          '<span class="crumb"><a data-go="5">Radar</a> &rsaquo; <a data-go="2">Bloomwell gummies at Target</a> &rsaquo; <b>Act</b></span></div>' +
          '<div class="win-body">' + t + body + '</div></div>';
      }
    },
    {
      title: 'Tune', cap: 'One tap teaches the agent', soon: true,
      notes: ['Feedback changes the next update and says so (principle 9).'],
      render: function () { return soon('Tune', 'Not relevant and More like this, with the reason chips, the confirmation that shows what changed, and the agent card opening inline. Round 2.'); }
    },
    {
      title: 'Radar home', cap: 'Four agents, on by default', soon: true,
      notes: ['She starts full, not empty (principle 1).', 'Agents are named by the job, in her words (principle 10).'],
      render: function () { return soon('Radar home', 'The four preset agents watching Kindroot, each with what it watches, how often, where and what it produces. The preset library. New agent. Round 2.'); }
    },
    {
      title: 'New agent', cap: 'A prompt becomes a card, with a sample first', soon: true,
      notes: ['A prompt becomes a card she can edit, with a sample of the first update before she commits (principles 2 and 3).'],
      render: function () { return soon('New agent by prompt', 'Maya types what she wants watched. Radar answers with an editable card and a sample of the first update. Start watching closes the loop. Round 2.'); }
    }
  ];

  function soon(title, text) {
    return '<div class="soon"><div class="kicker">Round 2</div><h4>' + title + '</h4><p>' + text + '</p></div>';
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
    '<div class="proto-body"><div class="stage" id="p-stage"></div>' +
    '<aside class="rail"><ol class="steps" id="p-steps"></ol><div class="notes" id="p-notes-box"></div></aside></div>' +
    '<div class="proto-foot"><button class="btn btn-ghost btn-sm" data-prev>Back</button><span class="proto-cap" id="p-cap"></span><button class="btn btn-primary btn-sm" data-next>Next</button></div>';

  var stage = mount.querySelector('#p-stage');
  var stepsEl = mount.querySelector('#p-steps');
  var notesBox = mount.querySelector('#p-notes-box');

  function render() {
    var s = STATES[ui.i];
    stage.innerHTML = s.render();
    mount.querySelector('#p-step').textContent = 'Step ' + (ui.i + 1) + ' of ' + STATES.length + ' · ' + s.title;
    mount.querySelector('#p-cap').textContent = s.cap;
    var html = '';
    for (var i = 0; i < STATES.length; i++) {
      html += '<li><button data-go="' + i + '"' + (i === ui.i ? ' aria-current="step"' : '') + (STATES[i].soon ? ' class="soon"' : '') + '><span class="k">' + (i + 1) + '</span>' + STATES[i].title + '</button></li>';
    }
    stepsEl.innerHTML = html;
    var n = '<h4>Why it\'s built this way</h4>';
    for (var j = 0; j < s.notes.length; j++) n += '<p>' + s.notes[j] + '</p>';
    notesBox.innerHTML = n;
    notesBox.hidden = !ui.notes;
    mount.querySelector('[data-prev]').disabled = ui.i === 0;
    mount.querySelector('[data-next]').textContent = ui.i === STATES.length - 1 ? 'Restart' : 'Next';
    stage.scrollTop = 0;
  }

  function go(i) {
    if (i < 0 || i >= STATES.length) return;
    ui.i = i; ui.edit = false; ui.ask = -1;
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
    var t = e.target.closest('[data-go],[data-channel],[data-tab],[data-toast],[data-edit],[data-copy],[data-ask],[data-prev],[data-next],[data-restart]');
    if (!t || !mount.contains(t)) return;
    if (t.hasAttribute('data-tab')) ui.tab = t.getAttribute('data-tab');
    if (t.hasAttribute('data-go')) { go(+t.getAttribute('data-go')); return; }
    if (t.hasAttribute('data-prev')) { go(ui.i - 1); return; }
    if (t.hasAttribute('data-next')) { go(ui.i === STATES.length - 1 ? 0 : ui.i + 1); return; }
    if (t.hasAttribute('data-restart')) { ui.channel = 'slack'; ui.tab = 'slide'; go(0); return; }
    if (t.hasAttribute('data-channel')) { ui.channel = t.getAttribute('data-channel'); render(); return; }
    if (t.hasAttribute('data-tab')) { ui.edit = false; ui.ask = -1; render(); return; }
    if (t.hasAttribute('data-ask')) { ui.ask = +t.getAttribute('data-ask'); render(); return; }
    if (t.hasAttribute('data-edit')) { ui.edit = !ui.edit; render(); if (ui.edit) { var b = stage.querySelector('#draft-body'); if (b) b.focus(); } return; }
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
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    if (e.key === 'ArrowRight') { go(ui.i === STATES.length - 1 ? ui.i : ui.i + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(ui.i - 1); e.preventDefault(); }
  });

  window.radarProto = { go: go, count: STATES.length };
  render();
})();
