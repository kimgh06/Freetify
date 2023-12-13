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
  // metadata = {
  //   title: JSON.parse(data)?.playlist,
  //   description: 'playlist from freetify'
  // }
  return (
    <html lang="en">
      <head>
        <title>{JSON.parse(data)?.playlist}</title>
        <meta name="description" content="playlist from freetify" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
