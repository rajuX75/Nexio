'use client';

import { routing } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  if (!mounted) {
    return (
      <div className="flex gap-2">
        {routing.locales.map((loc) => (
          <button
            key={loc}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLanguage(loc)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            locale === loc
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
