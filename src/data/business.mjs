// Facts about the business. One source of truth: every page reads from here.
export const BIZ = {
  name: 'Blackout Syndicate',
  legal: 'GC General Contracting LLC',
  founder: 'Gregory Clark',
  founderShort: 'GC',
  phone: '(574) 213-9097',
  phoneHref: 'tel:+15742139097',
  sms: 'sms:+15742139097',
  email: 'info@blackoutsyn.com',
  city: 'South Bend',
  region: 'IN',
  regionLong: 'Indiana',
  area: ['South Bend', 'Mishawaka', 'Elkhart'],
  tagline: 'Real ads. Real people. No bots.',
  // Stated on the store: keep this sentence on every page that sells promotion.
  resultsNote: 'Results depend on your content, your audience and the platform. No set number of views, likes or followers is guaranteed.',
};

export const SOCIALS = [
  { key: 'x', label: 'X', handle: '@BzTheG', url: 'https://x.com/BzTheG' },
  { key: 'tiktok', label: 'TikTok', handle: '@bigbizgc', url: 'https://www.tiktok.com/@bigbizgc' },
  { key: 'instagram', label: 'Instagram', handle: '@bizgc2', url: 'https://instagram.com/bizgc2' },
  { key: 'facebook', label: 'Facebook', handle: 'Blackout Syndicate', url: 'https://facebook.com/1106862255844913' },
  { key: 'youtube', label: 'YouTube', handle: 'Blackout Syndicate', url: 'https://www.youtube.com/channel/UCmJc9N5EHufdvCeG0FmvlRQ' },
  { key: 'discord', label: 'Discord', handle: 'Graveshift Gaming', url: 'https://discord.gg/7UFuNZgzu' },
];

// Real clips. Never add a clip that wasn't made by the crew.
export const REEL = [
  { url: 'https://www.youtube.com/shorts/EKYdYyosvf0', kind: 'Short', length: '0:46', who: 'Blackout Syndicate', title: 'Get Seen. We push for you.', tone: 'gold' },
  { url: 'https://www.youtube.com/shorts/QMssQ39tNm4', kind: 'Short', length: '0:31', who: 'Graveshift Gaming', title: 'Trophy Hunt: Taking Names', tone: 'red' },
  { url: 'https://www.youtube.com/watch?v=CBeBPZVmA9k', kind: 'Video', length: 'AI showdown', who: 'AI Tools series', title: 'Grok vs Gemini', tone: 'gold' },
  { url: 'https://www.youtube.com/channel/UCmJc9N5EHufdvCeG0FmvlRQ', kind: 'Channel', length: 'Every drop', who: 'YouTube', title: 'See the whole channel', tone: 'smoke' },
];

export const PLATFORMS = [
  { name: 'X', note: 'New. Booking now', fresh: true },
  { name: 'YouTube', note: 'Shorts and long-form' },
  { name: 'TikTok', note: 'For You placements' },
  { name: 'Instagram', note: 'Reels and Stories' },
  { name: 'Facebook', note: 'Local reach' },
];

// Clearance ladder. XP thresholds tuned so a curious visitor levels up every 1–2 files.
export const LEVELS = [
  { lv: 0, name: 'Outsider', xp: 0, unlock: 'Nothing yet. Keep reading.' },
  { lv: 1, name: 'Lookout', xp: 25, unlock: 'Playbook Rule 01 on the home page' },
  { lv: 2, name: 'Associate', xp: 60, unlock: 'The pricing math on every package file' },
  { lv: 3, name: 'Operative', xp: 110, unlock: 'How a push is actually aimed (How it works)' },
  { lv: 4, name: 'Lieutenant', xp: 170, unlock: 'The founder’s full file (About)' },
  { lv: 5, name: 'Inner Circle', xp: 240, unlock: 'The Vault: the full Syndicate Playbook and your Syndicate ID' },
];

export const XP = { visit: 10, read: 15, quiz: 30, lead: 50, mark: 25, blackout: 20 };
