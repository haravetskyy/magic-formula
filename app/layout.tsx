import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Magic Formula',
  description: 'A small app for basic math operations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`w-svw h-svh antialiased`}>{children}</body>
    </html>
  );
}
