import type { Metadata } from 'next';
import { Laila } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../features/theme/ThemeContext';
import { LanguageProvider } from '../features/language/LanguageContext';
import { AuthProvider } from '../features/auth/AuthContext';
import { PlayerProvider } from '../features/player/PlayerContext';
import { Navbar } from '../components/navigation/Navbar';
import { MiniPlayer } from '../components/player/MiniPlayer';
import { FullPlayerModal } from '../components/player/FullPlayerModal';

const laila = Laila({
  subsets: ['latin', 'devanagari'],
  variable: '--font-laila',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Moksha Music — Sanctuary of Sound | जहाँ भक्ति संगीत बन जाती है',
  description: 'Lossless recordings of Bhajans, Vedic Stotrams, Aartis, and Meditative Ragas for deep inner stillness.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Moksha Music | Where Music Meets Devotion',
    description: 'Soulful bhajans, powerful mantras, divine aartis and peaceful devotional music.',
    images: [
      {
        url: '/images/krishna-hero.png',
        width: 3584,
        height: 5376,
        alt: 'Lord Krishna playing the flute - Moksha Music',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${laila.variable} dark`} suppressHydrationWarning>
      <body className="font-laila text-[var(--text-primary)] antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PlayerProvider>
                {/* Global Navbar */}
                <Navbar />

                {/* Main Content View */}
                <main className="flex-1 w-full flex flex-col items-center">
                  {children}
                </main>

                {/* Global Player Components */}
                <MiniPlayer />
                <FullPlayerModal />
              </PlayerProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
