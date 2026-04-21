import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/session-provider'
import { PwaProvider } from '@/components/pwa-provider'
import { NetworkStatus } from '@/components/network-status'
import { PwaInstallButton } from '@/components/pwa-install-button'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: 'Plenitude Tabernacle | Eglise de Kinshasa',
  description: 'Bienvenue a Plenitude Tabernacle - Une eglise vivante au coeur de Kinshasa. Decouvrez nos enseignements, predications et rejoignez notre communaute spirituelle.',
  generator: 'v0.app',
  keywords: ['eglise', 'Kinshasa', 'Plenitude Tabernacle', 'Joel Mugisho', 'predications', 'streaming'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Plénitude',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: '/app-logo.png',
        type: 'image/png',
      },
    ],
    apple: '/app-logo.png',
    shortcut: '/app-logo.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#800020',
    'msapplication-config': '/browserconfig.xml',
  },
}

export const viewport: Viewport = {
  themeColor: '#800020',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <SessionProvider>
          <PwaProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <NetworkStatus />
              {children}
              <PwaInstallButton />
            </ThemeProvider>
          </PwaProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
