import type { Metadata } from "next";
import "./globals.css";
import React from 'react';
import { QueryClientProviderWrapper } from './QueryClientProviderWrapper';

export const metadata: Metadata = {
  title: "DEFRAG | The Operating System for Human Design",
  description: "Stop fixing yourself. Start operating yourself. Get your architectural blueprint based on Natural Law.",
  openGraph: {
    images: ['/og-circuit-board-gold.png'],
    title: 'DEFRAG | The Operating System for Human Design',
    description: 'Stop fixing yourself. Start operating yourself. Get your architectural blueprint based on Natural Law.',
    url: 'https://defrag.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEFRAG | The Operating System for Human Design',
    description: 'Stop fixing yourself. Start operating yourself. Get your architectural blueprint based on Natural Law.',
    images: ['/og-circuit-board-gold.png'],
    site: '@defragapp',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="antialiased selection:bg-white selection:text-black">
        <QueryClientProviderWrapper>
          {children}
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
