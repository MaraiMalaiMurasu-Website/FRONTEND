/*
  Content migration — auto-applies new editorial content (e.g. when a new
  weekly PDF is published) by overwriting the user's saved localStorage
  on next page load if the saved version is older than the current PDF.

  When a new edition is shipped:
    1. Bump CURRENT_PDF_VERSION below
    2. Update PDF_HOME_CONTENT to match the new issue
    3. Users automatically see the new content on next page load
*/

export const CURRENT_PDF_VERSION = '2026-05-10-v1'; // MM Murasu — May 10-16, 2026

// Content matching MM MURASU 10.05.2026 PDF
const PDF_HOME_CONTENT = {
  _pdfVersion: CURRENT_PDF_VERSION,
  leadVideo: {
    kicker: 'அரசியல் முரசு',
    title: 'தமிழக முதல்வர் ஆனார் த.வெ.க தலைவர் ஜோசப் விஜய்',
    meta: 'புரட்சி அரசியலும்... புத்தம் புதிய கூட்டணி ஆட்சியும்!',
    videoId: 'PDOg5PnSXYM',
    poster: '/img/vijay.avif'
  },
  heroBlurb: {
    dek: 'தமிழக அரசியல் வரலாற்றில் ஒரு புதிய அத்தியாயம் எழுதப்பட்டுள்ளது. 234 தொகுதிகளில் தனித்துப் போட்டியிட்ட த.வெ.க., 108 இடங்களில் வெற்றி பெற்று தனிப்பெரும் கட்சியாக உருவெடுத்துள்ளது. காங்கிரஸ் (5 எம்.எல்.ஏ.க்கள்), விசிக, இடதுசாரிக் கட்சிகள், IUML ஆதரவுடன் மொத்தம் 120 இடங்களுடன் "கூட்டணி ஆட்சி" புதிய அத்தியாயம் தொடங்கியுள்ளது.',
    liveTag: '● LIVE',
    tags: [
      { text: 'த.வெ.க. வெற்றி', href: '/headlines' },
      { text: 'கூட்டணி ஆட்சி', href: '/article' },
      { text: 'ஜோசப் விஜய் · முதலமைச்சர்', href: '/article' },
      { text: 'புரட்சி அரசியல்', href: '/article' }
    ],
    reporting: 'டெல்லி டெஸ்க், மாநில செய்தியாளர்கள், மறைமலை முரசு குழுமம்',
    updatedAt: '',
    updatedAtTs: ''
  },
  heroSide: [
    { n: 1, img: '/img/crime-scene.avif', title: 'அம்பேத்கர் வரலாற்றை பாடப்புத்தகத்தில் சேர்க்க வேண்டும்: மதுரை நீதிமன்றம் கிளை அதிரடி உத்தரவு!', meta: 'மதுரை · 10 நிமிடங்களுக்கு முன்' },
    { n: 2, img: '/img/world-summit.avif', title: 'உற்பத்தித் துறை வளர்ச்சி: பொருளாதார முன்னேற்றம்', meta: 'பொருளாதாரம் · 22 நிமிடங்களுக்கு முன்' },
    { n: 3, img: '/img/cheating-case.avif', title: 'பொறியியல் படிப்பிற்கான விண்ணப்பப் பதிவு தொடக்கம்!', meta: 'கல்வி · 1 மணி நேரத்திற்கு முன்' },
    { n: 4, img: '/img/cheating-case.avif', title: 'செங்கல்பட்டு மாவட்டத்தில் 93.25 சதவீத மாணவமாணவிகள் தேர்ச்சி', meta: 'கல்வி · 2 மணி நேரத்திற்கு முன்' }
  ],
  liveTicker: [
    'தமிழக முதல்வர் ஆனார் த.வெ.க தலைவர் ஜோசப் விஜய்',
    'அம்பேத்கர் வரலாற்றை பாடப்புத்தகத்தில் சேர்க்க மதுரை கிளை உத்தரவு',
    'புதுச்சேரியில் மீண்டும் முதலமைச்சராகிறார் ரங்கசாமி',
    'பொறியியல் படிப்பிற்கான விண்ணப்பப் பதிவு தொடக்கம்',
    'சிங்கப்பெருமாள் கோவில்: பயன்பாட்டிற்கு வராத மேம்பாலம் - மக்கள் அவதி',
    'சீனாவின் எதிர்ப்பை மீறி தைவான் அதிபர் அமெரிக்கப் பயணம்',
    'திருச்சி உச்சி பிள்ளையார் கோயில் - ஆன்மிக முரசு சிறப்பு கட்டுரை',
    'த.வெ.க. ஆதரவு: காங்கிரசை விமர்சிக்கும் தி.மு.க. — ராஜேஷ்குமார் கடும் கண்டனம்'
  ],
  electionBanner: {
    title: 'தேர்தல் 2026 முடிவுகள்',
    leftNum: '108',
    leftLabel: 'த.வெ.க. வென்ற\nதொகுதிகள்',
    rightNum: '120',
    rightLabel: 'கூட்டணியில் மொத்த\nஆதரவு இடங்கள்'
  },
  sponsorCard: {
    brand: 'தமிழ்நாடு பெட்டிங் மார்ட் · Tamilnadu Bedding Mart',
    headline: 'ஏசி மேளா — Voltas / Carrier / Samsung 1 Ton 3 Star ₹33,990 முதல்',
    copy: 'அனைத்து ஏசிகளுக்கும் இன்ஸ்டாலேஷன் முற்றிலும் இலவசம்! ₹10,000 மேல் பொருட்கள் வாங்கினால் நிச்சயமான சிறப்பு பரிசு உண்டு.',
    cta: 'மறைமலை நகர் · 98410 05056 →',
    thumb: 'AC MELA'
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
    { cat: 'அரசியல்', img: '/img/vijay.avif', title: 'தமிழக அரசியலில் புதிய சகாப்தம்: எம்.ஜி.ஆர், ஜெயலலிதா வரிசையில் நடிகர் விஜய்!', meta: 'அரசியல் · 18 நிமிடம்', thumb: 'POLITICS' },
    { cat: 'தமிழகம்', img: '/img/crime-scene.avif', title: 'மயிலாடுதுறையில் பரபரப்பு: காங்கிரஸ் கட்சியினர் மீது திமுகவினர் தாக்குதல்!', meta: 'மயிலாடுதுறை · 36 நிமிடம்', thumb: 'CLASH' },
    { cat: 'அரசியல்', img: '/img/mamata.avif', title: 'தமிழகத்தில் புதிய ஆட்சி அமைய உடனே நடவடிக்கை எடுக்க வேண்டும்: மு.க.ஸ்டாலின்', meta: 'அரசியல் · 1 மணி நேரம்', thumb: 'DMK' },
    { cat: 'சினிமா', img: '/img/vijay.avif', title: 'ஜனநாயகன் அப்டேட்: தளபதி பிறந்தநாளில் திரைக்கு வருகிறதா கடைசிப் படம்?', meta: 'சினிமா · 2 மணி நேரம்', thumb: 'CINEMA' }
  ],
  electionGrid: [
    { cat: 'மாநில முரசு', img: '/img/mamata.avif', title: 'புதுச்சேரியில் என்.ஆர்.காங்கிரஸ் கூட்டணி அமோக வெற்றி: மீண்டும் முதலமைச்சராகிறார் ரங்கசாமி!', meta: 'புதுச்சேரி · 4 மணி நேரம்', thumb: 'ELECTION' },
    { cat: 'நீதிமன்றம்', img: '/img/crime-scene.avif', title: 'சிறுமி கொலை வழக்கு: கொடூர குற்றவாளிக்கு தூக்கு தண்டனை — புதுச்சேரி நீதிமன்றம் அதிரடி தீர்ப்பு', meta: 'புதுச்சேரி · 5 மணி நேரம்', thumb: 'COURT' },
    { cat: 'சர்வதேசம்', img: '/img/world-summit.avif', title: '4 ஆண்டுகளை கடந்து நீடிக்கும் போர்: 350 டிரோன்களைச் சுட்டு வீழ்த்தியது உக்ரைன்!', meta: 'உலகம் · 6 மணி நேரம்', thumb: 'WAR' },
    { cat: 'சர்வதேசம்', img: '/img/world-summit.avif', title: 'அமைதி ஒப்பந்தத்தில் கையெழுத்திடாவிட்டால் ஈரான் வேதனைப்பட வேண்டி இருக்கும்: டிரம்ப் மிரட்டல்', meta: 'வாஷிங்டன் · 7 மணி நேரம்', thumb: 'IRAN' }
  ],
  cinemaGrid: [
    { cat: 'சினிமா', img: '/img/milind.avif', title: 'திரையுலகின் சாதனைத் தயாரிப்பாளர் ஆர்.பி.சௌத்ரி காலமானார்!', meta: 'திரை டெஸ்க் · 3 மணி நேரம்', thumb: 'OBITUARY' },
    { cat: 'சினிமா', img: '/img/vijay.avif', title: 'ஜனநாயகன் அப்டேட்: தளபதி பிறந்தநாளில் திரைக்கு வருகிறதா கடைசிப் படம்?', meta: 'சினிமா டெஸ்க் · 4 மணி நேரம்', thumb: 'UPDATE' },
    { cat: 'திரை விமர்சனம்', img: '/img/vijay.avif', title: 'கருப்பு சினிமா: திரையுலகின் மறைக்கப்பட்ட முகத்தை காட்டும் அதிரடி உலகம்', meta: 'சினிமா டெஸ்க் · 5 மணி நேரம்', thumb: 'REVIEW' },
    { cat: 'சினிமா', img: '/img/milind.avif', title: 'வைரல் அப்டேட்ஸ்: ஃபர்ஸ்ட் லுக், டீசர், டிரெய்லர் — ட்ரோல் கலாச்சாரம் அதிகரிப்பு', meta: 'திரை டெஸ்க் · 7 மணி நேரம்', thumb: 'TRENDING' }
  ],
  twoColLeft: {
    head: 'மாநில செய்திகள்',
    lead: { img: '/img/cheating-case.avif', title: 'சிங்கப்பெருமாள் கோவில்: பயன்பாட்டிற்கு வராத ஆகாய நடை மேம்பாலம் — பொதுமக்கள் அவதி', excerpt: 'பல கோடி ரூபாய் மதிப்பில் கட்டப்பட்ட ஆகாய நடை மேம்பாலம் இன்னும் பயன்பாட்டிற்கு வராததால், ஜி.எஸ்.டி சாலையைக் கடக்க பொதுமக்கள் சிரமப்படுகின்றனர்.', meta: 'காஞ்சிபுரம் · 12 நிமிடம்', thumb: 'INFRA' },
    rest: [
      { img: '/img/crime-scene.avif', title: 'போலீஸ் எஸ்.ஐ-யை சுட்ட ரவுடி: பதிலடி கொடுத்த போலீஸ்! திருச்செந்தூர் அருகே பரபரப்பு', meta: 'திருச்செந்தூர் · 1 மணி நேரம்', thumb: 'CRIME' },
      { img: '/img/cheating-case.avif', title: 'செங்கல்பட்டு நெடுஞ்சாலையில் நடைமேம்பாலம்: பொதுமக்கள் கோரிக்கை!', meta: 'செங்கல்பட்டு · 2 மணி நேரம்', thumb: 'PUBLIC DEMAND' },
      { img: '/img/crime-scene.avif', title: 'நகைக்காக மூதாட்டி கொலை: இளைஞர் கைது — செங்கல்பட்டு மாவட்டம்', meta: 'குற்றம் · 3 மணி நேரம்', thumb: 'ARREST' },
      { img: '/img/mamata.avif', title: 'சிலிண்டர் விலை உயர்வு: சென்னையில் கம்யூனிஸ்ட், விசிகவினர் கண்டன ஆர்ப்பாட்டம்!', meta: 'சென்னை · 4 மணி நேரம்', thumb: 'PROTEST' }
    ]
  },
  twoColRight: {
    head: 'தேசிய & சர்வதேச செய்திகள்',
    lead: { img: '/img/world-summit.avif', title: 'சீனாவின் எதிர்ப்பை மீறி தைவான் அதிபர் ஆப்பிரிக்கப் பயணம்: கண்டனம் தெரிவித்த சீனா!', excerpt: 'மன்னர் 3-ம் எம்ஸ்வாதி அரியணை ஏறிய 40-வது ஆண்டு விழாவில் கலந்து கொண்ட தைவான் அதிபர் லாய் சிங்தே, பொருளாதார ஒத்துழைப்பு உள்ளிட்ட முக்கிய ஒப்பந்தங்களில் கையெழுத்திட்டார்.', meta: 'உலகம் · 30 நிமிடம்', thumb: 'WORLD' },
    rest: [
      { img: '/img/crime-scene.avif', title: 'சப்-இன்ஸ்பெக்டரை சுட்ட ரவுடி: துப்பாக்கி முனையில் அதிரடி வேட்டை — மரிய அந்தோணி கைது', meta: 'தூத்துக்குடி · 1 மணி நேரம்', thumb: 'CRIME' },
      { img: '/img/world-summit.avif', title: 'பீகார் பா.ஜ.க கூட்டணி அமைச்சரவை விரிவாக்கம்: 32 அமைச்சர்கள் பதவியேற்பு', meta: 'பாட்னா · 2 மணி நேரம்', thumb: 'POLITICS' },
      { img: '/img/cheating-case.avif', title: 'ரூ.5.13 கோடி மோசடி: திண்டுக்கல் நிலக்கோட்டை நிதி நிறுவன உரிமையாளர் மனைவி கைது!', meta: 'திண்டுக்கல் · 3 மணி நேரம்', thumb: 'FRAUD' },
      { img: '/img/air-india.avif', title: 'த.வெ.க. ஆதரவு: காங்கிரசை விமர்சிக்கும் தி.மு.க. — ராஜேஷ்குமார் கடும் கண்டனம்', meta: 'சென்னை · 4 மணி நேரம்', thumb: 'POLITICS' }
    ]
  },
  sportsCol: {
    head: 'விளையாட்டு & ஆன்மீகம்',
    lead: { img: '/img/cricket.avif', title: 'சர்வதேச விளையாட்டு அரங்கு: இந்தியாவின் அதிரடி ஆதிக்கம் மற்றும் வீரர்களின் சாதனைகளும்!', excerpt: 'உலகளாவிய விளையாட்டுப் போட்டிகளில் இந்திய வீரர்களின் தொடர் வெற்றிகள் மற்றும் புதிய சாதனைகள் — க்ரிக்கெட், தடகளம், கால்பந்து.', meta: 'விளையாட்டு டெஸ்க் · 1 மணி நேரம்', thumb: 'SPORTS' },
    rest: [
      { img: '/img/cricket.avif', title: 'க்ரிக்கெட்: உலக அரங்கில் ஆதிக்கம் செலுத்தும் நீலப்படை — டெஸ்ட் சாம்பியன்ஷிப்பில் முதலிடத்துக்கு போட்டி', meta: 'விளையாட்டு டெஸ்க் · 2 மணி நேரம்', thumb: 'CRICKET' },
      { img: '/img/milind.avif', title: 'ஈட்டி எறிதலில் ஈடிணையற்ற நீரஜ் சோப்ரா — 90 மீட்டர் இலக்கை எட்டும் முயற்சி', meta: 'விளையாட்டு டெஸ்க் · 3 மணி நேரம்', thumb: 'JAVELIN' },
      { img: '/img/world-summit.avif', title: 'கால்பந்து: மெஸ்ஸி-ரொனால்டோ யுகத்திற்குப் பிந்தைய மாற்றம் — எம்பாப்பே, ஹாலண்ட் எழுச்சி', meta: 'விளையாட்டு டெஸ்க் · 5 மணி நேரம்', thumb: 'FOOTBALL' },
      { img: '/img/world-summit.avif', title: 'திருச்சி உச்சி பிள்ளையார் கோயில்: விபீஷணன் வரலாறும் வழிபாட்டுத் தலமும்', meta: 'ஆன்மீகம் · 6 மணி நேரம்', thumb: 'TEMPLE' }
    ]
  },
  lifestyleCol: {
    head: 'வாழ்வியல் & சமையல்',
    lead: { img: '/img/milind.avif', title: 'செட்டிநாடு சிக்கன் கிரேவி: காரசாரமான சுவையில் ஒரு அட்டகாசமான செய்முறை', excerpt: 'வரமிளகாய், மல்லி, சீரகம், சோம்பு, மிளகு — வறுத்து அரைத்த மசாலா முழுவதையும் கொண்ட பாரம்பரிய செட்டிநாட்டு சிக்கன் குழம்பு செய்வது எப்படி?', meta: 'சமையல் முரசு · 1 மணி நேரம்', thumb: 'CHETTINAD CHICKEN' },
    rest: [
      { img: '/img/milind.avif', title: 'அழகு முரசு: தலை குளிக்கும்போது செய்யக்கூடாத 10 தவறுகள்!', meta: 'அழகு குறிப்பு · 2 மணி நேரம்', thumb: 'HAIR CARE' },
      { img: '/img/world-summit.avif', title: 'திருக்குறள் — அதிகாரம் 6: வாழ்க்கைத் துணைநலம் (குறள் 56)', meta: 'இலக்கியம் · 3 மணி நேரம்', thumb: 'TIRUKKURAL' },
      { img: '/img/world-summit.avif', title: 'நீதியரசரின் நற்சிந்தனைகள்: நாம் தவறு செய்யும்போது நமக்கு நாமே வழக்கறிஞர்கள் ஆகிறோம்', meta: 'சிந்தனை · 4 மணி நேரம்', thumb: 'WISDOM' },
      { img: '/img/world-summit.avif', title: 'வாக்கர் வாய்ஸ்: தற்போதைய அரசியல் சூழலை அலசும் அண்ணாச்சி-அபி உரையாடல்', meta: 'வாழ்வியல் · 6 மணி நேரம்', thumb: 'CONVERSATION' }
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
