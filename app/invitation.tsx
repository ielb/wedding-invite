import { ArrowDown, CalendarDays, MapPin } from 'lucide-react';
import Image from 'next/image';
import Countdown from './countdown';
import MotionExperience from './motion-experience';

const wedding = { title: 'حفل الزفاف', day: 'الأحد', number: '25', date: '2026-10-25', description: 'ونحتفل معكم ببداية حكايتنا' };
const henna = { title: 'ليلة الحناء', day: 'الجمعة', number: '23', date: '2026-10-23', description: 'نبدأ فرحتنا بليلة الحناء' };
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Hamama%20Palace%2C%20Tetouan%2C%20Morocco';

export default function Invitation({ weddingOnly = false }: { weddingOnly?: boolean }) {
  const celebrations = weddingOnly ? [wedding] : [henna, wedding];
  const calendar = weddingOnly ? '/wedding/invitation.ics' : '/nouhaila-issam.ics';
  const title = weddingOnly ? 'دعوة زفاف' : 'دعوة زفاف نهيلة وعصام';

  return (
    <MotionExperience>
      <a className="skip-link" href="#invitation">انتقل إلى الدعوة</a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label={`${title}، بداية الدعوة`}>
          {weddingOnly ? 'دعوة زفاف' : <>نهيلة <span>و</span> عصام</>}
        </a>
        <a className="header-date" href="#celebrations">25 <span>·</span> 10 <span>·</span> 2026</a>
      </header>
      <main id="home">
        <section className="hero" aria-label={title}>
          <div className="side-note side-note-right" aria-hidden="true"><span />دعوة زفاف<span /></div>
          <div className="invitation-art">
            <Image className="arch-image" src="/images/embroidered-garden.webp" width={1024} height={1536} alt="" unoptimized priority />
            <div className={`hero-copy${weddingOnly ? ' hero-copy-wedding' : ''}`}>
              <p className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              {weddingOnly ? <h1 className="wedding-heading"><span>دعوة</span><span>زفاف</span></h1> : <h1><span>نهيلة</span><span className="names-and">و</span><span>عصام</span></h1>}
              <p className="hero-date"><time dateTime="2026-10-25">25 أكتوبر 2026</time></p>
            </div>
          </div>
          <div className="side-note side-note-left" aria-hidden="true"><span />أكتوبر 2026<span /></div>
          <a className="discover" href="#invitation"><span>بكل الحب، ندعوكم</span><ArrowDown size={17} strokeWidth={1.4} aria-hidden="true" /></a>
        </section>
        <section className="blessing section-pad" id="invitation" aria-labelledby="verse-label">
          <div className="ornament" aria-hidden="true" data-reveal><span />✧<span /></div>
          <div data-reveal>
            <p className="verse-intro" id="verse-label">قال الله تعالى</p>
            <blockquote className="quran" cite="https://quran.com/30/21">
              ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ ﴾
            </blockquote>
            <a className="verse-source" href="https://quran.com/30/21" target="_blank" rel="noreferrer">سورة الروم، الآية 21</a>
          </div>
          <div className="invitation-message" data-reveal>
            <h2>وبحضوركم تكتمل فرحتنا</h2>
            <p>بكل الحب والسرور، نتشرّف نحن وعائلتانا بدعوتكم<br className="desktop-break" /> لمشاركتنا فرحة زفافنا، وبداية حياتنا معًا.</p>
          </div>
        </section>
        <section className="celebrations section-pad" id="celebrations" aria-labelledby="celebration-heading">
          <div className="section-heading" data-reveal><span /><h2 id="celebration-heading">موعدنا مع الفرح</h2><span /></div>
          <div className={`event-grid${weddingOnly ? ' event-grid-single' : ''}`}>
            {celebrations.map(event => (
              <article className="event" key={event.date} data-reveal>
                <p className="event-day">{event.day}</p>
                <h3>{event.title}</h3>
                <time className="event-date" dateTime={event.date}>
                  <span className="event-number">{event.number}</span>
                  <span className="event-month">أكتوبر <span>2026</span></span>
                </time>
                <p className="event-description">{event.description}</p>
              </article>
            ))}
          </div>
          <div className="venue" data-reveal>
            <MapPin size={24} strokeWidth={1.3} aria-hidden="true" />
            <p className="venue-label">مكان حفل الزفاف</p>
            <h3>قصر حمامة</h3>
            <p className="venue-city">تطوان</p>
            <a className="map-link" href={mapUrl} target="_blank" rel="noreferrer">الموقع على الخريطة</a>
          </div>
          <a className="calendar-link" href={calendar} download={weddingOnly ? 'wedding-25-october-2026.ics' : 'nouhaila-issam.ics'} data-reveal>
            <CalendarDays size={19} strokeWidth={1.4} aria-hidden="true" />{weddingOnly ? 'احفظوا الموعد في التقويم' : 'احفظوا الموعدين في التقويم'}
          </a>
        </section>
        <section className="countdown-section section-pad" aria-labelledby="countdown-heading" data-reveal>
          <p id="countdown-heading">نعدّ الأيام للقائكم</p>
          <Countdown />
          <p className="countdown-caption">حتى يوم زفافنا</p>
        </section>
      </main>
      <footer className="site-footer" data-reveal>
        <div className="ornament" aria-hidden="true"><span />✧<span /></div>
        <p className="footer-message">أنتم أجمل من يشاركنا هذه الفرحة</p>
        <a className={`footer-names${weddingOnly ? ' footer-wedding' : ''}`} href="#home" aria-label="العودة إلى بداية الدعوة">
          {weddingOnly ? 'بحضوركم نفرح' : <>نهيلة <span>و</span> عصام</>}
        </a>
        <time dateTime="2026-10-25">25 أكتوبر 2026</time>
      </footer>
    </MotionExperience>
  );
}
