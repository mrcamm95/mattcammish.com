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
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </Link>
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
              <div>
                <span className="font-medium">Total Entries in Space:</span> {connectionTest.totalEntries}
              </div>
            )}
            <div>
              <span className="font-medium">Blog Posts Found:</span> {postsCount}
            </div>
            <div>
              <span className="font-medium">Content Type:</span>{" "}
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
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Create Contentful Content Type</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Create a content type with ID <code className="bg-muted px-1 py-0.5 rounded">blogPost</code> and these
                fields:
              </p>
              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>
                  <strong>title</strong> (Short text) - Required
                </li>
                <li>
                  <strong>slug</strong> (Short text) - Required, Unique
                </li>
                <li>
                  <strong>excerpt</strong> (Long text) - Required
                </li>
                <li>
                  <strong>content</strong> (Rich text) - Required
                </li>
                <li>
                  <strong>publishedDate</strong> (Date & time) - Required
                </li>
                <li>
                  <strong>tags</strong> (Short text, list) - Optional
                </li>
                <li>
                  <strong>featured</strong> (Boolean) - Optional
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Add Environment Variables</h3>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Create and Publish Content</h3>
              <p className="text-sm text-muted-foreground">
                Create blog posts in Contentful and make sure they're published (not draft).
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Fallback Behavior</h2>
          <p className="text-muted-foreground text-sm">
            If Contentful is unavailable or not configured, the application will automatically fall back to demo content
            to ensure the site remains functional. This provides a seamless user experience while you set up your CMS.
          </p>
        </div>
      </div>
    </div>
  )
}
