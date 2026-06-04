/*
  Content migration — auto-applies new editorial content (e.g. when a new
  weekly PDF is published) by overwriting the user's saved localStorage
  on next page load if the saved version is older than the current PDF.

  When a new edition is shipped:
    1. Bump CURRENT_PDF_VERSION below
    2. Update PDF_HOME_CONTENT to match the new issue
    3. Users automatically see the new content on next page load
*/

export const CURRENT_PDF_VERSION = '2026-05-31-v1'; // MM Murasu — May 31 - Jun 6, 2026 (Vol 03, Issue 37)

// Content matching MM MURASU 31.05.2026 PDF
const PDF_HOME_CONTENT = {
  _pdfVersion: CURRENT_PDF_VERSION,
  leadVideo: {
    kicker: 'அரசியல் முரசு',
    title: 'பதவித் துறப்பும்... புதிய அரசியல் திசையும்!',
    meta: 'அதிமுகவில் கொந்தளிப்பு — மரகதம் குமரவேல், சத்தியபாமா, ஜெயகுமார் ராஜினாமா!',
    videoId: 'PDOg5PnSXYM',
    poster: '/img/vijay.avif'
  },
  heroBlurb: {
    dek: 'தமிழக அரசியல் வரலாற்றில் எப்போதும் இல்லாத ஒரு புதிய அத்தியாயத்திற்கு இந்த 5 தொகுதி இடைத்தேர்தல் களம் அடித்தளமிட்டிருக்கிறது. அதிமுகவின் முக்கிய முகங்களாக வலம் வந்த மரகதம் குமரவேல் (மதுராந்தகம்), சத்தியபாமா (தாராபுரம்), ஜெயகுமார் (பெருந்துறை), எசக்கி சுப்பையா (அம்பாசமுத்திரம்) ஆகியோர் தங்களது சட்டமன்ற உறுப்பினர் பதவிகளை அதிரடியாக ராஜினாமா செய்துவிட்டு, தமிழக வெற்றிக் கழகத்தில் தங்களை இணைத்துக் கொண்டிருப்பது சாதாரண நிகழ்வல்ல.',
    liveTag: '● LIVE',
    tags: [
      { text: '5 தொகுதி இடைத்தேர்தல்', href: '/headlines' },
      { text: 'அதிமுக ராஜினாமா', href: '/article' },
      { text: 'த.வெ.க — புதிய அத்தியாயம்', href: '/article' },
      { text: 'ஜெயகுமார் · மரகதம்', href: '/article' }
    ],
    reporting: 'அரசியல் டெஸ்க், செங்கல்பட்டு செய்தியாளர்கள், மறைமலை முரசு குழுமம்',
    updatedAt: '31 மே 2026',
    updatedAtTs: ''
  },
  heroSide: [
    { n: 1, img: '/img/crime-scene.avif', title: 'அமைச்சர்கள், எம்.எல்.ஏ.க்களுக்காக கடவுள் காத்திருக்க கூடாது — சென்னை ஐகோர்ட் அதிரடி கருத்து!', meta: 'சென்னை · 12 நிமிடங்களுக்கு முன்' },
    { n: 2, img: '/img/world-summit.avif', title: 'தமிழகத்தின் புதிய சட்டம் ஒழுங்கு DGP-ஆக மகேஷ்குமார் அகர்வால் பொறுப்பேற்பு!', meta: 'சென்னை · 28 நிமிடங்களுக்கு முன்' },
    { n: 3, img: '/img/cheating-case.avif', title: 'திருவள்ளூர் பெயிண்ட் ஆலையில் தீ விபத்து: 2 பேர் உயிரிழப்பு, 4 பேர் படுகாயம்!', meta: 'திருவள்ளூர் · 1 மணி நேரத்திற்கு முன்' },
    { n: 4, img: '/img/cheating-case.avif', title: 'TNPSC தொகுதியான பணியாளர் தேர்வு 2026 — விண்ணப்பப் பதிவு தொடக்கம்!', meta: 'கல்வி & வேலை · 2 மணி நேரத்திற்கு முன்' }
  ],
  liveTicker: [
    'பதவித் துறப்பும்... புதிய அரசியல் திசையும் — த.வெ.க-வில் இணையும் அதிமுக எம்.எல்.ஏ.க்கள்',
    'அமைச்சர்கள், எம்.எல்.ஏ.க்களுக்காக கடவுள் காத்திருக்க கூடாது — சென்னை ஐகோர்ட்',
    'தமிழகத்தின் புதிய சட்டம் ஒழுங்கு DGP-ஆக மகேஷ்குமார் அகர்வால் பொறுப்பேற்பு',
    'திருவள்ளூர் பெயிண்ட் ஆலையில் தீ விபத்து: 2 பேர் உயிரிழப்பு, 4 பேர் படுகாயம்',
    'மதுரை திருப்பரங்குன்றம் முருகன் கோயில் - ஆன்மீக முரசு சிறப்பு கட்டுரை',
    'TNPSC தொகுதியான பணியாளர் தேர்வு 2026 — விண்ணப்ப பதிவு தொடக்கம்',
    'டாரிக் ஜாஃப் 2026 உலக சாம்பியன்ஷிப் போட்டி: ஜெய்துகின்ற அதிசய சேதி!',
    'அரசியல், சமூக சீர்திருத்தத்தின் கனல் சித்தர்ந்தர் காந்தி — சிறப்புக் கட்டுரை'
  ],
  electionBanner: {
    title: '5 தொகுதி இடைத்தேர்தல் 2026',
    leftNum: '04',
    leftLabel: 'அதிமுக எம்.எல்.ஏ\nராஜினாமா',
    rightNum: '05',
    rightLabel: 'மொத்த இடைத்தேர்தல்\nதொகுதிகள்'
  },
  sponsorCard: {
    brand: 'மறைமலை நகர் இ-சேவை மையம் · Govt & Digital Services',
    headline: 'Colour & B/W Xerox · Binding · Aadhaar · PAN · Passport · Marriage Registration',
    copy: 'பெட்டா அப்ளை · CSC சேவைகள் · ரெண்டல் ஒப்பந்தம் · ஆதார் கார்டு · GST மாதாந்திர பைலிங் · ஸ்டார்ட்அப் பதிவு · பாஸ்போர்ட் · DL · ஓய்வூதிய சான்றிதழ் — ஒரே இடத்தில்!',
    cta: 'எண்: 112, மறைமலை நகர் · 94441 12294 →',
    thumb: 'E-SEVAI'
  },
  advertiseCta: {
    headline: 'உங்கள் பிராண்டை 14 லட்சம் வாசகர்களுக்கு கொண்டு செல்லுங்கள்',
    copy: 'Google Ads, Meta Audience Network வழியாக programmatic விளம்பரங்கள் — அல்லது நேரடி ஆதரவாளர் ஒப்பந்தங்கள். print + digital + newsletter — மூன்று தளங்களிலும் ஒரே campaign-ல்.',
    networks: ['Google AdSense', 'Google Ad Manager', 'Meta Audience Network', 'Direct Sponsorship', 'Newsletter'],
    ctaText: 'விளம்பர திட்டங்கள்',
    ctaSub: 'ads@maraimalaimurasu.com · 9444112294',
    ctaHref: 'mailto:ads@maraimalaimurasu.com'
  },
  topStoriesGrid: [
    { cat: 'அரசியல்', img: '/img/vijay.avif', title: 'பதவித் துறப்பும் புதிய அரசியல் திசையும்: 5 தொகுதி இடைத்தேர்தலில் த.வெ.க அதிரடி நகர்வு!', meta: 'அரசியல் · 24 நிமிடம்', thumb: 'POLITICS' },
    { cat: 'நீதிமன்றம்', img: '/img/crime-scene.avif', title: 'அமைச்சர்கள், எம்.எல்.ஏ.க்களுக்காக கடவுள் காத்திருக்க கூடாது — சென்னை ஐகோர்ட் அதிரடி கருத்து!', meta: 'சென்னை · 42 நிமிடம்', thumb: 'COURT' },
    { cat: 'காவல்', img: '/img/mamata.avif', title: 'தமிழகத்தின் புதிய சட்டம் ஒழுங்கு DGP-ஆக மகேஷ்குமார் அகர்வால் பொறுப்பேற்பு!', meta: 'சென்னை · 1 மணி நேரம்', thumb: 'POLICE' },
    { cat: 'விபத்து', img: '/img/cheating-case.avif', title: 'திருவள்ளூர் பெயிண்ட் ஆலையில் தீ விபத்து: 2 பேர் உயிரிழப்பு, 4 பேர் படுகாயம்!', meta: 'திருவள்ளூர் · 2 மணி நேரம்', thumb: 'FIRE' }
  ],
  electionGrid: [
    { cat: 'அரசியல்', img: '/img/mamata.avif', title: 'மரகதம் குமரவேல் (மதுராந்தகம்) — அதிமுக எம்.எல்.ஏ பதவி ராஜினாமா, த.வெ.க-வில் இணைப்பு!', meta: 'மதுராந்தகம் · 3 மணி நேரம்', thumb: 'RESIGN' },
    { cat: 'அரசியல்', img: '/img/crime-scene.avif', title: 'சத்தியபாமா (தாராபுரம்) எம்.எல்.ஏ-வும் த.வெ.க-வில் இணைகிறார்: அதிமுகவில் கொந்தளிப்பு!', meta: 'தாராபுரம் · 4 மணி நேரம்', thumb: 'POLITICS' },
    { cat: 'அரசியல்', img: '/img/world-summit.avif', title: 'ஜெயகுமார் (பெருந்துறை), எசக்கி சுப்பையா (அம்பாசமுத்திரம்) — ராஜினாமா அலை!', meta: 'பெருந்துறை · 5 மணி நேரம்', thumb: 'WAVE' },
    { cat: 'விசாரணை', img: '/img/world-summit.avif', title: 'ராஜினாமா மற்றும் கட்சித் தாவல் — சி.பி.ஐ விசாரணை வேண்டும்: அதிமுக எம்.பி தனபால் கோரிக்கை', meta: 'டெல்லி · 6 மணி நேரம்', thumb: 'CBI' }
  ],
  cinemaGrid: [
    { cat: 'சினிமா', img: '/img/milind.avif', title: 'வாரத்திற்கான திரைப்படம்: விமர்சகர்களும் ரசிகர்களும் வாஞ்சித்த படைப்பு — சினிமா முரசு', meta: 'திரை டெஸ்க் · 2 மணி நேரம்', thumb: 'MOVIE WEEK' },
    { cat: 'சினிமா', img: '/img/vijay.avif', title: 'திரையுலகின் சாதனை தயாரிப்பாளர் ஆர்.பி.சௌத்ரி காலமானார் — திரை உலகம் இரங்கல்', meta: 'சினிமா டெஸ்க் · 4 மணி நேரம்', thumb: 'OBITUARY' },
    { cat: 'திரை விமர்சனம்', img: '/img/vijay.avif', title: '"FOOD" — சமூகச் சிந்தனையை தூண்டும் புதிய படைப்பு | விமர்சகர் கருத்து', meta: 'சினிமா டெஸ்க் · 5 மணி நேரம்', thumb: 'REVIEW' },
    { cat: 'சினிமா', img: '/img/milind.avif', title: 'வைரல் அப்டேட்ஸ்: ஃபர்ஸ்ட் லுக், டீசர், டிரெய்லர் — ட்ரோல் கலாச்சாரம் அதிகரிப்பு', meta: 'திரை டெஸ்க் · 7 மணி நேரம்', thumb: 'TRENDING' }
  ],
  twoColLeft: {
    head: 'மாவட்ட முரசு — தமிழகச் செய்திகள்',
    lead: { img: '/img/crime-scene.avif', title: 'அரசியல், சமூக சீர்திருத்தத்தின் கனல் சித்தர்ந்தர் காந்தி — சிறப்புக் கட்டுரை', excerpt: 'காந்தியின் சமூக சீர்திருத்தச் சிந்தனைகள் இன்றைய தமிழக அரசியல் சூழலுக்கு எவ்வாறு பொருந்துகின்றன என்பதை ஆழமாக ஆராயும் சிறப்புக் கட்டுரை — மறைமலை முரசு குழுமம்.', meta: 'சென்னை · 22 நிமிடம்', thumb: 'GANDHI' },
    rest: [
      { img: '/img/world-summit.avif', title: 'மதுரை திருப்பரங்குன்றம் முருகன் கோயில் கலாச்சார விழா: லட்சக்கணக்கான பக்தர்கள் கூட்டம்!', meta: 'மதுரை · 1 மணி நேரம்', thumb: 'TEMPLE' },
      { img: '/img/cheating-case.avif', title: 'தாக்குதல்: சி.பி.ஐ விசாரணை வேண்டும் — தி.மு.க கடும் கோரிக்கை!', meta: 'சென்னை · 2 மணி நேரம்', thumb: 'CBI' },
      { img: '/img/crime-scene.avif', title: 'மழைக்கால ஏற்பாடுகள் நிறைவெய்தியது: சென்னை மாநகராட்சி வெளியீடு', meta: 'சென்னை · 3 மணி நேரம்', thumb: 'CIVIC' },
      { img: '/img/mamata.avif', title: 'காவல் துறை மிக மிக... — சென்னை ஐகோர்ட் கோர்ட் கடும் கருத்து!', meta: 'சென்னை · 4 மணி நேரம்', thumb: 'COURT' }
    ]
  },
  twoColRight: {
    head: 'யாமினில் முரசு — உலகச் செய்திகள்',
    lead: { img: '/img/world-summit.avif', title: 'பேடதர் உலகின் பெரிய ராணுவத்தை 51% குறைக்க டிரம்ப் அறிவிப்பு!', excerpt: 'ஐக்கிய அரசின் ராணுவச் செலவினங்களை கணிசமாக குறைக்க அமெரிக்க அதிபர் டொனால்டு டிரம்ப் முக்கிய அறிவிப்பு வெளியிட்டுள்ளார். இது உலக நாடுகள் இடையே பெரும் விவாதத்தை ஏற்படுத்தியுள்ளது.', meta: 'வாஷிங்டன் · 35 நிமிடம்', thumb: 'TRUMP' },
    rest: [
      { img: '/img/world-summit.avif', title: 'ஐக்கிய அரபு எமீரகங்கள் முதலீட்டாளர்களை இந்தியா வரவேற்கிறது — பெரும் ஒப்பந்தம் கையெழுத்து!', meta: 'புது தில்லி · 1 மணி நேரம்', thumb: 'UAE' },
      { img: '/img/crime-scene.avif', title: 'டிரம்ப் பஃபர் கார் கால் — Q4 அதிரடி வீழ்ச்சி: உலகப் பங்குச் சந்தையில் கொந்தளிப்பு!', meta: 'நியூயார்க் · 2 மணி நேரம்', thumb: 'MARKET' },
      { img: '/img/cheating-case.avif', title: 'இஸ்லாமிய முரசு: அரபு உலகின் முக்கிய நிகழ்வுகள் — வாரத்திற்கான சுருக்கம்', meta: 'மத்திய கிழக்கு · 3 மணி நேரம்', thumb: 'ISLAMIC' },
      { img: '/img/air-india.avif', title: 'வணிகராய்ந்தோர் முரசு: சர்வதேச மார்க்கெட் இயக்கம் & தொழில்துறை அப்டேட்', meta: 'வணிகம் · 4 மணி நேரம்', thumb: 'BUSINESS' }
    ]
  },
  sportsCol: {
    head: 'விளையாட்டு முரசு & சித்தர் மருத்துவம்',
    lead: { img: '/img/cricket.avif', title: 'டாரிக் ஜாஃப் 2026 உலக சாம்பியன்ஷிப் போட்டி: ஜெய்துகின்ற அதிசய சேதி!', excerpt: 'உலக சாம்பியன்ஷிப் தலா போட்டியில் தமிழ்நாட்டு வீரர் டாரிக் ஜாஃப் பெற்ற அபூர்வ வெற்றி — விளையாட்டு உலகில் புதிய சாதனை. இந்திய தடகள வீரர்களின் சர்வதேச மேடையில் சாதனை தொடர்கிறது.', meta: 'விளையாட்டு டெஸ்க் · 1 மணி நேரம்', thumb: 'CHAMPION' },
    rest: [
      { img: '/img/cricket.avif', title: 'சித்தர் மருத்துவம்: இயற்கையான மூலிகை மருத்துவம் — வாரக் குறிப்புகள்', meta: 'மருத்துவம் · 2 மணி நேரம்', thumb: 'SIDDHA' },
      { img: '/img/milind.avif', title: 'ஈட்டி எறிதலில் நீரஜ் சோப்ரா: 90 மீட்டர் இலக்கை எட்டும் முயற்சி தொடர்கிறது', meta: 'விளையாட்டு டெஸ்க் · 3 மணி நேரம்', thumb: 'JAVELIN' },
      { img: '/img/world-summit.avif', title: 'க்ரிக்கெட்: உலக அரங்கில் ஆதிக்கம் செலுத்தும் நீலப்படை — டெஸ்ட் சாம்பியன்ஷிப்', meta: 'விளையாட்டு டெஸ்க் · 5 மணி நேரம்', thumb: 'CRICKET' },
      { img: '/img/world-summit.avif', title: 'டோகிடம் முரசு: விளையாட்டுச் சமூகத்தின் சிறப்புப் பகுதி', meta: 'விளையாட்டு · 6 மணி நேரம்', thumb: 'SPECIAL' }
    ]
  },
  lifestyleCol: {
    head: 'ஆன்மீக முரசு & சமையல் முரசு',
    lead: { img: '/img/milind.avif', title: 'ஒளி தந்த ஒளியான ஞானம்: திருவாதிரை விழா — ஆன்மீகச் சிறப்புக் கட்டுரை!', excerpt: 'திருவாதிரை விழாவின் ஆன்மீக முக்கியத்துவம், பண்டைய பாரம்பரியம், கோயில் வழிபாட்டு நெறிமுறைகள் — ஆன்மீக முரசு வாசகர்களுக்கான விரிவான கட்டுரை.', meta: 'ஆன்மீகம் · 1 மணி நேரம்', thumb: 'THIRUVATHIRAI' },
    rest: [
      { img: '/img/milind.avif', title: 'சமையல் முரசு: வாரத்திற்கான பாரம்பரிய தமிழ் ருசிமிக்க செய்முறை!', meta: 'சமையல் · 2 மணி நேரம்', thumb: 'RECIPE' },
      { img: '/img/world-summit.avif', title: 'திருக்குறள் — அதிகாரம் 6: வாழ்க்கைத் துணைநலம் (குறள் 56)', meta: 'இலக்கியம் · 3 மணி நேரம்', thumb: 'TIRUKKURAL' },
      { img: '/img/world-summit.avif', title: 'அழகு முரசு: இந்த வாரம் — அழகு பராமரிப்பு எளிய குறிப்புகள்', meta: 'அழகுகுறிப்பு · 4 மணி நேரம்', thumb: 'BEAUTY' },
      { img: '/img/world-summit.avif', title: 'ஆட்காட்டு உண்மைகள்: நீதியரசரின் நற்சிந்தனைகள் — வாழ்வியல் கட்டுரை', meta: 'வாழ்வியல் · 6 மணி நேரம்', thumb: 'WISDOM' }
    ]
  }
};

/** Force-apply the PDF content. Called from the "Apply PDF" button in admin. */
export function applyPdfContent() {
  try {
    localStorage.setItem('customHomeContent', JSON.stringify(PDF_HOME_CONTENT));
    // Trigger same-tab listeners
    window.dispatchEvent(new StorageEvent('storage', { key: 'customHomeContent' }));
    return true;
  } catch (e) {
    console.error('Failed to apply PDF content', e);
    return false;
  }
}

/** Runs on app boot — if saved content predates the current PDF version,
 *  overwrite it so users automatically see the latest issue. Safe to call
 *  multiple times; only writes when version mismatches. */
export function runHomeContentMigration() {
  try {
    const saved = localStorage.getItem('customHomeContent');
    if (!saved) {
      // No saved data — write defaults so the homepage shows PDF content
      localStorage.setItem('customHomeContent', JSON.stringify(PDF_HOME_CONTENT));
      return 'fresh-install';
    }
    let parsed;
    try { parsed = JSON.parse(saved); } catch (e) {
      // Corrupted — overwrite
      localStorage.setItem('customHomeContent', JSON.stringify(PDF_HOME_CONTENT));
      return 'corrupted-reset';
    }
    if (parsed && parsed._pdfVersion === CURRENT_PDF_VERSION) {
      return 'up-to-date';
    }
    // Version mismatch (or missing) — apply new content
    localStorage.setItem('customHomeContent', JSON.stringify(PDF_HOME_CONTENT));
    window.dispatchEvent(new StorageEvent('storage', { key: 'customHomeContent' }));
    return 'migrated';
  } catch (e) {
    console.error('Migration failed', e);
    return 'error';
  }
}

export { PDF_HOME_CONTENT };
