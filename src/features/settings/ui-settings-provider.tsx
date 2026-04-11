'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'light';
type FontScale = 'sm' | 'md' | 'lg';
type FontFamily = 'sans' | 'serif' | 'mono';

interface UiSettingsContextValue {
  themeMode: ThemeMode;
  fontScale: FontScale;
  fontFamily: FontFamily;
  setThemeMode: (theme: ThemeMode) => void;
  setFontScale: (scale: FontScale) => void;
  setFontFamily: (family: FontFamily) => void;
  toggleTheme: () => void;
}

interface StoredUiSettings {
  themeMode?: ThemeMode;
  fontScale?: FontScale;
  fontFamily?: FontFamily;
}

const STORAGE_KEY = 'eventgo-ui-settings';

const UiSettingsContext = createContext<UiSettingsContextValue | null>(null);

export const UiSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [fontScale, setFontScale] = useState<FontScale>('md');
  const [fontFamily, setFontFamily] = useState<FontFamily>('sans');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as StoredUiSettings;
      if (parsed.themeMode === 'dark' || parsed.themeMode === 'light') {
        setThemeMode(parsed.themeMode);
      }
      if (
        parsed.fontScale === 'sm' ||
        parsed.fontScale === 'md' ||
        parsed.fontScale === 'lg'
      ) {
        setFontScale(parsed.fontScale);
      }
      if (
        parsed.fontFamily === 'sans' ||
        parsed.fontFamily === 'serif' ||
        parsed.fontFamily === 'mono'
      ) {
        setFontFamily(parsed.fontFamily);
      }
    } catch {
      // Ignore malformed local settings and keep defaults.
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-font-scale', fontScale);
    document.documentElement.setAttribute('data-font-family', fontFamily);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ themeMode, fontScale, fontFamily })
    );
  }, [fontFamily, fontScale, themeMode]);

  const value = useMemo<UiSettingsContextValue>(
    () => ({
      themeMode,
      fontScale,
      fontFamily,
      setThemeMode,
      setFontScale,
      setFontFamily,
      toggleTheme: () =>
        setThemeMode((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [fontFamily, fontScale, themeMode]
  );

  return (
    <UiSettingsContext.Provider value={value}>{children}</UiSettingsContext.Provider>
  );
};

export const useUiSettings = () => {
  const context = useContext(UiSettingsContext);
  if (!context) {
    throw new Error('useUiSettings must be used within UiSettingsProvider');
  }
  return context;
};
