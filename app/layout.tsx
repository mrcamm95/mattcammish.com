import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Your Name - Personal Blog",
    template: "%s | Your Name",
  },
  description: "Personal blog sharing thoughts on technology, design, and life.",
  keywords: ["blog", "technology", "design", "personal"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
              <div className="flex justify-end mb-8">
                <ThemeToggle />
              </div>
              <main>{children}</main>
              <footer className="mt-16 pt-8 border-t border-border">
                <div className="max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground text-center">© 2024 Your Name. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
