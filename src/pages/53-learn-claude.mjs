// Learn Claude With Me: Biz's live class. Not a clearance file (no `file`), so the game counts don't change.
// Facts only from Biz's class draft: live, about an hour, $40 a class, what you do in it, bring your own project,
// times announced on the socials, booked through the calendar. Independent; not affiliated with Anthropic.
import { BIZ } from '../data/business.mjs';
import { CLASSES } from '../data/offers.mjs';
import { bookingBlock, BOOKING_CSS, BOOKING_JS } from '../data/booking.mjs';

const K = CLASSES[0];

const css = `
.lc-price{display:flex;align-items:baseline;gap:8px;margin-top:6px}
.lc-price b{font-family:var(--f-display);font-weight:900;font-size:clamp(56px,8vw,84px);line-height:.85;color:var(--gold)}
.lc-price span{color:var(--ash)}
.lc-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:start}
@media (max-width:860px){.lc-grid{grid-template-columns:1fr}}
.lc-note{font-size:15px;color:var(--ash)}
` + BOOKING_CSS;

export default {
  path: K.path,
  section: 'contact',
  title: K.name,
  description: `${K.name}: a live class with Biz, about an hour, ${K.price} a ${K.per}. Set up Claude, write posts, emails and your profile with it. Independent class, not affiliated with Anthropic.`,
  next: 'contact.html',
  css,
  js: BOOKING_JS,
  body: (c) => `
<header class="pagehead">
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'Get started', p: 'getstarted.html' }, { t: K.name }])}
    <p class="label">Live class · With Biz</p>
    <h1 class="h1">${K.name}</h1>
    <p class="lede">One hour, live, with Biz. Set up Claude and start your own work in it.</p>
    <div class="lc-price"><b>${K.price}</b><span>a ${K.per} · ${K.length.toLowerCase()}</span></div>
    <div class="ctas">${c.btn('Book a class', '#book', 'lg')}${c.btn(`Call or text ${BIZ.phone}`, BIZ.phoneHref, 'ghost')}</div>
  </div>
</header>

<section class="band" aria-labelledby="lc-what-h">
  <div class="wrap lc-grid">
    <div class="rv">
      <p class="label">What we do in the hour</p>
      <h2 class="h2" id="lc-what-h">Set it up. <span class="whisper">Then use it.</span></h2>
      <ul class="ticks">
        <li>Set up Claude</li>
        <li>Write posts, emails and your profile with it</li>
        <li>Turn your notes into plans</li>
        <li>Bring your own project and work on it</li>
      </ul>
    </div>
    <aside class="panel rv">
      <p class="label">Good to know</p>
      <ul class="ticks">
        <li>${K.price} a ${K.per}, ${K.length.toLowerCase()}</li>
        <li>Class times are announced on our socials</li>
        <li>Book a time below, or call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a></li>
      </ul>
      <p class="lc-note">An independent class run by Blackout Syndicate. Not affiliated with or endorsed by Anthropic, the company that makes Claude.</p>
    </aside>
  </div>
</section>
${bookingBlock({ id: 'book', label: 'Book a class', title: 'Pick your hour.', lead: `Choose a 1-hour slot that works for you. ${K.name} is ${K.price} a ${K.per}.` })}
`,
};
