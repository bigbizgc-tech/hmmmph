// File 13: How it works. The full play: two paths, what we need, the recap, the hard lines, the feeds.
import { BIZ, PLATFORMS } from '../data/business.mjs';
import { BOOSTS, PLANS, offerPath } from '../data/offers.mjs';

// ── Facts pulled from the data (never hard-code a price) ──────────────────
const orList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]);
const andList = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const boostDays = BOOSTS.map((o) => (o.run.match(/\d+/) || [''])[0]);
const adMoney = (o) => (o.spend.match(/\$[\d,]+(?:\.\d+)?/) || [''])[0];
const SURGE = PLANS[0];
const ICON_KEY = { X: 'x', YouTube: 'youtube', TikTok: 'tiktok', Instagram: 'instagram', Facebook: 'facebook' };

const BP = BOOSTS[0].process; // Claim it, Point it, It goes live, Read the recap
const BOOST_STEPS = [
  BP[0],
  BP[1],
  { t: 'Aim it', d: 'At your area or the audience you name. Local shops usually aim by place, creators by the kind of viewer. You OK it before it runs.' },
  BP[2],
  BP[3],
];
const PLAN_STEPS = PLANS[0].process; // Intake call, First month built, It runs every month, Monthly recap

const NEED = [
  { v: 'reach', t: 'A way to reach you', d: 'Your name, plus a phone number or an email.', core: true },
  { v: 'link', t: 'What you’re pushing', d: 'The post, page, channel, website or booking line you want people to land on. A link is perfect.', core: true },
  { v: 'platform', t: 'The platform', d: `${orList(PLATFORMS.map((p) => p.name))}. Not sure? We’ll suggest one.`, core: true },
  { v: 'who', t: 'Who you want to reach', d: 'Your town or area, or the kind of viewer or customer you’re after.', core: true },
  { v: 'goal', t: 'One goal', d: 'More people seeing it, more clicks to a link, or more video views. Pick one.', core: true },
  { v: 'page', t: 'A page that’s ready', d: 'Your bio says what you do, where you are and what to do next. Ads send strangers there.', core: true },
  { v: 'date', t: 'Your date, if you have one', d: 'For an event or a launch, book at least a week ahead so the full run lands before it.' },
  { v: 'call', t: 'Twenty minutes, for a plan', d: 'Plans start with an intake call on what you sell, who buys it and where they scroll.' },
];
const CORE = NEED.filter((n) => n.core).length;

const GLOSS = [
  { t: 'Spend', tag: 'Every recap', d: `What the platform actually charged for the ad. It’s the part of your price that buys the ad itself: about ${andList([...BOOSTS.map((o) => `${adMoney(o)} on ${o.name}`), `${adMoney(SURGE)} a month on ${SURGE.name}`])}.` },
  { t: 'Reach', tag: 'Every recap', d: 'How many different people saw it at least once. Someone who saw it three times counts once.' },
  { t: 'Impressions', tag: 'Ad reports', d: 'How many times it was shown in total, repeats included. It’s always at least as big as reach.' },
  { t: 'Clicks', tag: 'Every recap · link goals', d: 'Taps that took someone where you pointed the ad: your page, your link, your site or your booking line.' },
  { t: 'Views', tag: 'Every recap · video goals', d: 'How many times your video was watched. Each platform sets its own rule for what counts as a view, so compare views on the same app.' },
  { t: 'Follows', tag: andList([...BOOSTS.slice(1).map((o) => o.name), 'plans']), d: 'People who hit follow while the run was live. Whether they do depends most on what they find when they land on your page.' },
];

const NEVER = [
  { t: 'Bots', d: 'No software pretending to be people. Your ad is shown by the platform itself, through its own ad tools.' },
  { t: 'Fake followers', d: 'No padded counts. A follower who doesn’t exist can’t watch, book or buy.' },
  { t: 'Engagement pods', d: 'No groups trading likes and comments to game the feed. It looks busy and brings you nobody new.' },
  { t: 'Buying followers', d: 'Not at any price. New people find you because a real ad put you in front of them.' },
  { t: 'Running without your OK', d: 'You see what runs under your name before it runs. Nothing goes out that you haven’t seen.' },
  { t: 'Promising numbers', d: BIZ.resultsNote },
];

// Reach vs impressions illustration: times each person saw the ad.
const SEEN = [1, 2, 1, 3, 2, 1, 2, 2];
const REACH = SEEN.length;
const IMPS = SEEN.reduce((a, b) => a + b, 0);
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const PERSON = '<svg viewBox="0 0 40 48" aria-hidden="true" focusable="false"><circle cx="20" cy="13" r="9" fill="currentColor"/><path d="M3 47c0-10.5 7.6-17 17-17s17 6.5 17 17Z" fill="currentColor"/></svg>';

const css = `
/* ── Head ── */
.hw-head__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:clamp(28px,5vw,72px);align-items:end}
@media (max-width:960px){.hw-head__grid{grid-template-columns:1fr;align-items:start}}
.hw-head__main{display:grid;gap:22px;min-width:0}
.hw-title .whisper{display:block;font-size:clamp(24px,3.2vw,44px);line-height:1.05;margin-top:.4em}
.hw-index{background:var(--coal);border:1px solid var(--smoke);padding:22px 20px 14px;display:grid;gap:10px;position:relative;min-width:0;max-width:460px}
.hw-index::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.hw-index ol{list-style:none;display:grid}
.hw-index a{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;align-items:baseline;padding:11px 0;border-bottom:1px solid var(--smoke);text-decoration:none;color:var(--paper);font-size:15.5px;transition:color .2s}
.hw-index li:last-child a{border-bottom:0}
.hw-index a:hover{color:var(--gold-hi)}
.hw-index a>span:first-child{font-family:var(--f-type);font-size:12.5px;color:var(--brass)}
.hw-index a>span:last-child{font-family:var(--f-type);font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);white-space:nowrap}
.hw-index .is-locked{color:var(--signal)}
.hw-index .is-unlocked{color:var(--gold)}

/* ── The two paths ── */
.paths{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(16px,2.4vw,28px);align-items:stretch}
@media (max-width:900px){.paths{grid-template-columns:1fr}}
.path{--bg:var(--coal);background:var(--bg);border:1px solid var(--smoke);padding:clamp(22px,3vw,36px);display:grid;grid-template-rows:auto auto 1fr;align-content:start;gap:28px;min-width:0;position:relative}
.path--plan{border-color:var(--brass);background:linear-gradient(170deg,#1d170c 0%,var(--coal) 46%)}
.path--plan::before{content:"";position:absolute;inset:-1px -1px auto auto;width:36px;height:36px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.path__head{display:grid;gap:12px}
.path__name{font-family:var(--f-display);font-weight:900;font-size:clamp(44px,5vw,68px);line-height:.86;text-transform:uppercase}
.path__meta{display:flex;flex-wrap:wrap;gap:6px 16px;font-family:var(--f-type);font-size:13px;letter-spacing:.06em;color:var(--ash)}
.path__meta a{color:var(--paper);text-decoration:none;border-bottom:1px solid var(--brass)}
.path__meta a:hover{color:var(--gold-hi);border-color:var(--gold)}
.path__meta b{color:var(--gold);font-weight:400}

.track{list-style:none;position:relative;display:grid;--fill:1}
.track::before,.track::after{content:"";position:absolute;left:21px;top:22px;width:2px;margin-left:-1px}
.track::before{bottom:0;background:var(--smoke)}
.track::after{height:calc((100% - 22px) * var(--fill));background:linear-gradient(var(--gold-hi),var(--gold));box-shadow:0 0 14px rgba(243,212,138,.45)}
.track>li{position:relative;display:grid;grid-template-columns:42px minmax(0,1fr);column-gap:18px}
.track__n{position:relative;z-index:1;width:42px;height:42px;display:grid;place-items:center;border:1.5px solid var(--gold);background:var(--bg);font-family:var(--f-display);font-weight:900;font-size:19px;color:var(--gold);transition:background .45s,color .45s,box-shadow .45s}
.track>li.is-lit .track__n{background:var(--gold);color:var(--void);box-shadow:0 0 22px rgba(243,212,138,.45)}
.track__body{display:grid;gap:6px;padding:8px 0 30px;min-width:0;position:relative}
.track h4{font-family:var(--f-display);font-weight:800;font-size:clamp(25px,2.4vw,30px);line-height:1;text-transform:uppercase;letter-spacing:.02em}
.track p{color:var(--ash);font-size:15.5px;max-width:46ch}
/* the monthly loop: steps 03 and 04 are bracketed and repeat */
.track>li.is-loop .track__body{border-right:1.5px dashed var(--brass);padding-right:20px;padding-left:16px;background:rgba(217,178,95,.035)}
.track>li.is-loop--first .track__body{border-top:1.5px dashed var(--brass);border-top-right-radius:20px;padding-top:24px}
.track>li.is-loop--first .track__n{margin-top:16px}
.track>li.is-loop--last .track__body{border-bottom:1.5px dashed var(--brass);border-bottom-right-radius:20px;padding-bottom:22px}
.track>li.is-loop--first .track__body::before{content:"";position:absolute;top:-7px;left:-1px;border:6px solid transparent;border-right:9px solid var(--gold);border-left:0}
.loop-tag{position:absolute;top:-10px;right:24px;background:var(--coal);padding:0 8px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);line-height:18px;display:inline-flex;gap:7px;align-items:center}
.loop-tag svg{width:14px;height:14px;animation:spin 6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

.path__end{align-self:end;display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--smoke);background:var(--void);font-size:15px;color:var(--ash);flex-wrap:wrap}
.path__end b{color:var(--paper);font-weight:600}
.path__end>span:nth-child(2){flex:1 1 220px;min-width:0}
.path__stop{width:14px;height:14px;background:var(--gold);flex:none}
.path__end--loop{border-color:var(--brass);border-style:dashed}
.path__end--loop svg{width:22px;height:22px;color:var(--gold);flex:none}

/* ── Difference table ── */
.diff{margin-top:clamp(40px,5vw,64px);display:grid;gap:20px}
.diff__t{width:100%;border-collapse:collapse;font-size:15.5px}
.diff__t th,.diff__t td{text-align:left;vertical-align:top;padding:16px 18px;border-bottom:1px solid var(--smoke)}
.diff__t thead th{font-family:var(--f-display);font-weight:900;font-size:28px;text-transform:uppercase;line-height:1;color:var(--gold);border-bottom:2px solid var(--gold);padding-top:0}
.diff__t tbody th{font-family:var(--f-type);font-weight:400;font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);width:22%}
.diff__t td{color:var(--paper);width:39%}
.diff__t tr:hover td{background:rgba(217,178,95,.04)}
.diff__t .diff__fine td{font-size:14.5px;color:var(--ash)}
@media (max-width:700px){
  .diff__t thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  .diff__t,.diff__t tbody{display:block}
  .diff__t tr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 16px;padding:16px 0;border-bottom:1px solid var(--smoke)}
  .diff__t th,.diff__t td,.diff__t tbody th{display:block;width:auto;padding:0;border:0}
  .diff__t tbody th{grid-column:1/-1;margin-bottom:6px}
  .diff__t td::before{content:attr(data-h);display:block;font-family:var(--f-display);font-weight:800;font-size:18px;text-transform:uppercase;color:var(--gold);margin-bottom:2px}
}

/* ── What we need ── */
.need{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(32px,6vw,88px);align-items:start}
.need__side{display:grid;gap:22px;position:sticky;top:110px;min-width:0}
@media (max-width:900px){.need{grid-template-columns:1fr}.need__side{position:static;display:contents}.need__intro{order:1}.need__list{order:2}.need__card{order:3}}
.need__intro{display:grid;gap:20px;min-width:0}
.need__list{border:0;margin:0;padding:0;min-width:0}
.need__list legend{padding:0;margin-bottom:14px}
.need__group{display:grid}
.need__group + .need__group{margin-top:28px}
.need__item{position:relative;display:grid;grid-template-columns:30px minmax(0,1fr);gap:16px;align-items:start;padding:18px 4px;border-top:1px solid var(--smoke);cursor:pointer;transition:background .25s}
.need__item:last-child{border-bottom:1px solid var(--smoke)}
.need__item:hover{background:rgba(217,178,95,.04)}
.need__item input{position:absolute;opacity:0;left:4px;top:18px;width:30px;height:30px;margin:0;cursor:pointer}
.need__box{width:30px;height:30px;border:1.5px solid var(--brass);display:grid;place-items:center;transition:background .25s,border-color .25s}
.need__box::after{content:"";width:12px;height:7px;border-left:2.5px solid var(--void);border-bottom:2.5px solid var(--void);margin-top:-3px;transform:rotate(-45deg) scale(0);transition:transform .3s var(--ease)}
.need__item input:checked + .need__box{background:var(--gold);border-color:var(--gold)}
.need__item input:checked + .need__box::after{transform:rotate(-45deg) scale(1)}
.need__item input:focus-visible + .need__box{outline:2px solid var(--gold-hi);outline-offset:3px}
.need__txt{display:grid;gap:4px;min-width:0}
.need__txt b{font-family:var(--f-display);font-weight:800;font-size:25px;line-height:1.05;text-transform:uppercase;letter-spacing:.02em;transition:color .25s}
.need__txt span{color:var(--ash);font-size:15.5px}
.need__item input:checked ~ .need__txt b{color:var(--gold)}
.need__card{position:relative;background:var(--void);border:1px solid var(--smoke);padding:clamp(22px,3vw,30px);display:grid;gap:14px;min-width:0;transition:border-color .4s}
.need__count{display:flex;align-items:baseline;gap:10px;font-family:var(--f-type);font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash)}
.need__count b{font-family:var(--f-display);font-weight:900;font-size:64px;line-height:.8;letter-spacing:0;color:var(--gold)}
.need__live{display:grid;gap:14px}
.need__live[hidden]{display:none}
.need__msg{color:var(--paper);min-height:3em;max-width:34ch}
.need__card .stamp{position:absolute;right:-12px;top:-40px;width:108px;font-size:21px;box-shadow:inset 0 0 0 5px var(--coal),inset 0 0 0 6.5px var(--gold);background:var(--coal);opacity:0;transform:rotate(-13deg) scale(.6);transition:opacity .35s,transform .45s cubic-bezier(.2,1.6,.4,1);pointer-events:none}
@media (max-width:600px){.need__card .stamp{right:6px;top:-46px;width:96px;font-size:19px}}
.need__card.is-ready{border-color:var(--gold)}
.need__card.is-ready .stamp{opacity:1;transform:rotate(-13deg) scale(1)}
.need__fine{font-size:14px;color:var(--ash)}
.need__fine a{color:var(--gold)}

/* ── The recap (paper) ── */
@media (max-width:600px){.recap-h .whisper{display:block;margin-top:.12em}}
.recap{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(32px,5vw,72px);align-items:start}
@media (max-width:960px){.recap{grid-template-columns:1fr}}
.gloss{margin:0;display:grid;border-top:2px solid var(--ink)}
.gloss>div{display:grid;grid-template-columns:minmax(0,200px) minmax(0,1fr);gap:8px 28px;padding:20px 0;border-bottom:1px solid rgba(23,20,15,.18)}
.gloss dt{display:grid;gap:8px;align-content:start;font-family:var(--f-display);font-weight:900;font-size:clamp(32px,3vw,42px);line-height:.88;text-transform:uppercase;color:var(--ink)}
.gloss dt small{font-family:var(--f-type);font-weight:400;font-size:11.5px;letter-spacing:.14em;line-height:1.35;color:var(--brass)}
.gloss dd{margin:0;color:var(--ink);font-size:16.5px;line-height:1.55}
@media (max-width:560px){.gloss>div{grid-template-columns:1fr}}
.ri{margin:0;border:1.5px solid var(--ink);padding:clamp(20px,3vw,28px);display:grid;gap:20px;background:var(--paper);box-shadow:10px 10px 0 rgba(23,20,15,.12);position:sticky;top:110px}
@media (max-width:960px){.ri{position:static}}
.ri__top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px}
.ri__toggle{display:inline-flex;border:1.5px solid var(--ink)}
.ri__toggle button{background:none;border:0;padding:9px 13px;font-family:var(--f-type);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink);cursor:pointer}
.ri__toggle button[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
.no-js .ri__toggle{display:none}
.ri__crowd{display:grid;grid-template-columns:repeat(${SEEN.length},minmax(0,1fr));gap:clamp(6px,1.2vw,12px);align-items:end;padding:8px 0 14px;border-bottom:1px dashed rgba(23,20,15,.3)}
.ri__p{display:grid;gap:8px;justify-items:center;color:var(--ink);transition:color .4s,opacity .4s}
.ri__p svg{width:100%;max-width:40px;height:auto}
.ri__ticks{display:flex;gap:3px;min-height:22px;align-items:end;flex-wrap:wrap;justify-content:center}
.ri__ticks i{display:block;width:6px;height:18px;background:var(--signal);transform-origin:bottom;transition:opacity .4s,transform .4s var(--ease)}
.ri__nums{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ri__num{display:grid;gap:4px;transition:opacity .4s}
.ri__num b{font-family:var(--f-display);font-weight:900;font-size:clamp(56px,6vw,80px);line-height:.8}
.ri__num--imp b{color:var(--signal)}
.ri__num span{font-family:var(--f-type);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute)}
.ri figcaption{font-size:15px;color:var(--ink-mute)}
.ri[data-mode="reach"] .ri__ticks i{opacity:.18;transform:scaleY(.5)}
.ri[data-mode="reach"] .ri__num--imp{opacity:.3}
.ri[data-mode="imp"] .ri__p svg{opacity:.22}
.ri[data-mode="imp"] .ri__num--reach{opacity:.3}
.recap__read{margin-top:clamp(36px,5vw,56px);display:grid;grid-template-columns:auto minmax(0,1fr);gap:18px;align-items:start;padding:22px 24px;border:1.5px dashed var(--brass);max-width:900px}
.recap__read p:not(.label){color:var(--ink);font-size:17px}
.recap__read strong{color:var(--ink)}
.recap__read .label{padding-top:4px}
@media (max-width:560px){.recap__read{grid-template-columns:1fr;gap:8px}}

/* ── What we never do ── */
.never{list-style:none;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
@media (max-width:980px){.never{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:600px){.never{grid-template-columns:1fr}}
.never>li{background:var(--void);padding:clamp(24px,3vw,36px);display:grid;gap:14px;align-content:start;min-width:0}
.never h3{font-family:var(--f-display);font-weight:900;font-size:clamp(40px,4.2vw,58px);line-height:.92;text-transform:uppercase;color:var(--paper)}
.never h3{transition:color .6s .35s}
.never .nv{position:relative;display:inline-block}
.never .nv::after{content:"";position:absolute;left:-.05em;right:-.05em;bottom:.44em;height:.11em;background:var(--signal);box-shadow:0 0 10px rgba(229,72,77,.35);transform-origin:left center;transition:transform .32s var(--snap) calc(var(--i,0) * .14s)}
.never .nv:not(:last-child)::after{right:-.3em}
.js .never>li:not(.is-struck) .nv::after{transform:scaleX(0)}
.never>li.is-struck h3{color:var(--ash)}
.never p{color:var(--ash);font-size:15.5px;max-width:40ch}
.never__foot{margin-top:24px;color:var(--ash);font-size:15px;max-width:70ch}

/* ── Where we push ── */
.feeds{list-style:none;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
.feed{position:relative;overflow:hidden;isolation:isolate;background:var(--void);padding:28px 22px 24px;display:grid;gap:14px;align-content:start;min-width:0}
.feed::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(240px circle at 24% 0%,rgba(217,178,95,.2),transparent 70%);opacity:0;transition:opacity .35s}
.feed:hover::before{opacity:1}
.feed .ico{width:34px;height:34px;color:var(--gold);transition:transform .4s var(--ease)}
.feed:hover .ico{transform:rotate(-8deg) scale(1.1)}
.feed b{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,3.2vw,46px);line-height:.9;text-transform:uppercase;overflow-wrap:anywhere}
.feed span{font-family:var(--f-type);font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash)}
.feed--new span{color:var(--signal)}
.feed--new::after{content:"";position:absolute;top:16px;right:16px;width:8px;height:8px;border-radius:50%;background:var(--signal);box-shadow:0 0 0 0 rgba(229,72,77,.6);animation:ping 2.2s infinite}
@keyframes ping{70%{box-shadow:0 0 0 12px rgba(229,72,77,0)}100%{box-shadow:0 0 0 0 rgba(229,72,77,0)}}
@media (max-width:900px){.feeds{grid-template-columns:repeat(2,minmax(0,1fr))}.feed--new{grid-column:1/-1}}
@media (max-width:600px){.feeds{grid-template-columns:1fr}.feed{grid-template-columns:34px minmax(0,1fr);gap:2px 18px;align-items:center;padding:18px 18px}.feed .ico{grid-row:span 2}.feed b{font-size:34px}.feed--new::after{top:50%;margin-top:-4px;right:20px}}
.feeds__foot{margin-top:22px;color:var(--ash);font-size:15.5px;max-width:70ch}

/* ── Close (gold) ── */
.hw-close{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(32px,6vw,90px);align-items:end}
@media (max-width:900px){.hw-close{grid-template-columns:1fr;align-items:start}}
.hw-close__main{display:grid;gap:clamp(22px,3vw,32px);justify-items:start;min-width:0}
.hw-close h2{font-family:var(--f-display);font-weight:900;font-size:clamp(64px,9.6vw,150px);line-height:.8;text-transform:uppercase}
.hw-close p{font-size:var(--t-lede);max-width:50ch}
.hw-close .btn{--bg:var(--void);--fg:var(--gold);--bd:var(--void)}
.hw-close .btn--ghost{--bg:transparent;--fg:var(--void);--bd:var(--void)}
.hw-close .btn--ghost:hover{--bg:var(--void);--fg:var(--gold)}
.hw-close__phone{font-family:var(--f-display);font-weight:900;font-size:clamp(30px,3.6vw,44px);color:var(--void);text-decoration:none;line-height:1}
.doors{display:grid;gap:12px;min-width:0}
.door{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;align-items:end;padding:22px 24px;background:var(--void);color:var(--paper);text-decoration:none;border:1.5px solid var(--void);transition:transform .25s var(--ease),background .25s}
.door:hover{transform:translateX(6px);background:#141109}
.door .label{grid-column:1/-1}
.door b{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,3.6vw,48px);line-height:.88;text-transform:uppercase;color:var(--gold-hi)}
.door span.door__go{display:inline-flex;align-items:center;gap:8px;font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);white-space:nowrap}
.door .arw{width:16px;height:16px;transition:transform .25s var(--ease)}
.door:hover .arw{transform:translateX(4px)}
.door small{grid-column:1/-1;color:var(--ash);font-size:14.5px}
`;

const js = `
/* Tracks fill with light as you read down them */
(() => {
  const tracks = [...document.querySelectorAll('[data-track]')];
  if (!tracks.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lightAll = () => tracks.forEach((t) => { t.style.setProperty('--fill', 1); [...t.children].forEach((li) => li.classList.add('is-lit')); });
  if (reduce || !window.requestAnimationFrame) return lightAll();
  let raf = 0;
  const update = () => {
    raf = 0;
    const line = innerHeight * 0.62;
    tracks.forEach((t) => {
      const r = t.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top - 22) / Math.max(1, r.height - 22)));
      t.style.setProperty('--fill', p.toFixed(3));
      [...t.children].forEach((li) => { const n = li.querySelector('.track__n').getBoundingClientRect(); li.classList.toggle('is-lit', n.top + n.height / 2 <= line); });
    });
  };
  const req = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
})();

/* What we need: a checklist that remembers itself in this browser */
(() => {
  const list = document.querySelector('[data-need]');
  if (!list) return;
  const boxes = [...list.querySelectorAll('input[type="checkbox"]')];
  const core = boxes.filter((b) => b.hasAttribute('data-core'));
  const card = document.querySelector('[data-need-card]');
  const live = document.querySelector('[data-need-live]');
  const n = document.querySelector('[data-need-n]');
  const bar = document.querySelector('[data-need-bar]');
  const msg = document.querySelector('[data-need-msg]');
  const KEY = 'bs2.need.v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { saved = {}; }
  boxes.forEach((b) => { if (saved[b.value]) b.checked = true; });
  if (live) live.hidden = false;
  let was = null;
  const paint = (byUser) => {
    const k = core.filter((b) => b.checked).length, done = k === core.length;
    if (n) n.textContent = k;
    if (bar) bar.style.setProperty('--p', Math.round((k / core.length) * 100) + '%');
    if (msg) msg.textContent = done ? 'File ready. Bring it to us and the first conversation takes minutes.' : k === 0 ? 'Tick each one as you get it ready. Missing a few? Ask anyway.' : (core.length - k) + ' to go. Missing one is fine. Sorting it out is part of the job.';
    if (card) card.classList.toggle('is-ready', done);
    if (done && byUser && was === false && window.BS) window.BS.toast('Your file is ready. Bring it to us.', 'What we need');
    was = done;
  };
  list.addEventListener('change', () => {
    const s = {}; boxes.forEach((b) => { if (b.checked) s[b.value] = 1; });
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ }
    paint(true);
  });
  paint(false);
})();

/* Reach vs impressions */
(() => {
  const fig = document.querySelector('[data-ri]');
  if (!fig) return;
  const btns = [...fig.querySelectorAll('[data-ri-mode]')];
  const set = (m) => { fig.dataset.mode = m; btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.riMode === m))); };
  btns.forEach((b) => b.addEventListener('click', () => set(b.dataset.riMode)));
  set('reach');
})();

/* What we never do: struck from the record as it comes into view */
(() => {
  const items = [...document.querySelectorAll('[data-never] > li')];
  if (!items.length) return;
  const strike = (li) => li.classList.add('is-struck');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return items.forEach(strike);
  const io = new IntersectionObserver((ens) => ens.forEach((en) => {
    if (!en.isIntersecting) return;
    const i = items.indexOf(en.target);
    setTimeout(() => strike(en.target), 120 + (i % 3) * 160);
    io.unobserve(en.target);
  }), { rootMargin: '0px 0px -18% 0px' });
  items.forEach((li) => io.observe(li));
})();

/* Index: show whether the classified file is already open for this visitor */
(() => {
  const el = document.querySelector('[data-aim-state]');
  if (!el) return;
  const go = () => { try { const open = window.BS.level().lv >= 3; el.textContent = open ? 'Opened' : 'Clearance 3'; el.className = open ? 'is-unlocked' : 'is-locked'; } catch (e) { /* engine missing */ } };
  const watch = () => {
    go();
    /* Clearance can rise while you're on this page (opening and reading it both count), so keep the index in step */
    document.addEventListener('bs:change', go);
    const hud = document.querySelector('[data-hud-lv]');
    if (hud && window.MutationObserver) new MutationObserver(go).observe(hud, { childList: true, characterData: true, subtree: true });
  };
  if (window.BS) watch(); else document.addEventListener('bs:ready', watch, { once: true });
})();
`;

export default {
  path: 'how-it-works.html',
  file: 'File 13',
  order: 30,
  navTitle: 'How it works',
  section: 'how',
  title: 'How it works',
  description: 'How a Blackout Syndicate push works: the boost path and the plan path step by step, what we need from you, what the recap means, and what we never do.',
  teaser: 'Every step from claim to recap, and the lines we never cross.',
  next: 'packages/surge.html',
  css,
  js,
  jsonld: (ctx, config) => ({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How a Blackout Syndicate boost works',
    description: 'A one-time paid push on one platform, from claim to recap.',
    url: config.siteUrl + '/how-it-works.html',
    step: BOOST_STEPS.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.t, text: s.d })),
  }),
  body: (c) => {
    const step = (s, i, extra = '') => `<li${extra}><span class="track__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div class="track__body"><h4><span class="sr">Step ${i + 1}: </span>${s.t}</h4><p>${s.d}</p></div></li>`;
    const loopIcon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/></svg>';
    const nameLinks = (arr) => arr.map((o) => `<a href="${c.link(c.offerPath(o))}">${o.name}</a>`).join(' · ');
    const oneMonth = PLANS.filter((o) => o.oneMonth);
    const launch = PLANS.filter((o) => o.regular).map((o) => o.name);
    return `
<header class="pagehead">
  <div class="wrap pagehead__in hw-head__grid">
    <div class="hw-head__main">
      ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'How it works' }])}
      <p class="label">File 13 · The play, in full</p>
      <h1 class="h1 hw-title">How it<br>works<span class="whisper">Every step, start to finish.</span></h1>
      <p class="lede">Two ways in: a <strong>one-time boost</strong> or a <strong>monthly plan</strong>. Here is every step of both, what we need from you, what you get back, and the lines we never cross.</p>
      <div class="ctas">
        ${c.btn('See the two paths ' + c.arrow, '#paths', 'lg')}
        ${c.btn('Find my package', 'packages.html#match', 'ghost lg')}
      </div>
    </div>
    <nav class="hw-index" aria-label="In this file">
      <p class="label">In this file</p>
      <ol>
        <li><a href="#paths"><span>01</span><span>The two paths</span><span>Boost or plan</span></a></li>
        <li><a href="#need"><span>02</span><span>What we need from you</span><span>Checklist</span></a></li>
        <li><a href="#recap"><span>03</span><span>What you get back</span><span>Glossary</span></a></li>
        <li><a href="#never"><span>04</span><span>What we never do</span><span>${NEVER.length} lines</span></a></li>
        <li><a href="#where"><span>05</span><span>Where we push</span><span>${PLATFORMS.length} feeds</span></a></li>
        <li><a href="#aimed"><span>06</span><span>How a push is aimed</span><span data-aim-state class="is-locked">Clearance 3</span></a></li>
      </ol>
    </nav>
  </div>
</header>

<section class="band" id="paths" aria-labelledby="paths-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">01 · The two paths</p>
      <h2 class="h2" id="paths-h">One push, <span class="whisper">or every month.</span></h2>
      <p>A boost is one push with a start and an end. A plan keeps the push running month after month. Same real ads, different rhythm.</p>
    </div>
    <div class="paths">
      <article class="path rv" aria-labelledby="pb-h">
        <header class="path__head">
          <p class="label">One-time · No contract</p>
          <h3 class="path__name" id="pb-h">The boost path</h3>
          <p class="path__meta"><span>${nameLinks(BOOSTS)}</span><span>From <b>${BOOSTS[0].price}</b></span><span>${orList(boostDays)} days</span></p>
        </header>
        <ol class="track" data-track>
          ${BOOST_STEPS.map((s, i) => step(s, i)).join('')}
        </ol>
        <p class="path__end"><span class="path__stop" aria-hidden="true"></span><span><b>Run ends.</b> Recap in hand, you decide: go again, go bigger, or stop. Nothing renews on its own.</span>${c.mark('m2')}</p>
      </article>
      <article class="path path--plan rv" style="--d:.1s;--bg:var(--coal)" aria-labelledby="pp-h">
        <header class="path__head">
          <p class="label">Monthly · Stay or walk</p>
          <h3 class="path__name" id="pp-h">The plan path</h3>
          <p class="path__meta"><span>${nameLinks(PLANS)}</span><span>From <b>${PLANS[0].price}${PLANS[0].suffix}</b></span></p>
        </header>
        <ol class="track" data-track>
          ${PLAN_STEPS.map((s, i) => step(s, i, i === 2 ? ' class="is-loop is-loop--first"' : i === 3 ? ' class="is-loop is-loop--last"' : '')).join('').replace('<div class="track__body"><h4><span class="sr">Step 3: </span>', `<div class="track__body"><span class="loop-tag" aria-hidden="true">${loopIcon}Repeats monthly</span><h4><span class="sr">Step 3: </span>`)}
        </ol>
        <p class="path__end path__end--loop">${loopIcon}<span><b>Then it repeats.</b> Steps 03 and 04 run every month, without restarting from zero, until you stop.</span></p>
      </article>
    </div>

    <div class="diff rv">
      <h3 class="h3">The difference, line by line</h3>
      <table class="diff__t">
        <caption class="sr">The boost path compared with the plan path</caption>
        <thead><tr><th scope="col"><span class="sr">Question</span></th><th scope="col">Boost</th><th scope="col">Plan</th></tr></thead>
        <tbody>
          <tr><th scope="row">You pay</th><td data-h="Boost">Once. ${andList(BOOSTS.map((o) => `${o.name} ${o.price}`))}.</td><td data-h="Plan">Every month. ${andList(PLANS.map((o) => `${o.name} ${o.price}`))}.${launch.length ? ` ${andList(launch)} are at launch prices.` : ''}</td></tr>
          <tr><th scope="row">Commitment</th><td data-h="Boost">None.</td><td data-h="Plan">Month to month. Or one month only, no commitment: ${andList(oneMonth.map((o) => `${o.name} ${o.oneMonth}`))}.</td></tr>
          <tr><th scope="row">How long it runs</th><td data-h="Boost">${orList(boostDays)} days. Shorter bursts on TikTok.</td><td data-h="Plan">Every month until you stop.</td></tr>
          <tr><th scope="row">Platforms</th><td data-h="Boost">One per boost, your pick.</td><td data-h="Plan">Picked with you on the intake call.</td></tr>
          <tr><th scope="row">It starts with</th><td data-h="Boost">The form or a call.</td><td data-h="Plan">A twenty-minute intake call.</td></tr>
          <tr><th scope="row">Recaps</th><td data-h="Boost">One, when the run ends.</td><td data-h="Plan">One every month.</td></tr>
          <tr><th scope="row">Built for</th><td data-h="Boost">A moment: a post, a drop, a launch, an event.</td><td data-h="Plan">Staying in front of your people all year.</td></tr>
          <tr class="diff__fine"><th scope="row">If you change your mind</th><td data-h="Boost">${c.POLICY.boosts}</td><td data-h="Plan">${c.POLICY.plans}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="band band--coal" id="need" aria-labelledby="need-h">
  <div class="wrap need">
    <div class="need__side">
      <div class="need__intro rv">
        <p class="label">02 · What we need from you</p>
        <h2 class="h2" id="need-h">What we need <span class="whisper">from you.</span></h2>
        <p class="muted">Have these ready and the first conversation takes minutes. Tick them off as you go. Missing one? Ask anyway. Sorting it out is part of the job.</p>
      </div>
      <div class="need__card rv" data-need-card>
        <span class="stamp stamp--gold" aria-hidden="true">Ready<small>File complete</small></span>
        <div class="need__live" data-need-live hidden>
          <p class="need__count"><b data-need-n>0</b><span>of ${CORE} ready</span></p>
          <div class="meter" aria-hidden="true"><i data-need-bar></i></div>
          <p class="need__msg" data-need-msg aria-live="polite">Tick each one as you get it ready. Missing a few? Ask anyway.</p>
        </div>
        <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html')}</div>
        <p class="need__fine">You see the ad before it runs. Nothing goes live without your OK. Page not ready? <a href="${c.link('packages/profile-fix.html')}">Profile Fix</a> sorts it.</p>
      </div>
    </div>
    <fieldset class="need__list rv" data-need>
      <legend class="label">Have these ready</legend>
      <div class="need__group">
        ${NEED.filter((x) => x.core).map((x) => `<label class="need__item"><input type="checkbox" name="need" value="${x.v}" data-core><span class="need__box" aria-hidden="true"></span><span class="need__txt"><b>${x.t}</b><span>${x.d}</span></span></label>`).join('')}
      </div>
      <p class="label label--dim" style="margin:28px 0 10px">If it applies</p>
      <div class="need__group" style="margin-top:0">
        ${NEED.filter((x) => !x.core).map((x) => `<label class="need__item"><input type="checkbox" name="need" value="${x.v}"><span class="need__box" aria-hidden="true"></span><span class="need__txt"><b>${x.t}</b><span>${x.d}</span></span></label>`).join('')}
      </div>
    </fieldset>
  </div>
</section>

<section class="band band--paper" id="recap" aria-labelledby="recap-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">03 · What you get back</p>
      <h2 class="h2 recap-h" id="recap-h">The recap, <span class="whisper">in plain English.</span></h2>
      <p>Every boost ends with a recap. Every plan gets one each month. Here is what each number on it means.</p>
    </div>
    <div class="recap">
      <dl class="gloss rv">
        ${GLOSS.map((g) => `<div><dt>${g.t}<small>${g.tag}</small></dt><dd>${g.d}</dd></div>`).join('')}
      </dl>
      <figure class="ri rv" style="--d:.1s" data-ri data-mode="both">
        <div class="ri__top">
          <p class="label">Reach vs impressions</p>
          <div class="ri__toggle" role="group" aria-label="What to count">
            <button type="button" data-ri-mode="reach" aria-pressed="false">Count reach</button>
            <button type="button" data-ri-mode="imp" aria-pressed="false">Count impressions</button>
          </div>
        </div>
        <div class="ri__crowd" aria-hidden="true">${SEEN.map((k) => `<span class="ri__p"><span class="ri__ticks">${'<i></i>'.repeat(k)}</span>${PERSON}</span>`).join('')}</div>
        <div class="ri__nums">
          <p class="ri__num ri__num--reach"><b>${REACH}</b><span>Reach · people</span></p>
          <p class="ri__num ri__num--imp"><b>${IMPS}</b><span>Impressions · times shown</span></p>
        </div>
        <figcaption>Same run, two numbers. ${WORD[REACH][0].toUpperCase() + WORD[REACH].slice(1)} people saw the ad. Some saw it more than once, so it was shown ${WORD[IMPS] || IMPS} times. Illustration, not data.</figcaption>
      </figure>
    </div>
    <div class="recap__read rv">
      <p class="label">Read it in this order</p>
      <p><strong>Spend</strong> first: did the money go out. Then <strong>reach</strong>: how many people saw it. Then the one number that matches your goal. The rest of the method sits in a classified file further down.</p>
    </div>
  </div>
</section>

<section class="band" id="never" aria-labelledby="never-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label label--red">04 · What we never do</p>
      <h2 class="h2" id="never-h">What we <span class="whisper">never</span> do.</h2>
      <p>Some shortcuts make numbers go up and business go nowhere. We don’t take them.</p>
    </div>
    <ul class="never rv" data-never>
      ${NEVER.map((x) => `<li><h3>${x.t.split(' ').map((w, i) => `<span class="nv" style="--i:${i}">${w}</span>`).join(' ')}</h3><p>${x.d}</p></li>`).join('')}
    </ul>
    <p class="never__foot rv">Every push is a real paid placement, bought through the platform’s own ad tools, the same ones any business uses.</p>
  </div>
</section>

<section class="band band--coal" id="where" aria-labelledby="where-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">05 · Where we push</p>
      <h2 class="h2" id="where-h">${PLATFORMS.length} feeds. <span class="whisper">One honest pick.</span></h2>
      <p>We put your money where your people already scroll, and tell you straight when a platform is the wrong fit.</p>
    </div>
    <ul class="feeds rv">
      ${PLATFORMS.map((p) => `<li class="feed${p.fresh ? ' feed--new' : ''}">${ICON_KEY[p.name] ? c.icon(ICON_KEY[p.name]) : ''}<b>${p.name}</b><span>${p.note}</span></li>`).join('')}
    </ul>
    <p class="feeds__foot rv">Each boost runs on one platform you pick. ${SURGE.name} covers up to 2 platforms, and so does ${PLANS[1].name}. ${PLANS[2].name} runs on the platforms your people use.</p>
  </div>
</section>

<section class="band" id="aimed" aria-label="Classified">
  <div class="wrap wrap--narrow">
    ${c.classified({ id: 'aim', level: 3, title: 'How a push is actually aimed', body: `
      <p>This is how we set up every run. Use it on your own ads too.</p>
      <ol>
        <li><strong>One goal per run.</strong> Pick reach (the most people seeing it), clicks (people going to a link) or video views. The platform chases whatever you ask for, so asking for all three gets you a weak version of each.</li>
        <li><strong>Aim by place, then by interest.</strong> A shop does best aimed at the area its customers can actually get to, not the whole state. A creator does best aimed at interests close to the content: the games, music or topics the right viewers already follow. Too narrow and the platform can’t find enough people. Too wide and the money spreads thin.</li>
        <li><strong>The first two seconds decide everything.</strong> People choose to stop or scroll almost instantly. Open on the most interesting frame, not a logo or a slow intro. Put the point on screen in words, because plenty of people watch with the sound off.</li>
        <li><strong>One clear call to action.</strong> Follow, book, buy or show up. Pick one and say it plainly. An ad that asks for three things usually gets none of them.</li>
        <li><strong>Longer runs settle better.</strong> A platform spends the first part of any run learning who responds, then puts more of the money in front of people like them. A longer run gives it time to learn. That is why longer runs tend to get more out of each dollar, and why monthly plans don’t restart from zero.</li>
        <li><strong>Leave it alone while it learns.</strong> Big edits mid-run can send the platform back to learning. Set it up right, then let the run play out before you judge it.</li>
        <li><strong>Read the recap like this.</strong> Spend first: did the money go out. Reach next: how many people saw it. Then the one number that matches your goal. Compare each run with your last one, not with somebody else’s account. And count what happened off the screen: messages, bookings, people who say they saw you.</li>
      </ol>` })}
  </div>
</section>

<section class="band band--gold" aria-labelledby="move-h">
  <div class="wrap hw-close">
    <div class="hw-close__main">
      <p class="label">Your move</p>
      <h2 id="move-h">Pick your<br>path.</h2>
      <p>Start with one boost and see what real reach feels like, or keep the push running every month. Still deciding? The FAQ has the straight answers.</p>
      <div class="ctas">${c.btn('Make contact ' + c.arrow, 'contact.html', 'lg')}${c.btn('Read the FAQ', 'faq.html', 'ghost lg')}</div>
      <a class="hw-close__phone" href="${BIZ.phoneHref}">${BIZ.phone}</a>
    </div>
    <div class="doors">
      <a class="door" href="${c.link('packages.html#boosts')}"><span class="label">One push</span><b>One-time boosts</b><span class="door__go">See them ${c.arrow}</span><small>${andList(BOOSTS.map((o) => o.name))}. From ${BOOSTS[0].price}, no contract.</small></a>
      <a class="door" href="${c.link('packages.html#plans')}"><span class="label">Every month</span><b>Monthly plans</b><span class="door__go">See them ${c.arrow}</span><small>${andList(PLANS.map((o) => o.name))}. From ${PLANS[0].price}${PLANS[0].suffix}, stay or walk.</small></a>
    </div>
  </div>
</section>`;
  },
};
