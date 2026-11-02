// /getstarted — the address printed on flyers, cards and posts. One job: get the visitor to the right door fast.
import { BIZ } from '../data/business.mjs';
import { bySlug, offerPath, CLASSES } from '../data/offers.mjs';
import { bookingBlock, BOOKING_CSS, BOOKING_JS } from '../data/booking.mjs';

const css = `
.gs{position:relative;overflow:hidden;isolation:isolate;border-bottom:1px solid var(--smoke)}
.gs::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(clamp(260px,40vw,560px) circle at var(--x,70%) var(--y,30%),rgba(217,178,95,.18),transparent 70%)}
.gs__in{display:grid;gap:22px;padding-block:clamp(36px,5vw,64px) clamp(28px,4vw,48px)}
.gs__title{font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:clamp(76px,12vw,168px);line-height:.8;letter-spacing:-.01em}
.gs__title .whisper{display:block;font-size:.3em;line-height:1.1;margin-top:.25em}
.doors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;background:var(--smoke);border:1px solid var(--smoke)}
@media (max-width:860px){.doors{grid-template-columns:1fr}}
.door{--x:50%;--y:0%;position:relative;display:flex;flex-direction:column;gap:12px;padding:clamp(24px,3vw,34px);background:var(--void);color:var(--paper);text-decoration:none;isolation:isolate;min-width:0;transition:background .3s}
.door::before{content:"";position:absolute;inset:0;z-index:-1;opacity:0;background:radial-gradient(280px circle at var(--x) var(--y),rgba(217,178,95,.18),transparent 70%);transition:opacity .3s}
.door:hover::before,.door:focus-visible::before{opacity:1}
.door__no{font-family:var(--f-display);font-weight:900;font-size:72px;line-height:.8;color:transparent;-webkit-text-stroke:1.5px var(--gold);transition:color .3s}
.door:hover .door__no{color:var(--gold)}
.door b{font-family:var(--f-display);font-weight:900;font-size:clamp(32px,3.4vw,44px);line-height:.9;text-transform:uppercase}
.door span:not(.label):not(.door__no):not(.file__open){color:var(--ash)}
.door .lines__big{font-size:clamp(30px,3.2vw,40px)}
.door .file__open{margin-top:auto;padding-top:6px}
.door .lines__big,.door .copy{align-self:flex-start}
.gs-pop{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,2vw,22px)}
@media (max-width:980px){.gs-pop{grid-template-columns:1fr}}
@media (min-width:981px){.gs-pop{grid-template-rows:auto auto 1fr auto auto;row-gap:14px}.gs-pop>.file{grid-row:span 5;grid-template-rows:subgrid}}
`;

export default {
  path: 'getstarted.html',
  section: 'contact',
  title: 'Get started',
  description: 'Get seen in South Bend, Mishawaka and Elkhart. Pick a package, take the 3-question match, or call or text (574) 213-9097. Real ads, real people, no bots.',
  teaser: 'Three doors. Pick one and we take it from there.',
  next: 'packages.html',
  css: css + BOOKING_CSS, js: BOOKING_JS,
  body: (c) => {
    const picks = ['spark', 'surge', 'total-blackout'].map((s) => bySlug[s]);
    return `
<header class="gs" data-spot>
  <div class="wrap gs__in">
    <p class="label">You found the door · ${BIZ.area.join(' · ')}</p>
    <h1 class="gs__title">Get started.<span class="whisper">Three ways in. Pick one.</span></h1>
    <p class="lede"><strong>Real ads. Real people. No bots.</strong> Paid reach for creators, streamers, solo businesses and local shops. Prices are on every package. Nothing runs until you say go.</p>
  </div>
</header>

<section class="band band--tight" aria-labelledby="doors-h">
  <div class="wrap">
    <h2 class="sr" id="doors-h">Choose how to start</h2>
    <div class="doors">
      <a class="door" href="${c.link('contact.html')}" data-spot>
        <span class="door__no">01</span><span class="label">I know what I want</span><b>Send a message</b>
        <span>Tell us what you’re pushing and which package. We reach out the way you ask and confirm everything before anything starts.</span>
        <span class="file__open">Open the form ${c.arrow}</span>
      </a>
      <a class="door" href="${c.link('packages.html#match')}" data-spot>
        <span class="door__no">02</span><span class="label">Help me pick</span><b>Take the match</b>
        <span>Three questions about what you’re pushing, for how long and how much you want handled. One straight recommendation.</span>
        <span class="file__open">Find my package ${c.arrow}</span>
      </a>
      <div class="door" data-spot>
        <span class="door__no">03</span><span class="label">I’d rather talk</span><b>Call or text</b>
        <a class="lines__big" href="${BIZ.phoneHref}">${BIZ.phone}</a>
        <span>Calls and texts go to a real person in South Bend. Ask anything, including whether you need us at all.</span>
        <button class="copy" type="button" data-copy="${BIZ.phone}">Copy number</button>
      </div>
    </div>
  </div>
</section>

<section class="band band--coal" aria-labelledby="pop-h">
  <div class="wrap">
    <div class="band__head band__head--row rv">
      <div><p class="label">Three good places to start</p><h2 class="h2" id="pop-h">Three files. <span class="whisper">Three sizes.</span></h2><p>A test, a monthly push, or the whole thing done for you. Every file opens to exactly what you get.</p></div>
      <a class="textlink" href="${c.link('packages.html')}">See every package ${c.arrow}</a>
    </div>
    <div class="gs-pop rv">${picks.map((o) => c.offerCard(o)).join('')}</div>
    <p class="small muted" style="margin-top:22px">${BIZ.resultsNote}</p>
  </div>
</section>
${bookingBlock({ id: 'book', title: 'Rather talk first? Book a call or a class.', lead: `Pick a 1-hour slot to talk about getting seen, or to book ${CLASSES[0].name} (${CLASSES[0].price} a ${CLASSES[0].per}). <a href="${c.link(CLASSES[0].path)}">What the class covers</a>.` })}

<section class="band band--gold" aria-labelledby="gs-final">
  <div class="wrap" style="display:grid;gap:22px;justify-items:start">
    <p class="label">No pressure</p>
    <h2 class="h2" id="gs-final">Not ready? Look around.</h2>
    <p style="font-size:var(--t-lede);max-width:56ch">Every file you open raises your clearance, and higher levels unlock classified files. Start with how a push works, or meet the guy behind it.</p>
    <div class="ctas">${c.btn('How it works ' + c.arrow, 'how-it-works.html', 'paper lg')}${c.btn('Who runs this', 'about.html', 'paper ghost lg')}</div>
  </div>
</section>`;
  },
};
