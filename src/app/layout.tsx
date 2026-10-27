import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ഹട്കെ ഹാത്ത് • Hatke Haat | Cyber-Traditional E-Commerce',
  description: 'Where Indian Heritage Craft Meets Next-Gen Futuristic Technology. Exclusive 3D showcase, smart appliances, artisanal cookware, cyber audio, and ambient living.',
  keywords: ['Hatke Haat', 'Indian Traditional Art', 'Cyber-Traditional', 'Futuristic E-Commerce', 'Home Appliances', 'Handcrafted', 'Next.js E-Commerce'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#09070F] text-slate-100 antialiased selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
