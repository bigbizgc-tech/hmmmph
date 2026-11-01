// Temporary placeholder used only until the real page module is written.
export const stub = (o) => ({
  ...o,
  body: (c) => `<header class="pagehead"><div class="wrap pagehead__in"><p class="label">${o.file || 'Page'}</p><h1 class="h1">${o.h1 || o.title}</h1><p class="lede">${o.description}</p></div></header>${(o.anchors || []).map((a) => `<section id="${a}" class="band band--tight"><div class="wrap"><p class="label">#${a}</p></div></section>`).join('')}`,
});
