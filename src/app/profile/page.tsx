'use client';

import Footer from '@/components/footer/footer';
import Navbar from '@/components/navbar/navbar';
import SignInRequired from '@/features/auth/sign-in-required';
import { useUiSettings } from '@/features/settings/ui-settings-provider';
import { useSession } from 'next-auth/react';

const ProfilePage = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const { themeMode, fontScale, setThemeMode, setFontScale } = useUiSettings();

  if (!isLoggedIn) {
    return <SignInRequired title="Profile settings require sign in" />;
  }

  return (
    <div className="h-screen w-full p-1 flex flex-col border-2 border-solid border-red-500">
      <Navbar title="Profile Settings" />
      <div className="h-full border-2 border-solid border-orange-500 rounded-sm my-1 bg-gray-700 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          <section className="border border-green-600 rounded-lg p-4">
            <h2 className="text-xl font-semibold">Theme</h2>
            <p className="text-sm text-green-300 mb-3">
              Choose a color mode for readability and comfort.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`px-4 py-2 rounded border ${
                  themeMode === 'dark' ? 'border-green-400 bg-black' : 'border-red-500'
                }`}
              >
                Dark
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`px-4 py-2 rounded border ${
                  themeMode === 'light'
                    ? 'border-green-400 bg-white text-black'
                    : 'border-red-500'
                }`}
              >
                Light
              </button>
            </div>
          </section>

          <section className="border border-green-600 rounded-lg p-4">
            <h2 className="text-xl font-semibold">Font size</h2>
            <p className="text-sm text-green-300 mb-3">
              Increase or decrease base text size.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setFontScale('sm')}
                className={`px-4 py-2 rounded border ${
                  fontScale === 'sm' ? 'border-green-400' : 'border-red-500'
                }`}
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => setFontScale('md')}
                className={`px-4 py-2 rounded border ${
                  fontScale === 'md' ? 'border-green-400' : 'border-red-500'
                }`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setFontScale('lg')}
                className={`px-4 py-2 rounded border ${
                  fontScale === 'lg' ? 'border-green-400' : 'border-red-500'
                }`}
              >
                Large
              </button>
            </div>
          </section>

          <section className="border border-green-600 rounded-lg p-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <p className="mt-2">
              This preview text reflects your current theme and font settings.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
