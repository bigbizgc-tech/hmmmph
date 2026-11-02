// File 17: Contact. The direct line, the intake form (engine-driven lead form), service area and socials.
// Field names match the lead form engine in site.js exactly: name, business, email, phone, interest, platform, reach, message, _honey.
import { BIZ, SOCIALS, PLATFORMS, POLICY, XP } from '../data/business.mjs';
import { OFFERS, offerPath } from '../data/offers.mjs';

const GROUPS = [
  { kind: 'boost', t: 'One-time boosts' },
  { kind: 'plan', t: 'Monthly plans' },
  { kind: 'addon', t: 'Add-ons' },
  { kind: 'service', t: 'Built to order' },
];
const KIND = { boost: 'One-time boost', plan: 'Monthly plan', addon: 'Add-on', service: 'Built to order' };
const priceOf = (o) => (o.kind === 'service' ? 'Quoted' : o.price + o.suffix);
// One plain line shown under the select once a package is picked.
const noteFor = (o) => {
  if (o.kind === 'boost') return `${KIND.boost} · ${o.run}. ${o.spend}`;
  if (o.kind === 'plan') return `${KIND.plan} · ${o.price}${o.suffix}${o.oneMonth ? `, or ${o.oneMonth} for one month only` : ''}. ${o.spend}`;
  if (o.kind === 'addon') return `${KIND.addon} · ${o.run}. ${o.tagline}`;
  return `${KIND.service} · ${o.spend}`;
};
const TEL = BIZ.phoneHref.replace('tel:', '');

const css = `
/* ── Head: make contact + the direct line ── */
.ct-head__grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,500px);gap:clamp(28px,5vw,72px);align-items:end}
@media (max-width:1100px){.ct-head__grid{grid-template-columns:1fr;align-items:start}.ct-line{max-width:560px}}
.ct-head__main{display:grid;gap:22px;min-width:0}
.ct-down .arw{rotate:90deg}
.ct-line{--x:70%;--y:30%;position:relative;display:grid;gap:16px;padding:clamp(20px,2.6vw,28px);background:var(--coal);border:1px solid var(--smoke);isolation:isolate;min-width:0}
.ct-line::before{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(320px circle at var(--x) var(--y),rgba(217,178,95,.2),transparent 70%)}
.ct-line::after{content:"";position:absolute;top:-1px;right:-1px;width:30px;height:30px;border-top:2px solid var(--gold);border-right:2px solid var(--gold)}
.ct-line__top{display:flex;justify-content:space-between;gap:8px 12px;flex-wrap:wrap}
.ct-line__num{font-family:var(--f-display);font-weight:900;font-size:clamp(46px,4.9vw,68px);line-height:.88;color:var(--gold-hi);text-decoration:none;white-space:nowrap;font-variant-numeric:tabular-nums;letter-spacing:.005em;text-shadow:0 0 38px rgba(243,212,138,.28);width:fit-content;max-width:100%;transition:color .2s}
.ct-line__num:hover{color:var(--paper)}
@media (max-width:1100px){.ct-line__num{font-size:clamp(36px,12vw,76px)}}
.ct-line__acts{display:flex;flex-wrap:wrap;gap:8px}
.ct-line__acts .btn{flex:1 1 auto}
.ct-line__mail{font-family:var(--f-type);font-size:14px;letter-spacing:.04em;color:var(--ash);overflow-wrap:anywhere;border-top:1px dashed var(--smoke);padding-top:14px}
.ct-line__mail a{color:var(--paper);text-decoration:none;border-bottom:1px solid var(--brass)}
.ct-line__mail a:hover{color:var(--gold)}

/* ── Main: info column + intake form ── */
.ct-main{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(36px,5vw,80px);align-items:start}
.ct-main>.intake{grid-column:2;grid-row:1}
.ct-main>.ct-info{grid-column:1;grid-row:1}
@media (max-width:980px){.ct-main{grid-template-columns:1fr}.ct-main>.intake,.ct-main>.ct-info{grid-column:1;grid-row:auto}}
.ct-info{display:grid;gap:clamp(52px,6vw,76px);min-width:0;padding-top:26px}
.ct-block{display:grid;gap:18px;align-content:start;min-width:0}
.ct-h{font-family:var(--f-display);font-weight:900;font-size:clamp(38px,4vw,54px);line-height:.9;text-transform:uppercase}
.ct-h .whisper{font-size:.72em}
.ct-next{list-style:none;counter-reset:n;display:grid;border-top:1px solid var(--smoke)}
.ct-next li{counter-increment:n;display:grid;grid-template-columns:60px minmax(0,1fr);gap:6px 16px;padding:20px 0;border-bottom:1px solid var(--smoke)}
.ct-next li::before{content:counter(n,decimal-leading-zero);grid-row:span 2;font-family:var(--f-display);font-weight:900;font-size:50px;line-height:.8;color:transparent;-webkit-text-stroke:1.5px var(--gold);transition:color .3s}
.ct-next li:hover::before{color:var(--gold)}
.ct-next h3{font-family:var(--f-display);font-weight:800;font-size:25px;line-height:1.02;text-transform:uppercase;letter-spacing:.02em}
.ct-next p{color:var(--ash);font-size:15.5px}
.ct-block .lines__big{font-size:clamp(34px,3.4vw,44px)}
.ct-follow{margin-top:8px}

/* service area: the territory */
.terr{position:relative;height:156px;border:1px solid var(--smoke);background:var(--coal);overflow:hidden;isolation:isolate}
.terr::before{content:"";position:absolute;inset:0;z-index:-3;opacity:.55;background-image:linear-gradient(var(--smoke) 1px,transparent 1px),linear-gradient(90deg,var(--smoke) 1px,transparent 1px);background-size:26px 26px}
.terr__beam{position:absolute;left:12%;top:53%;z-index:-2}
.terr__beam::before{content:"";position:absolute;width:640px;height:640px;left:-320px;top:-320px;border-radius:50%;background:conic-gradient(from 60deg,rgba(243,212,138,.34),rgba(243,212,138,.08) 22deg,transparent 34deg 360deg);-webkit-mask-image:radial-gradient(closest-side,#000 10%,transparent);mask-image:radial-gradient(closest-side,#000 10%,transparent);animation:terrSweep 9s linear infinite}
@keyframes terrSweep{to{transform:rotate(360deg)}}
.terr__river{position:absolute;inset:0;width:100%;height:100%;z-index:-1}
.terr__river path{fill:none;stroke:var(--brass);stroke-width:2;stroke-linecap:round;vector-effect:non-scaling-stroke}
.terr__river path+path{stroke:rgba(217,178,95,.16);stroke-width:7}
.terr__pin{position:absolute;left:var(--px);top:var(--py);width:0;height:0}
.terr__pin i{position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:var(--gold-hi);box-shadow:0 0 0 4px rgba(217,178,95,.22),0 0 18px rgba(243,212,138,.85)}
.terr__pin--hq i{left:-8px;top:-8px;width:16px;height:16px}
.terr__pin b{position:absolute;top:14px;left:0;transform:translateX(-50%);font-family:var(--f-type);font-weight:700;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--paper);white-space:nowrap;text-shadow:0 1px 6px var(--void)}
.terr__pin--hq b{transform:translateX(-14px)}
.terr__pin--up b{top:auto;bottom:14px}
.terr__net{position:absolute;right:12px;top:10px;font-family:var(--f-type);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);background:var(--coal);padding:2px 6px}

/* ── The intake form: a paper dossier ── */
.intake{position:relative;padding-top:26px;min-width:0;scroll-margin-top:90px}
.intake__tab{position:absolute;left:0;top:0;height:27px;display:flex;align-items:center;padding:2px 26px 0 14px;background:var(--paper);clip-path:polygon(0 0,84% 0,100% 100%,0 100%);font-family:var(--f-type);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute)}
.intake__sheet.form{background:var(--paper);color:var(--ink);border:0;gap:22px;padding:clamp(20px,3.6vw,42px);background-image:repeating-linear-gradient(transparent 0 31px,rgba(23,20,15,.045) 31px 32px);box-shadow:0 40px 80px -40px rgba(0,0,0,.95)}
.intake__sheet::before{content:"";position:absolute;top:0;right:0;width:46px;height:46px;background:linear-gradient(225deg,var(--void) 50%,var(--paper-2) 50%)}
.intake ::selection{background:var(--ink);color:var(--paper)}
.intake :focus-visible{outline-color:var(--ink)}
.intake__head{position:relative;display:grid;gap:12px;padding-right:clamp(100px,12vw,146px);min-height:110px;align-content:start}
.intake__head .label{color:var(--brass)}
.intake__h{font-family:var(--f-display);font-weight:900;font-size:clamp(34px,3.4vw,48px);line-height:.92;text-transform:uppercase}
.intake__h .whisper{color:var(--brass);font-size:.8em}
.intake__need{font-size:14.5px;color:var(--ink-mute)}
.intake__need b{color:var(--signal)}
.intake__subject{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline;font-family:var(--f-type);font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-mute)}
.intake__subject span+span{font-size:16px;letter-spacing:.02em;text-transform:none;color:var(--ink);border-bottom:1px solid rgba(23,20,15,.35);min-width:12ch;max-width:100%;overflow-wrap:anywhere;padding-bottom:1px}
.intake__stamp.stamp{position:absolute;top:-6px;right:-8px;width:clamp(100px,10vw,126px);font-size:clamp(17px,1.6vw,20px);padding:10px;--c:var(--ink-mute);color:var(--c);border:2.5px dashed var(--c);box-shadow:none;opacity:.85;transition:color .3s,border-color .3s}
.intake__stamp small{font-size:9.5px;letter-spacing:.12em}
.intake__stamp [data-s]{display:none}
.intake__stamp[data-state="draft"] [data-s="draft"],.intake__stamp[data-state="ready"] [data-s="ready"],.intake__stamp[data-state="sent"] [data-s="sent"]{display:block}
.intake__stamp[data-state="ready"]{--c:var(--brass);border-style:solid;opacity:1;box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--c)}
.intake__stamp[data-state="sent"]{--c:var(--signal);border-style:solid;opacity:1;box-shadow:inset 0 0 0 5px var(--paper),inset 0 0 0 6.5px var(--c)}
.intake fieldset{border:0;margin:0;padding:0;min-width:0}
.intake legend{padding:0;margin-bottom:9px}
.intake .field > label,.intake .field__label{color:var(--ink-mute)}
.intake .field > label b,.intake .field__label b{color:var(--signal);font-weight:700}
.intake .field input,.intake .field select,.intake .field textarea{color:var(--ink);background-color:color-mix(in srgb,var(--paper-2) 60%,transparent);border:0;border-bottom:1.5px solid rgba(23,20,15,.45);font-family:var(--f-type);font-size:17px;padding:12px 12px 10px;transition:border-color .2s,box-shadow .2s,background-color .2s}
.intake .field textarea{border:1.5px solid rgba(23,20,15,.3);min-height:140px;line-height:1.55}
.intake .field select{color-scheme:light;background-image:linear-gradient(45deg,transparent 50%,var(--ink) 50%),linear-gradient(135deg,var(--ink) 50%,transparent 50%);cursor:pointer}
.intake option,.intake optgroup{color:var(--ink);background:var(--paper)}
.intake .field input:hover,.intake .field select:hover,.intake .field textarea:hover{border-color:var(--ink)}
.intake .field input:focus,.intake .field select:focus,.intake .field textarea:focus{border-color:var(--ink);background-color:var(--paper);box-shadow:0 0 0 3px color-mix(in srgb,var(--gold) 55%,transparent)}
.intake .field input::placeholder,.intake .field textarea::placeholder{color:var(--ink-mute);opacity:.72}
.intake .field [aria-invalid="true"]{border-color:var(--signal);background-color:color-mix(in srgb,var(--signal) 9%,transparent)}
.intake .field__err{color:var(--ink);font-weight:600;display:flex;gap:8px;align-items:baseline}
.intake .field__err::before{content:"";flex:none;width:10px;height:10px;background:var(--signal);clip-path:polygon(20% 0,50% 30%,80% 0,100% 20%,70% 50%,100% 80%,80% 100%,50% 70%,20% 100%,0 80%,30% 50%,0 20%)}
.intake .field__err:empty{display:none}
.intake .field__hint{color:var(--ink-mute)}
.intake .field__hint a{color:var(--ink);font-weight:600;text-underline-offset:3px}
.intake .chip span{display:inline-flex;align-items:center;gap:8px;padding:9px 14px;border-color:rgba(23,20,15,.35);color:var(--ink);background:transparent}
.intake .chip .ico{width:15px;height:15px;flex:none}
.intake .chip:hover span{border-color:var(--ink)}
.intake .chip input:checked + span{background:var(--ink);color:var(--gold-hi);border-color:var(--ink)}
.intake .chip input:focus-visible + span{outline:2px solid var(--ink);outline-offset:2px}
.intake__pick{font-size:14.5px;line-height:1.5}
.intake__pick b{color:var(--ink)}
.intake__pick .label{display:block;color:var(--brass);margin-bottom:3px}
.intake .form__alert{color:var(--paper)}
.intake .form__alert[hidden]{display:none}
.intake .field{align-content:start}
.intake .form__alert strong{color:var(--gold-hi)}
.intake__send{display:flex;flex-wrap:wrap;align-items:center;gap:14px 20px;border-top:1px dashed rgba(23,20,15,.25);padding-top:22px}
.intake__btn.btn{--bg:var(--ink);--fg:var(--gold-hi);--bd:var(--ink)}
.intake__btn.btn:hover{--bg:var(--void)}
.intake__btn.btn::after{background:linear-gradient(100deg,transparent,rgba(243,212,138,.35),transparent)}
.intake__xp{display:inline-flex;align-items:baseline;gap:8px;font-family:var(--f-type);font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-mute)}
.intake__xp b{font-family:var(--f-display);font-weight:900;font-size:26px;letter-spacing:0;color:var(--brass)}
.intake .form__fine{color:var(--ink-mute)}
.intake__nojs{display:none}
.no-js .intake__nojs{display:grid;color:var(--ink);border-color:var(--signal)}
.no-js .intake__nojs a{color:var(--ink)}
.no-js .intake__send,.no-js .intake__stamp,.no-js .intake__subject{display:none}
.intake .form__fine a{color:var(--ink);text-underline-offset:3px}
@media (max-width:560px){
  .intake__head{padding-right:0;min-height:0}
  .intake__head .label,.intake__need{padding-right:96px}
  .intake__stamp.stamp{width:92px;font-size:15px;top:-4px;right:-4px;padding:8px}
  .intake__stamp small{font-size:8.5px}
  .intake__btn.btn{width:100%}
}

/* ── Not ready to write ── */
.ct-doors a{position:relative;display:grid;gap:12px;align-content:start;padding:26px 24px 24px;background:var(--void);border:1px solid var(--smoke);text-decoration:none;color:var(--paper);min-width:0;transition:border-color .3s,transform .3s var(--ease)}
.ct-doors a:hover,.ct-doors a:focus-visible{border-color:var(--gold);transform:translateY(-3px)}
.ct-doors b{font-family:var(--f-display);font-weight:900;font-size:clamp(36px,3.4vw,46px);line-height:.88;text-transform:uppercase;transition:color .3s}
.ct-doors a:hover b{color:var(--gold-hi)}
.ct-doors span:not(.label):not(.file__open){color:var(--ash);font-size:15.5px}
.ct-doors .file__open{margin-top:6px}
.ct-doors a:hover .file__open .arw{transform:translateX(5px)}
`;

const js = `
(() => {
  const form = document.querySelector('[data-intake]');
  if (!form) return;
  const q = (s) => form.querySelector(s);
  const name = q('[name="name"]'), email = q('[name="email"]'), phone = q('[name="phone"]'), sel = q('[name="interest"]');
  const stamp = q('[data-intake-stamp]'), count = q('[data-intake-count]'), subj = q('[data-intake-subject]');
  const pick = q('[data-pick]'), star = q('[data-phone-star]'), btn = q('[type="submit"]'), alertBox = q('[data-form-alert]');
  const BLANK = subj ? subj.textContent : '';
  const EMPTY = pick ? pick.innerHTML : '';
  const emailOk = () => /^\\S+@\\S+\\.\\S+$/.test(email.value.trim());
  const keep = (k, v) => { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } };
  let state = 'draft';
  const setState = (s) => {
    if (!stamp || state === s) return;
    state = s; stamp.dataset.state = s;
    stamp.classList.remove('is-slam');
    if (s !== 'draft') { void stamp.offsetWidth; stamp.classList.add('is-slam'); }
  };
  // live stamp: counts what is still missing; the subject line types the name onto the file
  function check() {
    const missing = [name.value.trim(), emailOk(), sel.value, !phone.required || phone.value.trim()].filter((v) => !v).length;
    if (count) count.textContent = missing ? missing + (missing === 1 ? ' detail needed' : ' details needed') : '';
    if (state !== 'sent') setState(missing ? 'draft' : 'ready');
    if (subj) subj.textContent = name.value.trim() || BLANK;
  }
  // the note under the package select
  function showPick(from) {
    if (!pick) return;
    const o = sel.selectedOptions[0];
    if (!o || !o.value) { pick.innerHTML = EMPTY; return; }
    pick.textContent = '';
    if (o.value === 'unsure') {
      pick.append('No problem. Tell us what you’re pushing in the message and we’ll point you at the right file. Or ');
      const a = document.createElement('a'); a.href = pick.dataset.match; a.textContent = 'take the three-question match';
      pick.append(a, ' first.');
      return;
    }
    if (from) { const l = document.createElement('span'); l.className = 'label'; l.textContent = from; pick.append(l); }
    const b = document.createElement('b'); b.textContent = o.dataset.name;
    const a = document.createElement('a'); a.href = o.dataset.href; a.textContent = 'Open the ' + o.dataset.name + ' file';
    pick.append(b, ' · ' + o.dataset.note + ' ', a);
  }
  // picking call or text makes the phone number needed
  const reachMsg = { Call: 'Add a phone number so we can call you.', Text: 'Add a phone number so we can text you.' };
  form.querySelectorAll('[name="reach"]').forEach((r) => r.addEventListener('change', () => {
    const need = !!reachMsg[r.value];
    phone.required = need;
    if (need) phone.dataset.msg = reachMsg[r.value];
    if (star) star.hidden = !need;
    if (!need && phone.getAttribute('aria-invalid') === 'true') {
      phone.setAttribute('aria-invalid', 'false');
      const e = q('[data-err-for="phone"]'); if (e) e.textContent = '';
    }
    keep('bs2.reach', r.value);
    check();
  }));
  form.addEventListener('input', check);
  sel.addEventListener('change', () => { showPick(''); check(); });

  // after the engine has wired the form (and preselected ?pkg= or the last package file opened)
  const go = () => {
    const pre = sel.value && sel.value !== 'unsure';
    showPick(pre ? (new URLSearchParams(location.search).has('pkg') ? 'From the file you came from' : 'From the last file you opened') : '');
    check();
    form.addEventListener('submit', () => { if (btn && btn.disabled) setState('sent'); });
    if (alertBox) new MutationObserver(() => { if (!alertBox.hidden) { state = 'draft'; check(); } }).observe(alertBox, { attributes: true, attributeFilter: ['hidden'] });
  };
  if (window.BS) go(); else document.addEventListener('bs:ready', go);
})();
`;

export default {
  path: 'contact.html',
  file: 'File 17',
  order: 50,
  navTitle: 'Contact',
  section: 'contact',
  title: 'Contact',
  description: `Call or text ${BIZ.phone}, email ${BIZ.email}, or send the form. Real paid ads, content and AI setup for ${BIZ.area.slice(0, -1).join(', ')} and ${BIZ.area.slice(-1)}.`,
  teaser: 'Make contact. Real person, real phone.',
  next: 'vault.html',
  css, js,
  jsonld: (ctx, cfg) => ({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${BIZ.name}`,
    url: cfg.siteUrl + '/contact.html',
    mainEntity: {
      '@type': 'ProfessionalService',
      name: BIZ.name,
      url: cfg.siteUrl + '/',
      telephone: TEL,
      email: BIZ.email,
      address: { '@type': 'PostalAddress', addressLocality: BIZ.city, addressRegion: BIZ.region, addressCountry: 'US' },
      areaServed: BIZ.area.map((a) => ({ '@type': 'City', name: `${a}, ${BIZ.region}` })),
      contactPoint: { '@type': 'ContactPoint', telephone: TEL, email: BIZ.email, contactType: 'customer service' },
      sameAs: SOCIALS.map((s) => s.url),
    },
  }),
  body: (c) => {
    const options = GROUPS.map((g) => `<optgroup label="${g.t}">${OFFERS.filter((o) => o.kind === g.kind).map((o) => `<option value="${o.slug}" data-slug="${o.slug}" data-name="${c.esc(o.name)}" data-note="${c.esc(noteFor(o))}" data-href="${c.link(offerPath(o))}">${c.esc(o.name)} · ${priceOf(o)}</option>`).join('')}</optgroup>`).join('');
    const platformChips = [...PLATFORMS.map((p) => ({ v: p.name, icon: p.name.toLowerCase() })), { v: 'Not sure' }]
      .map((p) => `<label class="chip"><input type="radio" name="platform" value="${p.v}"><span>${p.icon ? c.icon(p.icon) : ''}${p.v}</span></label>`).join('');
    const reachChips = ['Call', 'Text', 'Email'].map((v) => `<label class="chip"><input type="radio" name="reach" value="${v}"><span>${v}</span></label>`).join('');
    const field = (id, label, input, { req = false, hint = '' } = {}) => `
        <div class="field">
          <label for="f-${id}">${label}${req ? ' <b aria-hidden="true">*</b>' : ''}</label>
          ${input}
          ${hint}
          <p class="field__err" id="err-${id}" data-err-for="${id}"></p>
        </div>`;

    return `
<header class="pagehead ct-head">
  <div class="wrap pagehead__in">
    ${c.crumbs([{ t: 'Home', p: 'index.html' }, { t: 'Contact' }])}
    <div class="ct-head__grid">
      <div class="ct-head__main">
        <p class="label">${c.page.file} · Make contact</p>
        <h1 class="h1">Make <span class="whisper">contact.</span></h1>
        <p class="lede">Tell us what you’re pushing and where your people are. We’ll tell you straight which package fits, or whether you need one at all.</p>
        <div class="ctas"><a class="btn btn--lg ct-down" href="#intake">Send a message ${c.arrow}</a></div>
      </div>
      <aside class="ct-line" data-spot aria-label="Direct line">
        <div class="ct-line__top"><span class="label">The direct line</span><span class="label label--dim">Call or text</span></div>
        <a class="ct-line__num" href="${BIZ.phoneHref}">${BIZ.phone}</a>
        <div class="ct-line__acts">
          ${c.btn('Call', BIZ.phoneHref)}
          ${c.btn('Text', BIZ.sms, 'ghost')}
          ${c.btn('Email', 'mailto:' + BIZ.email, 'ghost')}
        </div>
        <p class="ct-line__mail">Or write to <a href="mailto:${BIZ.email}">${BIZ.email}</a></p>
      </aside>
    </div>
  </div>
</header>

<section class="band" aria-label="Contact details and form">
  <div class="wrap ct-main">

    <div class="intake rv" id="intake">
      <span class="intake__tab" aria-hidden="true">Intake · ${c.page.file}</span>
      <form class="form intake__sheet" method="post" data-lead data-intake novalidate aria-labelledby="intake-h">
        <div class="intake__head">
          <p class="label">Intake form</p>
          <h2 class="intake__h" id="intake-h">Tell us what you’re <span class="whisper">pushing.</span></h2>
          <p class="intake__need">Fields with a <b>*</b> are needed. The rest helps us aim.</p>
          <p class="intake__subject" aria-hidden="true"><span>Subject</span><span data-intake-subject>________________</span></p>
          <div class="stamp intake__stamp" data-intake-stamp data-state="draft" aria-hidden="true">
            <span data-s="draft">Intake<small data-intake-count>3 details needed</small></span>
            <span data-s="ready">Ready<small>Send it</small></span>
            <span data-s="sent">Filed<small>On the desk</small></span>
          </div>
        </div>

        <div class="form__row">
          ${field('name', 'Your name', `<input id="f-name" name="name" type="text" autocomplete="name" required data-msg="We need a name to put on the file." aria-describedby="err-name">`, { req: true })}
          ${field('business', 'Business or channel', `<input id="f-business" name="business" type="text" autocomplete="organization" placeholder="Shop name or @handle" aria-describedby="err-business">`)}
        </div>
        <div class="form__row">
          ${field('email', 'Email', `<input id="f-email" name="email" type="email" inputmode="email" autocomplete="email" required data-msg="Add an email so we can write back." placeholder="you@example.com" aria-describedby="err-email">`, { req: true })}
          ${field('phone', 'Phone <b data-phone-star hidden aria-hidden="true">*</b>', `<input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" aria-describedby="hint-phone err-phone">`, { hint: '<p class="field__hint" id="hint-phone">Needed if you’d like a call or a text.</p>' })}
        </div>

        ${field('interest', 'Package or service', `<select id="f-interest" name="interest" required data-msg="Pick a package, or choose Not sure yet." aria-describedby="pick-note err-interest">
            <option value="">Choose one</option>
            <option value="unsure" data-slug="unsure">Not sure yet, help me pick</option>
            ${options}
          </select>`, { req: true, hint: `<p class="field__hint intake__pick" id="pick-note" data-pick data-match="${c.link('packages.html#match')}" aria-live="polite">Not sure? Choose <b>Not sure yet</b> and we’ll help you pick. Every package has its own <a href="${c.link('packages.html')}">file</a> if you want to read first.</p>` })}

        <fieldset class="field">
          <legend class="field__label">Platform</legend>
          <div class="chips">${platformChips}</div>
          <p class="field__err" data-err-for="platform"></p>
        </fieldset>

        <fieldset class="field">
          <legend class="field__label">Best way to reach you</legend>
          <div class="chips">${reachChips}</div>
          <p class="field__err" data-err-for="reach"></p>
        </fieldset>

        ${field('message', 'What are you pushing?', `<textarea id="f-message" name="message" rows="5" placeholder="What you sell or make, who it’s for, and any date that matters." aria-describedby="err-message"></textarea>`)}

        <label class="hp" aria-hidden="true">Leave this field empty <input name="_honey" tabindex="-1" autocomplete="off"></label>
        <div class="form__alert" data-form-alert role="alert" hidden></div>

        <p class="note intake__nojs"><span>JavaScript is off in this browser, so this form can’t send. Call or text <a href="${BIZ.phoneHref}">${BIZ.phone}</a> or email <a href="mailto:${BIZ.email}">${BIZ.email}</a> instead.</span></p>
        <div class="intake__send">
          <button class="btn btn--lg intake__btn" type="submit">Send it ${c.arrow}</button>
          <span class="intake__xp"><b>+${XP.lead}</b> clearance when it’s sent</span>
        </div>
        <p class="form__fine">Sending this doesn’t charge you anything. It’s emailed to us so we can get back to you about what you asked. The <a href="${c.link('privacy.html')}">privacy page</a> covers what we collect and why.</p>
      </form>
    </div>

    <div class="ct-info">
      <section class="ct-block rv" aria-labelledby="next-h">
        <p class="label">After you send it</p>
        <h2 class="ct-h" id="next-h">What happens <span class="whisper">next.</span></h2>
        <ol class="ct-next">
          <li><h3>We read it</h3><p>It comes straight to us and a person reads it. No bots on this end either.</p></li>
          <li><h3>We reach out the way you asked</h3><p>Call, text or email. Pick one on the form and that’s how we get back to you.</p></li>
          <li><h3>We confirm before anything starts</h3><p>${POLICY.payment} Nothing runs without your OK.</p></li>
        </ol>
      </section>

      <section class="ct-block rv" aria-labelledby="line-h">
        <p class="label">Direct line</p>
        <h2 class="ct-h" id="line-h">Call, text <span class="whisper">or write.</span></h2>
        ${c.contactLines()}
        <p class="label label--dim ct-follow">Follow the Syndicate</p>
        ${c.socialRow()}
      </section>

      <section class="ct-block rv" aria-labelledby="area-h">
        <p class="label">Service area</p>
        <h2 class="ct-h" id="area-h">Where <span class="whisper">we work.</span></h2>
        <div class="terr" aria-hidden="true">
          <span class="terr__beam"></span>
          <svg class="terr__river" viewBox="0 0 400 156" preserveAspectRatio="none" focusable="false"><path d="M400 60 C372 64 346 80 320 79 S262 66 222 78 S162 98 128 89 S80 76 48 83 S20 62 14 0"/><path d="M400 60 C372 64 346 80 320 79 S262 66 222 78 S162 98 128 89 S80 76 48 83 S20 62 14 0"/></svg>
          <span class="terr__pin terr__pin--hq" style="--px:12%;--py:53.2%"><i></i><b>South Bend</b></span>
          <span class="terr__pin terr__pin--up" style="--px:32%;--py:57%"><i></i><b>Mishawaka</b></span>
          <span class="terr__pin" style="--px:80%;--py:50.6%"><i></i><b>Elkhart</b></span>
          <span class="terr__net">Online · anywhere</span>
        </div>
        <p class="muted">We’re based in ${BIZ.city} and work across ${BIZ.area.slice(1).join(' and ')}. AI setup can happen in person around here. Ads, content and the rest run online, so you can be anywhere.</p>
      </section>
    </div>

  </div>
</section>

<section class="band band--coal" aria-labelledby="ready-h">
  <div class="wrap">
    <div class="band__head rv">
      <p class="label">Still deciding</p>
      <h2 class="h2" id="ready-h">Not ready <span class="whisper">to write?</span></h2>
      <p>Fair. Open a few more files first. Every one you read raises your clearance.</p>
    </div>
    <div class="grid grid--3 ct-doors rv">
      <a href="${c.link('packages.html#match')}"><span class="label">+${XP.quiz} clearance</span><b>Find my package</b><span>Three questions. We point you at the file that fits.</span><span class="file__open">Take the match ${c.arrow}</span></a>
      <a href="${c.link('faq.html')}"><span class="label">Straight answers</span><b>Read the FAQ</b><span>Refunds, recaps, contracts and passwords, answered word for word.</span><span class="file__open">Open the FAQ ${c.arrow}</span></a>
      <a href="${c.link('how-it-works.html')}"><span class="label">The full play</span><b>How it works</b><span>From the first message to the recap, step by step.</span><span class="file__open">See the play ${c.arrow}</span></a>
    </div>
  </div>
</section>`;
  },
};
