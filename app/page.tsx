import { ArrowDown, CalendarDays } from 'lucide-react';
import Countdown from './countdown';

const celebrations = [
  { title: 'ليلة الحناء', day: 'الجمعة', number: '٢٣', date: '2026-10-23', description: 'نبدأ فرحتنا بليلة الحناء' },
  { title: 'حفل الزفاف', day: 'الأحد', number: '٢٥', date: '2026-10-25', description: 'ونحتفل معكم ببداية حكايتنا' },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#invitation">انتقل إلى الدعوة</a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="نهيلة وعصام، بداية الدعوة">نهيلة <span>و</span> عصام</a>
        <a className="header-date" href="#celebrations">٢٥ <span>·</span> ١٠ <span>·</span> ٢٠٢٦</a>
      </header>
      <main id="home">
        <section className="hero" aria-label="دعوة زفاف نهيلة وعصام">
          <div className="side-note side-note-right" aria-hidden="true"><span />دعوة زفاف<span /></div>
          <div className="invitation-art">
            <img className="arch-image" src="/images/embroidered-garden.webp" width="1024" height="1536" alt="" fetchPriority="high" />
            <div className="hero-copy">
              <p className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <h1><span>نهيلة</span><span className="names-and">و</span><span>عصام</span></h1>
              <p className="hero-date"><time dateTime="2026-10-25">٢٥ أكتوبر ٢٠٢٦</time></p>
            </div>
          </div>
          <div className="side-note side-note-left" aria-hidden="true"><span />أكتوبر ٢٠٢٦<span /></div>
          <a className="discover" href="#invitation"><span>بكل الحب، ندعوكم</span><ArrowDown size={17} strokeWidth={1.4} aria-hidden="true" /></a>
        </section>
        <section className="blessing section-pad" id="invitation" aria-labelledby="verse-label">
          <div className="ornament" aria-hidden="true"><span />✧<span /></div>
          <p className="verse-intro" id="verse-label">قال الله تعالى</p>
          <blockquote className="quran" cite="https://quran.com/30/21">
            ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ ﴾
          </blockquote>
          <a className="verse-source" href="https://quran.com/30/21" target="_blank" rel="noreferrer">سورة الروم، الآية ٢١</a>
          <div className="invitation-message">
            <h2>وبحضوركم تكتمل فرحتنا</h2>
            <p>بكل الحب والسرور، نتشرّف نحن وعائلتانا بدعوتكم<br className="desktop-break" /> لمشاركتنا فرحة زفافنا، وبداية حياتنا معًا.</p>
          </div>
        </section>
        <section className="celebrations section-pad" id="celebrations" aria-labelledby="celebration-heading">
          <div className="section-heading"><span /><h2 id="celebration-heading">موعدنا مع الفرح</h2><span /></div>
          <div className="event-grid">
            {celebrations.map(event => (
              <article className="event" key={event.date}>
                <p className="event-day">{event.day}</p>
                <h3>{event.title}</h3>
                <time className="event-date" dateTime={event.date}>
                  <span className="event-number">{event.number}</span>
                  <span className="event-month">أكتوبر <span>٢٠٢٦</span></span>
                </time>
                <p className="event-description">{event.description}</p>
              </article>
            ))}
          </div>
          <a className="calendar-link" href="/nouhaila-issam.ics" download="nouhaila-issam.ics"><CalendarDays size={19} strokeWidth={1.4} aria-hidden="true" />احفظوا الموعدين في التقويم</a>
        </section>
        <section className="countdown-section section-pad" aria-labelledby="countdown-heading">
          <p id="countdown-heading">نعدّ الأيام للقائكم</p>
          <Countdown />
          <p className="countdown-caption">حتى يوم زفافنا</p>
        </section>
      </main>
      <footer className="site-footer">
        <div className="ornament" aria-hidden="true"><span />✧<span /></div>
        <p className="footer-message">أنتم أجمل من يشاركنا هذه الفرحة</p>
        <a className="footer-names" href="#home" aria-label="العودة إلى بداية الدعوة">نهيلة <span>و</span> عصام</a>
        <time dateTime="2026-10-25">٢٥ أكتوبر ٢٠٢٦</time>
      </footer>
    </>
  );
}
