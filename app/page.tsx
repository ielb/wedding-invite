import type { Metadata } from 'next';
import Invitation from './invitation';

export const metadata: Metadata = {
  title: 'نهيلة وعصام | دعوة زفاف · 25 أكتوبر 2026',
  description: 'بكل الحب ندعوكم لمشاركتنا فرحة الزفاف يوم الأحد 25 أكتوبر 2026، بقصر حمامة في تطوان.',
  icons: { icon: '/favicon.svg' },
};

export default function Home() {
  return <Invitation />;
}
