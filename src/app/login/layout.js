export const metadata = {
  title: 'Freetify Login',
  description: 'You can make your playlist if you are loged in.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Freetify Login" />
        <title>Freetify Login</title>
        <meta name="description" content="You can make your playlist if you are loged in." />
        <meta property="og:description" content="You can make your playlist if you are loged in." />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
