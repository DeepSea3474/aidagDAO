import './globals.css'

export const metadata = {
  title: 'AIDAG DAO - AI Managed Chain',
  description: 'The first AI-managed cryptocurrency project.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
