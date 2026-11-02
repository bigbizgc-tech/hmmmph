// Poster art for the reel clips, shared by the home page reel and the Reel page (work.html), so a clip
// looks the same wherever it shows. Pure decoration: every piece is aria-hidden and drawn from the clip's
// own title, so a new REEL entry gets art without new code.
//   artFor(r)        → which poster a clip gets: 'beam' (our spots), 'reticle' (Graveshift), 'vs', 'strip' (channel)
//   clipArt(r, k)    → the poster markup. It fills the link it sits in (position:absolute; inset:0; z-index:-2),
//                      so the link needs position:relative and isolation:isolate.
//   CLIP_ART_CSS     → the styles. Hover motion keys off the link the art sits in (a:hover > .rl-art).
//                      Sizes read custom properties, so a smaller card can scale the art down:
//                      --art-words (beam word size), --art-top (beam word top), --vs-size, --vs-a, --vs-b, --vs-x
//                      (showdown word size and tops), --ret-w and --ret-top (reticle width and top).
export const VS = /\s+vs\.?\s+/i;
export const artFor = (r) => (VS.test(r.title) ? 'vs' : /graveshift/i.test(r.who) ? 'reticle' : r.kind === 'Channel' ? 'strip' : 'beam');

const RETICLE = `<svg class="rl-ret" viewBox="0 0 200 200" focusable="false">
  <g class="rl-ret__spin"><circle cx="100" cy="100" r="86"/>${Array.from({ length: 36 }, (_, i) => `<path d="M100 ${i % 3 ? 16 : 10}V22" transform="rotate(${i * 10} 100 100)"/>`).join('')}</g>
  <circle cx="100" cy="100" r="58" class="rl-ret__mid"/>
  <path d="M100 130V170M30 100H70M130 100H170" class="rl-ret__cross"/>
  <g class="rl-ret__cup" transform="translate(100 54) scale(.8) translate(-100 -100)"><path d="M84 80h32v9c0 11-7 18-16 18s-16-7-16-18Z"/><path d="M84 84h-7c0 8 4 12 9 13M116 84h7c0 8-4 12-9 13M100 107v9M89 121h22"/></g>
</svg>`;

const FRAMES = ['g', 'r', 's', 'g', 's', 'r', 'g', 's'];

export function clipArt(r, k = artFor(r)) {
  if (k === 'vs') {
    const [a, b] = r.title.split(VS);
    return `<span class="rl-art rl-art--vs" aria-hidden="true"><span class="rl-vs rl-vs--a"><span>${a}</span></span><span class="rl-vs rl-vs--b"><span>${b}</span></span><span class="rl-vs__slash"></span><span class="rl-vs__x">VS</span></span>`;
  }
  if (k === 'reticle') return `<span class="rl-art rl-art--reticle" aria-hidden="true">${RETICLE}</span>`;
  if (k === 'strip') {
    const run = FRAMES.map((f) => `<i class="rl-fr rl-fr--${f}"></i>`).join('');
    return `<span class="rl-art rl-art--strip" aria-hidden="true"><span class="rl-strip"><span class="rl-strip__run">${run}${run}</span></span></span>`;
  }
  const words = r.title.split('.')[0].trim().split(/\s+/).slice(0, 3);
  return `<span class="rl-art rl-art--beam" aria-hidden="true"><span class="rl-beam__cone"></span><span class="rl-beam__words">${words.join('<br>')}.</span></span>`;
}

export const CLIP_ART_CSS = `
/* ── Clip posters (shared: home reel + work.html) ── */
.rl-art{position:absolute;inset:0;z-index:-2;overflow:hidden}

/* art: searchlight on the words */
.rl-art--beam{background:radial-gradient(110% 60% at 50% 0,rgba(217,178,95,.12),transparent 64%),var(--void)}
.rl-beam__cone{position:absolute;left:-30%;top:-20%;width:160%;height:140%;background:conic-gradient(from 165deg at 50% 0,transparent 0deg,rgba(243,212,138,.13) 10deg,transparent 22deg);transform-origin:50% 0;animation:rlCone 7s ease-in-out infinite alternate}
.rl-beam__words{position:absolute;left:9%;right:6%;top:var(--art-top,max(62px,10%));font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:var(--art-words,clamp(84px,9vw,150px));line-height:.82;letter-spacing:-.01em;color:transparent;-webkit-text-stroke:1.5px rgba(242,234,216,.34);background:linear-gradient(100deg,transparent 34%,var(--gold) 44%,var(--gold-hi) 50%,var(--gold) 56%,transparent 66%) 50% 0/260% 100% no-repeat;-webkit-background-clip:text;background-clip:text;animation:rlBeam 5.5s ease-in-out infinite alternate}
:hover>.rl-art .rl-beam__words{animation-duration:2.2s}
@keyframes rlBeam{from{background-position:100% 0}to{background-position:0 0}}
@keyframes rlCone{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}

/* art: the reticle (Graveshift) */
.rl-art--reticle{background:radial-gradient(60% 50% at 50% 40%,rgba(229,72,77,.24),transparent 70%),var(--void);display:grid;place-items:start center;padding-top:var(--ret-top,14%)}
.rl-ret{width:var(--ret-w,min(92%,340px));height:auto;overflow:visible;fill:none;stroke:var(--signal);stroke-width:1.5;transition:transform .5s var(--ease)}
.rl-ret__spin{transform-origin:100px 100px;animation:rlSpin 26s linear infinite;opacity:.8}
.rl-ret__mid{stroke-dasharray:4 7;opacity:.55}
.rl-ret__cross{stroke:var(--paper);opacity:.5}
.rl-ret__cup{stroke:var(--gold-hi);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 6px rgba(243,212,138,.7))}
:hover>.rl-art .rl-ret{transform:scale(.9)}
:hover>.rl-art .rl-ret__spin{animation-duration:4s}
@keyframes rlSpin{to{transform:rotate(360deg)}}

/* art: the showdown */
.rl-art--vs{background:var(--void)}
.rl-vs{position:absolute;inset:0;display:flex;transition:transform .5s var(--ease)}
.rl-vs span{position:absolute;font-family:var(--f-display);font-weight:900;text-transform:uppercase;font-size:var(--vs-size,clamp(50px,4.8vw,74px));line-height:.85;letter-spacing:-.005em}
.rl-vs--a{clip-path:polygon(0 0,60% 0,40% 100%,0 100%);background:radial-gradient(80% 90% at 10% 20%,rgba(217,178,95,.2),transparent 70%),var(--vault)}
.rl-vs--a span{left:6%;top:var(--vs-a,60px);color:var(--gold-hi)}
.rl-vs--b{clip-path:polygon(60% 0,100% 0,100% 100%,40% 100%);background:radial-gradient(80% 90% at 90% 30%,rgba(242,234,216,.1),transparent 70%),var(--coal)}
.rl-vs--b span{right:6%;top:var(--vs-b,124px);color:transparent;-webkit-text-stroke:1.5px var(--paper)}
.rl-vs__slash{position:absolute;left:50%;top:-10%;bottom:-10%;width:2px;background:var(--gold);transform:rotate(11.3deg);box-shadow:0 0 18px rgba(243,212,138,.8)}
.rl-vs__x{position:absolute;left:50%;top:var(--vs-x,120px);width:62px;height:62px;margin:-31px 0 0 -31px;border-radius:50%;background:var(--gold);color:var(--void);display:grid;place-items:center;font-family:var(--f-display);font-weight:900;font-size:26px;letter-spacing:.02em;box-shadow:0 0 0 6px var(--void);transition:transform .4s var(--ease)}
:hover>.rl-art .rl-vs--a{transform:translateX(-8px)}
:hover>.rl-art .rl-vs--b{transform:translateX(8px)}
:hover>.rl-art .rl-vs__x{transform:scale(1.15) rotate(-8deg)}

/* art: the film strip (channel) */
.rl-art--strip{background:radial-gradient(90% 70% at 50% 40%,rgba(170,163,150,.12),transparent 70%),var(--void)}
.rl-strip{position:absolute;left:-10%;right:-10%;top:16%;height:46%;transform:rotate(-7deg);background:#0b0a0c;border-block:1px solid var(--smoke);overflow:hidden;padding:22px 0}
.rl-strip::before,.rl-strip::after{content:"";position:absolute;left:0;right:0;height:10px;background:repeating-linear-gradient(90deg,var(--smoke) 0 12px,transparent 12px 26px)}
.rl-strip::before{top:6px}.rl-strip::after{bottom:6px}
.rl-strip__run{display:flex;gap:10px;height:100%;width:max-content;animation:rlRun 22s linear infinite}
.rl-fr{display:block;height:100%;aspect-ratio:4/3;border:1px solid var(--smoke)}
.rl-fr--g{background:radial-gradient(60% 70% at 30% 35%,rgba(243,212,138,.45),transparent 70%),var(--vault)}
.rl-fr--r{background:radial-gradient(60% 70% at 65% 60%,rgba(229,72,77,.4),transparent 70%),var(--vault)}
.rl-fr--s{background:linear-gradient(160deg,rgba(242,234,216,.16),transparent 60%),var(--coal)}
:hover>.rl-art .rl-strip__run{animation-duration:6s}
@keyframes rlRun{to{transform:translateX(-50%)}}
`;
