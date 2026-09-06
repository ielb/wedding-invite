import type { Metadata } from 'next';
import Invitation from '../invitation';

export const metadata: Metadata = {
  title: 'نهيلة وعصام | ليلة الحناء والزفاف · أكتوبر 2026',
  description: 'بكل الحب ندعوكم لمشاركتنا فرحتنا. ليلة الحناء: 23 أكتوبر 2026. حفل الزفاف: 25 أكتوبر 2026، قصر حمامة، تطوان.',
  icons: { icon: '/favicon.svg' },
};

export default function HennaAndWedding() {
  return <Invitation includeHenna />;
}
