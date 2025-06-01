import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Recommendations",
  description: "Books, podcasts, and people I've found particularly insightful",
}

export default function RecommendationsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Recommendations</h1>
        <p className="text-lg text-muted-foreground">
          A collection of books, podcasts, and people I've found particularly insightful.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Books</h2>
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h3 className="text-xl font-medium mb-2">Thinking, Fast and Slow</h3>
            <p className="text-muted-foreground mb-2">by Daniel Kahneman</p>
            <p className="text-muted-foreground">
              A fascinating exploration of the two systems that drive the way we think—one fast, intuitive, and
              emotional; the other slower, more deliberative, and more logical.
            </p>
          </div>
          <div className="border-b border-border pb-6">
            <h3 className="text-xl font-medium mb-2">Atomic Habits</h3>
            <p className="text-muted-foreground mb-2">by James Clear</p>
            <p className="text-muted-foreground">
              A practical guide to breaking bad habits and building good ones, focusing on small changes that lead to
              remarkable results.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Podcasts</h2>
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h3 className="text-xl font-medium mb-2">The Knowledge Project</h3>
            <p className="text-muted-foreground mb-2">by Shane Parrish</p>
            <p className="text-muted-foreground">
              Interviews with experts across various fields, exploring the mental models and frameworks they use to make
              decisions and solve problems.
            </p>
          </div>
          <div className="border-b border-border pb-6">
            <h3 className="text-xl font-medium mb-2">Lex Fridman Podcast</h3>
            <p className="text-muted-foreground mb-2">by Lex Fridman</p>
            <p className="text-muted-foreground">
              Conversations about AI, science, technology, history, philosophy, and the nature of intelligence,
              consciousness, love, and power.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">People</h2>
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h3 className="text-xl font-medium mb-2">Richard Feynman</h3>
            <p className="text-muted-foreground">
              Physicist and educator known for his ability to explain complex concepts in simple terms. His approach to
              learning and problem-solving is inspiring.
            </p>
          </div>
          <div className="pb-6">
            <h3 className="text-xl font-medium mb-2">Naval Ravikant</h3>
            <p className="text-muted-foreground">
              Entrepreneur and investor with thought-provoking insights on wealth creation, happiness, and
              decision-making.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
