// The Vault: the Level 5 payoff. A vault door that opens on clearance, the full Syndicate Playbook
// (ten classified rules), and a Syndicate ID card drawn on a canvas with the visitor's name on it.
// No `file` property: visiting the Vault gives no clearance. Contact's "Next file" card points here.
import { BIZ, LEVELS, XP, SOCIALS } from '../data/business.mjs';
import { bySlug } from '../data/offers.mjs';
import { arrow } from '../layout.mjs';
import config from '../config.mjs';

const TOP = LEVELS[LEVELS.length - 1];
const X_HANDLE = (SOCIALS.find((s) => s.key === 'x') || {}).handle || '';

// ── The door (two stacked SVGs: the frame stays, the door swings) ───────────
const R2 = (n) => Math.round(n * 100) / 100;
const pol = (r, deg) => { const a = (deg * Math.PI) / 180; return [R2(220 + r * Math.sin(a)), R2(220 - r * Math.cos(a))]; };
const BOLTS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 300, 330]; // 270 is the hinge side
const HAT = (cls, tf) => `<g class="${cls}" transform="${tf}"><ellipse cx="20" cy="27" rx="18" ry="4.5"/><path d="M9 26C9 14 12 9 20 9s11 5 11 17Z"/></g>`;
const ring = (n, r, fn) => Array.from({ length: n }, (_, i) => fn(pol(r, (360 / n) * i), i)).join('');

const FRAME = `
<svg class="vd__frame" viewBox="0 0 440 440" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="vd-glow" cx="50%" cy="50%" r="50%"><stop offset="0" style="stop-color:var(--paper)"/><stop offset=".26" style="stop-color:var(--gold-hi)"/><stop offset=".62" style="stop-color:var(--brass)"/><stop offset="1" style="stop-color:var(--void)"/></radialGradient>
    <linearGradient id="vd-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--vault)"/><stop offset="1" style="stop-color:var(--void)"/></linearGradient>
  </defs>
  <circle class="vd__wall" cx="220" cy="220" r="218"/>
  <circle class="vd__lip" cx="220" cy="220" r="203"/>
  ${ring(32, 211, ([x, y]) => `<circle class="vd__rivet" cx="${x}" cy="${y}" r="2.1"/>`)}
  <circle cx="220" cy="220" r="190" fill="url(#vd-glow)"/>
  <g class="vd__tunnel"><circle cx="220" cy="220" r="152"/><circle cx="220" cy="220" r="114"/><circle cx="220" cy="220" r="78"/></g>
  ${HAT('vd__sil', 'translate(160 152) scale(3)')}
  ${BOLTS.map((a) => `<rect class="vd__recv" x="209" y="14" width="22" height="20" transform="rotate(${a} 220 220)"/>`).join('')}
  <rect class="vd__hinge" x="2" y="126" width="34" height="46" rx="4"/>
  <rect class="vd__hinge" x="2" y="268" width="34" height="46" rx="4"/>
  <circle class="vd__lamp" cx="220" cy="9.5" r="4.2"/>
</svg>`;

const DOOR = `
<svg class="vd__door" viewBox="0 0 440 440" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="vd-face" cx="38%" cy="32%" r="78%"><stop offset="0" style="stop-color:var(--vault)"/><stop offset="1" style="stop-color:var(--void)"/></radialGradient>
    <linearGradient id="vd-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--gold-hi)"/><stop offset=".5" style="stop-color:var(--gold)"/><stop offset="1" style="stop-color:var(--brass)"/></linearGradient>
    <path id="vd-ring" d="M220,75 a145,145 0 1,1 -0.01,0"/>
  </defs>
  <g>${BOLTS.map((a, i) => `<g transform="rotate(${a} 220 220)"><rect class="vd__bolt" style="--i:${i}" x="211" y="24" width="18" height="40" rx="2"/></g>`).join('')}</g>
  <rect class="vd__knuckle" x="30" y="134" width="24" height="30" rx="3"/>
  <rect class="vd__knuckle" x="30" y="276" width="24" height="30" rx="3"/>
  <circle class="vd__face" cx="220" cy="220" r="178"/>
  <circle class="vd__line" cx="220" cy="220" r="170"/>
  ${ring(28, 163, ([x, y]) => `<circle class="vd__stud" cx="${x}" cy="${y}" r="2.4"/>`)}
  <circle class="vd__line vd__line--dim" cx="220" cy="220" r="156"/>
  <text class="vd__engrave"><textPath href="#vd-ring" textLength="896" lengthAdjust="spacing"><tspan class="vd__name">BLACKOUT</tspan> SYNDICATE · CLEARANCE 5 · INNER CIRCLE ONLY · SOUTH BEND, INDIANA ·</textPath></text>
  <circle class="vd__line vd__line--dim" cx="220" cy="220" r="132"/>
  <circle class="vd__plate" cx="220" cy="220" r="122"/>
  <g class="vd__wheel">
    ${[0, 60, 120].map((a) => `<rect class="vd__spoke" x="214" y="114" width="12" height="212" rx="4" transform="rotate(${a} 220 220)"/>`).join('')}
    ${ring(6, 106, ([x, y]) => `<circle class="vd__knob" cx="${x}" cy="${y}" r="10"/>`)}
  </g>
  <circle class="vd__shadow" cx="220" cy="222" r="64"/>
  <g class="vd__dial">
    <circle class="vd__dialface" cx="220" cy="220" r="58"/>
    ${Array.from({ length: 50 }, (_, i) => { const [x1, y1] = pol(i % 10 === 0 ? 44 : i % 5 === 0 ? 48 : 51, i * 7.2); const [x2, y2] = pol(56, i * 7.2); return `<line class="vd__tick${i % 5 === 0 ? ' vd__tick--big' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }).join('')}
    ${[0, 10, 20, 30, 40].map((n, i) => { const [x, y] = pol(36, i * 72); return `<text class="vd__num" x="${x}" y="${y}">${n}</text>`; }).join('')}
    <circle class="vd__hub" cx="220" cy="220" r="21"/>
    ${HAT('vd__hubhat', 'translate(204 202) scale(.8)')}
  </g>
  <path class="vd__index" d="M213.5,150 L226.5,150 L220,160.5 Z"/>
</svg>`;

// ── The Syndicate Playbook ─────────────────────────────────────────────────
// Ten rules that add to the earlier rewards instead of repeating them: Rule 01 is only a callback to the
// Level 1 file on the home page, and none of these restate the Level 3 aim file on How it works.
// Advice only. No results are promised, and every fact (run lengths, what a package does) comes from offers.mjs.
const BOOST_DAYS = (bySlug.boost.run.match(/\d+/) || [''])[0];
const RULES = (c) => {
  const to = (slug) => c.link(c.offerPath(bySlug[slug]));
  const a = (slug, t) => `<a href="${to(slug)}">${t}</a>`;
  return [
    { t: 'Fix the landing first', s: 'Fix the landing first', body: `
      <p>You already have this one. It was your Level 1 file: <a href="${c.link('index.html#cl-rule-01')}">fix the landing before you buy the traffic</a>. Every rule below assumes your page passes the three-second test.</p>` },
    { t: 'Go where your people already scroll', s: 'Go where your people scroll', body: `
      <p>You don’t need every platform. You need the one or two your people open without thinking about it.</p>
      <p>A barbershop, a food truck and a streamer don’t need the same feed. Get good in one place before you spread yourself thin across five.</p>
      <p><strong>Do it today:</strong> ask your next ten customers which app they open first. Streaming? Ask chat which app they found you on. Put your effort there.</p>` },
    { t: 'Put money behind what already works', s: 'Back what already works', body: `
      <p>A paid push puts a post in front of more people. It does the most for a post that already gave people a reason to stop: the clip that got shared, the post that brought messages, the moment chat lost it.</p>
      <p>Look at what pulled on its own before you pay to push anything. If two posts are close, test both small and let the cheap test pick. That is the job of ${a('spark', 'Spark')}: a small, real push that tells you whether a bigger one makes sense.</p>
      <p><strong>Do it today:</strong> scroll back through your last month of posts and clips. Find the one that did best with no money behind it. That is your first push.</p>` },
    { t: 'Start the push before stream night', s: 'Start before stream night', body: `
      <p>An ad for a stream night has to land before you go live. People need to see it, remember it and come back at the time you said.</p>
      <p>Time the run so it ends on the night. ${a('boost', 'Boost')} is a ${BOOST_DAYS}-day run, so start it about ${BOOST_DAYS} days out. On TikTok it runs as a one-day burst, so run that the day before. Put the day, the time and your time zone in the ad, and point it at your channel, where the follow button is.</p>
      <p><strong>Do it today:</strong> pick your next big stream night, count back ${BOOST_DAYS} days, and put “start the push” on that day.</p>` },
    { t: 'Turn one stream into a week of clips', s: 'One stream, a week of clips', body: `
      <p>One stream holds a week of posts. The clutch play, the funny fail, the moment chat lost it. Each one is a clip that can bring someone to the next stream.</p>
      <p>Mark the moments while you play, or right after. Cut each one down to the part worth watching, then post one a day until you go live again. A shop can do the same with one busy day filmed in short bits.</p>
      <p><strong>Do it today:</strong> after your next stream, write down five timestamps worth a clip. That is five days of posts. ${a('creator-systems', 'Creator Content Systems')} sets up the whole workflow if you’d rather not do it by hand.</p>` },
    { t: 'Show up where your town shows up', s: 'Show up where your town does', body: `
      <p>Markets, game days, festivals, fundraisers, open mics, tournaments. When the town gathers, people are already in the mood to find something new.</p>
      <p>Post before so people come, during so the people who missed it feel it, and after to thank everyone who showed up. If you’re putting money behind a date, start the push at least a week out so it lands while people are still making plans. ${a('blitz', 'Blitz')} is built for exactly that.</p>
      <p><strong>Do it today:</strong> put the next three local events you could show up at on your calendar, with one post planned for each.</p>` },
    { t: 'Let happy customers do the talking', s: 'Let customers talk', body: `
      <p>A post from a happy customer reaches the people who already trust that customer. That kind of word of mouth is easy to ask for and hard to fake.</p>
      <p>Ask while they’re smiling: right after the haircut, the meal, the stream, the finished job. Make it easy with your handle on the counter, a QR code to your review page, and a repost every time someone tags you.</p>
      <p>Never buy reviews and never write fake ones. It breaks the platforms’ rules, and people can tell.</p>
      <p><strong>Do it today:</strong> put your handle and one line, “Tag us and we’ll repost you,” where customers pay or wait.</p>` },
    { t: 'Steady beats loud', s: 'Steady beats loud', body: `
      <p>Twenty posts in one week and then a month of silence looks like a business that closed. Three good posts a week, every week, looks like a business that’s open.</p>
      <p>Pick a pace you can hold on your busiest, worst week. Film in batches on one day, then post through the rest of the week.</p>
      <p><strong>Do it today:</strong> choose your posting days and put them on the calendar for the next four weeks. The ${a('post-kit', '30-Day Post Kit')} does the planning for you.</p>` },
    { t: 'Answer while they’re still looking', s: 'Answer while they’re looking', body: `
      <p>A push brings messages, comments and questions. The person asking “are you open Sunday?” is ready right now. By tomorrow they may have moved on.</p>
      <p>Answer the same day, in plain words, and put the next step in the reply: the booking link, the address, the stream time.</p>
      <p><strong>Do it today:</strong> write answers to the five questions you get most and keep them in your phone’s notes, ready to paste. ${a('ai-automation', 'AI Automation')} can send those answers for you.</p>` },
    { t: 'Own a list the app can’t take', s: 'Own your list', body: `
      <p>Followers live on someone else’s app. If the app changes its rules or your account gets locked, the way you reach them goes too.</p>
      <p>Give people one way to stay in touch that belongs to you: an email list, a text list, or a Discord for your community. Ask where they already trust you: at the counter, at the end of a stream, in the follow-up after a sale.</p>
      <p><strong>Do it today:</strong> pick one list and make signing up a single tap. Mention it once at the counter, or once a stream.</p>` },
  ];
};

const css = `
/* ── The door ── */
.vt-hero{position:relative;overflow:hidden;isolation:isolate;border-bottom:1px solid var(--smoke);--x:30%;--y:40%}
.vt-hero::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(clamp(240px,34vw,520px) circle at var(--x) var(--y),rgba(217,178,95,.16),rgba(217,178,95,.04) 45%,transparent 72%)}
.vt-hero__in{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,500px);grid-template-areas:"head door" "body door";column-gap:clamp(32px,5vw,80px);row-gap:clamp(20px,2.4vw,28px);align-items:center;padding-block:clamp(36px,5vw,72px) clamp(56px,7vw,96px)}
.vt-hero__head{grid-area:head;display:grid;gap:18px;min-width:0;align-self:end;container-type:inline-size}
.vt-hero__body{grid-area:body;display:grid;gap:20px;min-width:0;align-self:start}
.vt-hero__door{grid-area:door;min-width:0;width:100%;display:grid;gap:16px;justify-items:center;position:relative}
.vt-hero__door::before{content:"";position:absolute;inset:-18% -18% -8%;z-index:-1;background:radial-gradient(closest-side,rgba(243,212,138,.34),rgba(217,178,95,.1) 55%,transparent);opacity:0;transition:opacity 1s var(--ease)}
.vt-hero.is-open .vt-hero__door::before{opacity:1;transition:opacity 2.2s var(--ease) 2.9s}
@media (max-width:900px){.vt-hero__in{grid-template-columns:minmax(0,1fr);grid-template-areas:"head" "door" "body"}.vt-hero__door{max-width:440px;justify-self:center}}
.vt-title{margin:0;font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(76px,31cqi,200px);line-height:.8;letter-spacing:-.012em}
.vt-stack{display:grid;--x:30%;--y:50%;filter:drop-shadow(0 0 26px rgba(243,212,138,.34))}
.vt-stack>span{grid-area:1/1}
.vt-dark{color:transparent;-webkit-text-stroke:2px rgba(242,234,216,.5)}
.vt-lit{color:var(--gold-hi);-webkit-mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%);mask-image:radial-gradient(clamp(150px,22vw,330px) circle at var(--x) var(--y),#000 0 34%,transparent 74%)}
.no-js .vt-lit{-webkit-mask-image:none;mask-image:none}
.vt-whisper{display:block;font-family:var(--f-serif);font-style:italic;font-weight:500;text-transform:none;font-size:clamp(28px,3.4vw,46px);letter-spacing:0;color:var(--gold);line-height:1;margin-top:.32em}
.vt-hero .lede{max-width:50ch}
.vt-state{display:flex;gap:12px;align-items:baseline;font-family:var(--f-type);font-size:14.5px;line-height:1.5;color:var(--ash);max-width:52ch}
.vt-state::before{content:"";flex:none;width:9px;height:9px;border-radius:50%;background:var(--signal);box-shadow:0 0 10px var(--signal);transform:translateY(-1px)}
.vt-hero.is-cracked .vt-state::before{background:var(--gold);box-shadow:0 0 10px var(--gold)}
.vt-hero.is-open .vt-state::before{background:var(--gold-hi);box-shadow:0 0 12px var(--gold-hi)}
.vt-state b{color:var(--paper);font-weight:700}

.vd{position:relative;display:block;width:100%;max-width:520px;aspect-ratio:1;margin:0;padding:0;background:none;border:0;border-radius:50%;cursor:pointer;perspective:1700px;-webkit-tap-highlight-color:transparent;color:inherit}
.vd:focus-visible{outline:2px solid var(--gold-hi);outline-offset:10px}
.vd svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.vd__wall{fill:url(#vd-wall);stroke:var(--brass);stroke-width:1.5}
.vd__lip{fill:none;stroke:var(--smoke);stroke-width:8}
.vd__rivet{fill:var(--brass)}
.vd__tunnel circle{fill:none;stroke:var(--void);stroke-width:1.5;opacity:.3}
.vd__sil{fill:var(--void)}
.vd__recv{fill:var(--void);stroke:var(--smoke);stroke-width:1}
.vd__hinge{fill:var(--brass);stroke:var(--void);stroke-width:1.5}
.vd__lamp{fill:var(--signal);filter:drop-shadow(0 0 4px var(--signal));animation:vdBlink 2.4s steps(1) infinite}
.vd.is-open .vd__lamp,.vd.is-cracked .vd__lamp{fill:var(--gold-hi);filter:drop-shadow(0 0 5px var(--gold-hi));animation:none}
@keyframes vdBlink{0%,70%{opacity:1}71%,100%{opacity:.35}}
.vd__rays{position:absolute;inset:-26%;border-radius:50%;pointer-events:none;opacity:0;background:repeating-conic-gradient(from 6deg,rgba(243,212,138,.2) 0 5deg,transparent 5deg 17deg);-webkit-mask-image:radial-gradient(closest-side,transparent 52%,#000 60%,transparent);mask-image:radial-gradient(closest-side,transparent 52%,#000 60%,transparent);transition:opacity .8s var(--ease)}
.vd.is-cracked .vd__rays{opacity:.3;transition:opacity 1.4s var(--ease) 2.8s}
.vd.is-open .vd__rays{opacity:1;transition:opacity 1.8s var(--ease) 3s;animation:vdRays 80s linear infinite}
@keyframes vdRays{to{transform:rotate(360deg)}}
.vd__door{transform-origin:7% 50%;transition:transform 1.1s cubic-bezier(.6,0,.3,1);filter:drop-shadow(0 28px 34px rgba(0,0,0,.7))}
.vd.is-cracked .vd__door{transform:rotateY(-24deg);filter:drop-shadow(0 28px 34px rgba(0,0,0,.7)) drop-shadow(6px 0 16px rgba(243,212,138,.45));transition:transform 1.3s cubic-bezier(.45,0,.15,1) 2.6s,filter 1s var(--ease) 2.8s}
.vd.is-open .vd__door{transform:rotateY(-74deg);transition:transform 1.9s cubic-bezier(.45,0,.15,1) 2.7s}
.vd.is-rattle .vd__door{animation:vdRattle .5s var(--ease)}
@keyframes vdRattle{0%,100%{translate:0}20%{translate:-6px}40%{translate:6px}60%{translate:-4px}80%{translate:2px}}
.vd__bolt{fill:url(#vd-metal);stroke:var(--brass);stroke-width:1;transition:transform .35s var(--snap) calc(1.05s + var(--i) * 30ms)}
.vd.is-open .vd__bolt,.vd.is-cracked .vd__bolt{transform:translateY(27px);transition:transform .45s var(--snap) calc(1.95s + var(--i) * 45ms)}
.vd__knuckle{fill:var(--brass);stroke:var(--void);stroke-width:1.5}
.vd__face{fill:url(#vd-face);stroke:var(--gold);stroke-width:2.5}
.vd__line{fill:none;stroke:var(--brass);stroke-width:1.2}
.vd__line--dim{opacity:.7;stroke-width:.8}
.vd__stud{fill:url(#vd-metal)}
.vd__engrave{font-family:var(--f-type);font-size:13px;letter-spacing:2px;fill:var(--brass)}
.vd__name{fill:var(--gold-hi);font-weight:700}
.vd__plate{fill:var(--vault);stroke:var(--gold);stroke-width:1.5}
.vd__wheel{transform-origin:220px 220px;transition:transform .8s var(--ease) 1.45s}
.vd.is-open .vd__wheel,.vd.is-cracked .vd__wheel{transform:rotate(150deg);transition:transform 1s var(--ease) 1.1s}
.vd.is-rattle .vd__wheel{animation:vdJiggle .5s var(--ease)}
@keyframes vdJiggle{30%{rotate:-7deg}65%{rotate:5deg}}
.vd__spoke{fill:url(#vd-metal);stroke:var(--void);stroke-width:1}
.vd__knob{fill:url(#vd-metal);stroke:var(--brass);stroke-width:1.5}
.vd__shadow{fill:var(--void);opacity:.55}
.vd__dial{transform-origin:220px 220px;transition:transform .6s var(--ease) 1.9s}
.vd.is-open .vd__dial,.vd.is-cracked .vd__dial{transform:rotate(-36deg);animation:vdDial 1.15s var(--ease) .05s both}
@keyframes vdDial{0%{transform:rotate(0)}38%{transform:rotate(-250deg)}70%{transform:rotate(110deg)}100%{transform:rotate(-36deg)}}
.vd__dialface{fill:var(--coal);stroke:var(--gold);stroke-width:2}
.vd__tick{stroke:var(--brass);stroke-width:.9}
.vd__tick--big{stroke:var(--gold);stroke-width:1.3}
.vd__num{font-family:var(--f-type);font-size:8.5px;fill:var(--paper);text-anchor:middle;dominant-baseline:central}
.vd__hub{fill:url(#vd-metal);stroke:var(--brass);stroke-width:1}
.vd__hubhat{fill:var(--void)}
.vd__index{fill:var(--gold-hi)}
.vd__cap{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;text-align:center}
.vd__cap b{color:var(--signal);font-weight:400}
.vt-hero.is-cracked .vd__cap b{color:var(--gold)}
.vt-hero.is-open .vd__cap b{color:var(--gold-hi)}
.no-js .vd__cap{display:none}
.no-js .vd{cursor:default}

/* ── How to get in ── */
.vt-in{display:grid;grid-template-columns:minmax(0,380px) minmax(0,1fr);gap:clamp(28px,5vw,72px);align-items:start}
@media (max-width:900px){.vt-in{grid-template-columns:minmax(0,1fr)}.vt-card{max-width:460px}}
.no-js .vt-in{grid-template-columns:minmax(0,1fr)}
.vt-card{background:var(--void);border:1px solid var(--smoke);padding:22px 20px 20px;display:grid;gap:16px;position:relative;min-width:0}
.vt-card::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.vt-card__head{display:flex;justify-content:space-between;align-items:center;gap:10px}
.vt-card__lv{display:flex;align-items:flex-end;gap:16px}
.vt-card__lv>b{font-family:var(--f-display);font-weight:900;font-size:104px;line-height:.76;color:var(--gold)}
.vt-card__lv>span{display:grid;gap:8px;padding-bottom:2px}
.vt-card__name{font-family:var(--f-display);font-weight:800;font-size:32px;line-height:.95;text-transform:uppercase}
.vt-card__xp{font-family:var(--f-type);font-size:13px;letter-spacing:.06em;color:var(--ash)}
.vt-card__gap{font-size:15px;color:var(--ash);line-height:1.5}
.vt-card__gap b{color:var(--paper);font-weight:600}
.vt-card .ledger{font-size:13.5px}
.no-js .vt-card{display:none}
.tumblers{list-style:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}
.tumblers li{display:grid;gap:7px;min-width:0;text-align:center}
.tumblers .slot{position:relative;height:58px;border:1px solid var(--smoke);background:var(--coal);overflow:hidden}
.tumblers .slot::before{content:"";position:absolute;left:0;right:0;top:50%;border-top:1px dashed var(--smoke)}
.tumblers .pin{position:absolute;left:34%;right:34%;top:0;bottom:0;background:linear-gradient(var(--gold),var(--brass));opacity:.55;transform:translateY(calc(86% - var(--p,0%) * .86));transition:transform 1s var(--ease),opacity .4s}
.tumblers li.is-set .pin{opacity:1;background:linear-gradient(var(--gold-hi),var(--brass));box-shadow:0 0 14px rgba(243,212,138,.55)}
.tumblers small{display:grid;gap:2px;font-family:var(--f-type);font-size:10px;letter-spacing:0;line-height:1.15;text-transform:uppercase;color:var(--ash);word-break:keep-all}
.tumblers small b{font-weight:700;color:var(--brass)}
.tumblers li.is-set small,.tumblers li.is-set small b{color:var(--gold)}
@media (max-width:480px){.tumblers small{font-size:8.5px}}
.ways{list-style:none;display:grid;border-top:1px solid var(--smoke)}
.way{display:grid;grid-template-columns:92px minmax(0,1fr) auto;gap:8px 24px;padding:24px 0;border-bottom:1px solid var(--smoke);align-items:start}
.way__xp{font-family:var(--f-display);font-weight:900;font-size:46px;line-height:.82;color:var(--gold)}
.way__xp small{display:block;font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);margin-top:9px;line-height:1.3}
.way__body{display:grid;gap:10px;min-width:0}
.way__t{font-family:var(--f-display);font-weight:800;font-size:clamp(25px,2.4vw,31px);line-height:1;text-transform:uppercase;letter-spacing:.02em}
.way__body>p{color:var(--ash);font-size:15.5px;max-width:58ch}
.way__links{display:flex;flex-wrap:wrap;gap:8px 22px}
.way__state{font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);border:1px solid var(--smoke);padding:5px 9px;white-space:nowrap}
.way.is-done .way__state{color:var(--void);background:var(--gold);border-color:var(--gold)}
.way.is-done .way__xp{color:var(--brass)}
.no-js .way__state{display:none}
@media (max-width:560px){.way{grid-template-columns:62px minmax(0,1fr)}.way__xp{font-size:36px}.way__state{grid-column:2;justify-self:start;white-space:normal}}
.sayit{display:grid;gap:8px;max-width:400px;min-width:0}
.sayit__row{display:flex;gap:8px;min-width:0}
.sayit input{flex:1 1 auto;width:0;min-width:0;font:inherit;font-size:16px;color:var(--paper);background:var(--void);border:1px solid var(--smoke);border-radius:0;padding:10px 12px;text-transform:lowercase}
.sayit input::placeholder{color:#6f695f;text-transform:none}
.sayit input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(217,178,95,.18)}
.sayit__msg{font-size:14.5px;color:var(--gold-hi)}
.sayit__msg:empty{display:none}
.no-js .sayit{display:none}
.vt-next{margin-top:clamp(44px,5vw,64px);display:grid;gap:18px}
.vt-next__head{display:flex;justify-content:space-between;align-items:baseline;gap:12px 24px;flex-wrap:wrap}
.vt-next__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
@media (max-width:860px){.vt-next__grid{grid-template-columns:minmax(0,1fr)}}
.vt-nf{display:grid;gap:8px;align-content:start;padding:20px 20px 18px;border:1px solid var(--smoke);background:var(--void);text-decoration:none;color:var(--paper);min-width:0;transition:border-color .25s,transform .25s var(--ease)}
.vt-nf:hover,.vt-nf:focus-visible{border-color:var(--gold);transform:translateY(-3px)}
.vt-nf b{font-family:var(--f-display);font-weight:900;font-size:34px;line-height:.9;text-transform:uppercase;overflow-wrap:anywhere}
.vt-nf__xp{font-size:14.5px;color:var(--ash)}
.vt-nf--done{grid-column:1/-1;border-style:dashed;border-color:var(--brass)}

/* ── The Playbook ── */
.pb{display:grid;grid-template-columns:minmax(0,280px) minmax(0,1fr);gap:clamp(28px,5vw,72px);align-items:start}
.pb__nav{position:sticky;top:calc(92px + env(safe-area-inset-top,0px));display:grid;gap:14px}
@media (max-width:980px){.pb{grid-template-columns:minmax(0,1fr)}.pb__nav{display:none}}
.pb__nav ol{list-style:none;display:grid;border-top:1px solid var(--smoke)}
.pb__nav a{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--smoke);text-decoration:none;color:var(--ash);font-size:14.5px;line-height:1.3;transition:color .2s}
.pb__nav a:hover{color:var(--paper)}
.pb__nav a>span:first-child{font-family:var(--f-display);font-weight:900;font-size:21px;line-height:1;color:var(--brass)}
.pb__nav a.is-open>span:first-child{color:var(--gold)}
.pb__nav i{font-style:normal;font-family:var(--f-type);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--signal)}
.pb__nav a.is-open i{color:var(--gold)}
.pb__nav i:empty{display:none}
.pb__count{display:flex;align-items:baseline;gap:10px;font-family:var(--f-type);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash)}
.pb__count b{font-family:var(--f-display);font-weight:900;font-size:64px;line-height:.8;letter-spacing:0;color:var(--gold)}
.no-js .pb__count{display:none}
.pb__rules{display:grid;gap:clamp(26px,3.6vw,40px);min-width:0}
.pb__deck{display:grid;gap:clamp(26px,3.6vw,40px);min-width:0}
/* wide screens: one rule at a time, picked from the index or with previous / next, on a little pile of sheets */
.pb__bar{display:flex;justify-content:space-between;align-items:center;gap:12px 20px;flex-wrap:wrap}
.pb__bar[hidden]{display:none}
.pb__pos{font-family:var(--f-type);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash)}
.pb__pos b{font-family:var(--f-display);font-weight:900;font-size:34px;letter-spacing:0;color:var(--gold);margin-right:6px;vertical-align:-4px}
.pb__step{display:flex;gap:8px}
.pb__step .btn:disabled{opacity:.35;cursor:default;transform:none}
.pb--deck .pb__deck{position:relative;isolation:isolate;padding:0 22px 22px 0}
.pb--deck .pb__deck::before,.pb--deck .pb__deck::after{content:"";position:absolute;inset:0 22px 22px 0;z-index:-1;background:var(--paper-2);box-shadow:0 30px 60px -30px rgba(0,0,0,.8)}
.pb--deck .pb__deck::before{transform:translate(22px,22px) rotate(1.4deg);opacity:.28}
.pb--deck .pb__deck::after{transform:translate(11px,11px) rotate(.7deg);opacity:.5}
.pb--deck .pb__deck .classified__sheet{animation:pbIn .5s var(--ease)}
@keyframes pbIn{from{opacity:0;transform:translate(-14px,8px) rotate(-.8deg)}to{opacity:1;transform:none}}
.pb__nav a[aria-current]{color:var(--paper)}
.pb__nav a[aria-current]>span:nth-child(2){color:var(--gold-hi)}
.pb__nav a[aria-current]::before{content:"";position:absolute;left:-14px;top:50%;width:6px;height:6px;margin-top:-3px;background:var(--gold);transform:rotate(45deg)}
.pb__nav li{position:relative}
.js .pb--deck .pb__rules .classified.is-locked ~ .classified.is-locked .classified__status{font-size:13.5px;gap:12px}
.js .pb--deck .pb__rules .classified.is-locked ~ .classified.is-locked .classified__status span{display:inline}
.js .pb--deck .pb__rules .classified.is-locked ~ .classified.is-locked .classified__body{max-height:9.4em}
/* phones: a quick row of rule numbers to jump around, and room to read */
.pb__jump{display:none}
@media (max-width:980px){
  .pb__jump{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:4px;scrollbar-width:none}
  .pb__jump::-webkit-scrollbar{display:none}
  .pb__jump a{flex:none;display:grid;place-items:center;min-width:44px;height:44px;border:1px solid var(--smoke);font-family:var(--f-display);font-weight:900;font-size:20px;color:var(--brass);text-decoration:none}
  .pb__jump a.is-open{color:var(--gold);border-color:var(--brass)}
  .pb__rules .classified{scroll-margin-top:84px}
}
@media (max-width:560px){.pb__rules .classified__sheet{padding:22px 18px}.pb__rules .classified__body{font-size:15.5px;line-height:1.65}}
.pb__rules .classified__body a{color:var(--ink);text-decoration-color:var(--brass);text-underline-offset:3px;font-weight:700}
.js .pb__rules .classified.is-locked .classified__body a{text-decoration:none}
.js .pb__rules .classified.is-locked .classified__body{max-height:9.4em;overflow:hidden;-webkit-mask-image:linear-gradient(#000 40%,transparent);mask-image:linear-gradient(#000 40%,transparent)}
.js .pb__rules .classified.is-locked ~ .classified.is-locked .classified__status{font-size:0;gap:8px}
.js .pb__rules .classified.is-locked ~ .classified.is-locked .classified__status span{display:none}
.js .pb__rules .classified.is-locked ~ .classified.is-locked .classified__body{max-height:4.6em}
/* stacked rules: "How do I get clearance?" sits on the first sealed rule only (no run of ten identical
   tab stops); every sealed rule keeps its own "Break the seal anyway". The deck shows one rule at a
   time, so the rule on screen gets both again. */
.js .pb__rules .classified.is-locked ~ .classified.is-locked .classified__status button:first-of-type:not(:last-child){display:none}
.js .pb--deck .pb__rules .classified.is-locked ~ .classified.is-locked .classified__status button:first-of-type:not(:last-child){display:inline-block}
.pb__end{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px 32px;padding:clamp(22px,3vw,30px);border:1px dashed var(--brass)}
.pb__end p{color:var(--ash);max-width:56ch}
.pb__end b{color:var(--paper);font-weight:600}

/* ── Syndicate ID ── */
.sid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:clamp(28px,5vw,64px);align-items:center}
@media (max-width:900px){.sid{grid-template-columns:minmax(0,1fr)}}
.sid__card{margin:0;min-width:0;perspective:1400px}
.sid__tilt{--gx:30%;--gy:20%;position:relative;border-radius:3% / 4.76%;overflow:hidden;box-shadow:0 44px 80px -34px rgba(0,0,0,.95),0 0 0 1px var(--smoke);transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .6s var(--ease)}
.sid__tilt::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(420px circle at var(--gx) var(--gy),rgba(243,212,138,.16),transparent 65%);opacity:0;transition:opacity .4s}
.sid__card:hover .sid__tilt::after{opacity:1}
.sid__img,.sid__tilt canvas{display:block;width:100%;height:auto;aspect-ratio:1200 / 756;background:var(--void)}
.sid__form{align-content:start}
.sid__form .field__hint{margin-top:-4px}
.sid__form .btn .ico{width:18px;height:18px;flex:none}
.sid__msg{font-size:14.5px;color:var(--gold-hi);line-height:1.5}
.sid__msg:empty{display:none}
.sid__fine{font-size:13.5px;color:var(--ash);line-height:1.5}
.sid__n{display:inline-grid;place-items:center;width:24px;height:24px;border-radius:50%;border:1.5px solid currentColor;font-size:15px;line-height:1;margin-right:2px}
.sid__steps{display:grid;gap:12px}
.sid__steps .ctas{gap:10px}
.sid__earned{list-style:none;display:flex;flex-wrap:wrap;gap:8px}
.sid__earned li{font-family:var(--f-type);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash);border:1px dashed var(--smoke);padding:5px 9px}
.sid__earned li.is-on{color:var(--void);background:var(--gold);border:1px solid var(--gold)}
.sid__tag{margin-top:clamp(24px,3vw,36px);font-family:var(--f-serif);font-style:italic;font-size:clamp(20px,2vw,24px);color:var(--ash)}
.sid__tag a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--brass)}
.no-js .sid,.no-js .sid__tag{display:none}
.sid__nojs{max-width:60ch}
.js .sid__nojs{display:none}

/* ── Final call ── */
.vt-final{display:grid;gap:clamp(22px,3vw,34px);justify-items:start}
.vt-final h2{font-family:var(--f-display);font-weight:900;font-size:clamp(64px,11vw,176px);line-height:.8;text-transform:uppercase}
.vt-final p{font-size:var(--t-lede);max-width:52ch}
.vt-final .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.vt-final .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.vt-final .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.vt-final__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,4vw,48px);color:var(--void);text-decoration:none;line-height:1}
`;

const js = `
(() => {
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const LV = ${JSON.stringify(LEVELS.map((l) => ({ lv: l.lv, name: l.name, xp: l.xp })))};
  const XPV = ${JSON.stringify(XP)};
  const TOP = LV[LV.length - 1];
  const ARW = ${JSON.stringify(arrow)};
  const host = document.querySelector('[data-path]') || document.body;
  const ROOT = host.dataset.root || '';
  const store = {
    get(k, s) { try { return JSON.parse((s || localStorage).getItem(k)); } catch (e) { return null; } },
    set(k, v, s) { try { (s || localStorage).setItem(k, JSON.stringify(v)); } catch (e) { /* blocked */ } },
  };

  function start() {
    const BS = window.BS;
    if (!BS) return;
    const reduce = BS.reduce;

    /* ── The door ── */
    const hero = $('.vt-hero'), door = $('[data-vd]'), stateEl = $('[data-vd-state]'), cap = $('[data-vd-cap]');
    let shown = 'locked', pending = null, doorSeen = true, userShut = false, rattleT = 0, lastToast = 0, armed = false;
    const wantNow = () => (BS.level().lv >= TOP.lv ? 'open' : Object.keys(BS.state().broken || {}).length ? 'cracked' : 'locked');
    function words(s) {
      const L = BS.level();
      if (s === 'open') return userShut ? 'Closed. It is still yours. Press the door to open it again.' : '<b>Open.</b> Welcome to the Inner Circle. Every rule below is yours.';
      if (s === 'cracked') return '<b>Seal broken.</b> The bolts gave, but the door only opens all the way at Level ' + TOP.lv + '. You are Level ' + L.lv + ': ' + L.name + '.';
      return '<b>Locked.</b> Clearance ' + TOP.lv + ' required. You are Level ' + L.lv + ': ' + L.name + '.';
    }
    function paint(s) {
      shown = s;
      const vis = s === 'open' && userShut ? 'locked' : s;
      ['locked', 'cracked', 'open'].forEach((k) => { door.classList.toggle('is-' + k, k === vis); hero.classList.toggle('is-' + k, k === vis); });
      stateEl.innerHTML = '<span>' + words(s) + '</span>';
      if (cap) cap.textContent = s === 'open' ? (userShut ? 'Closed' : 'Open') : s === 'cracked' ? 'Seal broken' : 'Locked';
      const hint = $('[data-vd-hint]');
      if (hint) hint.textContent = s === 'open' ? (userShut ? 'Press to open' : 'Press to close') : 'Try the door';
      const w = $('[data-vt-whisper]');
      if (w) w.textContent = s === 'open' ? 'You’re in.' : 'Inner Circle only.';
      const ln = $('[data-vt-lock-note]'); if (ln) ln.hidden = s === 'open';
      $$('[data-vt-cta]').forEach((a) => { const o = s === 'open' ? a.dataset.open : a.dataset.closed; if (o) { const [t, h] = o.split('|'); a.innerHTML = t + ' ' + ARW; a.setAttribute('href', h); } });
    }
    function settle() {
      const want = wantNow();
      if (want === shown) { stateEl.innerHTML = '<span>' + words(shown) + '</span>'; return; }
      if (!armed) { stateEl.innerHTML = '<span>' + (want === 'open' ? '<b>Clearance confirmed.</b> Opening the door.' : '<b>Seal broken.</b> Releasing the bolts.') + '</span>'; return; }
      if (!doorSeen) { pending = want; return; }
      paint(want);
    }
    if (door) {
      paint('locked');
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { doorSeen = e.isIntersecting; if (doorSeen && pending) { const p = pending; pending = null; setTimeout(() => paint(p), reduce ? 0 : 250); } }, { threshold: 0.35 }).observe(door);
      const first = wantNow();
      setTimeout(() => { armed = true; settle(); }, reduce ? 0 : 650);
      if (first === 'open' && !store.get('bs2.vaultHello', sessionStorage)) { store.set('bs2.vaultHello', 1, sessionStorage); setTimeout(() => BS.toast('Welcome to the Inner Circle. The Vault is open.', 'The Vault', 'LV' + TOP.lv, 'level'), reduce ? 300 : 3200); }
      door.addEventListener('click', () => {
        if (shown === 'open') { userShut = !userShut; paint('open'); return; }
        door.classList.remove('is-rattle'); void door.offsetWidth; door.classList.add('is-rattle');
        clearTimeout(rattleT); rattleT = setTimeout(() => door.classList.remove('is-rattle'), 600);
        const L = BS.level(), now = Date.now();
        if (now - lastToast > 2500) { lastToast = now; BS.toast('The door holds.', 'Clearance ' + TOP.lv + ' required · You are Level ' + L.lv, '', ''); }
      });
    }

    /* ── Clearance card, ways in, next files ── */
    function ways() {
      const S = BS.state(), L = BS.level(), files = BS.FILES || [];
      const opened = files.filter((f) => S.seen[f.path]).length, read = files.filter((f) => S.read[f.path]).length;
      const marks = Object.keys(S.marks || {}).length;
      const mark = (k, txt, done) => { const li = $('[data-way="' + k + '"]'); if (!li) return; li.classList.toggle('is-done', !!done); const o = $('[data-way-state]', li); if (o) o.textContent = txt; };
      mark('files', opened + ' opened · ' + read + ' read', files.length && read >= files.length);
      mark('quiz', S.quiz ? 'Match found' : 'Not yet', S.quiz);
      mark('marks', marks + ' of 3 found', marks >= 3);
      mark('blackout', S.blackout ? 'Said it' : 'Not yet', S.blackout);
      mark('lead', S.lead ? 'Sent' : 'Not yet', S.lead);
      const gap = Math.max(0, TOP.xp - S.xp), g = $('[data-vt-gap]');
      if (g) g.innerHTML = gap ? '<b>' + gap + ' more clearance</b> opens the Vault. That is about ' + Math.max(1, Math.ceil(gap / (XPV.visit + XPV.read))) + ' more file' + (Math.ceil(gap / (XPV.visit + XPV.read)) === 1 ? '' : 's') + ' read to the end.' : '<b>You’re in.</b> Every rule below is open, and your ID gets the gold seal.';
      $$('[data-vt-of]').forEach((e) => (e.textContent = S.xp >= TOP.xp ? 'clearance · top level' : 'of ' + TOP.xp + ' clearance'));
      const intro = $('[data-vt-intro]');
      if (intro && L.lv >= TOP.lv) intro.textContent = 'You’re already Inner Circle. These still pay clearance if you want every file in the Archive.';
      $$('[data-tumbler]').forEach((t) => {
        const lv = +t.dataset.tumbler, need = LV[lv].xp, prev = LV[lv - 1].xp;
        const p = S.xp >= need ? 100 : S.xp <= prev ? 0 : Math.round(((S.xp - prev) / (need - prev)) * 100);
        t.style.setProperty('--p', p + '%'); t.classList.toggle('is-set', p >= 100);
      });
      $$('[data-visitor] [data-v="status"]').forEach((b) => { b.classList.toggle('badge--gold', L.lv >= 1); b.classList.toggle('badge--red', L.lv < 1); });
      const box = $('[data-vt-next]');
      if (box) {
        let list = files.filter((f) => !S.seen[f.path]), how = '+' + (XPV.visit + XPV.read) + ' to open and read';
        if (!list.length) { list = files.filter((f) => !S.read[f.path]); how = '+' + XPV.read + ' for reading to the end'; }
        box.innerHTML = list.length
          ? list.slice(0, 3).map((f) => "<a class='vt-nf' href='" + ROOT + f.path + "'><span class='label'>" + f.file + "</span><b>" + f.title + "</b><span class='vt-nf__xp'>" + how + "</span><span class='file__open'>Open file " + ARW + '</span></a>').join('')
          : '<p class="vt-nf vt-nf--done"><span class="label">Archive cleared</span><b>Every file read.</b><span class="vt-nf__xp">You’ve opened and read the whole Archive. Nothing left in the drawer.</span></p>';
      }
    }

    /* ── Playbook index ── */
    function pb() {
      let n = 0;
      $$('[data-classified^="pb-"]').forEach((el) => {
        const open = el.classList.contains('is-open'); if (open) n++;
        $$('[data-pb-link="' + el.dataset.classified + '"]').forEach((a) => { a.classList.toggle('is-open', open); const i = $('i', a); if (i) i.textContent = open ? 'Open' : 'Sealed'; });
      });
      $$('[data-pb-open]').forEach((e) => (e.textContent = n));
    }

    const refresh = () => { ways(); pb(); settle(); };
    refresh();
    const hud = $('[data-hud-lv]');
    if (hud) new MutationObserver(refresh).observe(hud, { childList: true, characterData: true, subtree: true });
    const mo = new MutationObserver(pb);
    $$('[data-classified^="pb-"]').forEach((el) => mo.observe(el, { attributes: true, attributeFilter: ['class'] }));

    /* ── Say the name on the door (works on phones too) ── */
    const say = $('[data-sayit]');
    if (say) say.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = $('input', say), out = $('[data-sayit-msg]'), v = inp.value.toLowerCase().replace(/[^a-z]/g, '');
      if (v === 'blackout' || v === 'blackoutsyndicate') {
        inp.value = ''; say.querySelector('button').focus();
        'blackout'.split('').forEach((k) => document.body.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true })));
        const veil = $('[data-veil]'), dark = veil && !veil.hidden;
        out.textContent = dark ? 'Lights out. Say it again to bring them back.' : 'Lights back on.';
      } else {
        out.textContent = v ? 'That isn’t it. The name is engraved on the door at the top of this page.' : 'Type the name first.';
      }
    });
  }
  if (window.BS) start(); else document.addEventListener('bs:ready', start);
})();

/* ── The playbook on wide screens: one rule at a time, picked from the index or with previous / next.
   Every rule stays in the page; phones and no-JS get the full stack. ── */
(() => {
  const pb = document.querySelector('[data-pb]');
  if (!pb) return;
  const sheets = [...pb.querySelectorAll('[data-pb-deck] > [data-classified]')];
  const links = [...pb.querySelectorAll('.pb__nav [data-pb-link]')];
  const bar = pb.querySelector('[data-pb-bar]'), pos = pb.querySelector('[data-pb-pos]');
  const prev = pb.querySelector('[data-pb-prev]'), next = pb.querySelector('[data-pb-next]');
  if (!sheets.length || !bar) return;
  const wide = matchMedia('(min-width: 981px)');
  let cur = 0;
  const show = (i, focus) => {
    cur = Math.max(0, Math.min(sheets.length - 1, i));
    const deck = wide.matches;
    pb.classList.toggle('pb--deck', deck);
    bar.hidden = !deck;
    sheets.forEach((el, k) => { el.hidden = deck && k !== cur; });
    links.forEach((a, k) => { if (deck && k === cur) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
    pos.textContent = String(cur + 1).padStart(2, '0');
    prev.disabled = cur === 0; next.disabled = cur === sheets.length - 1;
    if (focus && deck) {
      const t = sheets[cur].querySelector('.classified__title');
      if (t) { t.tabIndex = -1; t.focus({ preventScroll: true }); }
      const top = bar.getBoundingClientRect().top;
      if (top < 70 || top > innerHeight * .6) scrollBy({ top: top - 100, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };
  const go = (i) => { show(i, true); try { history.replaceState(null, '', '#cl-' + sheets[cur].dataset.classified); } catch (e) { /* file:// */ } };
  links.forEach((a, k) => a.addEventListener('click', (e) => { if (!wide.matches) return; e.preventDefault(); go(k); }));
  prev.addEventListener('click', () => go(cur - 1));
  next.addEventListener('click', () => go(cur + 1));
  const fromHash = () => { const k = sheets.findIndex((el) => '#cl-' + el.dataset.classified === location.hash); if (k >= 0) show(k, false); };
  if (wide.addEventListener) wide.addEventListener('change', () => show(cur, false));
  show(0, false); fromHash();
  addEventListener('hashchange', fromHash);
})();

/* ── Your Syndicate ID: drawn on a canvas, shown as an image so it can be saved ── */
(() => {
  const fig = document.querySelector('[data-sid-card]');
  if (!fig) return;
  const img = fig.querySelector('[data-sid-img]'), tilt = fig.querySelector('.sid__tilt');
  const nameIn = document.getElementById('sid-name'), bizIn = document.getElementById('sid-biz');
  const msg = document.querySelector('[data-sid-msg]'), share = document.querySelector('[data-sid-share]');
  const W = 1200, H = 756, KEY = 'bs2.sid';
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  if (!g) return;
  const cs = getComputedStyle(document.documentElement), T = (k) => cs.getPropertyValue('--' + k).trim();
  const C = { void: T('void') || '#070708', coal: T('coal') || '#0f0e11', vault: T('vault') || '#17151b', smoke: T('smoke') || '#2a2730', ash: T('ash') || '#aaa396', paper: T('paper') || '#f2ead8', gold: T('gold') || '#d9b25f', hi: T('gold-hi') || '#f3d48a', brass: T('brass') || '#8a6d34', signal: T('signal') || '#e5484d' };
  const F = { display: '"Big Shoulders Display", "Arial Narrow", Impact, sans-serif', type: '"Courier Prime", "Courier New", monospace', serif: '"Bodoni Moda", "Bodoni 72", Didot, Georgia, serif' };
  const rgba = (hex, a) => { const n = parseInt(hex.replace('#', ''), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; };
  const crown = new Path2D('M9 26C9 14 12 9 20 9s11 5 11 17Z');
  const hat = (x, y, s, fill) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = fill; g.beginPath(); g.ellipse(20, 27, 18, 4.5, 0, 0, Math.PI * 2); g.fill(); g.fill(crown); g.restore(); };
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const spaced = (text, x, y, sp, font, fill, align) => {
    g.font = font; g.fillStyle = fill; g.textAlign = 'left';
    const chars = [...text], ws = chars.map((c) => g.measureText(c).width), total = ws.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
    let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
    chars.forEach((c, i) => { g.fillText(c, cx, y); cx += ws[i] + sp; });
    return total;
  };
  const fit = (text, font, max, from, min) => { let s = from; for (; s > min; s -= 2) { g.font = font(s); if (g.measureText(text).width <= max) break; } return s; };
  const arc = (text, cx, cy, r, bottom, sp) => {
    const chars = [...text], ws = chars.map((c) => g.measureText(c).width + sp), total = ws.reduce((a, b) => a + b, 0) - sp;
    let a = bottom ? Math.PI + total / r / 2 : -total / r / 2;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    chars.forEach((c, i) => {
      const step = ws[i] / r, mid = bottom ? a - (ws[i] - sp) / r / 2 : a + (ws[i] - sp) / r / 2;
      g.save(); g.translate(cx, cy);
      if (bottom) { g.rotate(mid - Math.PI); g.translate(0, r); } else { g.rotate(mid); g.translate(0, -r); }
      g.fillText(c, 0, 0); g.restore();
      a += bottom ? -step : step;
    });
    g.textBaseline = 'alphabetic';
  };
  const hash = (s) => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const memberNo = (n) => { const k = n.trim().toLowerCase().replace(/\\s+/g, ' '); if (!k) return 'BS-0000-0000'; return 'BS-' + String(hash(k) % 10000).padStart(4, '0') + '-' + String(hash(k + '|syndicate') % 10000).padStart(4, '0'); };
  const level = () => (window.BS ? window.BS.level() : { lv: 0, name: 'Outsider' });
  // What the visitor has earned on the site, read from the engine (never written here).
  const earned = () => {
    const B = window.BS;
    if (!B) return { files: 0, read: 0 };
    if (B.stamps) return B.stamps();
    const S = B.state(), F = B.FILES || [], read = F.filter((f) => S.read[f.path]).length;
    return { files: F.length, read, archive: F.length > 0 && read >= F.length, allMarks: Object.keys(S.marks || {}).length >= 3, blackout: !!S.blackout, lead: !!S.lead };
  };
  // The earned stamps, packed from the right edge of the card's upper band. None earned: the band stays clean.
  function stamps(E) {
    const items = [];
    if (E.archive) items.push({ w: 124, draw: (x, y) => {
      g.save(); g.translate(x + 62, y); g.rotate(-0.14); g.strokeStyle = C.gold; g.fillStyle = C.gold;
      g.lineWidth = 3.5; g.beginPath(); g.arc(0, 0, 60, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, 51, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(0, 0, 31, 0, Math.PI * 2); g.stroke();
      g.font = '700 12.5px ' + F.type; arc('ARCHIVE', 0, 0, 41, false, 3.5); arc('ALL FILES READ', 0, 0, 41, true, 1.4);
      g.font = '900 25px ' + F.display; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = C.hi; g.fillText(E.read + '/' + E.files, 0, 1); g.textBaseline = 'alphabetic'; g.textAlign = 'left';
      g.restore();
    } });
    if (E.allMarks) items.push({ w: 166, draw: (x, y) => {
      for (let k = 0; k < 3; k++) hat(x + k * 56, y - 52, 1.35, C.hi);
      spaced('3 OF 3 MARKS', x + 83, y + 34, 3.5, '700 14px ' + F.type, C.gold, 'center');
    } });
    const box = (text, sub, col, tilt) => {
      g.font = '900 35px ' + F.display; const tw = g.measureText(text).width, w = Math.ceil(tw + 44);
      items.push({ w, draw: (x, y) => {
        g.save(); g.translate(x + w / 2, y); g.rotate(tilt); g.strokeStyle = col; g.fillStyle = col;
        g.lineWidth = 3.5; rr(-w / 2, -35, w, 70, 6); g.stroke(); g.lineWidth = 1.2; rr(-w / 2 + 7, -28, w - 14, 56, 3); g.stroke();
        g.font = '900 35px ' + F.display; g.textAlign = 'center'; g.fillText(text, 0, 7);
        spaced(sub, 0, 23, 2.8, '700 11px ' + F.type, col, 'center');
        g.restore();
      } });
    };
    if (E.blackout) box('SAID THE NAME', 'BLACKOUT', C.paper, 0.06);
    if (E.lead) box('MADE CONTACT', 'FILE ON THE DESK', C.gold, -0.07);
    let x = W - 76;
    items.forEach((it) => { x -= it.w; it.draw(x, 240); x -= 22; });
    return items.length;
  }
  const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

  function draw() {
    const L = level(), inner = L.lv >= 5;
    const rawName = nameIn.value.trim(), name = (rawName || 'Unknown').toUpperCase(), biz = bizIn.value.trim() || 'Independent operator';
    g.clearRect(0, 0, W, H);
    g.save(); rr(0, 0, W, H, 36); g.clip();
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, C.vault); bg.addColorStop(.55, C.coal); bg.addColorStop(1, C.void);
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const beam = g.createRadialGradient(300, 160, 0, 300, 160, 660); beam.addColorStop(0, rgba(C.gold, inner ? .26 : .17)); beam.addColorStop(.45, rgba(C.gold, .05)); beam.addColorStop(1, rgba(C.gold, 0));
    g.fillStyle = beam; g.fillRect(0, 0, W, H);
    // guilloche rosette watermark
    g.save(); g.translate(955, 372); g.strokeStyle = rgba(C.gold, inner ? .1 : .07); g.lineWidth = 1;
    for (let j = 0; j < 16; j++) { const base = 34 + j * 13, amp = 5 + j * .45; g.beginPath(); for (let k = 0; k <= 360; k += 2) { const t = (k / 180) * Math.PI, r = base + Math.sin(t * 14 + j * .7) * amp; k ? g.lineTo(Math.cos(t) * r, Math.sin(t) * r) : g.moveTo(Math.cos(t) * r, Math.sin(t) * r); } g.closePath(); g.stroke(); }
    g.restore();
    hat(955 - 66, 372 - 60, 3.3, rgba(C.gold, inner ? .09 : .06));
    // engraved waves
    g.strokeStyle = rgba(C.gold, .05); g.lineWidth = 1;
    for (let k = 0; k < 12; k++) { g.beginPath(); for (let x = 40; x <= W - 40; x += 8) { const y = 196 + k * 7 + Math.sin(x / 46 + k * .55) * 9; x === 40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    // borders and corners
    g.strokeStyle = C.gold; g.lineWidth = 3; rr(24, 24, W - 48, H - 48, 22); g.stroke();
    g.strokeStyle = rgba(C.brass, .9); g.lineWidth = 1; rr(36, 36, W - 72, H - 72, 14); g.stroke();
    g.strokeStyle = C.hi; g.lineWidth = 4;
    [[50, 50, 1, 1], [W - 50, 50, -1, 1], [50, H - 50, 1, -1], [W - 50, H - 50, -1, -1]].forEach(([x, y, sx, sy]) => { g.beginPath(); g.moveTo(x, y + sy * 34); g.lineTo(x, y); g.lineTo(x + sx * 34, y); g.stroke(); });
    // brand
    hat(78, 66, 2.15, C.gold);
    g.fillStyle = C.hi; g.font = 'italic 700 58px ' + F.serif; g.textAlign = 'left'; g.fillText('Blackout', 178, 122);
    spaced('SYNDICATE', 182, 152, 9.5, '400 16px ' + F.type, C.ash);
    spaced('SYNDICATE ID', W - 84, 104, 5, '400 20px ' + F.type, C.gold, 'right');
    g.font = '700 31px ' + F.type; g.fillStyle = C.paper; g.textAlign = 'right'; g.fillText(memberNo(rawName), W - 84, 146); g.textAlign = 'left';
    // member
    spaced('MEMBER', 82, 284, 6, '400 18px ' + F.type, C.ash);
    const ns = fit(name, (s) => '900 ' + s + 'px ' + F.display, 1030, 148, 60);
    g.font = '900 ' + ns + 'px ' + F.display;
    if (inner) { const ng = g.createLinearGradient(0, 440 - ns * .8, 0, 440); ng.addColorStop(0, C.hi); ng.addColorStop(1, C.gold); g.fillStyle = ng; g.shadowColor = rgba(C.hi, .35); g.shadowBlur = 30; }
    else g.fillStyle = C.paper;
    g.fillText(name, 78, 440); g.shadowBlur = 0;
    const bs = fit(biz, (s) => 'italic 500 ' + s + 'px ' + F.serif, 840, 50, 24);
    g.font = 'italic 500 ' + bs + 'px ' + F.serif; g.fillStyle = C.gold; g.fillText(biz, 82, 502);
    // divider
    g.strokeStyle = rgba(C.brass, .8); g.lineWidth = 1.5; g.setLineDash([2, 7]); g.beginPath(); g.moveTo(82, 552); g.lineTo(900, 552); g.stroke(); g.setLineDash([]);
    // fields
    const field = (x, k, v) => { spaced(k, x, 598, 4, '400 17px ' + F.type, C.ash); g.font = '700 27px ' + F.type; g.fillStyle = C.paper; g.textAlign = 'left'; g.fillText(v, x, 640); };
    field(82, 'CLEARANCE', 'LV ' + L.lv + ' · ' + L.name.toUpperCase());
    field(420, 'ISSUED', today());
    field(636, 'TERRITORY', 'SOUTH BEND, IN');
    // seal or provisional stamp
    if (inner) {
      g.save(); g.translate(1030, 590); g.rotate(-0.2);
      g.strokeStyle = C.gold; g.lineWidth = 3.5; g.beginPath(); g.arc(0, 0, 84, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 1.2; g.beginPath(); g.arc(0, 0, 74, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(0, 0, 50, 0, Math.PI * 2); g.stroke();
      g.fillStyle = C.gold; g.font = '700 14px ' + F.type; arc('INNER CIRCLE', 0, 0, 62, false, 3); arc('BLACKOUT SYNDICATE', 0, 0, 62, true, 1.6);
      hat(-24, -36, 1.2, C.hi);
      g.fillStyle = C.hi; g.font = '900 30px ' + F.display; g.textAlign = 'center'; g.fillText('LV 5', 0, 30); g.textAlign = 'left';
      g.restore();
    } else {
      g.save(); g.translate(1012, 588); g.rotate(-0.21); g.globalAlpha = .92;
      g.strokeStyle = C.signal; g.lineWidth = 4; rr(-112, -46, 224, 92, 8); g.stroke();
      g.lineWidth = 1.5; rr(-103, -37, 206, 74, 4); g.stroke();
      g.fillStyle = C.signal; g.font = '900 40px ' + F.display; g.textAlign = 'center'; g.fillText('PROVISIONAL', 0, 7);
      g.font = '700 13px ' + F.type; g.textAlign = 'left'; spaced('UNTIL LEVEL 5', 0, 27, 3, '700 12px ' + F.type, C.signal, 'center');
      g.restore();
    }
    const E = earned();
    stamps(E);
    spaced('GOOD FOR BRAGGING RIGHTS · BLACKOUTSYN.COM', 82, H - 56, 3.5, '400 15px ' + F.type, rgba(C.ash, .85));
    g.restore();
    return { L, E, name: rawName || 'Unknown', biz, no: memberNo(rawName) };
  }

  let blob = null, url = '', t = 0, info = null;
  function publish() {
    info = draw();
    const E = info.E, got = [E.archive && 'Archive, all ' + E.files + ' files read', E.allMarks && 'all three hidden marks', E.blackout && 'Said the name', E.lead && 'Made contact'].filter(Boolean);
    img.alt = 'Syndicate ID card for ' + info.name + ', ' + info.biz + '. Member number ' + info.no + '. Clearance Level ' + info.L.lv + ', ' + info.L.name + (info.L.lv >= 5 ? ', with the Inner Circle seal.' : ', stamped provisional until Level 5.') + (got.length ? ' Stamps: ' + got.join(', ') + '.' : '') + ' Issued ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '.';
    document.querySelectorAll('[data-earn]').forEach((li) => li.classList.toggle('is-on', !!{ archive: E.archive, marks: E.allMarks, blackout: E.blackout, lead: E.lead }[li.dataset.earn]));
    const show = (u) => { img.src = u; };
    try {
      cv.toBlob((b) => {
        if (!b) { try { show(cv.toDataURL('image/png')); } catch (e) { swapToCanvas(); } return; }
        const u = URL.createObjectURL(b);
        show(u); if (url) setTimeout(((old) => () => URL.revokeObjectURL(old))(url), 2000);
        url = u; blob = b;
      }, 'image/png');
    } catch (e) { swapToCanvas(); }
    if (share) {
      const L = info.L, txt = L.lv >= 5 ? 'Inner Circle at the Blackout Syndicate. The Vault is open. ${X_HANDLE}' : 'Level ' + L.lv + ': ' + L.name + ' at the Blackout Syndicate. Working my way into the Vault. ${X_HANDLE}';
      share.href = 'https://x.com/intent/tweet?text=' + encodeURIComponent(txt) + '&url=' + encodeURIComponent('${config.siteUrl}/vault.html');
    }
  }
  function swapToCanvas() { if (cv.isConnected) return; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', img.alt); img.replaceWith(cv); }
  const later = () => { clearTimeout(t); t = setTimeout(() => { publish(); store(); }, 140); };
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify({ n: nameIn.value, b: bizIn.value })); } catch (e) { /* blocked */ } };
  try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (v) { nameIn.value = v.n || ''; bizIn.value = v.b || ''; } } catch (e) { /* blocked */ }
  if (!nameIn.value) { try { const lead = JSON.parse(sessionStorage.getItem('bs2.lead') || 'null'); if (lead && lead.name) nameIn.value = lead.name; } catch (e) { /* blocked */ } }
  nameIn.addEventListener('input', later); bizIn.addEventListener('input', later);
  document.querySelector('[data-sid-form]').addEventListener('submit', (e) => { e.preventDefault(); publish(); });

  document.querySelector('[data-sid-save]').addEventListener('click', () => {
    const say = (m) => { msg.textContent = m; };
    const fallback = 'Saving didn’t start here. Long-press or right-click the card and save the image.';
    const go = (b) => {
      try {
        const u = URL.createObjectURL(b), a = document.createElement('a');
        const slug = (nameIn.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'member');
        a.href = u; a.download = 'syndicate-id-' + slug + '.png'; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(u), 4000);
        say('Saved. Your card is on its way to your downloads. Now attach it to your post. If nothing shows up, long-press or right-click the card and save the image.');
      } catch (e) { say(fallback); }
    };
    try { draw(); cv.toBlob((b) => (b ? go(b) : say(fallback)), 'image/png'); } catch (e) { say(fallback); }
  });

  // a little light on the card, and a tilt for mouse users
  if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fig.addEventListener('pointermove', (e) => { const r = tilt.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; tilt.style.setProperty('--ry', ((x - .5) * 9).toFixed(2) + 'deg'); tilt.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg'); tilt.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); tilt.style.setProperty('--gy', (y * 100).toFixed(1) + '%'); });
    fig.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
  }

  const begin = () => {
    publish();
    // redraw once the brand fonts are in, and whenever clearance changes
    if (document.fonts && document.fonts.load) Promise.all(['900 64px "Big Shoulders Display"', 'italic 700 40px "Bodoni Moda"', 'italic 500 40px "Bodoni Moda"', '400 20px "Courier Prime"', '700 20px "Courier Prime"'].map((f) => document.fonts.load(f).catch(() => null))).then(publish);
    // redraw when the level or an earned stamp changes
    const sig = () => { const E = earned(); return [level().lv, E.archive, E.allMarks, E.blackout, E.lead].join(); };
    let last = sig();
    document.addEventListener('bs:change', () => { const now = sig(); if (now !== last) { last = now; publish(); } });
  };
  if (window.BS) begin(); else document.addEventListener('bs:ready', begin);
})();
`;

export default {
  path: 'vault.html',
  navTitle: 'The Vault',
  title: 'The Vault',
  description: 'The Vault: the full Syndicate Playbook, ten plain rules for getting seen by the right people, plus a Syndicate ID with your name on it. Level 5 opens the door.',
  teaser: 'Inner Circle only. The full playbook lives here.',
  css, js,
  body: (c) => {
    const nFiles = c.all.filter((p) => p.file && p.xp !== false).length;
    const rules = RULES(c);
    const pad = (i) => String(i + 1).padStart(2, '0');
    return `
<header class="vt-hero" data-spot data-spot-idle>
  <div class="wrap vt-hero__in">
    <div class="vt-hero__head">
      ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'The Vault' }])}
      <p class="label">Clearance ${TOP.lv} · ${TOP.name} only</p>
      <h1 class="vt-title"><span class="sr">The Vault.</span><span class="vt-stack" data-spot-layer aria-hidden="true"><span class="vt-dark">The<br>Vault.</span><span class="vt-lit">The<br>Vault.</span></span><span class="vt-whisper" data-vt-whisper>Inner Circle only.</span></h1>
    </div>
    <div class="vt-hero__door">
      <button class="vd is-locked" type="button" data-vd aria-label="The Vault door" aria-describedby="vd-state">
        ${FRAME}
        <span class="vd__rays" aria-hidden="true"></span>
        ${DOOR}
      </button>
      <p class="vd__cap label label--dim" aria-hidden="true"><b data-vd-cap>Locked</b><span>·</span><span data-vd-hint>Try the door</span></p>
    </div>
    <div class="vt-hero__body">
      <p class="lede">Behind this door: <strong>the full Syndicate Playbook</strong>, ten plain rules for getting seen, and <strong>a Syndicate ID</strong> with your name on it. <span data-vt-lock-note>Level ${TOP.lv} opens it.</span></p>
      <p class="vt-state" id="vd-state" data-vd-state aria-live="polite"><span><b>Locked.</b> Clearance ${TOP.lv} required.</span></p>
      <div class="ctas">
        <a class="btn btn--lg" href="#get-in" data-vt-cta data-open="Read the playbook|#playbook">How to get in ${c.arrow}</a>
        <a class="btn btn--ghost btn--lg" href="#playbook" data-vt-cta data-open="Make your ID|#syndicate-id" data-closed="See the rules|#playbook">See the rules ${c.arrow}</a>
      </div>
    </div>
  </div>
</header>

<section class="band band--coal" id="get-in" aria-labelledby="in-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">How to get in</p>
      <h2 class="h2" id="in-h">Earn your clearance.</h2>
      <p data-vt-intro>Level ${TOP.lv} takes ${TOP.xp} clearance. Here is every way to earn it. Your clearance lives in this browser only.</p>
    </div>
    <div class="vt-in">
      <section class="vt-card rv" data-visitor aria-label="Your clearance">
        <div class="vt-card__head"><span class="label">Your clearance</span><span class="badge badge--red" data-v="status">Uncleared</span></div>
        <div class="vt-card__lv"><b data-v="lv">0</b><span><span class="vt-card__name" data-v="name">${LEVELS[0].name}</span><span class="vt-card__xp"><span data-v="xp">0</span> <span data-vt-of>of ${TOP.xp} clearance</span></span></span></div>
        <ol class="tumblers" aria-hidden="true">${LEVELS.slice(1).map((l) => `<li data-tumbler="${l.lv}"><span class="slot"><span class="pin"></span></span><small><b>LV ${l.lv}</b>${l.name}</small></li>`).join('')}</ol>
        <dl class="ledger">
          <div><dt>Files opened</dt><dd data-v="opened">0 / ${nFiles}</dd></div>
          <div><dt>Marks found</dt><dd data-v="marks">0 / 3</dd></div>
        </dl>
        <p class="vt-card__gap" data-vt-gap>Level ${TOP.lv} takes ${TOP.xp} clearance.</p>
        <p class="vt-card__gap"><span class="label label--dim">Next unlock</span><br><span data-v="next">${LEVELS[1].unlock} (Level 1)</span></p>
        <button class="textlink" type="button" data-hud-open>Open your full file ${c.arrow}</button>
      </section>
      <ol class="ways rv" style="--d:.1s">
        <li class="way" data-way="files">
          <span class="way__xp">+${XP.visit + XP.read}<small>per file</small></span>
          <div class="way__body">
            <h3 class="way__t">Open the files and read them to the end</h3>
            <p>There are ${nFiles} files across the site: the home page, the packages, how it works, the FAQ, about, the reel and contact. Opening one is +${XP.visit}. Scrolling to the end is +${XP.read} more.</p>
            <p class="way__links"><a class="textlink" href="${c.link('packages.html')}">Start with the packages ${c.arrow}</a></p>
          </div>
          <span class="way__state" data-way-state></span>
        </li>
        <li class="way" data-way="quiz">
          <span class="way__xp">+${XP.quiz}<small>once</small></span>
          <div class="way__body">
            <h3 class="way__t">Find your package match</h3>
            <p>Three questions on the packages page. We point you at the file that fits what you’re pushing.</p>
            <p class="way__links"><a class="textlink" href="${c.link('packages.html#match')}">Take the match ${c.arrow}</a></p>
          </div>
          <span class="way__state" data-way-state></span>
        </li>
        <li class="way" data-way="marks">
          <span class="way__xp">+${XP.mark}<small>per mark</small></span>
          <div class="way__body">
            <h3 class="way__t">Find the three hidden marks</h3>
            <p>A small fedora is hiding on each of these pages, somewhere it doesn’t belong. Click it to claim it.</p>
            <p class="way__links"><a class="textlink" href="${c.link('about.html')}">About ${c.arrow}</a><a class="textlink" href="${c.link('how-it-works.html')}">How it works ${c.arrow}</a><a class="textlink" href="${c.link('faq.html')}">FAQ ${c.arrow}</a></p>
          </div>
          <span class="way__state" data-way-state></span>
        </li>
        <li class="way" data-way="blackout">
          <span class="way__xp">+${XP.blackout}<small>once</small></span>
          <div class="way__body">
            <h3 class="way__t">Say the name on the door</h3>
            <p>It’s engraved on the Vault door at the top of this page. Type it on your keyboard anywhere on the site, or say it here.</p>
            <form class="sayit" data-sayit novalidate>
              <label class="label label--dim" for="sayit-in">The name on the door</label>
              <span class="sayit__row"><input id="sayit-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="24" placeholder="Type the name"><button class="btn btn--sm" type="submit">Say it</button></span>
              <span class="sayit__msg" data-sayit-msg aria-live="polite"></span>
            </form>
          </div>
          <span class="way__state" data-way-state></span>
        </li>
        <li class="way" data-way="lead">
          <span class="way__xp">+${XP.lead}<small>once</small></span>
          <div class="way__body">
            <h3 class="way__t">Make contact</h3>
            <p>Send the contact form. It’s the biggest single jump, and a person reads every one.</p>
            <p class="way__links"><a class="textlink" href="${c.link('contact.html')}">Make contact ${c.arrow}</a></p>
          </div>
          <span class="way__state" data-way-state></span>
        </li>
      </ol>
    </div>
    <div class="vt-next rv">
      <div class="vt-next__head"><h3 class="h3">Your next files</h3><span class="label label--dim">In reading order</span></div>
      <div class="vt-next__grid" data-vt-next>
        <a class="vt-nf" href="${c.link('how-it-works.html')}"><span class="label">The play</span><b>How it works</b><span class="vt-nf__xp">How a push is set up, aimed and reported.</span><span class="file__open">Open file ${c.arrow}</span></a>
        <a class="vt-nf" href="${c.link('faq.html')}"><span class="label">Questions</span><b>FAQ</b><span class="vt-nf__xp">Straight answers on money, timing and results.</span><span class="file__open">Open file ${c.arrow}</span></a>
        <a class="vt-nf" href="${c.link('about.html')}"><span class="label">The founder</span><b>About</b><span class="vt-nf__xp">Who runs the Syndicate and why.</span><span class="file__open">Open file ${c.arrow}</span></a>
      </div>
    </div>
  </div>
</section>

<section class="band" id="playbook" aria-labelledby="pb-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div>
        <p class="label">Clearance ${TOP.lv} · The Syndicate Playbook</p>
        <h2 class="h2" id="pb-h">Ten rules for getting seen.</h2>
        <p>Ten plain rules for getting seen, written for local shops, solo businesses, creators and streamers. Use them yourself. They work with or without us.</p>
      </div>
      <p class="pb__count"><b data-pb-open>0</b><span>of ${rules.length} open</span></p>
    </div>
    <div class="pb" data-pb>
      <nav class="pb__nav" aria-label="Playbook rules">
        <p class="label label--dim">The rules</p>
        <ol>${rules.map((r, i) => `<li><a href="#cl-pb-${pad(i)}" data-pb-link="pb-${pad(i)}"><span>${pad(i)}</span><span>${r.s}</span><i></i></a></li>`).join('')}</ol>
      </nav>
      <div class="pb__rules">
        <nav class="pb__jump" aria-label="Jump to a rule">${rules.map((r, i) => `<a href="#cl-pb-${pad(i)}" data-pb-link="pb-${pad(i)}" aria-label="Rule ${pad(i)}: ${r.s}">${pad(i)}</a>`).join('')}</nav>
        <div class="pb__bar" data-pb-bar hidden>
          <p class="pb__pos" aria-live="polite"><span class="sr">Rule </span><b data-pb-pos>01</b> of ${rules.length}</p>
          <div class="pb__step"><button class="btn btn--ghost btn--sm" type="button" data-pb-prev>Previous rule</button><button class="btn btn--sm" type="button" data-pb-next>Next rule ${c.arrow}</button></div>
        </div>
        <div class="pb__deck" data-pb-deck>
        ${rules.map((r, i) => c.classified({ id: `pb-${pad(i)}`, level: TOP.lv, title: `Rule ${pad(i)}: ${r.t}`, body: r.body, bypass: true })).join('')}
        </div>
        <div class="pb__end rv">
          <p><b>That’s the playbook.</b> Ten rules, no secrets. The hard part is doing them every week while you run the business.</p>
          ${c.btn('Let us run it ' + c.arrow, 'contact.html')}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="band band--coal" id="syndicate-id" aria-labelledby="sid-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">Your Syndicate ID</p>
      <h2 class="h2" id="sid-h">Put your name <span class="whisper">on file.</span></h2>
      <p>Type your name and your business or channel. The card shows your clearance, a member number that belongs to your name, and today’s date. Inner Circle gets the gold seal. Below Level ${TOP.lv} it’s stamped provisional. What you’ve done on the site goes on it as stamps.</p>
    </div>
    <div class="sid">
      <figure class="sid__card rv" data-sid-card>
        <div class="sid__tilt"><img class="sid__img" data-sid-img alt="Your Syndicate ID card" width="1200" height="756"></div>
      </figure>
      <form class="form sid__form rv" data-sid-form novalidate style="--d:.1s">
        <div class="field">
          <label for="sid-name">Your name</label>
          <input id="sid-name" name="sid-name" type="text" autocomplete="name" maxlength="32" placeholder="First and last">
        </div>
        <div class="field">
          <label for="sid-biz">Business or channel</label>
          <input id="sid-biz" name="sid-biz" type="text" autocomplete="organization" maxlength="38" placeholder="Shop, brand or channel name">
        </div>
        <p class="field__hint">The card is drawn right here in your browser. Nothing you type is sent anywhere.</p>
        <div class="sid__stamps">
          <p class="label label--dim">Stamps on your card</p>
          <ul class="sid__earned" data-sid-earned>
            <li data-earn="archive">Archive ${nFiles}/${nFiles}</li>
            <li data-earn="marks">3 of 3 marks</li>
            <li data-earn="blackout">Said the name</li>
            <li data-earn="lead">Made contact</li>
          </ul>
        </div>
        <div class="sid__steps">
          <p class="label">Save the card, then post it</p>
          <div class="ctas">
            <button class="btn" type="button" data-sid-save><span class="sid__n" aria-hidden="true">1</span> Save the card</button>
            <a class="btn btn--ghost" data-sid-share href="https://x.com/intent/tweet" target="_blank" rel="noopener"><span class="sid__n" aria-hidden="true">2</span> ${c.icon('x')} Post it on X</a>
          </div>
          <p class="sid__msg" data-sid-msg aria-live="polite"></p>
          <p class="sid__fine">The card saves as a picture. Attach it to your post on X, TikTok or Instagram. If saving doesn’t start, long-press or right-click the card and save the image.</p>
        </div>
      </form>
    </div>
    <p class="sid__tag">It’s good for bragging rights. Post it and tag us on X at <a href="${(SOCIALS.find((s) => s.key === 'x') || {}).url}" target="_blank" rel="noopener">${X_HANDLE}</a>.</p>
    <p class="note sid__nojs"><strong>Your Syndicate ID is drawn by your browser.</strong> Turn on JavaScript to make yours.</p>
  </div>
</section>

<section class="band band--gold" aria-labelledby="final-h">
  <div class="wrap vt-final">
    <p class="label">Make contact</p>
    <h2 id="final-h">You know<br>the playbook.</h2>
    <p>Want us to run it for you? Tell us what you’re pushing. We’ll tell you straight which file fits, or whether you need one at all.</p>
    <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html', 'lg')}${c.btn('See the packages', 'packages.html', 'ghost lg')}</div>
    <a class="vt-final__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
  </div>
</section>`;
  },
};
