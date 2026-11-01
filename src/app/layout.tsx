import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hatke • Everyday finds, a little different | ഹട്കെ',
  description: 'Desi at heart. Made for every Indian home. Launching first in Kerala. Useful first, honest prices, real delivery dates shown before you pay.',
  keywords: ['Hatke', 'Hatke Store', 'Kerala', 'Everyday finds', 'Desi at heart', 'Indian home products', 'Clever finds'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Chettan+2:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;500;600;700;800;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FAF9F6] text-[#111827] font-hatke-body antialiased selection:bg-[#FACC15] selection:text-[#111827]">
        {children}
      </body>
    </html>
  );
}
