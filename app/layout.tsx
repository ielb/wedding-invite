import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nouhaila-issam.ielb7.chatgpt.site'),
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
