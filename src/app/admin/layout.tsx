import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hatke • Admin Hub | അഡ്മിൻ കൺസോൾ',
  description: 'Everyday finds, a little different. Mobile-first Admin Portal for Hatke Store.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111827] antialiased selection:bg-[#FACC15] selection:text-[#111827] font-hatke-body">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Chettan+2:wght@500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      {children}
    </div>
  );
}
