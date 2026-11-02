// One dedicated page per package and per built-to-order service (12 pages).
import { OFFERS, offerPath, bySlug } from '../data/offers.mjs';
import { BIZ, LEVELS } from '../data/business.mjs';

// The "Next file" reading path. The story pages sit between the packages so the payoff comes late:
// packages → spark → boost → blitz → how-it-works → surge → overdrive → total-blackout → work → about
// → post-kit → profile-fix → faq → contact → vault. The built-to-order files run as their own branch
// (packages#built → website-design → ai-consulting → ai-automation → creator-systems → work).
// Any offer not listed here points at the next offer in offers.mjs.
const NEXT = {
  blitz: 'how-it-works.html',
  'total-blackout': 'work.html',
  'profile-fix': 'faq.html',
  'creator-systems': 'work.html',
};
// The clearance drawer lists files by `order`, so it follows the same path. The story pages take the
// gaps and are numbered after the file they follow: how-it-works 13 (File 03A), work 17 (File 06A),
// about 18 (File 06B), faq 21 (File 08A), contact 22 (File 08B). Keep those modules in step with this.
const ORDER = {
  spark: 10, boost: 11, blitz: 12, surge: 14, overdrive: 15, 'total-blackout': 16, 'post-kit': 19, 'profile-fix': 20,
  'website-design': 23, 'ai-consulting': 24, 'ai-automation': 25, 'creator-systems': 26,
};

// Section headings change with the kind of file, so clicking file to file doesn't feel copy-pasted.
const KIND = {
  boost: {
    label: 'One-time boost', crumb: 'Boosts', stamp: ['One', 'Time'], stampSub: 'No contract',
    heads: { what: ['One push.', 'One moment.'], run: ['From hello', 'to live.'], fit: ['Is this', 'your push?'] },
  },
  plan: {
    label: 'Monthly plan', crumb: 'Plans', stamp: ['Every', 'Month'], stampSub: 'Stay or walk',
    heads: { what: ['Every month,', 'handled.'], run: ['Month one', 'and every month after.'], fit: ['Is this', 'your plan?'] },
  },
  addon: {
    label: 'Add-on', crumb: 'Add-ons', stamp: ['Add', 'On'], stampSub: 'Pairs with any boost',
    heads: { what: ['Small job.', 'Big difference.'], run: ['From order', 'to done.'], fit: ['Do you', 'need it?'] },
  },
  service: {
    label: 'Built to order', crumb: 'Built to order', stamp: ['Price', 'In writing'], stampSub: 'Before work starts',
    heads: { what: ['What we', 'build.'], run: ['From call', 'to handoff.'], fit: ['Is this', 'your job?'] },
  },
};
// The Bodoni whisper is kept for two headings per page (what it is, and is it for you); the rest are plain.
const head = (h) => `${h[0]} <span class="whisper">${h[1]}</span>`;
const plain = (h) => `${h[0]} ${h[1]}`;

// ── Number helpers: every figure below is computed from offers.mjs, never typed in. ──
const num = (p) => Number(String(p).replace(/[^0-9.]/g, '')) || 0;
const money = (n) => '$' + (Math.round(n * 100) % 100 === 0 ? Math.round(n).toLocaleString('en-US') : n.toFixed(2));
const adOf = (o) => { const m = /About \$(\d+(?:\.\d+)?)/.exec(o.spend || ''); return m ? Number(m[1]) : 0; };
const daysOf = (o) => { const m = /(\d+)-day/.exec(o.run || ''); return m ? Number(m[1]) : 0; };
const WORDS = { 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten' };
const times = (r) => (r === 2 ? 'double' : `${WORDS[r] || +r.toFixed(1)} times`);
// A launch price is only "locked in" when the offer itself says so (or sets lockIn).
const lockedIn = (o) => o.lockIn ?? /locked in/i.test([o.spend, ...(o.includes || [])].join(' '));

const S = bySlug;
const planMath = (o, below, adds) => {
  const save = num(o.regular) - num(o.price);
  const single = num(o.oneMonth) - num(o.price);
  const step = num(o.price) - num(below.price);
  return [
    `Launch price ${o.price} a month. Regular price ${money(num(o.regular))} a month.`,
    `The regular price is <strong>${money(save)} a month more</strong> than the launch price.${lockedIn(o) ? ' Start at the launch price and you keep it while you stay.' : ''}`,
    `One month only costs ${o.oneMonth}. Staying month to month at ${o.price} costs ${money(single)} a month less.`,
    `${o.name} is ${money(step)} more than ${below.name}, and that ${money(step)} ${adds}.`,
  ];
};

// Level-2 classified: the real math behind each file.
const MATH = {
  spark: (o) => [
    `${o.price} total. About <strong>${money(adOf(o))} buys the ad</strong>, the rest covers setup, aiming it and your recap.`,
    `Over a ${o.run} that is about <strong>${money(adOf(o) / daysOf(o))} a day</strong> of real ad money.`,
    `The ${S['post-kit'].name} is included. On its own it costs ${S['post-kit'].price}${num(S['post-kit'].price) >= num(o.price) ? ', so the push is the bonus' : ''}.`,
    'Platforms spend the first part of any run learning who responds. That is one reason longer runs tend to get more out of each dollar.',
    `<strong>Why not hit Promote yourself?</strong> You can. With ${o.name} we set the ad up in the platform’s own ad tools, aim it at your area or the audience you name, add the ${S['post-kit'].name}, and send you a recap of spend, reach, and clicks or views.`,
  ],
  boost: (o) => [
    `${o.price} total. About <strong>${money(adOf(o))} buys the ad</strong>: ${times(adOf(o) / adOf(S.spark))} what ${S.spark.name} puts in.`,
    `Over a ${o.run} that is about <strong>${money(adOf(o) / daysOf(o))} a day</strong> of ad money.`,
    `On TikTok the same ${money(adOf(o))} runs as a one-day burst, so it lands hard on the day that counts.`,
    `If you already ran a ${S.spark.name}, ${o.name} is the cheapest real step up.`,
    `<strong>Why not hit Promote yourself?</strong> You can. With ${o.name} we set the ad up in the platform’s own ad tools, aim it at your area or the people you name, and send you a recap of spend, reach, clicks or views, and follows.`,
  ],
  blitz: (o) => [
    `${o.price} total. About <strong>${money(adOf(o))} buys the ad</strong>: ${times(adOf(o) / adOf(S.boost))} ${S.boost.name}, ${times(adOf(o) / adOf(S.spark))} ${S.spark.name}.`,
    `Over a ${o.run} that is about <strong>${money(adOf(o) / daysOf(o))} a day</strong> of ad money on one platform.`,
    `Three ${o.name}es cost ${money(3 * num(o.price))}. ${S.surge.name} is ${S.surge.price} a month and never restarts from zero.`,
    'Book it at least a week before your date so the whole run lands before the doors open.',
    `<strong>Why not hit Promote yourself?</strong> You can. With ${o.name} we set the ad up in the platform’s own ad tools, aim it at your area or the audience you name, and send you a recap of spend, reach, clicks or views, and follows.`,
  ],
  surge: (o) => [
    `${o.price} a month. About <strong>${money(adOf(o))} a month goes into the ads</strong> across up to 2 platforms.`,
    `That works out to roughly <strong>${money(adOf(o) / 30)} a day</strong> of ad money, every day of the month.`,
    `One month only costs ${o.oneMonth}. Staying month to month at ${o.price} costs ${money(num(o.oneMonth) - num(o.price))} a month less.`,
    `Three ${S.blitz.name}es would cost ${money(3 * num(S.blitz.price))} for ${3 * daysOf(S.blitz)} days on one platform. ${o.name} covers the whole month on two.`,
    `<strong>Why not hit Promote yourself?</strong> You can. With ${o.name} we run the ads on up to 2 platforms, check and adjust the aim every month as the numbers come in, and send you a monthly recap of spend, reach, clicks or views, and follows.`,
  ],
  overdrive: (o) => planMath(o, S.surge, 'buys automatic posting plus AI tools'),
  'total-blackout': (o) => planMath(o, S.overdrive, 'adds the customer-answering AI assistant and a clean web page'),
  'post-kit': (o) => [
    `${o.price} for a 30-day calendar and 12 captions works out to about <strong>${money(num(o.price) / 12)} a caption</strong>.`,
    `It comes free with every ${S.spark.name}, so buying ${S.spark.name} gets you the kit and a paid push for ${num(S.spark.price) === num(o.price) ? 'the same ' + o.price : S.spark.price}.`,
    'Twelve posts in thirty days is about three a week. That is enough to look alive without burning out.',
  ],
  'profile-fix': (o) => [
    `${o.price}, one time. Nothing recurring.`,
    'Ads are wasted on a page that doesn’t explain itself. Fixing the page first makes every later push work harder.',
    'You publish the changes yourself, so you never hand over a login.',
  ],
  'website-design': () => [
    'Every site is quoted in writing before work starts. No hourly meter running.',
    'Have these ready for the quote call: what you sell, your prices if you list them, your hours, your address or service area, and the domain you own.',
    'Social ads get tapped inside the app, and the apps live on phones. A phone-first site is built for exactly that visitor.',
  ],
  'ai-consulting': () => ['Quoted in writing before we start.', 'Before the call, write down the five tasks you repeat most in a normal week. That list is where the time savings hide.', 'If AI is the wrong tool for a job, you will hear that too.'],
  'ai-automation': () => ['Quoted in writing before we build.', 'The best first automation is the question you answer most. Count how many times a day you type the same reply.', 'Every build is tested on real examples from your business before it goes live.'],
  'creator-systems': () => ['Quoted in writing before we build.', 'One stream can feed a week of short posts. The system is what makes that happen without filming more.', 'Pair it with a Boost when a clip takes off, and put money behind the thing that is already working.'],
};

// Meta descriptions the default template leaves under 120 characters. Built from the offer data.
const where = `Blackout Syndicate, ${BIZ.city}, ${BIZ.region}.`;
const META = {
  surge: (o) => `${o.name}: paid ads every month on up to 2 platforms, about ${money(adOf(o))} a month of it in the ads. ${o.price}${o.suffix}, or ${o.oneMonth} for one month. ${where}`,
  overdrive: (o) => `${o.name}: everything in ${S.surge.name} plus automatic posting and AI tools set up for you. ${o.price}${o.suffix} launch price, or ${o.oneMonth} for one month. ${BIZ.city}, ${BIZ.region}.`,
  'total-blackout': (o) => `${o.name}: ads, AI-made posts, an AI assistant that answers customers and a clean web page, done for you. ${o.price}${o.suffix}, or ${o.oneMonth} for one month. ${BIZ.city}, ${BIZ.region}.`,
  'profile-fix': (o) => `${o.name}: a rewritten bio, a pinned post plan, organized highlights and a shot list, so your page makes sense before ads send people. ${o.price}, one time.`,
  'ai-automation': (o) => `${o.name}: automatic replies, lead capture, follow-ups and post scheduling built around your business. Quoted per job. ${where}`,
};

export default () => OFFERS.map((o, i) => {
  const k = KIND[o.kind];
  const path = offerPath(o);
  const next = NEXT[o.slug] || (OFFERS[i + 1] ? offerPath(OFFERS[i + 1]) : 'contact.html');
  const up = o.ladder && bySlug[o.ladder.to];
  const isService = o.kind === 'service';
  const claimLabel = isService ? 'Get my quote' : `Claim ${o.name}`;
  // Straight to the intake form, with this file picked.
  const claimHref = 'contact.html?pkg=' + o.slug + '#intake';
  // The file number, drawn huge behind the name ("File 05" → "05").
  const fileNo = String(o.file).replace(/\D/g, '');
  // The ladder card only shows when it points somewhere the "Next file" card below doesn't.
  const showLadder = up && offerPath(up) !== next;
  const rel = !up ? '' : (isService || up.kind === 'service') ? 'Related file' : (o.kind === 'addon' || up.kind === 'addon') ? 'Pairs with' : num(up.price) > num(o.price) ? 'Next step up' : 'Start smaller';
  const drawer = o.kind === 'addon' ? OFFERS.filter((x) => x.kind === 'boost') : OFFERS.filter((x) => x.kind === o.kind && x.slug !== o.slug);
  const drawerLabel = o.kind === 'addon' ? 'Pairs with any boost' : 'Also in this drawer';
  const lean = o.notForYou.length < 2;
  const ad = adOf(o);

  return {
    path,
    file: o.file,
    order: ORDER[o.slug] ?? 30 + i,
    navTitle: o.name,
    h1: o.name,
    section: 'packages',
    kind: o.kind,
    offer: o.slug,
    title: `${o.name}${isService ? '' : ' · ' + o.price + o.suffix}`,
    description: o.meta || (META[o.slug] ? META[o.slug](o) : null) || `${o.name}: ${o.tagline} ${isService ? 'Quoted per job.' : o.price + o.suffix + (o.kind === 'plan' ? '' : ', one time') + '.'} ${where}`,
    teaser: o.teaser,
    next,
    jsonld: (ctx, cfg) => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: o.name,
      description: o.summary,
      provider: { '@type': 'LocalBusiness', name: BIZ.name, telephone: '+1-574-213-9097', address: { '@type': 'PostalAddress', addressLocality: 'South Bend', addressRegion: 'IN', addressCountry: 'US' } },
      areaServed: BIZ.area.map((c) => c + ', IN'),
      url: cfg.siteUrl + '/' + path,
      ...(isService ? {} : { offers: { '@type': 'Offer', price: o.price.replace('$', ''), priceCurrency: 'USD', ...(o.suffix ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: o.price.replace('$', ''), priceCurrency: 'USD', unitText: 'MONTH' } } : {}) } }),
    }),
    body: (c) => {
      const priceHtml = `${o.price}${o.suffix ? `<small>${o.suffix}</small>` : ''}`;
      // Read the switch from the build config (so BS_CONFIG_OVERRIDE works), never from config.mjs.
      const payLink = !!(c.config.showPayLinks && o.store);

      // One signature module per kind, built only from the offer data.
      const money_ = o.kind === 'boost' && ad ? `
      <div class="offer-money">
        <p class="label label--dim">Where the money goes</p>
        <div class="offer-money__bar" role="img" aria-label="About ${money(ad)} of ${o.price} buys the ad itself"><i style="--w:${Math.round((ad / num(o.price)) * 100)}%"></i></div>
        <div class="offer-money__key"><span><b>About ${money(ad)}</b>buys the ad itself</span><span><b>The rest</b>covers setup, aiming and your recap</span></div>
      </div>` : '';
      const rate = o.kind === 'plan' ? `
      <div class="offer-rate">
        <p class="label label--dim">${o.regular ? 'Launch price' : 'Month to month'}</p>
        <p class="offer-rate__row"><span class="price">${priceHtml}</span></p>
        <p class="offer-rate__note">${o.regular ? (lockedIn(o) ? `Locked in while you stay. New clients after the launch pay the regular price, ${o.regular}. ` : `Month to month. The regular price is ${o.regular}. `) : ''}${o.oneMonth ? `One month only: ${o.oneMonth}, no commitment.` : ''}</p>
      </div>` : '';

      const ladder = showLadder
        ? `<a class="ladder" href="${c.link(offerPath(up))}"><span class="label">${rel} · ${up.file}</span><b>${up.name}</b><span>${o.ladder.text}</span><span class="file__open">Open file ${c.arrow}</span></a>`
        : drawer.length ? `<div class="ladder ladder--list"><span class="label">${drawerLabel}</span><ul>${drawer.map((x) => `<li><a href="${c.link(offerPath(x))}"><b>${x.name}</b><span>${x.kind === 'service' ? x.file : `${x.price}${x.suffix}`}</span>${c.arrow}</a></li>`).join('')}</ul></div>` : '';

      const claimNext = o.kind === 'plan' ? 'Your first month starts with the intake call.'
        : o.kind === 'boost' ? 'Our target is live within 24 hours of payment. Platform ad review can take longer.'
        : o.spend;

      return `
<header class="pagehead offer-head" data-spot data-spot-idle>
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: isService ? 'Built to order' : 'Packages', p: isService ? 'packages.html#built' : 'packages.html' }, { t: o.name }])}
    <div class="offer-head__grid">
      <div class="offer-head__main">
        ${fileNo ? `<span class="offer-no" data-spot-layer aria-hidden="true"><span class="offer-no__dark">${fileNo}</span><span class="offer-no__lit">${fileNo}</span></span>` : ''}
        <p class="label">${o.file} · ${k.label}${o.flagship ? ' · <span class="label--red">Flagship</span>' : ''}</p>
        <h1 class="h1 offer-head__name${o.name.length > 12 ? ' offer-head__name--long' : ''}">${o.name}</h1>
        <p class="lede">${o.tagline}</p>
        <div class="ctas">
          ${c.btn(claimLabel + ' ' + c.arrow, claimHref, 'lg')}
          ${payLink ? c.btn('Pay online', o.store, 'ghost lg') : c.btn('Call ' + BIZ.phone, BIZ.phoneHref, 'ghost lg') + c.btn('Text us', BIZ.sms, 'ghost lg')}
        </div>
      </div>
      <aside class="offer-card" aria-label="${o.name} at a glance">
        <div class="offer-card__top">
          ${isService
            ? '<div class="price offer-card__price offer-card__price--quote">By quote<span class="sr">. Price in writing before work starts.</span></div>'
            : `<div class="price offer-card__price">${priceHtml}</div>`}
          <div class="stamp stamp--gold is-slam" aria-hidden="true">${k.stamp[0]}<br>${k.stamp[1]}<small>${k.stampSub}</small></div>
        </div>
        <dl class="ledger">
          <div><dt>Type</dt><dd>${k.label}</dd></div>
          ${isService ? `<div><dt>Starts with</dt><dd>${o.process[0].t}</dd></div>` : `<div><dt>Run</dt><dd>${o.run}</dd></div>`}
          <div><dt>Best for</dt><dd>${o.bestFor}</dd></div>
          ${o.regular ? `<div><dt>Regular price</dt><dd>${o.regular}</dd></div>` : ''}
          ${o.oneMonth ? `<div><dt>One month only</dt><dd>${o.oneMonth}, no commitment</dd></div>` : ''}
        </dl>
        ${isService ? '' : `<p class="offer-card__spend">${o.spend}</p>`}
      </aside>
    </div>
  </div>
</header>

<section class="band${o.kind === 'addon' ? ' band--paper offer-paper' : ''}" aria-labelledby="what-h">
  <div class="wrap split split--wide">
    <div class="offer-what rv">
      <p class="label">What it is</p>
      <h2 class="h2" id="what-h">${head(k.heads.what)}</h2>
      <p class="lede">${o.summary}</p>
      ${money_}${rate}
      ${o.kind === 'boost' || o.kind === 'plan' ? `<p class="muted small">${BIZ.resultsNote}</p>` : ''}
    </div>
    <div class="panel rv" style="--d:.1s">
      <p class="label">What you get</p>
      <ul class="ticks">${o.includes.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="band ${isService ? 'band--paper offer-paper' : 'band--coal'}" aria-labelledby="run-h">
  <div class="wrap">
    <div class="band__head rv"><p class="label">How it runs</p><h2 class="h2" id="run-h">${plain(k.heads.run)}</h2></div>
    <ol class="steps rv" style="--n:${o.process.length}">${o.process.map((s) => `<li><h3>${s.t}</h3><p>${s.d}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="band" aria-labelledby="fit-h">
  <div class="wrap">
    <div class="band__head rv"><p class="label">Straight talk</p><h2 class="h2" id="fit-h">${head(k.heads.fit)}</h2></div>
    <div class="grid grid--2 rv${lean ? ' offer-fit--lean' : ''}">
      <div class="panel"><p class="label">It’s for you if</p><ul class="ticks">${o.forYou.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <div class="panel"><p class="label label--red">It’s not for you if</p><ul class="ticks ticks--no">${o.notForYou.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>

<section class="band band--flush-top offer-bonus" aria-label="Bonus file">
  <div class="wrap wrap--narrow">
    <p class="offer-bonus__note"><span class="label">Bonus file · ${isService ? 'Before you call' : 'The price math'}</span><span>${isService ? `What to have ready before you call about ${o.name}.` : `Where the money in ${o.name} goes, worked out line by line.`}<span class="offer-bonus__how"> It opens at Clearance 2: ${LEVELS[2].name}, which you earn by reading the site. No sign-up.</span></span></p>
    ${c.classified({ id: 'math-' + o.slug, level: 2, bypass: true, title: isService ? `Bonus file: before you call about ${o.name}` : `Bonus file: the math behind ${o.name}`, body: `<ul>${(MATH[o.slug] ? MATH[o.slug](o) : []).map((m) => `<li>${m}</li>`).join('')}</ul>` })}
  </div>
</section>

<section class="band band--coal" aria-labelledby="faq-h">
  <div class="wrap split">
    <div class="rv" style="display:grid;gap:18px;align-content:start">
      <p class="label">Questions</p>
      <h2 class="h2" id="faq-h">Asked and answered.</h2>
      <a class="textlink" href="${c.link('faq.html')}">Every other question ${c.arrow}</a>
    </div>
    <div class="rv">${o.faq.map((q) => `<details class="qa"><summary>${q.q}</summary><div><p>${q.a}</p></div></details>`).join('')}</div>
  </div>
</section>

<section class="band" aria-labelledby="claim-h">
  <div class="wrap">
    <div class="claim rv">
      <div class="claim__main">
        <p class="label">${o.file} · ${o.name}</p>
        <h2 class="h2" id="claim-h">${isService ? 'Get the quote.' : 'Claim the file.'}</h2>
        <p class="lede">${isService ? 'Tell us what you need. You get a written price before any work starts.' : `Send the form and we’ll reach out to confirm the details and how you’d like to pay. ${claimNext}`}</p>
        <div class="ctas">${c.btn(claimLabel + ' ' + c.arrow, claimHref, 'lg')}${payLink ? c.btn('Pay online now', o.store, 'ghost lg') : ''}</div>
        <p class="small muted claim__line">Or call <a href="${BIZ.phoneHref}">${BIZ.phone}</a>, or <a href="${BIZ.sms}">send a text</a>.</p>
      </div>
      <div class="claim__side">
        ${isService
          ? `<p class="label label--dim">Price before work starts</p><ol class="ticks claim__path">${o.process.map((s) => `<li>${s.t}</li>`).join('')}</ol>`
          : `<div class="price claim__price">${priceHtml}</div><p class="label label--dim">${o.cadence}</p>`}
        ${ladder}
      </div>
    </div>
  </div>
</section>`;
    },
    css: OFFER_CSS,
    js: OFFER_JS,
  };
});

// Visitors who came from one of our ads find the bonus file already open: no black bars on the page
// the ad paid to bring them to. Everyone else keeps the redaction game. "From an ad" means the same
// thing it does to the engine: the address carried twclid or utm_source, and site.js keeps those tags
// for this tab in sessionStorage 'bs2.src' ({ src: 'twclid=…&utm_source=…', landing }).
// The engine has no call to open one sheet without writing clearance, so the sheet is opened here and
// handed back to the page (data-classified removed), and later renders leave it open. No state is
// written and no toast is shown. A visitor already at Level 2 is left to the engine.
const OFFER_JS = `
(() => {
  const el = document.querySelector('.offer-bonus [data-classified]');
  if (!el) return;
  const tagged = (s) => /(^|[?&])(twclid|utm_source)=[^&]/.test(s || '');
  let saved = '';
  try { saved = (JSON.parse(sessionStorage.getItem('bs2.src')) || {}).src || ''; } catch (e) { /* storage blocked */ }
  if (!tagged(saved) && !tagged(location.search)) return;
  const open = () => {
    // already open, or a Level 2 visitor's sheet waiting to declassify in view: the engine has it
    if (el.classList.contains('is-open') || el.dataset.watch) return;
    el.removeAttribute('data-classified');
    el.dataset.openedFor = 'ad';
    el.classList.remove('is-locked', 'is-opening');
    el.classList.add('is-open');
    el.querySelectorAll('.classified__body a').forEach((a) => a.removeAttribute('tabindex'));
    const status = el.querySelector('[data-classified-status]');
    if (status) { status.textContent = ''; delete status.dataset.sig; }
  };
  if (window.BS) open(); else document.addEventListener('bs:ready', open);
})();
`;

const OFFER_CSS = `
.offer-head__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,400px);gap:clamp(28px,5vw,72px);align-items:start}
@media (max-width:900px){.offer-head__grid{grid-template-columns:minmax(0,1fr)}}
.offer-head__main{display:grid;gap:22px;min-width:0;position:relative;isolation:isolate}
.offer-head__name{overflow-wrap:anywhere}
/* signature: the file number, huge and outlined behind the name, lit where the searchlight passes */
.offer-no{--x:40%;--y:50%;position:absolute;z-index:-1;right:0;top:0;transform:translateY(-6%);display:grid;font-family:var(--f-display);font-weight:900;font-size:clamp(200px,23vw,330px);line-height:.76;letter-spacing:-.02em;font-variant-numeric:tabular-nums;pointer-events:none;user-select:none;-webkit-user-select:none}
.offer-no>span{grid-area:1/1}
.offer-no__dark{color:transparent;-webkit-text-stroke:1.5px rgba(217,178,95,.2)}
.offer-no__lit{color:rgba(243,212,138,.06);-webkit-text-stroke:2px var(--gold-hi);-webkit-mask-image:radial-gradient(clamp(140px,18vw,260px) circle at var(--x) var(--y),#000 0 30%,transparent 72%);mask-image:radial-gradient(clamp(140px,18vw,260px) circle at var(--x) var(--y),#000 0 30%,transparent 72%)}
@media (max-width:900px){.offer-no{font-size:clamp(170px,46vw,300px)}}
.offer-head__name--long{font-size:clamp(56px,8vw,118px)}
.offer-card{background:var(--coal);border:1px solid var(--smoke);padding:24px 22px;display:grid;gap:16px;position:relative;min-width:0;margin-top:2px}
.offer-card::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.offer-card__top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.offer-card__price{font-size:clamp(52px,6vw,74px)}
.offer-card__price--quote{text-transform:uppercase;font-size:clamp(40px,4.4vw,56px)}
.offer-card .stamp{width:126px;padding:20px;font-size:18px;flex:none}
.offer-card .stamp small{font-size:8px;letter-spacing:.08em;max-width:8em}
@media (max-width:380px){.offer-card__price{font-size:46px}.offer-card .stamp{width:106px;padding:15px;font-size:15px}.offer-card .stamp small{font-size:7px}}
.offer-card__spend{font-size:14.5px;color:var(--ash);border-top:1px dashed var(--smoke);padding-top:14px}
@media (max-width:560px){.offer-head .btn,.claim .btn{white-space:normal;text-align:center;max-width:100%;line-height:1.05}.offer-head .btn--lg,.claim .btn--lg{font-size:21px;padding:17px 22px 16px}}

.offer-what{display:grid;gap:18px;align-content:start;min-width:0}
.offer-what .lede{max-width:56ch}
.offer-money,.offer-rate{display:grid;gap:10px;padding-top:18px;border-top:1px dashed var(--smoke);max-width:56ch}
.offer-money__bar{position:relative;height:12px;background:var(--smoke);overflow:hidden}
.offer-money__bar i{position:absolute;inset:0 auto 0 0;width:var(--w);background:linear-gradient(90deg,var(--brass),var(--gold-hi))}
.offer-money__key{display:flex;justify-content:space-between;gap:8px 24px;flex-wrap:wrap;font-size:15px;color:var(--ash)}
.offer-money__key b{display:block;font-family:var(--f-display);font-weight:800;font-size:24px;line-height:1;letter-spacing:.02em;text-transform:uppercase;color:var(--gold);margin-bottom:4px}
.offer-money__key span:last-child{text-align:right}
.offer-money__key span:last-child b{color:var(--paper)}
.offer-rate .price{font-size:clamp(52px,5.4vw,68px)}
.offer-rate__note{font-size:15px;color:var(--ash)}

.offer-paper .panel{background:var(--paper-2);border-color:rgba(23,20,15,.18)}
.offer-paper .steps{background:rgba(23,20,15,.18);border-color:rgba(23,20,15,.18)}
.offer-paper .steps>li{background:var(--paper)}
.offer-paper .steps>li:hover{background:var(--paper-2)}
.offer-paper .steps>li::before{-webkit-text-stroke-color:var(--brass)}
.offer-paper .steps>li:hover::before{color:var(--brass)}
.offer-paper .steps p{color:var(--ink-mute)}

.offer-fit--lean{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:start}
@media (max-width:640px){.offer-fit--lean{grid-template-columns:minmax(0,1fr)}}

/* the bonus file: one plain line says what it is and how it opens; the locked sheet stays short */
.offer-bonus__note{display:grid;gap:6px;margin-bottom:16px;font-size:15px;color:var(--ash);max-width:62ch}
.js .offer-bonus .classified.is-locked .classified__body{max-height:4.6em}
.offer-bonus:has(.classified.is-open) .offer-bonus__how{display:none}
.claim__line a{color:var(--gold);text-underline-offset:3px}
.claim__line a:hover{color:var(--gold-hi)}

.claim{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(28px,5vw,72px);padding:clamp(28px,4.5vw,56px);border:1px solid var(--gold);background:linear-gradient(160deg,#211a0d,var(--coal) 60%);align-items:start}
@media (max-width:860px){.claim{grid-template-columns:minmax(0,1fr)}}
.claim__main{display:grid;gap:20px;min-width:0}
.claim__side{display:grid;gap:12px;min-width:0}
.claim__price{font-size:clamp(64px,8vw,104px)}
.claim__path{gap:10px;font-family:var(--f-display);font-weight:800;font-size:24px;line-height:1.05;text-transform:uppercase;letter-spacing:.02em}
.ladder{display:grid;gap:6px;margin-top:14px;padding:18px;border:1px solid var(--smoke);background:var(--void);text-decoration:none;color:var(--paper);transition:border-color .3s}
a.ladder:hover{border-color:var(--gold)}
.ladder b{font-family:var(--f-display);font-weight:900;font-size:36px;line-height:.9;text-transform:uppercase}
.ladder span:not(.label):not(.file__open){color:var(--ash);font-size:15px}
.ladder--list ul{list-style:none;display:grid}
.ladder--list li+li{border-top:1px solid var(--smoke)}
.ladder--list a{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:baseline;gap:12px;padding:11px 0 10px;color:var(--paper);text-decoration:none}
.ladder--list a b{font-size:28px;line-height:.95;transition:color .2s}
.ladder--list a span{font-family:var(--f-type);font-size:13px;letter-spacing:.08em;white-space:nowrap}
.ladder--list a .arw{width:16px;height:16px;color:var(--gold);transition:transform .25s var(--ease)}
.ladder--list a:hover b{color:var(--gold-hi)}
.ladder--list a:hover .arw{transform:translateX(4px)}
`;
