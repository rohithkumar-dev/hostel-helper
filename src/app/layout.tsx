import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HOSTEL HELPER • SRM AP Hostel Services',
  description:
    'Your Hostel Services, Simplified. Quickly request gate deliveries (Food, BigBasket, Online Orders), laundry services, and hostel shop items at SRM AP.',
  keywords: [
    'Hostel Helper',
    'SRM AP',
    'SRM University AP',
    'Hostel Delivery',
    'Hostel Laundry',
    'Gate Delivery',
    'Total Fresh',
    'Hostel Services',
  ],
  authors: [{ name: 'K Rohit Kumar' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased text-slate-800 bg-slate-50 flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
