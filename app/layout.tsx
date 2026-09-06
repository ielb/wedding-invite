import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nouhaila-issam.ielb7.chatgpt.site'),
  title: 'نهيلة وعصام | دعوة زفاف · 25 أكتوبر 2026',
  description: 'بكل الحب ندعوكم لمشاركتنا فرحتنا. ليلة الحناء: 23 أكتوبر 2026. حفل الزفاف: 25 أكتوبر 2026.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
