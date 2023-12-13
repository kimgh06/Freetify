// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Freetify',
  description: 'playlist',
}

export default function RootLayout({ children }) {
  const data = children?.props?.childProp?.segment?.split('?')[1]
  if (!data) {
    return;
  }
  return (
    <html lang="en">
      <head>
        <title>{JSON.parse(data)?.playlist}</title>
        <meta name="description" content="playlist from freetify" />
        <meta property="og:image" content="/apple-icon.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
