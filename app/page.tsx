import Link from "next/link"
import Image from "next/image"
import { getBlogPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import { SocialLinks } from "@/components/social-links"

export default async function HomePage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-16">
        <div className="flex justify-end mb-6">
          <SocialLinks />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Hi, I'm Matt 👋</h1>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>
                This site hosts my thoughts on product, marketing and other things I'm learning. I mostly try to become
                a little wiser every day.
              </p>
              <p>
                I maintain a list of my{" "}
                <Link
                  href="/recommendations"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors font-medium"
                >
                  recommendations
                </Link>{" "}
                -- mostly books, podcasts and people I've found particularly insightful.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <Image
              src="/images/matt-profile.jpeg"
              alt="Matt Cammish"
              width={200}
              height={200}
              className="rounded-full object-cover shadow-lg"
              priority
            />
          </div>
        </div>
      </header>

      <section className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-8">Recent Posts</h2>
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
                    <p className="text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts available yet. Content will be imported from CMS.</p>
          </div>
        )}
      </section>
    </div>
  )
}
