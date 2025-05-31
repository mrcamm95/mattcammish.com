import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { testContentfulConnection, getBlogPostsFromContentful } from "@/lib/contentful"

export const metadata = {
  title: "Admin - Contentful Status",
  description: "Check the status of your Contentful CMS integration",
}

export default async function AdminPage() {
  const envVars = {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID ? "✅ Set" : "❌ Missing",
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || "master (default)",
  }

  // Test Contentful connection
  const connectionTest = await testContentfulConnection()
  let postsCount = 0
  let blogPostsError = ""

  // If basic connection works, try to fetch blog posts
  if (connectionTest.success) {
    try {
      const posts = await getBlogPostsFromContentful()
      postsCount = posts.length
    } catch (error) {
      blogPostsError = error instanceof Error ? error.message : "Unknown error fetching blog posts"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Contentful CMS Status</h1>
        <div className="flex gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Status
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">CONTENTFUL_SPACE_ID:</span> {envVars.CONTENTFUL_SPACE_ID}
            </div>
            <div>
              <span className="font-medium">CONTENTFUL_ACCESS_TOKEN:</span> {envVars.CONTENTFUL_ACCESS_TOKEN}
            </div>
            <div>
              <span className="font-medium">CONTENTFUL_ENVIRONMENT:</span> {envVars.CONTENTFUL_ENVIRONMENT}
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">API Connection:</span>{" "}
              <span className={connectionTest.success ? "text-green-600" : "text-red-600"}>
                {connectionTest.success ? "✅ Connected" : "❌ Failed"}
              </span>
            </div>
            {connectionTest.success && (
              <>
                <div>
                  <span className="font-medium">Total Entries in Space:</span> {connectionTest.totalEntries}
                </div>
                <div>
                  <span className="font-medium">Blog Posts Found:</span> {connectionTest.blogPosts}
                </div>
                <div>
                  <span className="font-medium">Valid Blog Posts:</span> {connectionTest.validBlogPosts || 0}
                </div>
                <div>
                  <span className="font-medium">Content Type Status:</span>{" "}
                  {connectionTest.contentTypeExists ? "✅ Found" : "❌ Not Found"}
                </div>
              </>
            )}
            <div>
              <span className="font-medium">Posts Displayed:</span> {postsCount}
            </div>
            <div>
              <span className="font-medium">Content Type ID:</span>{" "}
              <code className="bg-muted px-2 py-1 rounded">blogPost</code>
            </div>
          </div>

          {!connectionTest.success && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm font-medium mb-2">Connection Error:</p>
              <p className="text-red-700 text-sm">{connectionTest.error}</p>
            </div>
          )}

          {blogPostsError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm font-medium mb-2">Blog Posts Error:</p>
              <p className="text-yellow-700 text-sm">{blogPostsError}</p>
            </div>
          )}

          {connectionTest.success && postsCount === 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm font-medium mb-2">No Posts Found:</p>
              <p className="text-blue-700 text-sm">
                Connection successful but no blog posts found. Make sure you have published blog posts in Contentful.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Requirements</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Required Fields</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your blog posts need these minimum fields to be displayed:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>title</strong> - Not empty
                </li>
                <li>
                  <strong>slug</strong> - Not empty
                </li>
                <li>
                  <strong>content</strong> - Rich text content
                </li>
                <li>
                  <strong>Published status</strong> - Must be published, not draft
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Optional Fields</h3>
              <p className="text-sm text-muted-foreground mb-2">These fields will use fallbacks if not provided:</p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>excerpt</strong> - Fallback: "Read more about this post..."
                </li>
                <li>
                  <strong>date</strong> - Fallback: Creation date
                </li>
                <li>
                  <strong>tags</strong> - Fallback: Empty array
                </li>
                <li>
                  <strong>featured</strong> - Fallback: false
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
