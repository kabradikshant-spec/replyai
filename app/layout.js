export const metadata = { title: 'ReplyAI', description: 'AI-powered review replies for small businesses' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      </head>
      <body style={{ margin: 0, background: '#0e0f11', color: '#f0f0ee', fontFamily: 'DM Sans, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
