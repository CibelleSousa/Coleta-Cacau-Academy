import './globals.css';
import type { Metadata } from 'next';
import { StoreProvider } from '@/store/StoreProvider';

export const metadata: Metadata = {
  title: 'Coleta-Cacau Academy — React Native para o Campo',
  description: 'Aprenda React Native construindo um app real para o setor agrícola.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const antiFlashScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        if (!theme) {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {}
    })();
  `;
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
