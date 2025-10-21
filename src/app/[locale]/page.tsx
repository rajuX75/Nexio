import { LanguageSwitcher } from '@/components/language-switcher';
import { ModeToggle } from '@/components/mode-toggle';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const navT = useTranslations('Navigation');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{navT('home')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">{t('title')}</h1>

          <h2 className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6">
            {t('welcome')}
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('description')}
          </p>

          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
            {t('getStarted')}
          </button>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {t('features.mindMaps')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Visualize your ideas and thoughts</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {t('features.taskManagement')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Organize and track your tasks</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {t('features.calendar')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Schedule and manage your time</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {t('features.teamChat')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Collaborate with your team</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {t('features.pomodoro')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Stay focused with timed sessions</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
