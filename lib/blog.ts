import { getBlogPostsFromContentful, getBlogPostBySlug, convertContentfulPost } from "./contentful"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string | any // Can be string or rich text document
  date: string
  published: boolean
  featured: boolean
  tags: string[]
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const contentfulPosts = await getBlogPostsFromContentful()

    return contentfulPosts.map(convertContentfulPost)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const contentfulPost = await getBlogPostBySlug(slug)

    if (!contentfulPost) {
      return null
    }

    return convertContentfulPost(contentfulPost)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}
