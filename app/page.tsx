import Link from "next/link"
import { getBlogPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"

export default async function HomePage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Your Name</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Welcome to my personal blog where I share thoughts on technology, design, and life.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-8">Recent Posts</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="border-b border-border pb-8 transition-colors group-hover:border-foreground/20">
                  <time className="text-sm text-muted-foreground mb-2 block">{formatDate(post.date)}</time>
                  <h3 className="text-xl font-medium mb-3 group-hover:text-foreground/80 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
