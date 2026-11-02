// Thank-you page: where the lead form lands after a successful send (the X pixel "lead" conversion page).
// The engine in site.js fills [data-lead-name], [data-lead-interest], [data-lead-preview] and awards the lead clearance.
// This page's script refines the wording, fills the intake slip and lights the "while you wait" doors.
import { BIZ, LEVELS, POLICY, XP } from '../data/business.mjs';

const css = `
/* ── Hero: file received ── */
.ty-hero{position:relative;overflow:hidden;isolation:isolate;border-bottom:1px solid var(--smoke);--x:30%;--y:40%}
.ty-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(clamp(240px,34vw,520px) circle at var(--x) var(--y),rgba(217,178,95,.17),rgba(217,178,95,.05) 45%,transparent 72%)}
.ty-hero::after{content:"";position:absolute;inset:auto 0 0;height:1px;background:linear-gradient(90deg,transparent,var(--brass),transparent);opacity:.6}
.ty-hero__in{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,370px);gap:clamp(32px,5vw,72px);align-items:center;padding-block:clamp(40px,6vw,88px) clamp(56px,7vw,104px)}
@media (max-width:900px){.ty-hero__in{grid-template-columns:1fr}}
.ty-hero__main{display:grid;gap:clamp(18px,2.4vw,26px);min-width:0;container-type:inline-size}
.ty-title{margin:0;font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(60px,11vw,160px);font-size:clamp(56px,26cqi,180px);line-height:.8;letter-spacing:-.01em}
.ty-stack{display:grid;--x:30%;--y:50%;filter:drop-shadow(0 0 26px rgba(243,212,138,.34))}
.ty-stack>span{grid-area:1/1}
.ty-dark{color:transparent;-webkit-text-stroke:2px rgba(242,234,216,.5)}
.ty-lit{color:var(--gold-hi);-webkit-mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%);mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%)}
.no-js .ty-lit{-webkit-mask-image:none;mask-image:none}
.ty-got{font-family:var(--f-serif);font-style:italic;font-weight:500;font-size:clamp(32px,4.4vw,58px);line-height:1.02;color:var(--gold);overflow-wrap:anywhere}
.ty-hero .lede{max-width:46ch}
.ty-preview{max-width:58ch}
.ty-preview[hidden]{display:none}
.ty-down .arw{rotate:90deg}

/* the intake slip */
.slip{position:relative;min-width:0;width:100%;max-width:370px;justify-self:end;padding-bottom:10px}
@media (max-width:900px){.slip{justify-self:start}}
.slip__sheet{position:relative;background:var(--paper);color:var(--ink);padding:24px 22px 26px;display:grid;gap:12px;transform:rotate(1.6deg);box-shadow:0 40px 70px -30px rgba(0,0,0,.95);background-image:repeating-linear-gradient(transparent 0 31px,rgba(23,20,15,.05) 31px 32px);animation:tyThud .5s var(--ease) 1.05s both}
.slip__sheet::before{content:"";position:absolute;top:0;right:0;width:40px;height:40px;background:linear-gradient(225deg,var(--void) 50%,var(--paper-2) 50%)}
.slip__head{display:grid;gap:6px;padding-right:34px}
.slip .label{color:var(--ink-mute)}
.slip__title{font-family:var(--f-display);font-weight:900;font-size:32px;line-height:.9;text-transform:uppercase}
.slip .ledger{font-size:14.5px}
.slip .ledger > div{border-color:rgba(23,20,15,.16)}
.slip .ledger dt{color:var(--ink-mute)}
.slip .ledger dd{color:var(--ink);overflow-wrap:anywhere}
.slip__stampzone{position:relative;height:118px;border-bottom:1px dashed rgba(23,20,15,.3)}
.slip__stampzone > span{position:absolute;left:0;bottom:6px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute)}
.ty-stamp.stamp{position:absolute;right:4px;top:-4px;width:132px;font-size:22px;padding:12px;box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--signal);animation:tySlam .6s cubic-bezier(.2,1.5,.4,1) .75s both}
.ty-stamp small{font-size:9.5px}
@keyframes tySlam{0%{opacity:0;transform:rotate(-13deg) scale(2.4)}60%{opacity:1;transform:rotate(-13deg) scale(.94)}100%{opacity:1;transform:rotate(-13deg) scale(1)}}
@media (prefers-reduced-motion:reduce){.slip__sheet,.ty-stamp.stamp{animation:none}}
@keyframes tyThud{0%{transform:rotate(1.6deg)}35%{transform:rotate(1.6deg) translateY(4px) scale(.99)}100%{transform:rotate(1.6deg)}}

/* ── Next steps, the direct line ── */
.ty-h{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,4.6vw,64px);line-height:.9;text-transform:uppercase}
.ty-h .whisper{font-size:.66em}
.ty-urgent{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(24px,4vw,64px);align-items:center;padding:clamp(26px,4vw,48px);border:1px solid var(--gold);background:linear-gradient(160deg,#211a0d,var(--coal) 62%)}
@media (max-width:860px){.ty-urgent{grid-template-columns:1fr}}
.ty-urgent__text{display:grid;gap:16px;min-width:0}
.ty-urgent__text p:not(.label){color:var(--ash);max-width:46ch}

/* ── While you wait ── */
.ty-wait{padding-top:clamp(28px,3.5vw,48px)}
.ty-wait__head{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,360px);gap:clamp(28px,5vw,72px);align-items:end;margin-bottom:clamp(40px,5vw,60px)}
@media (max-width:900px){.ty-wait__head{grid-template-columns:1fr;align-items:start}}
.ty-wait__head .band__head{margin-bottom:0}
.ty-wait__head .band__head p[data-xp-line]{color:var(--paper)}
.ty-wait__head .band__head p[data-xp-line] b{color:var(--gold-hi);font-weight:600}
.ty-clear{background:var(--coal);border:1px solid var(--smoke);padding:20px 20px 18px;display:grid;gap:12px;position:relative;min-width:0}
.ty-clear::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.ty-clear__head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.ty-clear__lv{display:flex;align-items:baseline;gap:14px}
.ty-clear__lv b{font-family:var(--f-display);font-weight:900;font-size:64px;line-height:.8;color:var(--gold)}
.ty-clear__lv span{font-family:var(--f-display);font-weight:800;font-size:28px;line-height:1;text-transform:uppercase}
.ty-clear__next{display:grid;gap:4px;font-size:14.5px}
.no-js .ty-clear{display:none}
.ty-doors .file__name{font-size:clamp(40px,3.6vw,52px)}
.ty-doors{row-gap:36px}
.ty-doors .file__foot{flex-direction:column;align-items:flex-start;gap:12px}
.ty-doors .file--flag::after{content:"Inner Circle"}
.ty-door__state{font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash)}
.ty-door__state.is-open{color:var(--gold)}
.ty-psst{margin-top:clamp(36px,5vw,56px);font-family:var(--f-serif);font-style:italic;font-size:clamp(20px,2vw,24px);color:var(--ash);display:none}
.ty-psst b{color:var(--gold);font-weight:500}
@media (hover:hover) and (pointer:fine){.js .ty-psst{display:block}}
`;

const js = `
(() => {
  const read = (k) => { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } };
  const set = (s, v) => document.querySelectorAll(s).forEach((e) => (e.textContent = v));
  const LEAD_XP = ${XP.lead};
  function doors() {
    if (!window.BS) return;
    const lv = window.BS.level().lv, st = window.BS.state();
    document.querySelectorAll('[data-door]').forEach((d) => {
      const out = d.querySelector('[data-door-state]'); if (!out) return;
      const need = d.dataset.door;
      let txt = '', open = false;
      if (need === 'quiz') { open = !!st.quiz; txt = open ? 'Match found' : '+${XP.quiz} clearance'; }
      else if (need === 'file') { open = !!(st.seen && st.seen[d.dataset.path]); txt = open ? 'Opened' : '+${XP.visit + XP.read} to open and read'; }
      else { open = lv >= +need; txt = open ? 'Open to you' : 'Level ' + need + ' · you’re Level ' + lv; }
      out.textContent = txt; out.classList.toggle('is-open', open);
    });
  }
  const go = () => {
    set('[data-slip-date]', new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    const lead = read('bs2.lead');
    if (lead) {
      const label = lead.interest || '';
      const unsure = !lead.slug || lead.slug === 'unsure';
      set('[data-lead-interest]', unsure ? 'file' : label.split(' · ')[0] + ' file');
      set('[data-slip-from]', lead.name || 'You');
      set('[data-slip-re]', unsure ? 'Help me pick' : label.split(' · ')[0]);
      const how = { Call: 'with a call', Text: 'by text', Email: 'by email' }[read('bs2.reach')];
      if (how) {
        set('[data-lead-reach]', how);
        set('[data-reach-line]', 'You asked us to reach you ' + how + ', so that’s how we’ll get back to you.');
      }
      const xp = document.querySelector('[data-xp-line]');
      if (xp) xp.innerHTML = 'You just earned <b>+' + LEAD_XP + ' clearance</b> for making contact. Spend it on the files below.';
    }
    doors();
    setTimeout(doors, 1700); // the lead award lands about a second after load
  };
  if (window.BS) go(); else document.addEventListener('bs:ready', go);
})();
`;

export default {
  path: 'thank-you.html',
  section: 'contact',
  title: 'File received',
  description: 'Your message reached Blackout Syndicate. See what happens next, the direct line if it can’t wait, and where to go deeper on the site while you wait.',
  noindex: true,
  css, js,
  body: (c) => {
    const fileOf = (p) => (c.all.find((x) => x.path === p) || {}).file || '';
    const reelFile = fileOf('work.html');
    return `
<header class="ty-hero" data-spot data-spot-idle>
  <div class="wrap ty-hero__in">
    <div class="ty-hero__main">
      <p class="label">Intake · Message received</p>
      <h1 class="ty-title"><span class="sr">File received.</span><span class="ty-stack" data-spot-layer aria-hidden="true"><span class="ty-dark">File<br>received.</span><span class="ty-lit">File<br>received.</span></span></h1>
      <p class="ty-got">Got it, <span data-lead-name>friend</span>.</p>
      <p class="lede">Your <span data-lead-interest>file</span> is on the desk. A person reads it, then we reach out <span data-lead-reach>the way you asked</span>.</p>
      <p class="note ty-preview" data-lead-preview hidden><span><strong>This was a preview.</strong> Nothing was actually sent. On the live site this form goes straight to ${BIZ.email}.</span></p>
      <div class="ctas">
        <a class="btn btn--lg ty-down" href="#wait">While you wait ${c.arrow}</a>
        ${c.btn('Call ' + BIZ.phone, BIZ.phoneHref, 'ghost lg')}
      </div>
    </div>
    <aside class="slip" aria-label="Your intake slip">
      <div class="slip__sheet">
        <div class="slip__head"><span class="label">${BIZ.name}</span><span class="slip__title">Intake slip</span></div>
        <dl class="ledger">
          <div><dt>From</dt><dd data-slip-from>You</dd></div>
          <div><dt>Re</dt><dd data-slip-re>Your message</dd></div>
          <div><dt>Filed</dt><dd data-slip-date>Today</dd></div>
          <div><dt>Status</dt><dd>On the desk</dd></div>
        </dl>
        <div class="slip__stampzone">
          <span>${BIZ.city} desk</span>
          <div class="stamp ty-stamp" aria-hidden="true">Received<small>On the desk</small></div>
        </div>
      </div>
    </aside>
  </div>
</header>

<section class="band band--coal" aria-labelledby="next-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">From here</p><h2 class="h2" id="next-h">What happens next.</h2></div>
      <p class="muted" style="max-width:42ch">Nothing is booked and nothing is charged yet.</p>
    </div>
    <ol class="steps rv" style="--n:3">
      <li><h3>We read it</h3><p>Your message comes straight to us and a person reads it. No bots on this end either.</p></li>
      <li><h3>We reach out the way you asked</h3><p data-reach-line>Call, text or email. Whichever you picked on the form is how we get back to you.</p></li>
      <li><h3>We confirm before anything starts</h3><p>${POLICY.payment} Nothing runs without your OK.</p></li>
    </ol>
  </div>
</section>

<section class="band band--tight" aria-labelledby="urgent-h">
  <div class="wrap">
    <div class="ty-urgent rv">
      <div class="ty-urgent__text">
        <p class="label">Can’t wait?</p>
        <h2 class="ty-h" id="urgent-h">Call or text <span class="whisper">the direct line.</span></h2>
        <p>If it can’t sit in the inbox, use the phone. Same people on the other end.</p>
      </div>
      ${c.contactLines()}
    </div>
  </div>
</section>

<section class="band ty-wait" id="wait" aria-labelledby="wait-h">
  <div class="wrap">
    <div class="ty-wait__head rv">
      <div class="band__head">
        <p class="label">While you wait</p>
        <h2 class="h2" id="wait-h">Go deeper.</h2>
        <p data-xp-line>Sending the form is worth <b>+${XP.lead} clearance</b>. Spend it on the files below.</p>
      </div>
      <section class="ty-clear" data-visitor aria-label="Your clearance">
        <div class="ty-clear__head"><span class="label">Your clearance</span><span class="badge badge--gold" data-v="status">Uncleared</span></div>
        <div class="ty-clear__lv"><b data-v="lv">0</b><span data-v="name">${LEVELS[0].name}</span></div>
        <div class="meter" aria-hidden="true"><i data-v="bar"></i></div>
        <p class="ty-clear__next"><span class="label label--dim">Next unlock</span><span data-v="next">${LEVELS[1].unlock} (Level 1)</span></p>
        <button class="textlink" type="button" data-hud-open>See every file ${c.arrow}</button>
      </section>
    </div>
    <div class="grid grid--4 ty-doors rv">
      <a class="file" href="${c.link('index.html#cl-rule-01')}" data-spot data-door="1">
        <span class="file__tab">Home · Level 1</span>
        <span class="file__top"><span class="label">Playbook</span></span>
        <span class="file__name">Rule 01</span>
        <span class="file__tag">Fix the landing before you buy the traffic. The first classified file in the Archive.</span>
        <span class="file__foot"><span class="ty-door__state" data-door-state>Opens at Level 1</span><span class="file__open">Read it ${c.arrow}</span></span>
      </a>
      <a class="file" href="${c.link('packages.html#match')}" data-spot data-door="quiz">
        <span class="file__tab">Packages</span>
        <span class="file__top"><span class="label">Three questions</span></span>
        <span class="file__name">The match</span>
        <span class="file__tag">Answer three questions and we point you at the file that fits.</span>
        <span class="file__foot"><span class="ty-door__state" data-door-state>+${XP.quiz} clearance</span><span class="file__open">Take it ${c.arrow}</span></span>
      </a>
      <a class="file" href="${c.link('work.html')}" data-spot data-door="file" data-path="work.html">
        <span class="file__tab">${reelFile ? reelFile + ' · ' : ''}Watch</span>
        <span class="file__top"><span class="label">The work</span></span>
        <span class="file__name">The Reel</span>
        <span class="file__tag">Spots cut for Blackout Syndicate and the Graveshift Gaming crew.</span>
        <span class="file__foot"><span class="ty-door__state" data-door-state>Open the file</span><span class="file__open">Watch ${c.arrow}</span></span>
      </a>
      <a class="file file--flag" href="${c.link('vault.html')}" data-spot data-door="5">
        <span class="file__tab">Level 5</span>
        <span class="file__top"><span class="label">The full Playbook</span></span>
        <span class="file__name">The Vault</span>
        <span class="file__tag">The full Syndicate Playbook and your Syndicate ID. Level 5 opens the door.</span>
        <span class="file__foot"><span class="ty-door__state" data-door-state>Opens at Level 5</span><span class="file__open">See the door ${c.arrow}</span></span>
      </a>
    </div>
    <p class="ty-psst">Psst. One word turns the lights out on this whole site. It’s the name on the door. <b>Just type it.</b></p>
  </div>
</section>`;
  },
};
