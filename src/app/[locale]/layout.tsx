import { ThemeProvider } from '@/components/providers/theme-provider';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Nexio - All-in-One Productivity & Collaboration Platform',
  description:
    "Boost your productivity with Nexio's integrated mind maps, task management, calendar, team chat, and Pomodoro timer. The ultimate workspace for focused collaboration.",
  keywords:
    'productivity app, mind mapping software, task management, team collaboration, pomodoro timer, project management, note taking app, team chat, calendar app, workspace organization',
  authors: [{ name: 'Nexio' }],
  creator: 'Nexio',
  publisher: 'Nexio',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexio.app',
    title: 'Nexio - Where Ideas Connect, Productivity Flows',
    description:
      'Transform how you work with Nexio. Mind maps, tasks, calendar, chat, and Pomodoro timer in one seamless platform. Perfect for teams and individuals.',
    siteName: 'Nexio',
    images: [
      {
        url: 'https://nexio.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nexio - Productivity Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexio - All-in-One Productivity Platform',
    description:
      'Mind maps, tasks, calendar, chat & Pomodoro timer. Everything you need to stay focused and organized.',
    images: ['https://nexio.app/twitter-image.jpg'],
    creator: '@nexioapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nexio',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web, iOS, Android',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
  description:
    'All-in-one productivity platform with mind maps, task management, calendar, team chat, and Pomodoro timer.',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load messages for the current locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
