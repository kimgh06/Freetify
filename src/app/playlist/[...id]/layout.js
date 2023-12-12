// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Freetify',
  description: 'Free online music player for you',
}

export default function RootLayout({ children }) {
  const data = children?.props?.childProp?.segment?.split('?')[1]
  if (!data) {
    return;
  }
  const title = JSON.parse(data)?.playlist
  return (
    <html lang="en">
      <title>{title}</title>
      <body>
        {children}
      </body>
    </html>
  )
}
