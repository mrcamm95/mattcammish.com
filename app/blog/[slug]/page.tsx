import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getBlogPost, getBlogPosts } from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import { BlogContent } from "@/components/blog-content"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <article>
        <header className="mb-8">
          <time className="text-sm text-muted-foreground mb-2 block">{formatDate(post.date)}</time>
          <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <BlogContent content={post.content} />
        </div>
      </article>
    </div>
  )
}
