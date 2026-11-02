// The booking calendar: Biz's Google Calendar booking page, embedded on a paper intake card.
// Booking is always optional; the form, a call or a text work just as well.
import { BIZ } from './business.mjs';

export const bookingBlock = ({ id = 'book', label = 'Optional · Pick a time', title = 'Want to talk first? Book a call.', lead = 'Pick a 1-hour slot that works for you. Or skip it: send the form, call or text, and we answer either way.' } = {}) => `
<section class="band bk" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    <div class="bk__card rv">
      <div class="bk__head">
        <p class="label">${label}</p>
        <h2 class="h3" id="${id}-h">${title}</h2>
        <p class="bk__lead">${lead}</p>
      </div>
      <div class="bk__frame">
        <iframe src="${BIZ.bookingEmbed}" title="Book a time with ${BIZ.founder.split(' ')[0]} (Google Calendar)" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>
      <p class="bk__alt">Calendar not showing? <a href="${BIZ.booking}" target="_blank" rel="noopener" data-book>Open the booking page</a> in a new tab.</p>
    </div>
  </div>
</section>`;

export const BOOKING_CSS = `
.band.bk.bk .bk__card,.band.bk.bk .bk__card *{text-shadow:none}
.bk__card{position:relative;background:var(--paper);color:var(--ink);padding:clamp(20px,3vw,34px);box-shadow:0 30px 60px -30px rgba(0,0,0,.8);display:grid;gap:18px}
.bk__card::before{content:"";position:absolute;inset:10px;border:1px dashed rgba(7,7,8,.25);pointer-events:none}
.bk__head{display:grid;gap:8px;max-width:62ch}
.bk__card .label{color:var(--ink-mute)}
.bk__card .h3{color:var(--ink)}
.bk__lead{color:var(--ink-mute);margin:0}
.bk__frame{position:relative;background:#fff;border:1px solid rgba(7,7,8,.2)}
.bk__frame iframe{display:block;width:100%;height:clamp(640px,80vh,760px);border:0}
@media (max-width:560px){.bk__frame iframe{height:820px}}
.bk__alt{margin:0;font-size:15px;color:var(--ink-mute)}
.bk__alt a{color:var(--ink);font-weight:600}
.bk__card a:focus-visible{outline-color:var(--ink)}
`;

// Taps on the booking link count like calls (X "call" event, if one is set). Clicks inside the
// Google iframe can't be seen from this site.
export const BOOKING_JS = `
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[data-book]');
  if (a && window.BS && BS.track) BS.track('call', { contents: [{ content_id: 'book', content_name: 'booking page' }] });
}, true);
`;
