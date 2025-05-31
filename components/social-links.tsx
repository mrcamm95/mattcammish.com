import Link from "next/link"
import { Linkedin } from "lucide-react"

// Custom X (Twitter) icon component since Lucide doesn't have the new X logo
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="https://x.com/mattcammish"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/80 transition-colors group"
        aria-label="Follow on X"
      >
        <XIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </Link>
      <Link
        href="https://linkedin.com/in/mattcammish"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-muted hover:bg-muted/80 transition-colors group"
        aria-label="Connect on LinkedIn"
      >
        <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </Link>
    </div>
  )
}
