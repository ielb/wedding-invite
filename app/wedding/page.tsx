import type { Metadata } from 'next';
import Invitation from '../invitation';

export const metadata: Metadata = {
  title: 'دعوة زفاف | 25 أكتوبر 2026 · قصر حمامة، تطوان',
  description: 'نتشرّف بدعوتكم لمشاركتنا فرحة الزفاف يوم الأحد 25 أكتوبر 2026، بقصر حمامة في تطوان.',
  icons: { icon: '/wedding/favicon.svg' },
};

export default function WeddingOnly() {
  return <Invitation weddingOnly />;
}
