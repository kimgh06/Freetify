export const metadata = {
  title: 'My Track',
  description: 'Free online music player for you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
