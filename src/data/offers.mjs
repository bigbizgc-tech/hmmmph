// Every package and service. Facts come from the live store, the Get SEEN ad plan
// and the current site. Prices are the single source of truth for every page.
import { POLICY } from './business.mjs';

// `store` links are the old Wix product pages. They only show when config.showPayLinks is true.
// Before turning that on, replace each one with the new checkout link: once blackoutsyn.com
// moves off Wix these pages are gone (the build writes 301s for their old addresses).
const STORE = 'https://www.blackoutsyn.com/product-page/';

const BOOST_PROCESS = [
  { t: 'Claim it', d: 'Send the form or call. Tell us your name, what you’re promoting and the platform you want.' },
  { t: 'Point it', d: 'Your post, page, channel, site or booking line. Pick where you want new people to land.' },
  { t: 'It goes live', d: 'We set up a real paid placement through the platform’s own ad tools. Our target is live within 24 hours of payment.' },
  { t: 'Read the recap', d: 'When the run ends you get the numbers that matter: what was spent, how many people it reached, and the clicks or views it got.' },
];

const PLAN_PROCESS = [
  { t: 'Intake call', d: 'Twenty minutes on what you sell, who buys it and where they scroll. No script.' },
  { t: 'First month built', d: 'We pick the platforms, aim the ads at your area or your audience, and line up what runs.' },
  { t: 'It runs every month', d: 'Promotion keeps going without restarting from zero. We adjust aim as the numbers come in.' },
  { t: 'Monthly recap', d: 'Spend, reach, clicks or views, and follows, every month, in plain English.' },
];

export const OFFERS = [
  // ── ONE-TIME BOOSTS ──────────────────────────────────────────────────────
  {
    slug: 'spark', kind: 'boost', file: 'File 01', name: 'Spark', price: '$19.99', suffix: '', cadence: 'One-time',
    tagline: 'The first light. A small, real paid push to test the water.',
    bestFor: 'First-timers testing paid reach',
    summary: 'Spark puts a real paid placement behind one post, page or channel on the platform you pick. It is the cheapest way to find out what happens when people who don’t follow you yet actually see your work.',
    spend: 'About $10 of your $19.99 buys the ad itself.',
    run: '3-day run',
    includes: [
      'Setup of one paid promotion on one platform you pick',
      'About $10 goes straight into the ad itself',
      'A 3-day run aimed at your area or the audience you name',
      'The 30-Day Post Kit, so you have something to post while new people find you',
      'A short recap: spend, reach, and clicks or views',
    ],
    process: BOOST_PROCESS,
    forYou: ['You have never run a paid ad and want to see how it feels', 'One post deserves more eyes than it got', 'You want real new viewers. Bot followers never watch anything'],
    notForYou: ['You need customers coming in every month. Look at Surge', 'You want guaranteed numbers. Nobody honest can promise those'],
    faq: [
      { q: 'Is $10 of ad money worth it?', a: 'At this size it is a test. Real people see a real placement, and you find out whether a bigger push makes sense. That is the whole job of Spark.' },
      { q: 'How does the ad actually run?', a: 'Through the platform’s own ad tools, the same ones any business uses. Nothing runs without your OK.' },
      { q: 'Will I get followers?', a: 'Maybe. Spark puts you in front of real people. Whether they follow depends on your content, your audience and the platform.' },
    ],
    ladder: { to: 'boost', text: 'Liked what Spark did? Boost puts 2.5 times the ad money behind you.' },
    store: STORE + 'spark-get-seen-boost',
    teaser: 'The cheapest way to find out what real reach feels like.',
  },
  {
    slug: 'boost', kind: 'boost', file: 'File 02', name: 'Boost', price: '$49.99', suffix: '', cadence: 'One-time',
    tagline: 'More fuel, longer run. Built for a launch, a drop or a stream night.',
    bestFor: 'A launch, a drop or a big stream night',
    summary: 'Boost is the same real paid placement as Spark with more money behind it and a longer run. Point it at whatever matters this week: a new release, a stream night, a sale, an opening.',
    spend: 'About $25 of your $49.99 buys the ad itself.',
    run: '5-day run',
    includes: [
      'Setup of one paid promotion on the platform you pick',
      'About $25 goes straight into the ad itself',
      'A 5-day run. On TikTok it runs as a one-day burst',
      'Aimed at your area or the people you name',
      'A recap: spend, reach, clicks or views, and follows',
    ],
    process: BOOST_PROCESS,
    forYou: ['Something drops this week and it needs a crowd', 'You tried Spark and want a bigger swing', 'You stream and want new faces in chat'],
    notForYou: ['You need steady traffic all month. Look at Surge', 'Your profile is a mess. Fix it first with Profile Fix'],
    faq: [
      { q: 'Can I pick TikTok?', a: 'Yes. TikTok runs as a one-day burst at this size because that is where the money works hardest there.' },
      { q: 'Can I point it at my website?', a: 'Yes. Your post, page, channel, website or booking line all work.' },
      { q: 'I stream on Twitch. Can Boost send people there?', a: 'Yes. The ad runs on X, TikTok, Instagram, Facebook or YouTube, and it can point people at your Twitch channel. Send us your channel link when you claim it.' },
      { q: 'Can I upgrade later?', a: 'Any time. Boost is a one-time buy with no contract.' },
    ],
    ladder: { to: 'blitz', text: 'Need it bigger? Blitz doubles the ad money and runs a full week.' },
    store: STORE + 'boost-get-seen-boost',
    teaser: 'More fuel, a longer run. Aim it at the night that matters.',
  },
  {
    slug: 'blitz', kind: 'boost', file: 'File 03', name: 'Blitz', price: '$99.99', suffix: '', cadence: 'One-time',
    tagline: 'The biggest single push. For openings, events and big announcements.',
    bestFor: 'Openings, events and big announcements',
    summary: 'Blitz is our largest one-time push: a full week of real paid placement on any one platform. It is built for the moments you only get once: an opening, an event, a big announcement.',
    spend: 'About $50 of your $99.99 buys the ad itself.',
    run: '7-day run',
    includes: [
      'Setup of one paid promotion on any one platform',
      'About $50 goes straight into the ad itself',
      'A full 7-day run. On TikTok it runs for 2 days',
      'Aimed at your area or the audience you name',
      'A recap: spend, reach, clicks or views, and follows',
    ],
    process: BOOST_PROCESS,
    forYou: ['You have a date on the calendar and need people there', 'You are opening, relaunching or announcing something big', 'You want to see what a full week of reach can do'],
    notForYou: ['You will need this every month. Surge costs about the same as three Blitzes and never stops'],
    faq: [
      { q: 'How far ahead should I book for an event?', a: 'Give it at least a week so the full run lands before the date.' },
      { q: 'Can I split it across two platforms?', a: 'Blitz runs on one platform so the money isn’t spread thin. Surge covers up to two.' },
      { q: 'What do I get at the end?', a: 'A recap with what was spent, how many people it reached, and the clicks, views and follows it got.' },
    ],
    ladder: { to: 'surge', text: 'Three Blitzes in? Surge is the better deal and it never restarts from zero.' },
    store: STORE + 'blitz-get-seen-boost',
    teaser: 'A full week of reach for the moment you only get once.',
  },

  // ── MONTHLY PLANS ────────────────────────────────────────────────────────
  {
    slug: 'surge', kind: 'plan', file: 'File 04', name: 'Surge', price: '$300', suffix: '/mo', cadence: 'Monthly',
    oneMonth: '$450',
    tagline: 'Ads every month. No restarting from zero.',
    bestFor: 'Creators and shops ready to stay visible',
    summary: 'Surge keeps paid promotion running month after month, so you are never starting cold. It is for creators and local shops who are done with one-off pushes and want to stay in front of their people.',
    spend: 'About $150 a month goes into the ads themselves.',
    run: 'Runs every month',
    includes: [
      'Paid promotion every month on up to 2 platforms',
      'About $150 a month goes straight into the ads',
      'Aim checked and adjusted every month as numbers come in',
      'A monthly recap: spend, reach, clicks or views, and follows',
      'Just want one month? $450, billed once and never renews',
    ],
    process: PLAN_PROCESS,
    forYou: ['You keep buying one-off boosts and want it to stop resetting', 'You sell to the same area every week', 'You want two platforms working at once'],
    notForYou: ['You only have one event to promote. A Blitz fits better', 'You also want posts and AI handled. Look at Overdrive'],
    faq: [
      { q: 'Is there a contract?', a: `No. ${POLICY.plans} Want a single month without monthly billing? That is $450, billed once, and it never renews.` },
      { q: 'Which two platforms?', a: 'Whichever two your people actually use. We decide that together on the intake call.' },
      { q: 'I stream on Twitch. Can the ads point there?', a: 'Yes. The ads run on X, TikTok, Instagram, Facebook or YouTube, and they can send people to your Twitch channel.' },
      { q: 'Can I move up to Overdrive?', a: 'Yes. Move up any month.' },
    ],
    ladder: { to: 'overdrive', text: 'Want the posting handled too? Overdrive adds automatic posting and AI tools.' },
    store: null,
    teaser: 'The push that never restarts from zero.',
  },
  {
    slug: 'overdrive', kind: 'plan', file: 'File 05', name: 'Overdrive', price: '$400', suffix: '/mo', cadence: 'Monthly',
    oneMonth: '$550', regular: '$650/mo',
    tagline: 'Everything in Surge, plus your posting on autopilot.',
    bestFor: 'Owners who are tired of doing it all by hand',
    summary: 'Overdrive is Surge with the busywork taken off your plate. The ads keep running, your posts go out on schedule without you, and AI tools get set up to handle the repeat stuff.',
    spend: 'Launch price: $400 a month, locked in while you stay. Regular price is $650 a month.',
    run: 'Runs every month',
    includes: [
      'Everything in Surge',
      'Automatic posting set up on your accounts',
      'AI tools set up for the repeat work in your business',
      'Launch price of $400 a month, locked in while you stay',
      'Just want one month? $550, billed once and never renews',
    ],
    process: PLAN_PROCESS,
    forYou: ['You know you should post more and never do', 'You answer the same questions all day', 'You want ads and posting moving at the same time'],
    notForYou: ['You only need ads. Surge is enough', 'You want a customer-answering assistant and a web page too. That is Total Blackout'],
    faq: [
      { q: 'What does “automatic posting” mean?', a: 'Your posts are scheduled ahead and go out on their own, so your page stays active on days you are busy.' },
      { q: 'What happens to the launch price later?', a: 'You keep $400 a month for as long as you stay. New clients after the launch pay the regular price.' },
      { q: 'Do I approve what gets posted?', a: 'Yes. Nothing goes out under your name that you haven’t seen.' },
    ],
    ladder: { to: 'total-blackout', text: 'Want the whole operation handled? Total Blackout is the full setup.' },
    store: null,
    teaser: 'Ads keep running. Posts go out without you.',
  },
  {
    slug: 'total-blackout', kind: 'plan', file: 'File 06', name: 'Total Blackout', price: '$500', suffix: '/mo', cadence: 'Monthly', flagship: true,
    oneMonth: '$650', regular: '$800/mo',
    tagline: 'The full Blackout Syndicate marketing plan, done for you.',
    bestFor: 'Shops that want the whole thing handled',
    summary: 'Total Blackout is the one we built everything else around. Ads, posts, an AI assistant that answers your customers, and a clean web page, all set up and run for you. You run the business. We make sure people can find it.',
    spend: 'Launch price: $500 a month. Regular price is $800 a month. Month to month.',
    run: 'Runs every month',
    includes: [
      'Everything in Overdrive: about $150 a month in ads on up to 2 platforms, automatic posting and AI tools',
      'An AI assistant that answers customers and captures their contact info',
      'AI-made posts and promos for your pages',
      'A clean web page with your hours, location and contact',
      'Just want one month? $650, billed once and never renews',
    ],
    process: PLAN_PROCESS,
    forYou: ['You are a local shop with no time for any of this', 'Customers message you after hours and nobody answers', 'You don’t have a real web page yet'],
    notForYou: ['You only want to test the water. Start with Spark', 'You want to do your own posting. Surge fits better'],
    faq: [
      { q: 'What does the AI assistant do?', a: 'It answers common customer questions and takes down their contact info so you can follow up. It is set up around your business, hours and prices.' },
      { q: 'Do I need a website already?', a: 'No. A clean web page with your hours, location and contact is part of the plan.' },
      { q: 'Can I cancel?', a: `Yes. ${POLICY.plans} Want a single month instead? It is $650, billed once, and it never renews.` },
    ],
    ladder: { to: 'post-kit', text: 'Not ready for the full plan? Start with the 30-Day Post Kit and build up.' },
    store: null,
    teaser: 'The one we built everything else around.',
  },

  // ── ADD-ONS ──────────────────────────────────────────────────────────────
  {
    slug: 'post-kit', kind: 'addon', file: 'File 07', name: '30-Day Post Kit', price: '$19.99', suffix: '', cadence: 'One-time',
    tagline: 'A month of posts, planned and written. You just hit publish.',
    bestFor: 'Anyone who stares at a blank caption box',
    summary: 'The 30-Day Post Kit is a month of ready-to-post content for one platform: a calendar and 12 captions written for your business. It pairs with any boost, so new visitors land on a page that’s alive.',
    spend: 'Delivered as a PDF within 2 business days.',
    run: 'Delivered in 2 business days',
    includes: [
      'A 30-day posting calendar for one platform',
      '12 captions written for your business',
      'Delivered as a PDF, emailed within 2 business days',
      'One round of edits',
      'Included free with every Spark',
    ],
    process: [
      { t: 'Claim it', d: 'Tell us your business, your platform and the tone you want.' },
      { t: 'We write it', d: 'A calendar and 12 captions built around what you actually sell.' },
      { t: 'You get the PDF', d: 'Emailed within 2 business days.' },
      { t: 'One round of edits', d: 'Anything that doesn’t sound like you, we fix.' },
    ],
    forYou: ['You never know what to post', 'You are about to run a boost and your page is quiet', 'You want a month planned in one go'],
    notForYou: ['You want the posting done for you every month. Look at Overdrive'],
    faq: [
      { q: 'Do you post it for me?', a: 'No. The kit is yours to post. If you want posting handled, that is Overdrive.' },
      { q: 'Which platform?', a: 'One platform you pick. The captions are written to fit it.' },
      { q: 'Can I get it with a boost?', a: 'It already comes free with Spark, and it pairs with any boost.' },
    ],
    ladder: { to: 'profile-fix', text: 'Page looks rough? Profile Fix cleans it up before people show up.' },
    store: STORE + '30-day-post-kit',
    teaser: 'A month of posts, written. You just hit publish.',
  },
  {
    slug: 'profile-fix', kind: 'addon', file: 'File 08', name: 'Profile Fix', price: '$49.99', suffix: '', cadence: 'One-time',
    tagline: 'Clean up your page before the ads send people to it.',
    bestFor: 'Pages that don’t say what you do in one look',
    summary: 'Ads send people to your page. Profile Fix makes sure they understand what you do in the first three seconds. We rewrite your bio and plan your pinned posts, highlights and the shots you need. You publish it, so you stay in control of your account.',
    spend: 'You publish the changes yourself. You keep full control of your account.',
    run: 'One-time cleanup',
    includes: [
      'A rewritten bio that says what you do and where',
      'A plan for your pinned posts',
      'A highlight list, organized',
      'A shot list of the photos and clips your page is missing',
      'You publish everything, so your account stays yours',
    ],
    process: [
      { t: 'Claim it', d: 'Send your page link and tell us what you sell.' },
      { t: 'We review it', d: 'We look at your page the way a stranger from an ad would.' },
      { t: 'You get the fix', d: 'Bio, pinned posts, highlights and a shot list, ready to use.' },
      { t: 'You publish', d: 'You make the changes, so nobody else needs your login.' },
    ],
    forYou: ['Your bio doesn’t say what you do', 'You are about to run ads and want the page ready', 'Your highlights are a junk drawer'],
    notForYou: ['You want a full website. Look at Website Design'],
    faq: [
      { q: 'Do I have to give you my password?', a: 'No. You publish the changes yourself.' },
      { q: 'Which platforms?', a: 'Instagram, TikTok, Facebook, YouTube or X. Tell us which page to fix.' },
      { q: 'Should I do this before a boost?', a: 'It is the best time. Ads work harder when the page they land on is clear.' },
    ],
    ladder: { to: 'spark', text: 'Page fixed? Now put a Spark behind it.' },
    store: STORE + 'profile-fix',
    teaser: 'Make your page make sense in three seconds.',
  },

  // ── BUILT TO ORDER ───────────────────────────────────────────────────────
  {
    slug: 'website-design', kind: 'service', file: 'File 09', name: 'Website Design', price: 'Quoted', suffix: '', cadence: 'Per job',
    tagline: 'A clean, fast site that says what you do, where you are and how to reach you.',
    bestFor: 'Businesses with no site, or a site that hurts',
    summary: 'Ads and posts send people somewhere. Website Design makes sure that somewhere works: fast on a phone, clear about what you sell, and easy to contact. Every job is quoted up front after a short call.',
    spend: 'Quoted per job after a short call. You know the price before work starts.',
    run: 'Quoted per job',
    includes: [
      'A site built for phones first',
      'Clear pages for what you sell and what it costs',
      'A contact form that actually reaches you',
      'Your hours, location and socials in the right places',
      'Ready for ad tracking, so paid traffic can be measured',
    ],
    process: [
      { t: 'Short call', d: 'What you sell, who buys it, and what the site needs to do.' },
      { t: 'Written quote', d: 'A price and a scope before any work starts.' },
      { t: 'Build', d: 'We build it and you review it on your own phone.' },
      { t: 'Launch', d: 'It goes live on your domain, connected to your socials and contact info.' },
    ],
    forYou: ['You have no website', 'Your site is slow, broken or out of date', 'You are about to run ads and need somewhere for them to land'],
    notForYou: ['You only need your social profile cleaned up. That is Profile Fix'],
    faq: [
      { q: 'How much does a site cost?', a: 'It depends on what it has to do. You get a written quote after a short call, before any work starts.' },
      { q: 'Can you work with my existing domain?', a: 'Yes. Tell us where it is registered and we will work with it.' },
    ],
    ladder: { to: 'ai-consulting', text: 'Want the site to answer customers too? Start with AI Consulting.' },
    store: null,
    teaser: 'Somewhere for the ads to land that actually works.',
  },
  {
    slug: 'ai-consulting', kind: 'service', file: 'File 10', name: 'AI Consulting', price: 'Quoted', suffix: '', cadence: 'Per job',
    tagline: 'Plain-English help finding where AI actually saves you time.',
    bestFor: 'Owners curious about AI but short on time',
    summary: 'AI Consulting is a sit-down about your week. We look at what eats your time, find the parts AI can honestly handle, and set them up with you. We come to you around South Bend, Mishawaka and Elkhart, and you walk away with it running.',
    spend: 'Quoted per job. You know the price before we start.',
    run: 'Quoted per job',
    includes: [
      'A walk through the work that eats your week',
      'A short list of where AI can actually help, and where it can’t',
      'The right tools picked for your business and budget',
      'Setup done with you, in person in the South Bend area',
      'You walk away with it running',
    ],
    process: [
      { t: 'Short call', d: 'What your week looks like and what you wish ran itself.' },
      { t: 'Written quote', d: 'What we will set up and what it costs.' },
      { t: 'Set it up together', d: 'In person or on a call. You see every step.' },
      { t: 'Walk away with it running', d: 'Plus notes so you can keep using it.' },
    ],
    forYou: ['You keep hearing about AI and don’t know where to start', 'You do the same tasks every single day', 'You want someone local you can actually talk to'],
    notForYou: ['You already know exactly what to automate. Go straight to AI Automation'],
    faq: [
      { q: 'Do I need to be good with computers?', a: 'No. Everything is explained in plain English and set up with you.' },
      { q: 'Do you come to me?', a: 'Yes, around South Bend, Mishawaka and Elkhart. Calls work too.' },
    ],
    ladder: { to: 'ai-automation', text: 'Know what you want automated? AI Automation builds it.' },
    store: null,
    teaser: 'Find out where AI actually saves you time.',
  },
  {
    slug: 'ai-automation', kind: 'service', file: 'File 11', name: 'AI Automation', price: 'Quoted', suffix: '', cadence: 'Per job',
    tagline: 'Stop doing everything by hand.',
    bestFor: 'Businesses buried in repeat work',
    summary: 'AI Automation takes the jobs you repeat every day and makes them run on their own: answering common questions, catching leads, following up, scheduling posts. Each build is quoted up front.',
    spend: 'Quoted per job. You know the price before we build.',
    run: 'Quoted per job',
    includes: [
      'Automatic replies to the questions you answer all day',
      'Lead capture that saves contact info for you',
      'Follow-ups that go out without you remembering',
      'Post scheduling across your pages',
      'A walkthrough so you know how it all works',
    ],
    process: [
      { t: 'Map the repeat work', d: 'We list what you do over and over.' },
      { t: 'Written quote', d: 'What gets built and what it costs.' },
      { t: 'Build and test', d: 'Tested on real examples from your business before it goes live.' },
      { t: 'Hand-off', d: 'A walkthrough and notes. It is yours.' },
    ],
    forYou: ['You answer the same five questions every day', 'Leads slip through because nobody followed up', 'Posting falls apart when you get busy'],
    notForYou: ['You are not sure what to automate yet. Start with AI Consulting'],
    faq: [
      { q: 'Will it sound like a robot?', a: 'It is written around your business and the way you talk, and you approve it before it goes live.' },
      { q: 'What if something breaks?', a: 'Call or text us. What’s covered after hand-off is written into your quote.' },
    ],
    ladder: { to: 'creator-systems', text: 'Creator or streamer? Creator Content Systems is built for you.' },
    store: null,
    teaser: 'The jobs you repeat every day, running on their own.',
  },
  {
    slug: 'creator-systems', kind: 'service', file: 'File 12', name: 'Creator Content Systems', price: 'Quoted', suffix: '', cadence: 'Per job',
    tagline: 'A system that turns every stream into a week of posts.',
    bestFor: 'Streamers and creators',
    summary: 'Creator Content Systems sets you up to make more with what you already film. Clip workflows, posting schedules and templates, built so every stream or shoot turns into posts across your platforms. The same kind of system runs the Graveshift Gaming crew.',
    spend: 'Quoted per job. You know the price before we build.',
    run: 'Quoted per job',
    includes: [
      'A clip workflow from stream or shoot to short-form',
      'A posting schedule across your platforms',
      'Templates for titles, captions and thumbnails',
      'Cross-posting set up so one clip reaches every feed',
      'A walkthrough so you can run it yourself',
    ],
    process: [
      { t: 'Look at your channel', d: 'What you make, how often, and where it lives.' },
      { t: 'Written quote', d: 'What the system includes and what it costs.' },
      { t: 'Build it', d: 'Workflow, schedule and templates set up around how you actually film.' },
      { t: 'Run it', d: 'A walkthrough, then it is yours.' },
    ],
    forYou: ['You stream but rarely post clips', 'Your channels are on different schedules or none at all', 'You want growth without filming more'],
    notForYou: ['You want paid reach right now. Start with Boost'],
    faq: [
      { q: 'I only stream on one platform. Is this for me?', a: 'Yes. Most of the value is turning that one stream into posts everywhere else.' },
      { q: 'Can you run ads on top?', a: 'Yes. Pair it with any boost or plan.' },
    ],
    ladder: { to: 'website-design', text: 'Need a home base for all of it? Website Design builds one.' },
    store: null,
    teaser: 'Every stream turned into a week of posts.',
  },
];

export const offerPath = (o) => (o.kind === 'service' ? 'services/' : 'packages/') + o.slug + '.html';
export const bySlug = Object.fromEntries(OFFERS.map((o) => [o.slug, o]));
export const BOOSTS = OFFERS.filter((o) => o.kind === 'boost');
export const PLANS = OFFERS.filter((o) => o.kind === 'plan');
export const ADDONS = OFFERS.filter((o) => o.kind === 'addon');
export const SERVICES = OFFERS.filter((o) => o.kind === 'service');

// Classes are not packages: kept out of OFFERS so the matcher, package counts and clearance files don't change.
export const CLASSES = [
  { slug: 'learn-claude', name: 'Learn Claude With Me', price: '$40', per: 'class', length: 'About an hour', path: 'learn-claude.html' },
];
