import React from "react"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"

import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

const _inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" })
const _cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "MonDiva - Стильно жить не запретишь",
  description:
    "Интернет-магазин премиальной женской одежды MonDiva. Платья, блузки, юбки, брюки, верхняя одежда и аксессуары.",
}

export const viewport: Viewport = {
  themeColor: "#1a1714",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
