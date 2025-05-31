import { createClient, type Entry } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Contentful client configuration with validation
function createContentfulClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master"

  if (!spaceId) {
    throw new Error("CONTENTFUL_SPACE_ID environment variable is required")
  }

  if (!accessToken) {
    throw new Error("CONTENTFUL_ACCESS_TOKEN environment variable is required")
  }

  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
  })
}

// Initialize client with error handling
let client: ReturnType<typeof createClient> | null = null

try {
  client = createContentfulClient()
} catch (error) {
  console.warn("⚠️ Contentful client initialization failed:", error instanceof Error ? error.message : "Unknown error")
  client = null
}

// Type definitions for Contentful blog post
export interface ContentfulBlogPostFields {
  title: string
  slug: string
  excerpt: string
  content: Document
  publishedDate: string
  tags?: string[]
  featured?: boolean
}

export type ContentfulBlogPost = Entry<ContentfulBlogPostFields>

// Fetch all published blog posts from Contentful
export async function getBlogPostsFromContentful(): Promise<ContentfulBlogPost[]> {
  if (!client) {
    console.warn("⚠️ Contentful client not initialized - missing environment variables")
    return []
  }

  try {
    console.log("🔍 Fetching blog posts from Contentful...")

    const response = await client.getEntries<ContentfulBlogPostFields>({
      content_type: "mattsBlog",
      order: "-fields.publishedDate",
      limit: 100,
    })

    console.log(`✅ Successfully fetched ${response.items.length} blog posts from Contentful`)

    return response.items
  } catch (error) {
    console.error("❌ Error fetching blog posts from Contentful:", error)

    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message)
    }

    // Return empty array to prevent app crashes
    return []
  }
}

// Fetch a single blog post by slug from Contentful
export async function getBlogPostBySlug(slug: string): Promise<ContentfulBlogPost | null> {
  if (!client) {
    console.warn("⚠️ Contentful client not initialized - missing environment variables")
    return null
  }

  try {
    console.log(`🔍 Fetching blog post with slug: ${slug}`)

    const response = await client.getEntries<ContentfulBlogPostFields>({
      content_type: "mattsBlog",
      "fields.slug": slug,
      limit: 1,
    })

    const post = response.items[0] || null

    if (post) {
      console.log(`✅ Found blog post: ${post.fields.title}`)
    } else {
      console.log(`❌ No blog post found with slug: ${slug}`)
    }

    return post
  } catch (error) {
    console.error(`❌ Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Convert Contentful blog post to our app's format
export function convertContentfulPost(post: ContentfulBlogPost) {
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

// Test Contentful connection
export async function testContentfulConnection() {
  try {
    console.log("🔍 Testing Contentful connection...")

    // Check if environment variables are set
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      return {
        success: false,
        error: "Missing environment variables",
        details: {
          hasSpaceId: !!process.env.CONTENTFUL_SPACE_ID,
          hasAccessToken: !!process.env.CONTENTFUL_ACCESS_TOKEN,
        },
      }
    }

    // Check if client was initialized
    if (!client) {
      return {
        success: false,
        error: "Contentful client failed to initialize",
        details: "Check environment variables and try again",
      }
    }

    // Test basic API call
    const response = await client.getEntries({ limit: 1 })

    return {
      success: true,
      totalEntries: response.total,
      message: "Connection successful",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}
