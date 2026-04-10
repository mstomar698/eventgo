'use client';
import { SessionProvider } from 'next-auth/react';
import { UiSettingsProvider } from '@/features/settings/ui-settings-provider';

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UiSettingsProvider>{children}</UiSettingsProvider>
    </SessionProvider>
  );
}
