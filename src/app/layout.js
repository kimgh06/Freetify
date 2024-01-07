import Script from 'next/script'
import './globals.css'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  OpenGraph: {
    title: 'Freetify',
    author: 'kimgh06',
    siteName: 'Freetify',
    description: "A free online music player",
    url: 'https://freetify.vercel.app',
    keywords: "freetify, free, player, music, songs",
    icons: {
      icon: "/favicon.ico"
    }
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:type" content="website" />
        <meta property="title" content="Freetify" />
        <link rel='icon' href='/favicon.ico' />
        <meta property="og:image" content="/opengraph-image.png" />
        {/* <meta property='og:url' content='https://freetify.vercel.app' /> */}
        <meta property='description' content='A free online music player' />
        <meta property='og:site_name' content='Freetify' />
        <meta name="google-site-verification" content="q9McqJBLT8ZooTZpbEQYsi_Mr13MbveBtl4j77XLtrc" />      </head>
      <Script src="https://www.googletagmanager.com/gtag/js?id=GTM-5N5SR26M" />
      <Script id="google-analytics">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'GA_MEASUREMENT_ID');
      `}</Script>
      <body>
        {children}
      </body>
    </html>
  )
}
