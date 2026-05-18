import React from 'react';
import { TOP_STORIES } from '../data/homeData.js';
import { usePageContent } from '../utils/pageContent.js';

export default function ArticlePage() {
  const pc = usePageContent('article', {
    breadcrumb: [
      { label: 'முகப்பு', link: '/' },
      { label: 'அரசியல்', link: '/category' },
      { label: 'கட்டுரை', link: '' }
    ],
    title: 'தமிழக முதல்வர் ஆனார் த.வெ.க தலைவர் ஜோசப் விஜய்',
    subtitle: 'புரட்சி அரசியலும்... புத்தம் புதிய கூட்டணி ஆட்சியும்! தமிழக மக்கள் அளித்த அமோக ஆதரவால் வரலாற்றுச் சாதனை.',
    author: 'மாநில செய்தியாளர்',
    date: '10 மே 2026, 10:30 IST',
    image: '/img/vijay.avif',
    caption: 'சென்னை தலைமைச் செயலகத்தில் நடைபெற்ற விழாவில் பதவிப்பிரமாணம்.',
    tags: ['அரசியல்', 'தமிழகம்', 'தேர்தல் 2026', 'முதலமைச்சர்'],
    content: [
      'தமிழக அரசியல் வரலாற்றில் ஒரு புதிய அத்தியாயம் எழுதப்பட்டுள்ளது. 2026 சட்டப்பேரவைத் தேர்தலில் மாபெரும் வெற்றி பெற்ற தமிழக வெற்றிக் கழகத்தின் (த.வெ.க) தலைவர் ஜோசப் விஜய் இன்று தமிழகத்தின் புதிய முதலமைச்சராகப் பதவியேற்றார்.',
      'சென்னை கிண்டியில் உள்ள ஆளுநர் மாளிகையில் நடைபெற்ற எளிய, ஆனால் பிரம்மாண்டமான விழாவில், அவருக்கு ஆளுநர் பதவிப் பிரமாணமும் ரகசியக் காப்புப் பிரமாணமும் செய்து வைத்தார். விழாவில் கூட்டணிக் கட்சித் தலைவர்கள், திரையுலகப் பிரபலங்கள் மற்றும் லட்சக்கணக்கான தொண்டர்கள் கலந்து கொண்டனர்.',
      'எம்.ஜி.ஆர், ஜெயலலிதா ஆகியோரைத் தொடர்ந்து, திரையுலகில் இருந்து வந்து தனிப்பெரும் தலைவராக உருவெடுத்து முதலமைச்சர் நாற்காலியை அலங்கரிக்கும் மூன்றாவது மிகப்பெரிய திரை ஆளுமை விஜய் ஆவார். மக்கள் மத்தியில் அவரது கொள்கைகளுக்கும், \'மாற்றம்\' என்ற முழக்கத்திற்கும் கிடைத்த வெற்றி இது என அரசியல் விமர்சகர்கள் கருத்துத் தெரிவித்துள்ளனர்.',
      'தனது முதல் உரையில், \'இந்த வெற்றி என் வெற்றி அல்ல, இது தமிழக மக்களின் வெற்றி. ஏழை, எளிய மக்களின் வாழ்வில் ஒளியேற்றுவதே எனது அரசின் தலையாய நோக்கமாக இருக்கும்\' என்று விஜய் சூளுரைத்தார். உடனடியாக பல முக்கிய கோப்புகளில் அவர் கையெழுத்திடுவார் என எதிர்பார்க்கப்படுகிறது.'
    ],
    pullQuote: '"இந்த வெற்றி என் வெற்றி அல்ல, இது தமிழக மக்களின் வெற்றி. ஏழை, எளிய மக்களின் வாழ்வில் ஒளியேற்றுவதே எனது அரசின் தலையாய நோக்கமாக இருக்கும்."',
    closing: 'புதிய அமைச்சரவையில் பல இளைஞர்களுக்கும், பெண்களுக்கும் வாய்ப்பளிக்கப்பட்டுள்ளதாக தகவல்கள் தெரிவிக்கின்றன. முதலமைச்சரின் முதல் கட்ட நடவடிக்கைகள் என்னவாக இருக்கும் என்பதை தமிழகமே ஆவலோடு எதிர்பார்த்துக் காத்திருக்கிறது.',
    relatedHead: 'தொடர்புடைய செய்திகள்'
  });

  const breadcrumb = pc.breadcrumb || [];
  const tags = pc.tags || [];
  const content = pc.content || [];

  return (
    <div className="article-page">
      <div className="article-breadcrumb">
        {breadcrumb.map((b, i) => (
          <React.Fragment key={i}>
            {b.link ? <a href={b.link}>{b.label}</a> : <span>{b.label}</span>}
            {i < breadcrumb.length - 1 ? ' › ' : ''}
          </React.Fragment>
        ))}
      </div>

      <header className="article-header">
        <h1 className="article-title">{pc.title}</h1>
        <h2 className="article-subtitle">{pc.subtitle}</h2>
        <div className="article-meta">
          <span className="article-author">எழுதியவர்: {pc.author}</span>
          <span className="article-date">{pc.date}</span>
        </div>
      </header>

      <figure className="article-featured-media">
        <img src={pc.image} alt={pc.title} />
        <figcaption className="article-caption">{pc.caption}</figcaption>
      </figure>

      <div className="article-body">
        {content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}

        {pc.pullQuote && (
          <div className="article-quote">{pc.pullQuote}</div>
        )}

        {pc.closing && (
          <p>{pc.closing}</p>
        )}
      </div>

      <div className="article-tags">
        {tags.map((tag, i) => (
          <a href="/category" className="article-tag" key={i}>{tag}</a>
        ))}
      </div>

      <section className="article-related">
        <h3>{pc.relatedHead}</h3>
        <div className="article-related-grid">
          {TOP_STORIES.slice(1).map((story, i) => (
            <a href="/article" className="related-card" key={i}>
              <img src={story.img} alt={story.title} />
              <h4>{story.title}</h4>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
