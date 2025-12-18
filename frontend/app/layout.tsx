import type { Metadata } from 'next';
import {
  Geist,
  Geist_Mono,
  Gloria_Hallelujah,
} from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const geistSans =
  Geist(
    {
      variable:
        '--font-geist-sans',
      subsets:
        [
          'latin',
        ],
    }
  );

const geistMono =
  Geist_Mono(
    {
      variable:
        '--font-geist-mono',
      subsets:
        [
          'latin',
        ],
    }
  );

const gloriaHallelujah =
  Gloria_Hallelujah(
    {
      weight:
        '400',
      variable:
        '--font-gloria',
      subsets:
        [
          'latin',
        ],
    }
  );

export const metadata: Metadata =
  {
    title:
      'Link6ync - URL Shortener',
    description:
      'Transform long URLs into elegant short links with Link6ync',
    icons:
      {
        icon: '/link6ync-favicon.png',
      },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gloriaHallelujah.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {
            children
          }
        </ThemeProvider>
      </body>
    </html>
  );
}
