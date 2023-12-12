import Script from 'next/script'
import './globals.css'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Freetify',
  description: 'Free online music player for you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <Script src="https://www.googletagmanager.com/gtag/js?id=GTM-5N5SR26M" />
      <Script id="google-analytics">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'GA_MEASUREMENT_ID');
      `}</Script> */}
      <body>
        {children}
      </body>
      {/* <!-- Google Tag Manager (noscript) --> */}
      {/* <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5N5SR26M"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript> */}
      {/* <!-- End Google Tag Manager (noscript) --> */}
    </html>
  )
}
