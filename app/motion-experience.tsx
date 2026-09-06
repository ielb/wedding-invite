'use client';

import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MotionExperience({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      setEnabled(!preference.matches);
    };
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const elements = root.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!elements) return;
    if (!enabled || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });
    elements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight - 16) element.classList.add('is-visible');
      else {
        element.classList.remove('is-visible');
        observer.observe(element);
      }
    });
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={root} className="motion-experience" data-motion={enabled ? 'on' : 'off'}>
    {children}
    {!reducedMotion && <button className="motion-toggle" type="button" onClick={() => setEnabled(value => !value)} aria-pressed={!enabled}>
      {enabled ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      {enabled ? 'إيقاف الحركة' : 'تشغيل الحركة'}
    </button>}
  </div>;
}
