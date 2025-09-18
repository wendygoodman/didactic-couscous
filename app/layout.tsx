
export const metadata = { title: 'Hanuman License — Shop', description: 'MVP shop with QR checkout' }
import './globals.css'
import React from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
