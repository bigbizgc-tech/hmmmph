// One dedicated page per package and per built-to-order service (12 pages).
import { OFFERS, offerPath, bySlug } from '../data/offers.mjs';
import { BIZ } from '../data/business.mjs';
import config from '../config.mjs';

const KIND = {
  boost: { label: 'One-time boost', crumb: 'Boosts', stamp: ['One', 'Time'], stampSub: 'No contract' },
  plan: { label: 'Monthly plan', crumb: 'Plans', stamp: ['Every', 'Month'], stampSub: 'Stay or walk' },
  addon: { label: 'Add-on', crumb: 'Add-ons', stamp: ['Add', 'On'], stampSub: 'Pairs with any boost' },
  service: { label: 'Built to order', crumb: 'Built to order', stamp: ['Quoted', 'Per job'], stampSub: 'Price before work' },
};

// Level-2 classified: the real math behind each file.
const MATH = {
  spark: ['$19.99 total. About <strong>$10 buys the ad</strong>, the rest covers setup, aiming it and your recap.', 'Over a 3-day run that is about <strong>$3.33 a day</strong> of real ad money.', 'The 30-Day Post Kit is included. On its own it costs $19.99, so the push is the bonus.', 'Platforms spend the first part of any run learning who responds. That is one reason longer runs tend to get more out of each dollar.'],
  boost: ['$49.99 total. About <strong>$25 buys the ad</strong>: 2.5 times what Spark puts in.', 'Over a 5-day run that is about <strong>$5 a day</strong> of ad money.', 'On TikTok the same $25 runs as a one-day burst, so it lands hard on the day that counts.', 'If you already ran a Spark, Boost is the cheapest real step up.'],
  blitz: ['$99.99 total. About <strong>$50 buys the ad</strong>: double Boost, five times Spark.', 'Over a 7-day run that is about <strong>$7.14 a day</strong> of ad money on one platform.', 'Three Blitzes cost $299.97. Surge is $300 a month and never restarts from zero.', 'Book it at least a week before your date so the whole run lands before the doors open.'],
  surge: ['$300 a month. About <strong>$150 a month goes into the ads</strong> across up to 2 platforms.', 'That works out to roughly <strong>$5 a day</strong> of ad money, every day of the month.', 'One month only costs $450. Staying month to month saves $150 every month.', 'Three Blitzes would cost $299.97 for 21 days on one platform. Surge covers the whole month on two.'],
  overdrive: ['Launch price $400 a month. Regular price $650 a month.', 'Staying on the launch price saves <strong>$250 a month, $3,000 a year</strong>.', 'One month only costs $550, so month-to-month saves $150 on top.', 'Overdrive is $100 more than Surge, and that $100 buys automatic posting plus AI tools.'],
  'total-blackout': ['Launch price $500 a month. Regular price $800 a month.', 'Staying on the launch price saves <strong>$300 a month, $3,600 a year</strong>.', 'One month only costs $650. Month-to-month saves $150 on top.', 'It is $100 more than Overdrive, and that $100 adds the customer-answering AI assistant and a clean web page.'],
  'post-kit': ['$19.99 for a 30-day calendar and 12 captions works out to about <strong>$1.67 a caption</strong>.', 'It comes free with every Spark, so buying Spark gets you the kit and a paid push for the same $19.99.', 'Twelve posts in thirty days is about three a week. That is enough to look alive without burning out.'],
  'profile-fix': ['$49.99, one time. Nothing recurring.', 'Ads are wasted on a page that doesn’t explain itself. Fixing the page first makes every later push work harder.', 'You publish the changes yourself, so you never hand over a login.'],
  'website-design': ['Every site is quoted in writing before work starts. No hourly meter running.', 'Have these ready for the quote call: what you sell, your prices if you list them, your hours, your address or service area, and the domain you own.', 'A site built for phones first matters most for ads, because almost all social ad traffic arrives on a phone.'],
  'ai-consulting': ['Quoted in writing before we start.', 'Before the call, write down the five tasks you repeat most in a normal week. That list is where the time savings hide.', 'If AI is the wrong tool for a job, you will hear that too.'],
  'ai-automation': ['Quoted in writing before we build.', 'The best first automation is the question you answer most. Count how many times a day you type the same reply.', 'Every build is tested on real examples from your business before it goes live.'],
  'creator-systems': ['Quoted in writing before we build.', 'One stream can feed a week of short posts. The system is what makes that happen without filming more.', 'Pair it with a Boost when a clip takes off, and put money behind the thing that is already working.'],
};

export default () => OFFERS.map((o, i) => {
  const k = KIND[o.kind];
  const path = offerPath(o);
  const nextOffer = OFFERS[i + 1];
  const next = nextOffer ? offerPath(nextOffer) : 'how-it-works.html';
  const up = o.ladder && bySlug[o.ladder.to];
  const isService = o.kind === 'service';
  const claimLabel = isService ? `Get a ${o.name} quote` : `Claim ${o.name}`;
  const priceLine = isService ? 'Quoted per job' : `${o.price}${o.suffix}`;

  return {
    path,
    file: o.file,
    order: 10 + i,
    navTitle: o.name,
    h1: o.name,
    section: 'packages',
    kind: o.kind,
    offer: o.slug,
    title: `${o.name}${isService ? '' : ' · ' + o.price + o.suffix}`,
    description: `${o.name}: ${o.tagline} ${isService ? 'Quoted per job.' : o.price + o.suffix + (o.kind === 'plan' ? '' : ', one time') + '.'} Blackout Syndicate, ${BIZ.city}, ${BIZ.region}.`,
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
    body: (c) => `
<header class="pagehead offer-head">
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: isService ? 'Built to order' : 'Packages', p: isService ? 'packages.html#built' : 'packages.html' }, { t: o.name }])}
    <div class="offer-head__grid">
      <div class="offer-head__main">
        <p class="label">${o.file} · ${k.label}${o.flagship ? ' · <span class="label--red">Flagship</span>' : ''}</p>
        <h1 class="h1 offer-head__name">${o.name}</h1>
        <p class="lede">${o.tagline}</p>
        <div class="ctas">
          ${c.btn(claimLabel + ' ' + c.arrow, 'contact.html?pkg=' + o.slug, 'lg')}
          ${config.showPayLinks && o.store ? c.btn('Pay online', o.store, 'ghost lg') : c.btn('Call ' + BIZ.phone, BIZ.phoneHref, 'ghost lg')}
        </div>
      </div>
      <aside class="offer-card" aria-label="${o.name} at a glance">
        <div class="offer-card__top">
          <div class="price offer-card__price">${isService ? 'Quoted' : o.price}${o.suffix ? `<small>${o.suffix}</small>` : ''}</div>
          <div class="stamp stamp--gold is-slam" aria-hidden="true">${k.stamp[0]}<br>${k.stamp[1]}<small>${k.stampSub}</small></div>
        </div>
        <dl class="ledger">
          <div><dt>Type</dt><dd>${k.label}</dd></div>
          <div><dt>Run</dt><dd>${o.run}</dd></div>
          <div><dt>Best for</dt><dd>${o.bestFor}</dd></div>
          ${o.regular ? `<div><dt>Regular price</dt><dd>${o.regular}</dd></div>` : ''}
          ${o.oneMonth ? `<div><dt>One month only</dt><dd>${o.oneMonth}, no commitment</dd></div>` : ''}
        </dl>
        <p class="offer-card__spend">${o.spend}</p>
      </aside>
    </div>
  </div>
</header>

<section class="band" aria-labelledby="what-h">
  <div class="wrap split split--wide">
    <div class="prose rv">
      <p class="label">What it is</p>
      <h2 class="h2" id="what-h">The <span class="whisper">short version.</span></h2>
      <p class="lede">${o.summary}</p>
      ${o.kind === 'boost' || o.kind === 'plan' ? `<p class="muted small">${BIZ.resultsNote}</p>` : ''}
    </div>
    <div class="panel rv" style="--d:.1s">
      <p class="label">What you get</p>
      <ul class="ticks">${o.includes.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="band band--coal" aria-labelledby="run-h">
  <div class="wrap">
    <div class="band__head rv"><p class="label">How it runs</p><h2 class="h2" id="run-h">From hello <span class="whisper">to live.</span></h2></div>
    <ol class="steps rv" style="--n:${o.process.length}">${o.process.map((s) => `<li><h3>${s.t}</h3><p>${s.d}</p></li>`).join('')}</ol>
  </div>
</section>

<section class="band" aria-labelledby="fit-h">
  <div class="wrap">
    <div class="band__head rv"><p class="label">Straight talk</p><h2 class="h2" id="fit-h">Is this <span class="whisper">your file?</span></h2></div>
    <div class="grid grid--2 rv">
      <div class="panel"><p class="label">It’s for you if</p><ul class="ticks">${o.forYou.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <div class="panel"><p class="label label--red">It’s not for you if</p><ul class="ticks ticks--no">${o.notForYou.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    </div>
  </div>
</section>

<section class="band band--flush-top" aria-label="Classified">
  <div class="wrap wrap--narrow">
    ${c.classified({ id: 'math-' + o.slug, level: 2, title: isService ? `Before you call: the ${o.name} file` : `The math on ${o.name}`, body: `<ul>${(MATH[o.slug] || []).map((m) => `<li>${m}</li>`).join('')}</ul>` })}
  </div>
</section>

<section class="band band--coal" aria-labelledby="faq-h">
  <div class="wrap split">
    <div class="rv" style="display:grid;gap:18px;align-content:start">
      <p class="label">Questions</p>
      <h2 class="h2" id="faq-h">Asked <span class="whisper">and answered.</span></h2>
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
        <p class="lede">${isService ? 'Tell us what you need. You get a written price before any work starts.' : `Send the form and we’ll reach out to confirm the details and how you’d like to pay. ${o.kind === 'plan' ? 'Your first month starts with the intake call.' : 'Our target is live within 24 hours of payment.'}`}</p>
        <div class="ctas">${c.btn(claimLabel + ' ' + c.arrow, 'contact.html?pkg=' + o.slug, 'lg')}${config.showPayLinks && o.store ? c.btn('Pay online now', o.store, 'ghost lg') : ''}</div>
        <p class="small muted">Or call or text <a href="${BIZ.phoneHref}" style="color:var(--gold)">${BIZ.phone}</a>.</p>
      </div>
      <div class="claim__side">
        <div class="price claim__price">${isService ? 'Quoted' : o.price}${o.suffix ? `<small>${o.suffix}</small>` : ''}</div>
        <p class="label label--dim">${priceLine === 'Quoted per job' ? 'Price before work starts' : o.cadence}</p>
        ${up ? `<a class="ladder" href="${c.link(offerPath(up))}"><span class="label">Next step up · ${up.file}</span><b>${up.name}</b><span>${o.ladder.text}</span><span class="file__open">Open file ${c.arrow}</span></a>` : ''}
      </div>
    </div>
  </div>
</section>`,
    css: OFFER_CSS,
  };
});

const OFFER_CSS = `
.offer-head__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,400px);gap:clamp(28px,5vw,72px);align-items:end}
@media (max-width:900px){.offer-head__grid{grid-template-columns:1fr}}
.offer-head__main{display:grid;gap:22px;min-width:0}
.offer-head__name{overflow-wrap:anywhere}
.offer-card{background:var(--coal);border:1px solid var(--smoke);padding:24px 22px;display:grid;gap:16px;position:relative;min-width:0}
.offer-card::before{content:"";position:absolute;inset:-1px -1px auto auto;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.offer-card__top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.offer-card__price{font-size:clamp(52px,6vw,74px)}
.offer-card .stamp{width:118px;font-size:19px;flex:none}
.offer-card__spend{font-size:14.5px;color:var(--ash);border-top:1px dashed var(--smoke);padding-top:14px}
.claim{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:clamp(28px,5vw,72px);padding:clamp(28px,4.5vw,56px);border:1px solid var(--gold);background:linear-gradient(160deg,#211a0d,var(--coal) 60%);align-items:start}
@media (max-width:860px){.claim{grid-template-columns:1fr}}
.claim__main{display:grid;gap:20px;min-width:0}
.claim__side{display:grid;gap:12px;min-width:0}
.claim__price{font-size:clamp(64px,8vw,104px)}
.ladder{display:grid;gap:6px;margin-top:14px;padding:18px;border:1px solid var(--smoke);background:var(--void);text-decoration:none;color:var(--paper);transition:border-color .3s}
.ladder:hover{border-color:var(--gold)}
.ladder b{font-family:var(--f-display);font-weight:900;font-size:36px;line-height:.9;text-transform:uppercase}
.ladder span:not(.label):not(.file__open){color:var(--ash);font-size:15px}
`;
