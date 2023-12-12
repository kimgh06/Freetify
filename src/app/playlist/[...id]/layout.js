// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export let metadata = {
  title: 'Freetify',
  description: 'playlist',
}

export default function RootLayout({ children }) {
  const data = children?.props?.childProp?.segment?.split('?')[1]
  if (!data) {
    return;
  }
  metadata = {
    title: JSON.parse(data)?.playlist
  }
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
