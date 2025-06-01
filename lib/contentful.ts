import { createClient, type Entry } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Contentful client configuration with validation
function createContentfulClient() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  
  // More robust preview detection - check multiple environment variables
  const isPreviewEnvironment = 
    process.env.VERCEL_ENV === 'preview' || 
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ||
    process.env.PREVIEW_MODE === 'true' ||
    process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true' ||
    process.env.CONTENTFUL_PREVIEW_MODE === 'true'
  
  // Log all environment variables for debugging
  console.log('🔍 Environment variables:', {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    PREVIEW_MODE: process.env.PREVIEW_MODE,
    NEXT_PUBLIC_PREVIEW_MODE: process.env.NEXT_PUBLIC_PREVIEW_MODE,
    CONTENTFUL_PREVIEW_MODE: process.env.CONTENTFUL_PREVIEW_MODE,
    NODE_ENV: process.env.NODE_ENV
  })
  
  const accessToken = isPreviewEnvironment
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master"

  console.log(`🔧 Creating Contentful client with:`, {
    spaceId: spaceId ? `${spaceId.substring(0, 8)}...` : "MISSING",
    accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : "MISSING",
    environment,
    isPreviewEnvironment,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
  })

  if (!spaceId) {
    throw new Error("CONTENTFUL_SPACE_ID environment variable is required")
  }

  if (!accessToken) {
    throw new Error(isPreviewEnvironment
      ? "CONTENTFUL_PREVIEW_ACCESS_TOKEN environment variable is required"
      : "CONTENTFUL_ACCESS_TOKEN environment variable is required")
  }

  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
    host: isPreviewEnvironment ? 'preview.contentful.com' : 'cdn.contentful.com',
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

// Update the content type ID to match your Contentful space
// Change this line:
// To:
const CONTENT_TYPE_ID = "mattsBlog"

// Update the ContentfulBlogPostFields interface to match your Contentful model
// The field names need to match exactly (case-sensitive)
export interface ContentfulBlogPostFields {
  title: string // Required - matches "Title" in Contentful
  slug: string // Required - matches "Slug" in Contentful
  content: Document // Required - matches "Content" in Contentful
  excerpt?: string // Optional - matches "Excerpt" in Contentful
  date?: string // Optional - matches "Date" in Contentful (but we need to handle Date & time format)
  tags?: string // Optional - matches "Tags" in Contentful
  featured?: boolean // Optional - matches "Featured" in Contentful
}

export type ContentfulBlogPost = Entry<ContentfulBlogPostFields>

// Helper function to validate if a post has minimum required fields
function isValidBlogPost(post: ContentfulBlogPost): boolean {
  const hasTitle = post.fields.title && post.fields.title.trim().length > 0
  const hasSlug = post.fields.slug && post.fields.slug.trim().length > 0
  const hasContent = post.fields.content && post.fields.content.nodeType === "document"

  console.log(`📝 Validating post "${post.fields.title || "Unknown"}":`, {
    hasTitle,
    hasSlug,
    hasContent,
    valid: hasTitle && hasSlug && hasContent,
    publishedAt: post.sys.publishedAt ? "Published" : "Draft",
  })

  return hasTitle && hasSlug && hasContent
}

// Debug function to get ALL entries regardless of content type
export async function debugGetAllEntries() {
  if (!client) {
    return { error: "Client not initialized" }
  }

  try {
    console.log("🔍 Fetching ALL entries from Contentful...")

    const allEntries = await client.getEntries({
      limit: 100,
    })

    console.log("📊 All entries response:", {
      total: allEntries.total,
      items: allEntries.items.length,
      contentTypes: [...new Set(allEntries.items.map((item) => item.sys.contentType?.sys.id).filter(Boolean))],
    })

    // Log first few entries for debugging
    allEntries.items.slice(0, 5).forEach((entry, index) => {
      console.log(`📝 Entry ${index + 1}:`, {
        id: entry.sys.id,
        contentType: entry.sys.contentType?.sys.id || "unknown",
        fields: Object.keys(entry.fields),
        published: entry.sys.publishedAt ? "Yes" : "No",
        title: entry.fields.title || "No title",
      })
    })

    return {
      success: true,
      total: allEntries.total,
      items: allEntries.items,
      contentTypes: [...new Set(allEntries.items.map((item) => item.sys.contentType?.sys.id).filter(Boolean))],
    }
  } catch (error) {
    console.error("❌ Error fetching all entries:", error)
    return { error: error instanceof Error ? error.message : "Unknown error" }
  }
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

    // Log all entries for debugging
    response.items.forEach((item, index) => {
      console.log(`📝 Raw entry ${index + 1}:`, {
        id: item.sys.id,
        title: item.fields.title,
        slug: item.fields.slug,
        hasContent: !!item.fields.content,
        contentType: item.sys.contentType.sys.id,
        published: item.sys.publishedAt ? "Yes" : "No",
        createdAt: item.sys.createdAt,
      })
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
    } else if (response.items.length > 0) {
      console.log("❌ No valid posts found. Issues with existing posts:")
      response.items.forEach((item, index) => {
        console.log(`Post ${index + 1} issues:`, {
          title: item.fields.title ? "✅ Has title" : "❌ Missing title",
          slug: item.fields.slug ? "✅ Has slug" : "❌ Missing slug",
          content: item.fields.content ? "✅ Has content" : "❌ Missing content",
          published: item.sys.publishedAt ? "✅ Published" : "❌ Draft",
        })
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

// Update the convertContentfulPost function to handle the date format correctly
export function convertContentfulPost(post: ContentfulBlogPost) {
  // Generate fallback excerpt from content if not provided
  const fallbackExcerpt = post.fields.excerpt || "Read more about this post..."

  // Handle Date & time format - extract just the date part if it's a full datetime
  let postDate = post.sys.createdAt.split("T")[0] // Default to creation date
  if (post.fields.date) {
    // If it's a string, extract date part, otherwise use as is
    postDate =
      typeof post.fields.date === "string" && post.fields.date.includes("T")
        ? post.fields.date.split("T")[0]
        : post.fields.date
  }

  console.log(`🔄 Converting post "${post.fields.title}":`, {
    slug: post.fields.slug,
    title: post.fields.title,
    hasExcerpt: !!post.fields.excerpt,
    hasDate: !!post.fields.date,
    dateValue: post.fields.date,
    convertedDate: postDate,
    usingFallbackExcerpt: !post.fields.excerpt,
    usingCreationDate: !post.fields.date,
  })

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
      contentTypeId: CONTENT_TYPE_ID,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
      contentTypeId: CONTENT_TYPE_ID,
    }
  }
}