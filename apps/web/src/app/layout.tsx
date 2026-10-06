import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ethio Fund / WeGen - Verified Fundraising for Ethiopia You Can Trust',
  description: 'Ethio Fund is Ethiopia\'s verified crowdfunding, giving, and organization fundraising platform. Every campaign is reviewed before going live.',
  openGraph: {
    title: 'Ethio Fund / WeGen - Verified Fundraising for Ethiopia',
    description: 'Every campaign is reviewed by our team. Support verified personal, referral, and organization causes in Ethiopia.',
    url: 'https://wegen.et',
    siteName: 'Ethio Fund',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#CCF88E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Figtree:wght@400;500;600&family=Noto+Sans+Ethiopic:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#FFFFFF] text-[#1A1A1A] antialiased selection:bg-[#CCF88E] selection:text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}

