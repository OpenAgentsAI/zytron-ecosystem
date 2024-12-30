import PanelLayout from '@/shared/components/panel-layout';
import { Toaster } from '@/shared/components/ui/Toasts/toaster';
import { helvetica } from '@/shared/styles/fonts';
import '@/shared/styles/main.css';
import { checkUserSession } from '@/shared/utils/auth-helpers/server';
import { getURL } from '@/shared/utils/helpers';
import { Viewport } from 'next';
import { Suspense } from 'react';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
};

const meta = {
  title: 'openagentsai Platform',
  description: '',
  url: getURL(),
  favicon: '/favicon.svg'
};
export default async function Panel({
  children
}: {
  children: React.ReactNode;
}) {
  await checkUserSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={helvetica.className}>
        <main
          id="skip"
          className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
        >
          <PanelLayout>{children}</PanelLayout>
        </main>
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
