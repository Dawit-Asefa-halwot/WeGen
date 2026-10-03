import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WeGen Ethiopia - Verified Crowdfunding, Giving & Organization Platform',
  description: 'WeGen is Ethiopia\'s verified crowdfunding, giving, and organization fundraising platform connecting people in need, referrers, donors, and NGOs.',
  openGraph: {
    title: 'WeGen Ethiopia - Verified Crowdfunding & Giving',
    description: 'Together, We Can Change Someone\'s Story. 100% Verified Ethiopian Crowdfunding.',
    url: 'https://wegen.et',
    siteName: 'WeGen Platform',
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
    <html lang="en" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
