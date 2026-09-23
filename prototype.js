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
  var RH_LABEL = { daily: 'Daily', weekly: 'Weekly', periodic: 'Periodic' };

  function urgencyRow(text) {
    return '<div class="urg" role="status"><span class="urg-k">Window closing</span><span>' + text + '</span></div>';
  }
  function urgencyToggle(obj) {
    return '<div class="field"><span>Urgency</span><div class="urgrow"><button class="toggle" role="switch" aria-checked="' + ui.urgent + '" data-urgent aria-label="Break through when a window is closing"></button><span class="hint">Break through to today when a window is closing, whatever the rhythm.</span></div></div>';
  }

  function update(withButtons) {
    return '<div class="update">' +
      '<div class="agent">Competitor launches &middot; daily &middot; <span class="urg-tag">breaks through: window closing</span></div>' +
      '<h5>Bloomwell Magnesium Sleep Gummies is gaining fast at Target</h5>' +
      '<p class="why"><b>Why it matters to Kindroot:</b> it competes with your Magnesium Glycinate capsules on the same "sleep" claim and is winning on format. Your magnesium share at Target is down 1.4 pts in 8 weeks.</p>' +
      urgencyRow('Endcap requests for Target\'s Q4 reset close <b>Oct 1</b>, the day of your review. <b>9 days.</b>') +
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
      '<div class="foot-links"><a data-toast="You asked Competitor launches to watch magnesium at Target, in your daily. The window made it urgent.">Why you\'re seeing this</a><a data-go="4">Adjust this agent</a></div>' +
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
      '<div class="email-head"><div class="subj">Competitor launches: Bloomwell gummies gaining fast at Target. Window closes Oct 1.</div>' +
      '<div class="meta-row"><span><b>From</b> Radar</span><span><b>To</b> Maya</span><span>Tue 8:41</span></div></div>' +
      '<div class="email-body"><p class="pre">Why it matters for Kindroot, the window, and three moves.</p>' + update(false) + '</div></div>';
  }

  function winBar(crumb) {
    return '<div class="win-bar"><div class="dots"><i></i><i></i><i></i></div><span class="crumb">' + crumb + '</span></div>';
  }

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
    return '<div class="agent' + (on ? '' : ' off') + '"><div class="top"><span class="name">' + a.name + '</span>' + (extra || '') +
      (idx !== null ? '<button class="toggle" role="switch" aria-checked="' + on + '" data-agent="' + idx + '" aria-label="' + a.name + ' on or off"></button>' : '') + '</div>' +
      '<div class="watch">' + a.watch + '</div>' +
      '<div class="metar"><span>' + a.where + '</span><span>' + a.out + '</span></div>' +
      '<div class="last">' + (on ? (a.lastLabel || 'Last update: ') + a.last : 'Paused') + '</div></div>';
  }

  var STATES = [
    {
      title: 'Scene', cap: 'Tuesday, 8:40. Her week runs in three rhythms.',
      notes: ['Maya isn\'t in the product. The story starts in her day, not ours.', 'She works in three rhythms: daily, weekly, periodic. Radar reports in them, not on a schedule of its own (principle 3).'],
      render: function () {
        return '<div class="scene wide"><div class="kicker">Tuesday, September 22, 8:40</div>' +
          '<h4>Maya is between meetings.</h4>' +
          '<p>Brand Manager, Kindroot. Owns five SKUs, measured on sales and launches. She last opened the platform three weeks ago. Her work runs in three rhythms:</p>' +
          '<div class="rhythms">' +
          '<div class="rh"><div class="k">Daily</div><ul><li>9:00 Brand team sync</li><li>11:00 Agency review</li><li>14:00 1:1 with Dana</li><li>Approvals, emails, questions from the team</li></ul></div>' +
          '<div class="rh"><div class="k">Weekly</div><ul><li>Monday: performance and sales</li><li>Project status</li><li>Management update</li></ul></div>' +
          '<div class="rh"><div class="k">Periodic</div><ul><li class="hl">Target category review, Oct 1</li><li>Q4 plan</li><li>Innovation pipeline, launch brief</li></ul></div>' +
          '</div><button class="btn btn-primary" data-go="1">Start</button></div>';
      }
    },
    {
      title: 'The moment', cap: 'A daily update, made urgent by a closing window',
      notes: [
        'Every update opens with why it matters to her brand (principle 5).',
        'A closing window makes this urgent: it carries a date and it breaks through to today, whatever the rhythm (principle 4).',
        'Control lives in the message: Adjust, Not relevant (principle 6). Same structure in Slack and email (principle 9).'
      ],
      render: function () {
        return '<div class="moment">' +
          '<div class="phone"><div class="notch"></div><div class="clock">8:41</div><div class="date">Tuesday, September 22</div>' +
          '<div class="notif"><div class="app"><span>' + (ui.channel === 'slack' ? 'SLACK &middot; RADAR' : 'MAIL &middot; RADAR') + '</span><span>now</span></div>' +
          '<b>Competitor launches, window closes Oct 1</b>Bloomwell\'s Magnesium Sleep Gummies are gaining fast at Target. Here\'s why it matters for Kindroot.</div></div>' +
          '<div><div class="moment-top"><div class="channel-toggle" role="group" aria-label="View as">' +
          '<button data-channel="slack" aria-pressed="' + (ui.channel === 'slack') + '">Slack</button>' +
          '<button data-channel="email" aria-pressed="' + (ui.channel === 'email') + '">Email</button></div>' +
          '<span class="hint">Maya picked Slack for this agent. Same update either way.</span></div>' +
          (ui.channel === 'slack' ? slack() : email()) + '</div></div>';
      }
    },
    {
      title: 'The insight', cap: 'The window first. Then signal, why it matters, evidence, three moves.',
      notes: [
        'The window is the first thing on the page: what closes, when, and what it costs to miss it (principle 4).',
        'Every number carries a source and a timeframe. She can show this in a room (principle 8).',
        'The three moves map to Maya\'s three outcomes: the retailer meeting, the campaign, the next launch.'
      ],
      render: function () {
        return '<div class="win">' + winBar('<a data-go="5">Radar</a> &rsaquo; <a data-go="5">Competitor launches</a> &rsaquo; <b>September 22</b>') +
          '<div class="win-body">' +
          '<h4 class="ins-title">Bloomwell Magnesium Sleep Gummies is gaining fast at Target</h4>' +
          '<p class="ins-sub">Launched 6 weeks ago. Magnesium glycinate + L-theanine. Positioned "sleep + stress".</p>' +
          urgencyRow('Target locks Q4 planograms on <b>Oct 6</b>. Endcap requests close <b>Oct 1</b>, the day of your review. After that, the next shot at placement is January. <span class="src">Target vendor calendar, Q4</span>') +
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
          '<div class="move"><div class="k">1 &middot; For the Target review, in 9 days</div><p>The category is up 22% YoY and sleep is the driver. Kindroot is the #1-reviewed clean-label magnesium at Target. Ask for the sleep endcap before the Oct 1 window, not just shelf defense.</p><button class="btn btn-primary btn-sm" data-go="3" data-tab="slide">Create slide</button></div>' +
          '<div class="move"><div class="k">2 &middot; Campaign angle</div><p>Lead with "sleep" on the existing capsule. Your product page mentions sleep once. Bloomwell\'s says it nine times.</p><button class="btn btn-ghost btn-sm" data-go="3" data-tab="email">Draft email to the team</button></div>' +
          '<div class="move"><div class="k">3 &middot; Launch consideration</div><p>The format gap is real. A gummy or powder extension keeps the clean-label story. Worth a 30-minute innovation discussion.</p><button class="btn btn-ghost btn-sm" data-go="3" data-tab="meeting">Schedule meeting</button></div>' +
          '</div>' +
          '<div class="also"><h6 class="kicker" style="margin-bottom:4px">Also on your radar</h6>' +
          '<div class="row"><span class="ag">Consumer trends &middot; periodic</span><span>"GLP-1 companion" searches (fiber, electrolytes) +61% in 6 months. For the Q4 plan.</span><span class="when">no window</span></div>' +
          '<div class="row"><span class="ag">Claims and ingredients &middot; weekly</span><span>Ashwagandha conversation cooling, -12% in 90 days. Your Ashwagandha SKU.</span><span class="when">Monday</span></div></div>' +
          '<div class="ins-foot"><span>Why you\'re seeing this: you asked Competitor launches to watch magnesium at Target. The window made it urgent.</span><span class="grow"></span><a data-go="4">Adjust</a><a data-go="4">Not relevant</a><a data-go="4">More like this</a></div>' +
          '</div></div>';
      }
    },
    {
      title: 'Act', cap: 'Her artifacts, drafted. Nothing sent without her.',
      notes: ['Outputs are her artifacts: a slide, an email, a meeting. Editable, never auto-sent (principle 7).', 'The window travels with the output: the slide asks for a date, the invite lands before it.'],
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
            '<p class="ask">Proposal: place Kindroot Magnesium in the sleep endcap for Q4. Request by Oct 1, ahead of the Oct 6 reset.</p></div>' +
            '<div class="src">Retail sales data (Target, weeks 32-37), search data (US, Q3 vs Q2), review analysis (n=1,214), Target vendor calendar. Illustrative.</div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Added to Q4 Target review.pptx as slide 7.">Add to deck</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Saved to Downloads (prototype, no file behind this).">Download .pptx</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Opens the slide editor. Text and chart are editable.">Edit</button></div>';
        } else if (ui.tab === 'email') {
          body = '<div class="act-head"><h5>Email to the team, drafted</h5><span class="hint">Her voice, her call. Edit, then send.</span></div>' +
            '<div class="draft"><div class="f"><span>To</span><div>Dana, Omri</div></div>' +
            '<div class="f"><span>Subject</span><div>Magnesium at Target: what changed and what we do before Oct 1</div></div>' +
            '<div class="body" id="draft-body" contenteditable="' + ui.edit + '">Hi both,\n\nRadar flagged that Bloomwell\'s Magnesium Sleep Gummies are running at 2.1x category velocity at Target, and our magnesium share there is down 1.4 pts in 8 weeks. Sleep is driving the category (+38% searches) and our product page barely says the word. Endcap requests for the Q4 reset close Oct 1, so this week matters.\n\nTwo things: Dana, can you draft a "sleep" lead for the capsule page by Thursday? Omri, I\'m bringing the attached slide to the Target review, let\'s align on the endcap ask.\n\nFull insight: radar/competitor-launches/sep-22\n\nMaya</div>' +
            '<div class="att">Attached: Sleep-magnesium-Target.pptx (1 slide)</div></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Sent to Dana and Omri.">Send</button>' +
            '<button class="btn btn-ghost btn-sm" data-edit>' + (ui.edit ? 'Done editing' : 'Edit') + '</button>' +
            '<button class="btn btn-ghost btn-sm" data-copy="draft-body">Copy</button></div>';
        } else if (ui.tab === 'meeting') {
          body = '<div class="act-head"><h5>Meeting, ready to send</h5><span class="hint">Found a slot everyone has free, before the window. The brief travels with the invite.</span></div>' +
            '<div class="invite"><h5>Magnesium format response</h5>' +
            '<div class="row"><span>When</span><div>Thursday, 10:00-10:30 <span class="pill">everyone\'s free</span> <span class="pill warn">7 days before the window</span></div></div>' +
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
          body = '<div class="act-head"><h5>Share</h5><span class="hint">The team gets the same card, with the same sources and the same date.</span></div>' +
            '<div class="act-btns"><button class="btn btn-primary btn-sm" data-toast="Posted to #brand-kindroot.">Post to #brand-kindroot</button>' +
            '<button class="btn btn-ghost btn-sm" data-toast="Link copied.">Copy link</button></div>';
        }
        return '<div class="win">' + winBar('<a data-go="5">Radar</a> &rsaquo; <a data-go="2">Bloomwell gummies at Target</a> &rsaquo; <b>Act</b>') +
          '<div class="win-body">' + t + body + '</div></div>';
      }
    },
    {
      title: 'Tune', cap: 'One tap teaches the agent, and it says what changed',
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
        var fb = '<div class="fb"><h6>Was this worth your time?</h6><div class="btns">' +
          '<button class="btn btn-ghost btn-sm" data-fb="no" aria-pressed="' + (ui.fb === 'no') + '">Not relevant</button>' +
          '<button class="btn btn-ghost btn-sm" data-fb="more" aria-pressed="' + (ui.fb === 'more') + '">More like this</button></div>';
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
          '<div class="agent-card"><div class="top"><span class="name">Competitor launches</span>' + (learned ? '<span class="pill">Changed just now</span>' : '') + '<button class="toggle" role="switch" aria-checked="true" data-toast="Paused. Turn it back on any time from Radar home."></button></div>' +
          '<div class="field"><span>Watches</span><div class="tags"><span class="tag">Magnesium</span><span class="tag">Sleep claims</span><span class="tag">Target, CVS, Amazon</span><span class="tag">Bloomwell, Sunveil, Nature\'s Path</span>' + learned + '</div></div>' +
          '<div class="field"><span>Rhythm</span>' + seg('seg', 'rh', RHY) + '</div>' +
          urgencyToggle('seg') +
          '<div class="field"><span>Where</span>' + seg('seg', 'where', WHERE) + '</div>' +
          '<div class="field"><span>You get</span>' + seg('seg', 'out', OUT) + '</div>' +
          '<div class="btns"><button class="btn btn-primary btn-sm" data-toast="Saved. Applies from the next update.">Save</button><button class="btn btn-ghost btn-sm" data-go="5">See all agents</button></div></div>' :
          '<div class="agent-card"><div class="top"><span class="name">Competitor launches</span><span class="pill">On &middot; daily</span></div>' +
          '<p class="hint" style="margin:0">This update came from your Competitor launches agent, in your daily rhythm. The Oct 1 window is why it came with a date.</p>' +
          '<div class="btns"><button class="btn btn-ghost btn-sm" data-adjust>Adjust this agent</button><button class="btn btn-quiet btn-sm" data-go="5">See all agents</button></div></div>';

        return '<div class="win">' + winBar('<a data-go="5">Radar</a> &rsaquo; <a data-go="2">Bloomwell gummies at Target</a> &rsaquo; <b>Tune</b>') +
          '<div class="win-body"><div class="tune-head"><h4 class="ins-title" style="margin:0">Bloomwell Magnesium Sleep Gummies is gaining fast at Target</h4></div>' +
          '<div class="tune">' + fb + card + '</div></div></div>';
      }
    },
    {
      title: 'Radar home', cap: 'Five agents, in her three rhythms. She turns off, not on.',
      notes: ['She starts full, not empty. The presets come from her brand profile, named by the job (principle 1).', 'Agents live in her three rhythms, so she reads this the way she reads her week (principle 3).', 'One rule for urgency, at the top: a closing window breaks through to today (principle 4).', 'The library is one tap away, and creating by prompt is behind it (principle 2).'],
      render: function () {
        var count = ui.agents.filter(Boolean).length + (ui.created ? 1 : 0);
        var h = '<div class="win">' + winBar('<b>Radar</b> &rsaquo; Your radar') + '<div class="win-body">' +
          '<div class="home-head"><div><h4 class="ins-title" style="margin-bottom:2px">Your radar</h4><p class="ins-sub" style="margin:0">' + count + ' agents watching Kindroot, in your three rhythms. Set up from your brand profile. Turn off anything you don\'t need.</p></div><span class="grow"></span><button class="btn btn-primary btn-sm" data-go="6">New agent</button></div>' +
          '<div class="rule"><button class="toggle" role="switch" aria-checked="' + ui.urgent + '" data-urgent aria-label="Urgent updates break through"></button><span><b>Urgency breaks the rhythm.</b> When a window is closing, the update comes today, in Slack, with the date on it.' + (ui.urgent ? '' : ' <span class="pill warn">Off: windows wait for their rhythm</span>') + '</span></div>';
        for (var g = 0; g < RHYTHMS.length; g++) {
          var rh = RHYTHMS[g];
          h += '<div class="rgroup"><div class="rhead"><span class="k">' + rh[1] + '</span><span class="hint">' + rh[2] + '</span></div><div class="agents">';
          for (var i = 0; i < AGENTS.length; i++) if (AGENTS[i].rh === rh[0]) h += agentCard(AGENTS[i], ui.agents[i], i);
          if (ui.created && ui.nseg.rh === rh[0]) {
            h += agentCard({ name: 'Threats to magnesium at Target', watch: ui.chips.join('. ') + '.', where: ui.nseg.where === 'slack' ? 'Slack' : 'Email', out: 'Insight + talking points', last: '<b>' + firstUpdate() + '</b>', lastLabel: 'First update: ' }, true, null, '<span class="pill">New</span>');
          }
          h += '</div></div>';
        }
        h += '<div class="presets"><div class="kicker">More to switch on</div><div class="row">';
        for (var p = 0; p < PRESETS.length; p++) {
          h += '<span class="preset' + (ui.presets[p] ? ' on' : '') + '">' + PRESETS[p][0] + ' <span class="rhx">&middot; ' + PRESETS[p][1] + '</span><button data-preset="' + p + '">' + (ui.presets[p] ? 'On' : 'Turn on') + '</button></span>';
        }
        h += '</div></div></div></div>';
        return h;
      }
    },
    {
      title: 'New agent', cap: 'A prompt becomes a card, with a sample before it starts',
      notes: ['A prompt becomes a card she can edit: what, which rhythm, where, what she gets (principle 2).', 'Rhythm and urgency are choices on the card, in her words (principles 3 and 4).', 'A sample of the first update appears before she commits. No surprises, no noise (principle 2).'],
      render: function () {
        if (ui.phase === 2) {
          return '<div class="done"><div class="kicker">Running</div><h4>First update ' + firstUpdate() + '.</h4>' +
            '<p>That\'s the loop. Maya told Radar what matters, in her words and in her rhythm. From here on, it does the noticing, and she does the deciding.</p>' +
            '<div class="btns" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-go="5">See all agents</button><button class="btn btn-primary btn-sm" data-restart>Restart</button></div></div>';
        }
        var body;
        if (ui.phase === 0) {
          body = '<h4 class="ins-title">Tell Radar what to watch</h4>' +
            '<p class="ins-sub">In your words. Radar turns it into an agent you can edit, and shows you a sample before it starts.</p>' +
            '<div class="prompt"><div class="in"><input id="np" value="anything that could hurt my magnesium line at Target" aria-label="What should Radar watch?"><button class="btn btn-primary btn-sm" data-phase="1">Ask Radar</button></div>' +
            '<div class="chips"><span class="hint" style="align-self:center">Try:</span>' +
            '<button class="chip" data-fill="who\'s launching in gut health">Who\'s launching in gut health</button>' +
            '<button class="chip" data-fill="price moves on my SKUs at Amazon">Price moves on my SKUs at Amazon</button>' +
            '<button class="chip" data-fill="claims growing in women\'s health">Claims growing in women\'s health</button></div></div>';
        } else {
          var chips = '';
          for (var c = 0; c < ui.chips.length; c++) chips += '<span class="tag">' + ui.chips[c] + '<button data-rmchip="' + c + '" aria-label="Remove">&times;</button></span>';
          chips += '<span class="tag add" data-toast="Type another thing to watch. Radar adds it to the list.">+ add</span>';
          body = '<p class="ins-sub" style="margin-bottom:12px">Maya asked: <b>"anything that could hurt my magnesium line at Target"</b></p>' +
            '<div class="agent-card"><div class="top"><span class="name">Threats to magnesium at Target</span><span class="pill">Draft</span></div>' +
            '<div class="field"><span>I\'ll watch</span><div class="tags">' + chips + '</div></div>' +
            '<div class="field"><span>Rhythm</span>' + seg('nseg', 'rh', [['daily', 'Daily, 8:30'], ['weekly', 'Weekly, Monday'], ['periodic', 'Periodic, before the Target review']]) + '</div>' +
            urgencyToggle('nseg') +
            '<div class="field"><span>Where</span>' + seg('nseg', 'where', [['slack', 'Slack'], ['email', 'Email']]) + '</div>' +
            '<div class="field"><span>You get</span>' + seg('nseg', 'out', OUT) + '</div>' +
            '<div class="sample"><div class="k">Sample of your first update, from last week\'s data</div>Sunveil cut its magnesium price 15% at Target this week. The promo runs to Oct 5. Your price gap is now 22%. Suggested move: hold price, add a value pack before the promo ends. <span class="pill warn">Window: Oct 5</span><span class="src">Retail pricing data, Target, week 37. Illustrative.</span></div>' +
            '<div class="btns"><button class="btn btn-primary btn-sm" data-phase="2">Start watching</button><button class="btn btn-ghost btn-sm" data-phase="0">Edit the request</button></div></div>';
        }
        return '<div class="win">' + winBar('<a data-go="5">Radar</a> &rsaquo; <b>New agent</b>') + '<div class="win-body">' + body + '</div></div>';
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
      html += '<li><button data-go="' + i + '"' + (i === ui.i ? ' aria-current="step"' : '') + '><span class="k">' + (i + 1) + '</span>' + STATES[i].title + '</button></li>';
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
    ui.fb = null; ui.reason = null; ui.adjust = false; ui.phase = 0;
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
  render();
})();
