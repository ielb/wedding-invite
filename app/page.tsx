import type { Metadata } from 'next';
import Invitation from './invitation';

export const metadata: Metadata = {
  title: 'نهيلة وعصام | دعوة زفاف · 25 أكتوبر 2026',
  description: 'بكل الحب ندعوكم لمشاركتنا فرحتنا. ليلة الحناء: 23 أكتوبر 2026. حفل الزفاف: 25 أكتوبر 2026، قصر حمامة، تطوان.',
  icons: { icon: '/favicon.svg' },
};

export default function Home() {
  return <Invitation />;
}
