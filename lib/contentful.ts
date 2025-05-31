import { createClient } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
})

// Type definitions for Contentful blog post
export interface ContentfulBlogPost {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    slug: string
    excerpt: string
    content: Document | string
    publishedDate: string
    tags?: string[]
    featured?: boolean
  }
}

// Fetch all blog posts from Contentful
export async function getBlogPostsFromContentful() {
  try {
    const response = await client.getEntries<ContentfulBlogPost["fields"]>({
      content_type: "blogPost",
      order: "-fields.publishedDate",
    })

    return response.items
  } catch (error) {
    console.error("Error fetching blog posts from Contentful:", error)
    return []
  }
}

// Fetch a single blog post by slug
export async function getBlogPostBySlug(slug: string) {
  try {
    const response = await client.getEntries<ContentfulBlogPost["fields"]>({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
    })

    return response.items[0] || null
  } catch (error) {
    console.error("Error fetching blog post from Contentful:", error)
    return null
  }
}

// Convert Contentful blog post to our app's format
export function convertContentfulPost(post: any) {
  return {
    slug: post.fields.slug,
    title: post.fields.title,
    excerpt: post.fields.excerpt,
    content: post.fields.content,
    date: post.fields.publishedDate,
    published: true,
    featured: post.fields.featured || false,
    tags: post.fields.tags || [],
  }
}
