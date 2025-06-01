import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Linkedin, Twitter } from "lucide-react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Matt's Blog",
    template: "%s | Matt's Blog",
  },
  description: "Personal blog sharing thoughts on product, systems, and things I'm curious about.",
  keywords: ["blog", "product", "systems thinking", "personal"],
  authors: [{ name: "Matt" }],
  creator: "Matt",
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
            <div className="container mx-auto px-4 py-8">
              {/* Top navigation bar with social icons and theme toggle */}
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                  <a
                    href="https://linkedin.com/in/mattcammish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://x.com/mattcammish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="X (Twitter) Profile"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
                <ThemeToggle />
              </div>

              <main>{children}</main>

              <footer className="mt-16 pt-8 border-t border-border">
                <div className="max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground text-center">© 2024 Matt. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
