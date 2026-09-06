import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nouhaila-issam.ielb7.chatgpt.site'),
  title: 'نهيلة وعصام | دعوة زفاف · ٢٥ أكتوبر ٢٠٢٦',
  description: 'بكل الحب ندعوكم لمشاركتنا فرحتنا. ليلة الحناء: ٢٣ أكتوبر ٢٠٢٦. حفل الزفاف: ٢٥ أكتوبر ٢٠٢٦.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
