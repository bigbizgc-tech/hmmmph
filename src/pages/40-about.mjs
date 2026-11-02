// File 15: About. Who runs the Syndicate: the founder, the name, the rules, the ground, the crew.
// Facts only from src/data. The founder file (Level 4) is the same facts, laid out as a dossier.
import { BIZ, SOCIALS, PLATFORMS, POLICY } from '../data/business.mjs';
import { bySlug, offerPath } from '../data/offers.mjs';

const andList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const AREA = andList(BIZ.area);
const DISCORD = SOCIALS.find((s) => s.key === 'discord');
const HANDLES = SOCIALS.filter((s) => ['x', 'tiktok', 'instagram'].includes(s.key));

// The case file (opens at Level 4). Every row is a known fact.
const FILE_ROWS = [
  ['Name', BIZ.founder],
  ['Known as', 'GC, Biz'],
  ['Base', `${BIZ.city}, ${BIZ.regionLong}`],
  ['Company', `${BIZ.name}, a ${BIZ.legal} company`],
  ['Background', 'Ten years building things with his hands'],
  ['Trade now', 'Paid reach, content and AI setup for creators, streamers, solo businesses and local shops'],
  ['Also handles', 'Websites, AI assistants and automations'],
  ['Territory', `${AREA}. All three on the St. Joseph River`],
  ['Crew', 'Graveshift Gaming, GC’s gaming crew. Find it on Discord'],
  ['Standing orders', 'Every dollar accounted for. If he can’t help you, he says so'],
  ['Found on', HANDLES.map((s) => `${s.handle} on ${s.label}`).join(', ')],
  ['Direct line', BIZ.phone],
];

// What GC takes on. Each points at the file that covers it.
const TRADES = [
  { t: 'Paid reach', d: `Real ads on ${andList(PLATFORMS.map((p) => p.name))}, from a one-time boost to a monthly plan.`, links: [{ t: 'Open the packages', p: 'packages.html' }] },
  { t: 'Content', d: bySlug['post-kit'].tagline, links: [{ t: bySlug['post-kit'].name, p: offerPath(bySlug['post-kit']) }] },
  { t: 'Creator systems', d: `${bySlug['creator-systems'].tagline} Built around how you already film.`, links: [{ t: bySlug['creator-systems'].name, p: offerPath(bySlug['creator-systems']) }] },
  { t: 'AI consulting', d: bySlug['ai-consulting'].tagline, links: [{ t: bySlug['ai-consulting'].name, p: offerPath(bySlug['ai-consulting']) }] },
  { t: 'AI automation', d: bySlug['ai-automation'].teaser, links: [{ t: bySlug['ai-automation'].name, p: offerPath(bySlug['ai-automation']) }] },
  { t: 'Websites', d: 'A clean site that works on a phone, so the people your ads reach have somewhere to land.', links: [{ t: bySlug['website-design'].name, p: offerPath(bySlug['website-design']) }] },
];

// What the name means for the people who hire it.
const TERMS = [
  { t: 'A crew that works for you', d: 'One local crew sets up your push, aims it, and reports back to you. You always know who’s handling it.' },
  { t: 'Straight talk', d: 'We tell you which file fits, or whether you need one at all. If a platform is the wrong fit for you, you hear that first.' },
  { t: 'Every dollar accounted for', d: 'Every recap shows what was spent and what it reached. Each boost page shows how much of your price buys the ad itself.' },
  { t: 'No bots', d: 'No fake followers, no engagement pods, no software pretending to be people. Real ads, bought through each platform’s own tools.' },
];

// The rules. Billing wording comes straight from POLICY.
const RULES = [
  { t: 'Your OK comes first', d: 'Nothing runs under your name until you say go. You see what runs before it runs.' },
  { t: 'You get a recap', d: 'When a run ends you get the numbers that matter: what was spent, how many people it reached, and the clicks or views it got.' },
  { t: 'Price before work', d: `Boosts, plans and add-ons have their price on the page. ${POLICY.quoted}` },
  { t: 'No promised numbers', d: BIZ.resultsNote },
  { t: 'Stay or walk', d: POLICY.plans },
  { t: 'A local person answers', d: `Call or text ${BIZ.phone}. You deal with a person in ${BIZ.city}.` },
];

// The map (viewBox 0 0 800 500). Stylized, not to scale. West to east: South Bend, Mishawaka, Elkhart.
const TOWNS = [
  { k: 'sb', name: 'South Bend', x: 208, y: 392, lx: 236, ly: 444, anchor: 'start', tag: 'Home base', note: 'Home base. GC is a South Bend guy, and the city takes its name from the bend in the river.' },
  { k: 'mi', name: 'Mishawaka', x: 372, y: 302, lx: 372, ly: 352, anchor: 'middle', tag: 'Next door', note: 'Right next door to South Bend, a short way up the river to the east.' },
  { k: 'el', name: 'Elkhart', x: 660, y: 222, lx: 660, ly: 186, anchor: 'middle', tag: 'East end', note: 'The east end of the territory, and the furthest up the river of the three.' },
];
const RIVER = 'M790 30C770 100 730 170 660 222C620 248 580 250 540 262C490 278 430 300 372 302C326 304 292 300 266 322C242 342 238 384 208 392C180 399 160 374 158 336C156 290 178 236 164 178C152 128 130 80 122 0';

const MAP = `
<svg class="ab-map__svg" viewBox="0 0 800 500" role="img" aria-labelledby="ab-map-t ab-map-d" focusable="false">
  <title id="ab-map-t">Stylized map of the St. Joseph River corridor</title>
  <desc id="ab-map-d">The St. Joseph River comes down from Michigan, runs west through Elkhart and Mishawaka, bends at South Bend and heads back north. Drawn for style, not to scale.</desc>
  <defs>
    <pattern id="ab-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" class="ab-map__gridline"/></pattern>
    <linearGradient id="ab-beam-g" x1="208" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#f3d48a" stop-opacity=".42"/><stop offset=".55" stop-color="#d9b25f" stop-opacity=".1"/><stop offset="1" stop-color="#d9b25f" stop-opacity="0"/></linearGradient>
    <path id="ab-riv-label" d="M396 282C470 268 548 246 640 202"/>
  </defs>
  <rect width="800" height="500" fill="url(#ab-grid)"/>
  <g class="ab-map__line">
    <path d="M0 96H800" class="ab-map__state"/>
    <text x="24" y="82" class="ab-map__state-t">Michigan</text>
    <text x="24" y="122" class="ab-map__state-t">Indiana</text>
  </g>
  <g class="ab-map__beam" data-beam transform="rotate(-50 208 392)"><path d="M208 392L908 269L908 515Z" fill="url(#ab-beam-g)"/></g>
  <path d="${RIVER}" class="ab-map__river-body"/>
  <path d="${RIVER}" class="ab-map__river" pathLength="1"/>
  <text class="ab-map__river-t"><textPath href="#ab-riv-label">St. Joseph River</textPath></text>
  ${TOWNS.map((t) => `<g class="ab-pin" data-pin="${t.k}"><circle class="ab-pin__ring" cx="${t.x}" cy="${t.y}" r="18"/><circle class="ab-pin__dot" cx="${t.x}" cy="${t.y}" r="7"/><text class="ab-pin__t" x="${t.lx}" y="${t.ly}" text-anchor="${t.anchor}">${t.name}</text></g>`).join('')}
  <g class="ab-map__compass" transform="translate(728 410)"><circle r="30"/><path d="M0 -24L7 4H-7Z" class="ab-map__needle"/><path d="M0 24L7 4H-7Z"/><text y="-36" text-anchor="middle">N</text></g>
</svg>`;

const css = `
/* ── Opening: the lamp over the subject ── */
.ab-head{padding-top:0}
.ab-head__in{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(20px,4vw,56px);align-items:stretch}
.ab-head__main{display:grid;gap:22px;align-content:end;min-width:0;padding-top:clamp(48px,7vw,96px)}
.ab-head__title{overflow-wrap:anywhere}
.ab-nw{white-space:nowrap}
.ab-head__tease{font-family:var(--f-type);font-size:13.5px;letter-spacing:.06em;color:var(--ash);display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
.ab-head__tease a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--brass)}
.ab-lamp{--cord:clamp(56px,7.5vw,112px);position:relative;min-height:clamp(440px,46vw,620px);min-width:0;pointer-events:none}
.ab-lamp__mount{position:absolute;left:50%;top:0;width:54px;height:6px;margin-left:-27px;background:var(--smoke)}
.ab-lamp__rig{position:absolute;left:50%;top:0;width:0;height:0;transform:rotate(var(--a,0deg));transform-origin:0 0}
.ab-lamp__cord{position:absolute;left:-1px;top:0;width:2px;height:calc(var(--cord) + 4px);background:linear-gradient(var(--smoke),var(--ash))}
.ab-lamp__shade{position:absolute;top:var(--cord);left:-70px;width:140px;max-width:none;height:72px;overflow:visible}
.ab-lamp__shade .cap{fill:var(--smoke)}
.ab-lamp__shade .shell{fill:var(--vault);stroke:var(--brass);stroke-width:1.5}
.ab-lamp__shade .rim{fill:var(--gold-hi)}
.ab-lamp__bulb{position:absolute;top:calc(var(--cord) + 56px);left:-17px;width:34px;height:34px;border-radius:50%;background:radial-gradient(circle,#fff8e4 0 22%,var(--gold-hi) 40%,rgba(243,212,138,0) 72%);box-shadow:0 0 50px 18px rgba(243,212,138,.28)}
.ab-lamp__cone{position:absolute;top:calc(var(--cord) + 64px);left:-460px;width:920px;height:820px;background:conic-gradient(from 161deg at 50% 0,transparent 0deg,rgba(243,212,138,.13) 6deg,rgba(243,212,138,.24) 19deg,rgba(243,212,138,.13) 32deg,transparent 38deg);-webkit-mask-image:linear-gradient(#000 0,rgba(0,0,0,.7) 55%,transparent 92%);mask-image:linear-gradient(#000 0,rgba(0,0,0,.7) 55%,transparent 92%)}
.ab-lamp__gc{position:absolute;left:50%;bottom:clamp(54px,7vw,84px);transform:translateX(-50%);display:grid;filter:drop-shadow(0 0 26px rgba(243,212,138,.32));font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(170px,19vw,290px);line-height:.8;letter-spacing:-.01em;white-space:nowrap}
.ab-lamp__gc>span{grid-area:1/1}
.ab-lamp__dark{color:transparent;-webkit-text-stroke:2px rgba(242,234,216,.34)}
.ab-lamp__lit{--x:50%;--y:50%;color:var(--gold-hi);-webkit-mask-image:radial-gradient(clamp(120px,13vw,190px) circle at var(--x) var(--y),#000 0 30%,transparent 100%);mask-image:radial-gradient(clamp(120px,13vw,190px) circle at var(--x) var(--y),#000 0 30%,transparent 100%)}
.ab-lamp__tag{position:absolute;left:0;right:0;bottom:clamp(14px,2.4vw,30px);text-align:center;font-family:var(--f-type);font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--ash)}
.ab-lamp__tag b{color:var(--gold);font-weight:400}
@media (max-width:900px){
  .ab-head__in{grid-template-columns:minmax(0,1fr)}
  .ab-lamp{--cord:34px;min-height:330px;margin-top:6px;border-top:1px solid var(--smoke);overflow:hidden}
  .ab-lamp__gc{font-size:clamp(130px,40vw,190px);bottom:52px}
}

/* ── The story ── */
.ab-story{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(36px,6vw,96px);align-items:start}
@media (max-width:900px){.ab-story{grid-template-columns:minmax(0,1fr)}}
.ab-story__lead{display:grid;gap:22px;min-width:0}
.ab-quote{margin:14px 0 0;display:grid;gap:18px;position:relative;padding-left:clamp(18px,2.4vw,28px);border-left:2px solid var(--gold)}
.ab-quote p{font-family:var(--f-serif);font-style:italic;font-weight:500;font-size:clamp(25px,2.6vw,35px);line-height:1.28;color:var(--paper);max-width:24ch;position:relative}
.ab-quote cite{font-style:normal;font-family:var(--f-type);font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
.ab-line{list-style:none;display:grid;gap:0;position:relative;padding-left:34px;min-width:0}
.ab-line::before{content:"";position:absolute;left:7px;top:10px;bottom:10px;width:1px;background:linear-gradient(var(--gold),var(--smoke) 85%)}
.ab-line li{position:relative;display:grid;gap:8px;padding:0 0 30px}
.ab-line li:last-child{padding-bottom:0}
.ab-line li::before{content:"";position:absolute;left:-33px;top:4px;width:13px;height:13px;border:1.5px solid var(--gold);background:var(--void);transform:rotate(45deg);transition:background .3s}
.ab-line li:hover::before{background:var(--gold)}
.ab-line h3{font-family:var(--f-display);font-weight:800;font-size:clamp(28px,2.6vw,36px);line-height:.95;text-transform:uppercase;letter-spacing:.01em}
.ab-line p{color:var(--ash);max-width:48ch}
.ab-trades{margin-top:clamp(64px,8vw,104px)}
.ab-trades__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
.ab-trade{background:var(--void);padding:26px 24px 24px;display:grid;gap:12px;align-content:start;grid-template-rows:auto 1fr auto;min-width:0;transition:background .3s}
.ab-trade:hover{background:var(--coal)}
.ab-trade h4{font-family:var(--f-display);font-weight:900;font-size:clamp(28px,2.4vw,34px);line-height:.92;text-transform:uppercase}
.ab-trade p{color:var(--ash);font-size:15.5px}
.ab-trade__links{display:flex;flex-wrap:wrap;gap:8px 18px;padding-top:6px}
.ab-trade__links .textlink{font-size:15px}
@media (max-width:980px){.ab-trades__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.ab-trades__grid{grid-template-columns:minmax(0,1fr)}}

/* ── The founder file (Level 4) ── */
.ab-file{scroll-margin-top:100px}
.ab-file [data-classified="founder"] .classified__body ul{list-style:none;padding-left:0;gap:0}
.ab-file [data-classified="founder"] .classified__body li{padding:8px 0;border-bottom:1px dashed rgba(23,20,15,.22)}
.ab-file [data-classified="founder"] .classified__body li strong{display:inline-block;min-width:10.5em;font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute);background:var(--paper);margin-left:-.08em;padding-left:.08em}
.js .ab-file .classified.is-locked .classified__body li strong{color:var(--ink-mute)}
.ab-file [data-classified="founder"] .classified__body a{color:var(--ink)}
.ab-file [data-classified="founder"] .classified__body li strong{margin-right:.7em}
@media (min-width:700px){.ab-file [data-classified="founder"] .classified__body li{padding-left:184px}.ab-file [data-classified="founder"] .classified__body li strong{margin-left:-184px;min-width:174px;margin-right:0;padding-left:0}}

/* ── The name (paper) ── */
.ab-name{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:clamp(36px,6vw,88px);align-items:start}
@media (max-width:900px){.ab-name{grid-template-columns:minmax(0,1fr)}}
.ab-name__lead{display:grid;gap:24px;min-width:0}
.ab-def{border-top:2px solid var(--ink);border-bottom:1px solid rgba(23,20,15,.25);padding:22px 0 24px;display:grid;gap:12px}
.ab-def__word{font-family:var(--f-serif);font-style:italic;font-weight:700;font-size:clamp(46px,5.4vw,74px);line-height:1;color:var(--ink)}
.ab-def__word i{font-family:var(--f-type);font-style:normal;font-weight:400;color:var(--brass);margin:0 .06em;font-size:.6em;vertical-align:.18em}
.ab-def__say{font-family:var(--f-type);font-size:14px;color:var(--ink-mute);letter-spacing:.04em}
.ab-def__say i{font-family:var(--f-serif);font-size:17px;margin-left:10px;color:var(--brass)}
.ab-def ol{padding-left:1.4em;display:grid;gap:8px;font-size:18px;color:var(--ink)}
.ab-def ol li::marker{font-family:var(--f-type);color:var(--brass)}
.ab-name__blackout{font-size:var(--t-lede);line-height:1.5;color:var(--ink);max-width:44ch}
.ab-terms{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:rgba(23,20,15,.18);border:1px solid rgba(23,20,15,.18)}
.ab-terms li{background:var(--paper);padding:26px 22px 24px;display:grid;gap:10px;align-content:start;min-width:0}
.ab-terms b{font-family:var(--f-display);font-weight:900;font-size:clamp(26px,2.4vw,32px);line-height:.95;text-transform:uppercase}
.ab-terms p{font-size:15.5px;color:var(--ink-mute)}
.ab-terms__n{font-family:var(--f-type);font-size:12px;letter-spacing:.16em;color:var(--brass)}
@media (max-width:560px){.ab-terms{grid-template-columns:minmax(0,1fr)}}

/* ── The rules ── */
.ab-rules{list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:clamp(28px,5vw,72px);border-top:1px solid var(--smoke);counter-reset:r}
.ab-rules li{counter-increment:r;display:grid;grid-template-columns:auto minmax(0,1fr);gap:22px;align-items:start;padding:28px 0 30px;border-bottom:1px solid var(--smoke);min-width:0}
.ab-rules li::before{content:counter(r,decimal-leading-zero);font-family:var(--f-display);font-weight:900;font-size:clamp(54px,5vw,72px);line-height:.8;color:transparent;-webkit-text-stroke:1.5px var(--gold);min-width:1.15em;transition:color .3s}
.ab-rules li:hover::before{color:var(--gold)}
.ab-rules h3{font-family:var(--f-display);font-weight:800;font-size:clamp(26px,2.4vw,32px);line-height:1;text-transform:uppercase;letter-spacing:.01em;margin-bottom:10px}
.ab-rules p{color:var(--ash);font-size:15.5px;max-width:48ch}
@media (max-width:820px){.ab-rules{grid-template-columns:minmax(0,1fr)}}
.ab-sign{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:flex-end;gap:6px 18px;margin-top:clamp(28px,4vw,44px)}
.ab-sign span{font-family:var(--f-type);font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ash)}
.ab-sign b{font-family:var(--f-serif);font-style:italic;font-weight:500;font-size:clamp(34px,4vw,50px);line-height:1;color:var(--gold);border-bottom:1px solid var(--brass);padding:0 6px 6px}

/* ── The territory ── */
.ab-turf{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(32px,5vw,72px);align-items:start}
@media (max-width:960px){.ab-turf{grid-template-columns:minmax(0,1fr)}}
.ab-turf__text{display:grid;gap:20px;align-content:start;min-width:0}
.ab-towns{list-style:none;display:grid;gap:8px;margin-top:6px}
.ab-towns button{width:100%;display:grid;grid-template-columns:auto minmax(0,1fr);gap:2px 16px;align-items:baseline;text-align:left;background:var(--coal);border:1px solid var(--smoke);padding:14px 16px;cursor:pointer;transition:border-color .2s,background .2s}
.ab-towns button:hover{border-color:var(--brass)}
.ab-towns button[aria-pressed="true"]{border-color:var(--gold);background:linear-gradient(110deg,#221b0e,var(--coal) 70%)}
.ab-towns b{font-family:var(--f-display);font-weight:900;font-size:26px;line-height:1;text-transform:uppercase;color:var(--paper);white-space:nowrap}
.ab-towns button[aria-pressed="true"] b{color:var(--gold-hi)}
.ab-towns small{font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);justify-self:end}
.ab-towns span{grid-column:1/-1;color:var(--ash);font-size:15px;line-height:1.5}
.no-js .ab-towns button{cursor:default}
.ab-map{margin:0;min-width:0;display:grid;gap:12px}
@media (min-width:961px){.ab-map{position:sticky;top:110px}}
.ab-map__box{position:relative;aspect-ratio:8/5;border:1px solid var(--smoke);background:radial-gradient(80% 90% at 26% 80%,rgba(217,178,95,.07),transparent 70%),var(--coal);overflow:hidden}
.ab-map__box::before,.ab-map__box::after{content:"";position:absolute;width:26px;height:26px;border-color:var(--gold);border-style:solid;pointer-events:none}
.ab-map__box::before{top:-1px;left:-1px;border-width:2px 0 0 2px}
.ab-map__box::after{bottom:-1px;right:-1px;border-width:0 2px 2px 0}
.ab-map__svg{display:block;width:100%;height:100%}
.ab-map__gridline{stroke:var(--smoke);stroke-width:1;opacity:.55}
.ab-map__state{stroke:var(--ash);stroke-width:1.5;stroke-dasharray:2 9;stroke-linecap:round;opacity:.5;fill:none}
.ab-map__state-t{font-family:var(--f-type);font-size:15px;letter-spacing:.3em;text-transform:uppercase;fill:var(--ash);opacity:.75}
.ab-map__river-body{fill:none;stroke:var(--gold);stroke-opacity:.09;stroke-width:22;stroke-linecap:round;stroke-linejoin:round}
.ab-map__river{fill:none;stroke:var(--gold);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px rgba(243,212,138,.55))}
.js .ab-map__river{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 2.6s var(--ease)}
.js .ab-map.is-drawn .ab-map__river{stroke-dashoffset:0}
@media (prefers-reduced-motion: reduce){.js .ab-map__river{stroke-dashoffset:0}}
.ab-map__river-t{font-family:var(--f-type);font-size:16px;letter-spacing:.2em;text-transform:uppercase;fill:var(--brass)}
.ab-pin__ring{fill:none;stroke:var(--gold);stroke-width:1.5;opacity:.35;transform-box:fill-box;transform-origin:center;transition:transform .5s var(--ease),opacity .4s,stroke .3s}
.ab-pin__dot{fill:var(--gold);stroke:var(--void);stroke-width:3;transition:fill .3s}
.ab-pin__t{font-family:var(--f-display);font-weight:900;font-size:36px;text-transform:uppercase;letter-spacing:.02em;fill:var(--paper);paint-order:stroke;stroke:var(--coal);stroke-width:6px;stroke-linejoin:round;transition:fill .3s}
.ab-pin.is-lit .ab-pin__ring{opacity:.9;transform:scale(1.5);stroke:var(--gold-hi)}
.ab-pin.is-lit .ab-pin__dot{fill:var(--gold-hi)}
.ab-pin.is-on .ab-pin__ring{opacity:1;transform:scale(2.1);stroke:var(--gold-hi)}
.ab-pin.is-on .ab-pin__dot{fill:var(--gold-hi)}
.ab-pin.is-on .ab-pin__t,.ab-pin.is-lit .ab-pin__t{fill:var(--gold-hi)}
.ab-map__beam{transition:opacity .5s}
.ab-map.is-home .ab-map__beam{opacity:.25}
.ab-map__compass circle{fill:none;stroke:var(--smoke);stroke-width:1.5}
.ab-map__compass path{fill:var(--ash);opacity:.5}
.ab-map__compass .ab-map__needle{fill:var(--gold);opacity:1}
.ab-map__compass text{font-family:var(--f-display);font-weight:900;font-size:22px;fill:var(--gold)}
.ab-map .hidden-mark{position:absolute;left:21.2%;top:85.2%;margin:-13px 0 0 -13px;z-index:2}
.ab-map figcaption{font-family:var(--f-type);font-size:12.5px;letter-spacing:.08em;color:var(--ash);display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 16px}

/* ── Graveshift ── */
.ab-gs{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(36px,6vw,88px);align-items:center;overflow-x:clip}
@media (max-width:900px){.ab-gs{grid-template-columns:minmax(0,1fr)}}
@media (max-width:400px){.ab-gs .btn{white-space:normal;text-align:center}}
.ab-gs__text{display:grid;gap:20px;min-width:0}
.ab-gs__text .lede strong{color:var(--paper)}
.ab-gs .btn .ico{width:22px;height:22px}
.ab-poster{position:relative;display:block;text-decoration:none;color:var(--paper);width:min(440px,calc(100% - 40px));justify-self:center;transform:rotate(1.6deg);transition:transform .45s var(--ease)}
.ab-poster:hover,.ab-poster:focus-visible{transform:rotate(0deg) translateY(-4px)}
.ab-poster__sheet{display:grid;gap:14px;justify-items:center;text-align:center;padding:30px 26px 28px;background:radial-gradient(120% 70% at 50% 0,rgba(229,72,77,.2),transparent 62%),var(--void);border:1.5px solid var(--signal);box-shadow:inset 0 0 0 6px var(--void),inset 0 0 0 7px rgba(229,72,77,.45),0 30px 60px -30px rgba(0,0,0,.9)}
.ab-poster__top{font-family:var(--f-type);font-size:12.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--signal)}
.ab-poster__name{font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(72px,8.5vw,112px);line-height:.78;letter-spacing:-.005em;color:var(--paper)}
.ab-poster__name i{display:block;font-style:normal;color:transparent;-webkit-text-stroke:1.5px var(--signal)}
.ab-poster__sub{font-family:var(--f-serif);font-style:italic;font-size:30px;line-height:1;color:var(--paper)}
.ab-poster__rule{width:70%;height:1px;background:linear-gradient(90deg,transparent,var(--signal),transparent)}
.ab-poster__mission{font-family:var(--f-display);font-weight:800;font-size:clamp(24px,2.4vw,30px);line-height:1;text-transform:uppercase;letter-spacing:.03em;max-width:14em}
.ab-poster__where{display:inline-flex;align-items:center;gap:10px;font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);border:1px solid var(--smoke);padding:8px 12px;transition:color .2s,border-color .2s}
.ab-poster:hover .ab-poster__where{color:var(--paper);border-color:var(--signal)}
.ab-poster__where .ico{width:18px;height:18px}
.ab-poster__stamp{position:absolute;right:-14px;top:-18px;width:104px;font-size:17px;background:var(--void)}
@media (max-width:560px){.ab-poster{transform:none;width:calc(100% - 12px)}.ab-poster__stamp{right:-6px;top:-22px;width:88px;font-size:15px}}

/* ── Close ── */
.ab-close{display:grid;gap:clamp(22px,3vw,34px);justify-items:start}
.ab-close h2{font-family:var(--f-display);font-weight:900;font-size:clamp(48px,11vw,170px);line-height:.84;text-transform:uppercase}
.ab-close p{font-size:var(--t-lede);max-width:52ch}
.ab-close .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.ab-close .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.ab-close .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.ab-close__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,4vw,48px);color:var(--void);text-decoration:none;line-height:1}
`;

const js = `
/* The lamp: swings on its own, swings toward the pointer, and lights the letters under its beam. */
(() => {
  const lamp = document.querySelector('[data-lamp]');
  if (!lamp) return;
  const head = lamp.closest('.ab-head'), rig = lamp.querySelector('[data-lamp-rig]'), lit = lamp.querySelector('[data-lamp-lit]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let a = reduce ? -7 : 6, v = 0, target = null, last = 0, visible = true, running = false;
  const t0 = performance.now(), G = {};
  const measure = () => { const lr = lamp.getBoundingClientRect(), r = lit.getBoundingClientRect(); G.px = lr.left + lr.width / 2; G.py = lr.top; G.lx = r.left; G.ly = r.top; G.lh = r.height; };
  const paint = () => {
    rig.style.setProperty('--a', a.toFixed(2) + 'deg');
    const rad = a * Math.PI / 180, yc = G.ly + G.lh * 0.5, t = (yc - G.py) / Math.cos(rad), x = G.px - t * Math.sin(rad);
    lit.style.setProperty('--x', (x - G.lx).toFixed(1) + 'px');
    lit.style.setProperty('--y', (yc - G.ly).toFixed(1) + 'px');
  };
  const tick = (now) => {
    if (!visible) { running = false; return; }
    const idle = target === null || now - last > 2600;
    const goal = idle ? 9 * Math.sin((now - t0) / 1000 * 0.85) : target;
    v += (goal - a) * 0.018; v *= 0.9; a += v;
    paint();
    requestAnimationFrame(tick);
  };
  const start = () => { if (!running && !reduce) { running = true; requestAnimationFrame(tick); } };
  measure(); paint();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); paint(); });
  addEventListener('resize', () => { measure(); paint(); });
  if (reduce) return;
  head.addEventListener('pointermove', (e) => {
    measure();
    const dx = e.clientX - G.px, dy = Math.max(80, e.clientY - G.py);
    target = Math.max(-30, Math.min(30, -Math.atan2(dx, dy) * 180 / Math.PI));
    last = performance.now();
  });
  head.addEventListener('pointerleave', () => { target = null; });
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) { measure(); start(); } }).observe(head);
  start();
})();

/* The territory: the river draws in, a beam sweeps out from home base, towns light up as it passes. */
(() => {
  const fig = document.querySelector('[data-map]');
  if (!fig) return;
  const beam = fig.querySelector('[data-beam]');
  const O = { x: 208, y: 392 };
  const T = { sb: { x: 208, y: 392 }, mi: { x: 372, y: 302 }, el: { x: 660, y: 222 } };
  const pins = {}; fig.querySelectorAll('[data-pin]').forEach((p) => (pins[p.dataset.pin] = p));
  const angOf = (k) => Math.atan2(T[k].y - O.y, T[k].x - O.x) * 180 / Math.PI;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const btns = [...document.querySelectorAll('[data-town]')];
  let lock = null, ang = -50, visible = false, running = false;
  const t0 = performance.now();
  const setBeam = (x) => {
    beam.setAttribute('transform', 'rotate(' + x.toFixed(2) + ' ' + O.x + ' ' + O.y + ')');
    ['mi', 'el'].forEach((k) => pins[k] && pins[k].classList.toggle('is-lit', lock !== 'sb' && Math.abs(x - angOf(k)) < 8));
  };
  const goal = () => (lock === null ? -44 + 47 * Math.sin((performance.now() - t0) / 1000 * 0.5) : lock === 'sb' ? -92 : angOf(lock));
  const tick = () => {
    if (!visible) { running = false; return; }
    ang += (goal() - ang) * (lock === null ? 1 : 0.08);
    setBeam(ang);
    requestAnimationFrame(tick);
  };
  const start = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
  const select = (k) => {
    lock = lock === k ? null : k;
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.town === lock)));
    Object.entries(pins).forEach(([pk, p]) => p.classList.toggle('is-on', pk === lock));
    fig.classList.toggle('is-home', lock === 'sb');
    if (reduce) { ang = goal(); setBeam(ang); }
  };
  btns.forEach((b) => b.addEventListener('click', () => select(b.dataset.town)));
  setBeam(ang);
  if (reduce) fig.classList.add('is-drawn');
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) { fig.classList.add('is-drawn'); if (!reduce) start(); }
  }, { threshold: 0.25 }).observe(fig);
})();
`;

export default {
  path: 'about.html',
  file: 'File 15',
  order: 40,
  navTitle: 'About',
  section: 'about',
  title: 'About the Syndicate',
  description: 'Meet Gregory Clark, the South Bend founder of Blackout Syndicate: ten years building with his hands, now building real reach for creators and local shops.',
  teaser: 'The man behind the Syndicate, the rules he runs by, and the ground he covers.',
  next: 'work.html',
  css, js,
  jsonld: (ctx, config) => ({
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Blackout Syndicate',
    url: config.siteUrl + '/about.html',
    mainEntity: {
      '@type': 'Person',
      name: BIZ.founder,
      alternateName: ['GC', 'Biz'],
      jobTitle: 'Founder',
      worksFor: { '@type': 'Organization', name: BIZ.name, parentOrganization: { '@type': 'Organization', name: BIZ.legal } },
      homeLocation: { '@type': 'City', name: `${BIZ.city}, ${BIZ.region}` },
    },
  }),
  body: (c) => `
<header class="pagehead ab-head">
  <div class="wrap ab-head__in">
    <div class="ab-head__main">
      ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'About' }])}
      <p class="label">File 15 · Personnel · <span class="ab-nw">${BIZ.city}, ${BIZ.regionLong}</span></p>
      <h1 class="h1 ab-head__title">Who runs <span class="whisper">the Syndicate.</span></h1>
      <p class="lede"><strong>Gregory Clark. Goes by GC.</strong> A South Bend guy who built things with his hands for ten years. Now he builds reach for creators, streamers, solo businesses and local shops.</p>
      <div class="ctas">
        ${c.btn('Read his story ' + c.arrow, '#story', 'lg')}
        ${c.btn('Make contact', 'contact.html', 'ghost lg')}
      </div>
      <p class="ab-head__tease"><span>His full case file is on this page.</span><a href="#file">It opens at Level 4: ${c.LEVELS[4].name}.</a></p>
    </div>
    <div class="ab-lamp" data-lamp aria-hidden="true">
      <span class="ab-lamp__mount"></span>
      <div class="ab-lamp__rig" data-lamp-rig>
        <span class="ab-lamp__cone"></span>
        <span class="ab-lamp__cord"></span>
        <svg class="ab-lamp__shade" viewBox="0 0 140 72" focusable="false"><path class="cap" d="M60 0h20l4 12H56Z"/><path class="shell" d="M56 12h28l46 50c2.5 3 .5 6-3.5 6h-115c-4 0-6-3-3.5-6Z"/><rect class="rim" x="12" y="64" width="116" height="3" rx="1.5"/></svg>
        <span class="ab-lamp__bulb"></span>
      </div>
      <div class="ab-lamp__gc"><span class="ab-lamp__dark">GC</span><span class="ab-lamp__lit" data-lamp-lit>GC</span></div>
      <p class="ab-lamp__tag">Subject · <b>${BIZ.founder}</b></p>
    </div>
  </div>
</header>

<section class="band" id="story" aria-labelledby="story-h">
  <div class="wrap">
    <div class="ab-story">
      <div class="ab-story__lead rv">
        <p class="label">The story</p>
        <h2 class="h2" id="story-h">Built with his hands. <span class="whisper">Now he builds reach.</span></h2>
        <blockquote class="ab-quote">
          <p>“I’m a South Bend guy who built things with my hands for ten years. Now I build reach. Every dollar you hand me is accounted for, and if I can’t help you, I’ll tell you straight.”</p>
          <cite>${BIZ.founder} · founder</cite>
        </blockquote>
      </div>
      <ol class="ab-line rv" style="--d:.1s">
        <li><p class="label">Then</p><h3>Ten years building</h3><p>Gregory Clark spent ten years building things with his hands. ${BIZ.name} is a ${BIZ.legal} company.</p></li>
        <li><p class="label">Now</p><h3>Building reach</h3><p>Real paid ads, content and AI setup for creators, streamers, solo businesses and local shops in ${AREA}.</p></li>
        <li><p class="label">Also</p><h3>Websites and AI setup</h3><p>A clean site for your ads to land on, and AI assistants and automations that take the repeat work off your plate. Each one is quoted in writing before work starts.</p></li>
        <li><p class="label label--red">The crew</p><h3>Running Graveshift Gaming</h3><p>GC’s gaming crew. It lives on Discord. <a class="textlink" href="#graveshift">Meet the crew ${c.arrow}</a></p></li>
      </ol>
    </div>

    <div class="ab-trades rv">
      <div class="drawer-label"><h3 class="h3">What GC takes on</h3><span class="label label--dim">One number for all of it · <span class="ab-nw">${BIZ.phone}</span></span></div>
      <div class="ab-trades__grid">
        ${TRADES.map((t) => `<div class="ab-trade"><h4>${t.t}</h4><p>${t.d}</p><div class="ab-trade__links">${t.links.map((l) => `<a class="textlink" href="${c.link(l.p)}">${l.t} ${c.arrow}</a>`).join('')}</div></div>`).join('')}
      </div>
    </div>
  </div>
</section>

<section class="band band--flush-top ab-file" id="file" aria-label="Founder case file">
  <div class="wrap wrap--narrow">
    ${c.classified({ id: 'founder', level: 4, title: `Case file: ${BIZ.founder}`, body: `
      <ul>${FILE_ROWS.map(([k, v]) => `<li><strong>${k}</strong> ${v}</li>`).join('')}</ul>
      <p>End of file. The rest you hear from him. Call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a>.</p>` })}
  </div>
</section>

<section class="band band--paper" aria-labelledby="name-h">
  <div class="wrap ab-name">
    <div class="ab-name__lead rv">
      <p class="label">The name</p>
      <h2 class="h2" id="name-h">What the Syndicate <span class="whisper">means for you.</span></h2>
      <div class="ab-def">
        <p class="ab-def__word">syn<i>·</i>di<i>·</i>cate</p>
        <p class="ab-def__say">/ˈsin-di-kət/ <i>noun</i></p>
        <ol>
          <li>A group that pools what it has to get one job done.</li>
          <li><strong>Ours:</strong> a crew that works for you.</li>
        </ol>
      </div>
      <p class="ab-name__blackout">Blackout is where most posts end up: posted, and never seen. The Syndicate is the crew that gets you out of it.</p>
    </div>
    <ul class="ab-terms rv" style="--d:.1s">
      ${TERMS.map((t, i) => `<li><span class="ab-terms__n">Term ${String(i + 1).padStart(2, '0')}</span><b>${t.t}</b><p>${t.d}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="band band--coal" aria-labelledby="rules-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">The code</p>
      <h2 class="h2" id="rules-h">The rules <span class="whisper">we run by.</span></h2>
      <p>Six lines we hold to on every job, from a ${bySlug.spark.price} ${bySlug.spark.name} to a monthly plan.</p>
    </div>
    <ol class="ab-rules rv">
      ${RULES.map((r) => `<li><div><h3>${r.t}</h3><p>${r.d}</p></div></li>`).join('')}
    </ol>
    <p class="ab-sign rv"><span>Signed</span><b>${BIZ.founder}</b></p>
  </div>
</section>

<section class="band" id="territory" aria-labelledby="turf-h">
  <div class="wrap ab-turf">
    <div class="ab-turf__text rv">
      <p class="label">The territory</p>
      <h2 class="h2" id="turf-h">Three towns. <span class="whisper">One river.</span></h2>
      <p class="lede">${AREA} all sit on the St. Joseph River. That’s our ground.</p>
      <p class="muted">We meet in person around here for AI setup and consulting. Ads and online work reach anywhere you want them aimed.</p>
      <ul class="ab-towns" aria-label="Towns on the map">
        ${TOWNS.map((t) => `<li><button type="button" data-town="${t.k}" aria-pressed="false"><b>${t.name}</b><small>${t.tag}</small><span>${t.note}</span></button></li>`).join('')}
      </ul>
    </div>
    <figure class="ab-map rv" data-map style="--d:.1s">
      <div class="ab-map__box">${MAP}${c.mark('m1')}</div>
      <figcaption><span>Drawn for style, not to scale.</span><span>West to east: ${BIZ.area.join(' · ')}</span></figcaption>
    </figure>
  </div>
</section>

<section class="band band--coal" id="graveshift" aria-labelledby="gs-h">
  <div class="wrap ab-gs">
    <div class="ab-gs__text rv">
      <p class="label label--red">The crew</p>
      <h2 class="h2" id="gs-h">Graveshift Gaming. <span class="whisper">GC’s crew.</span></h2>
      <p class="lede"><strong>The gaming crew lives on Discord.</strong> Its clips are on the Reel.</p>
      <p class="muted">The crew’s clips run on the same kind of system we build for streamers. That’s <a class="textlink" href="${c.link(offerPath(bySlug['creator-systems']))}">${bySlug['creator-systems'].name} ${c.arrow}</a></p>
      <div class="ctas">
        ${c.btn(c.icon('discord') + ' Join on Discord', DISCORD.url, 'lg')}
        ${c.btn('Watch the crew’s clips', 'work.html', 'ghost lg')}
      </div>
    </div>
    <a class="ab-poster rv" href="${DISCORD.url}" target="_blank" rel="noopener" style="--d:.1s">
      <span class="ab-poster__sheet">
        <span class="ab-poster__top">Join the crew</span>
        <span class="ab-poster__name">Grave<i>shift</i></span>
        <span class="ab-poster__sub">Gaming</span>
        <span class="ab-poster__rule"></span>
        <span class="ab-poster__mission">Find the crew on Discord</span>
        <span class="ab-poster__where">${c.icon('discord')} ${DISCORD.url.replace(/^https?:\/\//, '')}</span>
      </span>
      <span class="stamp ab-poster__stamp" aria-hidden="true">Open<br>call</span>
      <span class="sr">(opens Discord in a new tab)</span>
    </a>
  </div>
</section>

<section class="band band--gold" aria-labelledby="close-h">
  <div class="wrap ab-close">
    <p class="label">Your move</p>
    <h2 id="close-h">Now you know<br>who’s behind it.</h2>
    <p>See what the crew makes, or skip ahead and tell GC what you’re pushing. You get a straight answer either way.</p>
    <div class="ctas">${c.btn('Watch the Reel ' + c.arrow, 'work.html', 'lg')}${c.btn('Make contact', 'contact.html', 'ghost lg')}</div>
    <a class="ab-close__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
  </div>
</section>`,
};
