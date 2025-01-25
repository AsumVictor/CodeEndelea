"use client"

import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "./contexts/AuthContext"
import "./globals.css"
import "../styles/editor.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

