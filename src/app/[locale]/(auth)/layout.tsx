import { LanguageSwitcher } from '@/components/language-switcher';
import { GalleryVerticalEnd } from 'lucide-react';

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
};

export default async function RootLayout({ children }: Props) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-between">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            NEXIO Inc.
          </a>
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login-form-image.avif"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
