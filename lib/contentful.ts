import { createClient, type Entry } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// Contentful client configuration with validation
function createContentfulClient(preview = false) {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN
  const environment = process.env.CONTENTFUL_ENVIRONMENT || "master"

  console.log(`🔧 Creating Contentful client (${preview ? "preview" : "delivery"}) with:`, {
    spaceId: spaceId ? `${spaceId.substring(0, 8)}...` : "MISSING",
    accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : "MISSING",
    environment,
    preview,
    host: preview ? "preview.contentful.com" : "cdn.contentful.com",
  })

  if (!spaceId) {
    throw new Error("CONTENTFUL_SPACE_ID environment variable is required")
  }

  if (!accessToken) {
    throw new Error(
      `${preview ? "CONTENTFUL_PREVIEW_ACCESS_TOKEN" : "CONTENTFUL_ACCESS_TOKEN"} environment variable is required`,
    )
  }

  return createClient({
    space: spaceId,
    accessToken: accessToken,
    environment: environment,
    host: preview ? "preview.contentful.com" : undefined,
  })
}

// Initialize clients with error handling
let deliveryClient: ReturnType<typeof createClient> | null = null
let previewClient: ReturnType<typeof createClient> | null = null

try {
  deliveryClient = createContentfulClient(false)
  console.log("✅ Contentful delivery client initialized successfully")

  // Also initialize preview client if preview token is available
  if (process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
    previewClient = createContentfulClient(true)
    console.log("✅ Contentful preview client initialized successfully")
  } else {
    console.warn("⚠️ CONTENTFUL_PREVIEW_ACCESS_TOKEN not set - preview client not initialized")
  }
} catch (error) {
  console.warn("⚠️ Contentful client initialization failed:", error instanceof Error ? error.message : "Unknown error")
  deliveryClient = null
  previewClient = null
}

// Content type ID - matches your Contentful space
const CONTENT_TYPE_ID = "mattsBlog"

// Type definitions for Contentful blog post
export interface ContentfulBlogPostFields {
  title: string // Required - matches "Title" in Contentful
  slug: string // Required - matches "Slug" in Contentful
  content: Document // Required - matches "Content" in Contentful
  excerpt?: string // Optional - matches "Excerpt" in Contentful
  date?: string // Optional - matches "Date" in Contentful
  tags?: string // Optional - matches "Tags" in Contentful
  featured?: boolean // Optional - matches "Featured" in Contentful
}

export type ContentfulBlogPost = Entry<ContentfulBlogPostFields>

// Helper function to validate if a post has minimum required fields
function isValidBlogPost(post: ContentfulBlogPost): boolean {
  const hasTitle = post.fields.title && post.fields.title.trim().length > 0
  const hasSlug = post.fields.slug && post.fields.slug.trim().length > 0
  const hasContent = post.fields.content && post.fields.content.nodeType === "document"
  const isPublished = !!post.sys.publishedAt

  console.log(`📝 Validating post "${post.fields.title || "Unknown"}":`, {
    hasTitle,
    hasSlug,
    hasContent,
    isPublished,
    valid: hasTitle && hasSlug && hasContent && isPublished,
    id: post.sys.id,
    contentType: post.sys.contentType?.sys.id,
  })

  // Only consider a post valid if it has all required fields AND is published
  return hasTitle && hasSlug && hasContent && isPublished
}

// Get the appropriate client based on preview mode
function getClient(preview = false) {
  // If preview is requested but preview client isn't available, fall back to delivery client
  if (preview && !previewClient) {
    console.warn("⚠️ Preview client requested but not available, falling back to delivery client")
    return deliveryClient
  }

  const client = preview ? previewClient : deliveryClient

  if (!client) {
    console.error(`❌ No Contentful client available (${preview ? "preview" : "delivery"})`)
  }

  return client
}

// Debug function to get ALL entries regardless of content type
export async function debugGetAllEntries(preview = false) {
  const client = getClient(preview)

  if (!client) {
    return { error: "Client not initialized" }
  }

  try {
    console.log(`🔍 Fetching ALL entries from Contentful (${preview ? "preview" : "delivery"})...`)

    const allEntries = await client.getEntries({
      limit: 100,
    })

    console.log("📊 All entries response:", {
      total: allEntries.total,
      items: allEntries.items.length,
      contentTypes: [...new Set(allEntries.items.map((item) => item.sys.contentType?.sys.id).filter(Boolean))],
      preview,
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
      preview,
    }
  } catch (error) {
    console.error(`❌ Error fetching all entries (${preview ? "preview" : "delivery"}):`, error)
    return { error: error instanceof Error ? error.message : "Unknown error", preview }
  }
}

// Fetch all published blog posts from Contentful
export async function getBlogPostsFromContentful(preview = false): Promise<ContentfulBlogPost[]> {
  const client = getClient(preview)

  if (!client) {
    console.warn("⚠️ Contentful client not initialized - missing environment variables")
    return []
  }

  try {
    console.log(`🔍 Fetching blog posts from Contentful (${preview ? "preview" : "delivery"})...`)
    console.log(`📋 Using content type: ${CONTENT_TYPE_ID}`)
    console.log("🌍 Environment:", process.env.CONTENTFUL_ENVIRONMENT || "master")

    // IMPORTANT: Always fetch only published content, regardless of preview mode
    const response = await client.getEntries<ContentfulBlogPostFields>({
      content_type: CONTENT_TYPE_ID,
      limit: 100,
      // Always require published content
      "sys.publishedAt[exists]": true,
      // Order by date field if available, otherwise by creation date
      order: ["-fields.date", "-sys.createdAt"],
    })

    console.log(`📊 ${CONTENT_TYPE_ID} response (${preview ? "preview" : "delivery"}) - PUBLISHED ONLY:`, {
      total: response.total,
      items: response.items.length,
      skip: response.skip,
      limit: response.limit,
      clientType: preview ? "preview" : "delivery",
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
        updatedAt: item.sys.updatedAt,
      })
    })

    // Filter posts to only include those with required fields
    const validPosts = response.items.filter(isValidBlogPost)

    console.log(
      `✅ Found ${validPosts.length} valid published posts out of ${response.items.length} total entries (${preview ? "preview" : "delivery"})`,
    )

    if (validPosts.length > 0) {
      console.log(`📝 First valid post preview (${preview ? "preview" : "delivery"}):`, {
        title: validPosts[0].fields.title,
        slug: validPosts[0].fields.slug,
        hasContent: !!validPosts[0].fields.content,
        hasExcerpt: !!validPosts[0].fields.excerpt,
        hasDate: !!validPosts[0].fields.date,
        published: validPosts[0].sys.publishedAt ? "Yes" : "No",
        contentType: validPosts[0].sys.contentType.sys.id,
      })
    } else if (response.items.length > 0) {
      console.log(`❌ No valid posts found (${preview ? "preview" : "delivery"}). Issues with existing posts:`)
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
    console.error(`❌ Error fetching blog posts from Contentful (${preview ? "preview" : "delivery"}):`, error)

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
export async function getBlogPostBySlug(slug: string, preview = false): Promise<ContentfulBlogPost | null> {
  const client = getClient(preview)

  if (!client) {
    console.warn("⚠️ Contentful client not initialized - missing environment variables")
    return null
  }

  try {
    console.log(`🔍 Fetching blog post with slug: ${slug} (${preview ? "preview" : "delivery"})`)

    const response = await client.getEntries<ContentfulBlogPostFields>({
      content_type: CONTENT_TYPE_ID,
      "fields.slug": slug,
      limit: 1,
      // Always require published content
      "sys.publishedAt[exists]": true,
    })

    const post = response.items[0] || null

    if (post && isValidBlogPost(post)) {
      console.log(`✅ Found valid blog post: ${post.fields.title} (${preview ? "preview" : "delivery"})`)
      return post
    } else if (post) {
      console.log(
        `❌ Found blog post but missing required fields or not published: ${post.fields.title} (${preview ? "preview" : "delivery"})`,
      )
      return null
    } else {
      console.log(`❌ No blog post found with slug: ${slug} (${preview ? "preview" : "delivery"})`)
      return null
    }
  } catch (error) {
    console.error(`❌ Error fetching blog post with slug ${slug} (${preview ? "preview" : "delivery"}):`, error)
    return null
  }
}

// Convert Contentful blog post to our app's format with proper fallbacks
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
    id: post.sys.id,
    publishedAt: post.sys.publishedAt,
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
    contentfulId: post.sys.id, // Add Contentful ID for debugging
  }
}

// Test Contentful connection
export async function testContentfulConnection(preview = false) {
  try {
    console.log(`🔍 Testing Contentful connection (${preview ? "preview" : "delivery"})...`)

    // Check if environment variables are set
    const requiredToken = preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN

    if (!process.env.CONTENTFUL_SPACE_ID || !requiredToken) {
      return {
        success: false,
        error: "Missing environment variables",
        details: {
          hasSpaceId: !!process.env.CONTENTFUL_SPACE_ID,
          hasAccessToken: !!requiredToken,
          preview,
        },
      }
    }

    // Check if client was initialized
    const client = getClient(preview)
    if (!client) {
      return {
        success: false,
        error: "Contentful client failed to initialize",
        details: "Check environment variables and try again",
        preview,
      }
    }

    // Test basic API call
    const response = await client.getEntries({ limit: 1 })

    // Test specific content type - ALWAYS filter for published content
    const blogResponse = await client.getEntries({
      content_type: CONTENT_TYPE_ID,
      limit: 5,
      "sys.publishedAt[exists]": true,
    })

    // Count valid posts (those with required fields)
    const validPosts = blogResponse.items.filter((post: any) => {
      return post.fields.title && post.fields.slug && post.fields.content && post.sys.publishedAt
    })

    return {
      success: true,
      totalEntries: response.total,
      blogPosts: blogResponse.total,
      validBlogPosts: validPosts.length,
      message: "Connection successful",
      contentTypeExists: blogResponse.total >= 0,
      contentTypeId: CONTENT_TYPE_ID,
      preview,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: error,
      contentTypeId: CONTENT_TYPE_ID,
      preview,
    }
  }
}
