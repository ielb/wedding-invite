'use client';

import { useEffect, useState } from 'react';

// The start of the wedding date in Morocco; no ceremony time is implied.
const weddingDay = Date.parse('2026-10-25T00:00:00+01:00');
const number = new Intl.NumberFormat('ar-MA-u-nu-arab', { minimumIntegerDigits: 2, useGrouping: false });

export default function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, weddingDay - Date.now()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);
  if (remaining === 0) return <p className="celebration-arrived">بارك الله لنا وجمع بيننا في خير</p>;
  const units = [
    { label: 'يوم', value: remaining === null ? null : Math.floor(remaining / 86400000) },
    { label: 'ساعة', value: remaining === null ? null : Math.floor(remaining / 3600000) % 24 },
    { label: 'دقيقة', value: remaining === null ? null : Math.floor(remaining / 60000) % 60 },
  ];
  return <div className="countdown" role="timer" aria-label="الوقت المتبقي حتى يوم الزفاف">
    {units.map(unit => <div className="countdown-unit" key={unit.label}>
      <span className="countdown-number">{unit.value === null ? '—' : number.format(unit.value)}</span>
      <span>{unit.label}</span>
    </div>)}
  </div>;
}
