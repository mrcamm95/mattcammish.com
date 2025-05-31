import { createClient, type Entry } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Contentful client configuration with validation
function createContentfulClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master"

  console.log("🔧 Creating Contentful client with:", {
    spaceId: spaceId ? `${spaceId.substring(0, 8)}...` : "MISSING",
    accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : "MISSING",
    environment,
  })

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
  console.log("✅ Contentful client initialized successfully")
} catch (error) {
  console.warn("⚠️ Contentful client initialization failed:", error instanceof Error ? error.message : "Unknown error")
  client = null
}

// Content type ID - Using the correct content type from your Contentful space
const CONTENT_TYPE_ID = "mattsBlog"

// Type definitions for Contentful blog post
export interface ContentfulBlogPostFields {
  title: string // Required
  slug: string // Required
  content: Document // Required
  excerpt?: string // Optional
  date?: string // Optional
  tags?: string // Optional
  featured?: boolean // Optional
}

export type ContentfulBlogPost = Entry<ContentfulBlogPostFields>

// Helper function to validate if a post has minimum required fields
function isValidBlogPost(post: ContentfulBlogPost): boolean {
  const hasTitle = post.fields.title && post.fields.title.trim().length > 0
  const hasSlug = post.fields.slug && post.fields.slug.trim().length > 0
  const hasContent = post.fields.content && post.fields.content.nodeType === "document"

  console.log(`📝 Validating post "${post.fields.title}":`, {
    hasTitle,
    hasSlug,
    hasContent,
    valid: hasTitle && hasSlug && hasContent,
  })

  return hasTitle && hasSlug && hasContent
}

// Fetch all published blog posts from Contentful
export async function getBlogPostsFromContentful(): Promise<ContentfulBlogPost[]> {
  if (!client) {
    console.warn("⚠️ Contentful client not initialized - missing environment variables")
    return []
  }

  try {
    console.log("🔍 Fetching blog posts from Contentful...")
    console.log(`📋 Using content type: ${CONTENT_TYPE_ID}`)
    console.log("🌍 Environment:", process.env.CONTENTFUL_ENVIRONMENT || "master")

    // Fetch entries with minimal filtering - only require published status
    const response = await client.getEntries<ContentfulBlogPostFields>({
      content_type: CONTENT_TYPE_ID,
      limit: 100,
    })

    console.log(`📊 ${CONTENT_TYPE_ID} response:`, {
      total: response.total,
      items: response.items.length,
      skip: response.skip,
      limit: response.limit,
    })

    // Filter posts to only include those with required fields
    const validPosts = response.items.filter(isValidBlogPost)

    console.log(`✅ Found ${validPosts.length} valid posts out of ${response.items.length} total entries`)

    if (validPosts.length > 0) {
      console.log("📝 First valid post preview:", {
        title: validPosts[0].fields.title,
        slug: validPosts[0].fields.slug,
        hasContent: !!validPosts[0].fields.content,
        hasExcerpt: !!validPosts[0].fields.excerpt,
        hasDate: !!validPosts[0].fields.date,
        published: validPosts[0].sys.publishedAt ? "Yes" : "No",
        contentType: validPosts[0].sys.contentType.sys.id,
      })
    }

    // Sort by date if available, otherwise by creation date
    const sortedPosts = validPosts.sort((a, b) => {
      const dateA = a.fields.date ? new Date(a.fields.date) : new Date(a.sys.createdAt)
      const dateB = b.fields.date ? new Date(b.fields.date) : new Date(b.sys.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    return sortedPosts
  } catch (error) {
    console.error("❌ Error fetching blog posts from Contentful:", error)

    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
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
      content_type: CONTENT_TYPE_ID,
      "fields.slug": slug,
      limit: 1,
    })

    const post = response.items[0] || null

    if (post && isValidBlogPost(post)) {
      console.log(`✅ Found valid blog post: ${post.fields.title}`)
      return post
    } else if (post) {
      console.log(`❌ Found blog post but missing required fields: ${post.fields.title}`)
      return null
    } else {
      console.log(`❌ No blog post found with slug: ${slug}`)
      return null
    }
  } catch (error) {
    console.error(`❌ Error fetching blog post with slug ${slug}:`, error)
    return null
  }
}

// Convert Contentful blog post to our app's format with proper fallbacks
export function convertContentfulPost(post: ContentfulBlogPost) {
  // Generate fallback excerpt from content if not provided
  const fallbackExcerpt = post.fields.excerpt || "Read more about this post..."

  // Use date field if available, otherwise use creation date
  const postDate = post.fields.date || post.sys.createdAt.split("T")[0]

  return {
    slug: post.fields.slug,
    title: post.fields.title,
    excerpt: fallbackExcerpt,
    content: post.fields.content,
    date: postDate,
    published: true,
    featured: post.fields.featured || false,
    tags: post.fields.tags ? [post.fields.tags] : [],
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

    // Test specific content type
    const blogResponse = await client.getEntries({
      content_type: CONTENT_TYPE_ID,
      limit: 5,
    })

    // Count valid posts (those with required fields)
    const validPosts = blogResponse.items.filter((post: any) => {
      return post.fields.title && post.fields.slug && post.fields.content
    })

    return {
      success: true,
      totalEntries: response.total,
      blogPosts: blogResponse.total,
      validBlogPosts: validPosts.length,
      message: "Connection successful",
      contentTypeExists: blogResponse.total >= 0,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
    }
  }
}
