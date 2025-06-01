import Link from "next/link"
import Image from "next/image"
import { getBlogPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import { ContentStatus } from "@/components/content-status"

export default async function HomePage() {
  const posts = await getBlogPosts()

  // Check if posts are from Contentful (they'll have rich text content)
  const isContentful = posts.length > 0 && typeof posts[0].content === "object"

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-16">
        {/* Title and Profile Image Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Hi, I'm Matt 👋</h1>
          </div>
          <div className="flex-shrink-0 ml-8">
            <Image
              src="/images/profile.png"
              alt="Matt's profile picture"
              width={120}
              height={120}
              className="rounded-full border-2 border-border"
              priority
            />
          </div>
        </div>

        {/* Introduction Text */}
        <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
          <p>
            This site hosts my thoughts on product, systems and other things I'm curious about. I mostly try to become a
            little wiser every day.
          </p>
          <p>
            I have a list of{" "}
            <Link
              href="/recommendations"
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors font-medium"
            >
              recommendations
            </Link>{" "}
            — mostly books, podcasts and people I've found particularly insightful.
          </p>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Recent Posts</h2>
          <div className="text-sm text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="border-b border-border pb-8 transition-colors group-hover:border-foreground/20">
                    <time className="text-sm text-muted-foreground mb-2 block">{formatDate(post.date)}</time>
                    <h3 className="text-xl font-medium mb-3 group-hover:text-foreground/80 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">{post.excerpt}</p>

                    {/* Display tags if available */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Featured badge */}
                    {post.featured && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">📝</div>
              <h3 className="text-lg font-medium mb-2">No posts available</h3>
              <p className="text-sm">
                Posts will appear here once they're published in your CMS or when fallback content is available.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Content status indicator */}
      <ContentStatus isContentful={isContentful} postsCount={posts.length} />
    </div>
  )
}
