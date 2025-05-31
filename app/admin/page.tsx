import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { testContentfulConnection, getBlogPostsFromContentful, debugGetAllEntries } from "@/lib/contentful"

export const metadata = {
  title: "Admin - Contentful Status",
  description: "Check the status of your Contentful CMS integration",
}

// Force cache revalidation to prevent stale data
export const revalidate = 0

export default async function AdminPage() {
  const envVars = {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID ? "✅ Set" : "❌ Missing",
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || "master (default)",
    VERCEL_ENV: process.env.VERCEL_ENV || "Not set",
    NODE_ENV: process.env.NODE_ENV || "Not set",
  }

  // Check if we're in a preview environment
  const isPreview = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"

  // Test Contentful connection - both delivery and preview if available
  const deliveryTest = await testContentfulConnection(false)
  const previewTest = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    ? await testContentfulConnection(true)
    : { success: false, error: "Preview token not set" }

  // Get debug info about all entries
  const debugInfo = await debugGetAllEntries(isPreview)

  // Get posts count from the appropriate API
  let postsCount = 0
  let blogPostsError = ""
  let rawPostsData: any[] = []

  // If connection works, try to fetch blog posts
  if ((isPreview && previewTest.success) || (!isPreview && deliveryTest.success)) {
    try {
      const posts = await getBlogPostsFromContentful(isPreview)
      postsCount = posts.length
      console.log(`📊 Admin page: Found ${postsCount} valid posts (${isPreview ? "preview" : "delivery"})`)

      // Store raw post data for debugging
      rawPostsData = posts.map((post) => ({
        id: post.sys.id,
        title: post.fields.title,
        slug: post.fields.slug,
        published: post.sys.publishedAt ? "Yes" : "No",
        updatedAt: post.sys.updatedAt,
      }))
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
              <span className="font-medium">CONTENTFUL_PREVIEW_ACCESS_TOKEN:</span>{" "}
              {envVars.CONTENTFUL_PREVIEW_ACCESS_TOKEN}
            </div>
            <div>
              <span className="font-medium">CONTENTFUL_ENVIRONMENT:</span> {envVars.CONTENTFUL_ENVIRONMENT}
            </div>
            <div>
              <span className="font-medium">VERCEL_ENV:</span> {envVars.VERCEL_ENV}
            </div>
            <div>
              <span className="font-medium">NODE_ENV:</span> {envVars.NODE_ENV}
            </div>
            <div>
              <span className="font-medium">Current Mode:</span>{" "}
              <span className={`font-bold ${isPreview ? "text-amber-600" : "text-green-600"}`}>
                {isPreview ? "🔍 Preview" : "🚀 Production"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery API Status */}
            <div
              className={`p-4 rounded-md ${deliveryTest.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <h3 className="font-medium mb-2">Delivery API</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={deliveryTest.success ? "text-green-600" : "text-red-600"}>
                    {deliveryTest.success ? "✅ Connected" : "❌ Failed"}
                  </span>
                </div>
                {deliveryTest.success && (
                  <>
                    <div>
                      <span className="font-medium">Total Entries:</span> {deliveryTest.totalEntries}
                    </div>
                    <div>
                      <span className="font-medium">Published Blog Posts:</span> {deliveryTest.blogPosts}
                    </div>
                    <div>
                      <span className="font-medium">Valid Posts:</span> {deliveryTest.validBlogPosts}
                    </div>
                  </>
                )}
                {!deliveryTest.success && <div className="text-red-600">{deliveryTest.error}</div>}
              </div>
            </div>

            {/* Preview API Status */}
            <div
              className={`p-4 rounded-md ${previewTest.success ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
            >
              <h3 className="font-medium mb-2">Preview API</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={previewTest.success ? "text-green-600" : "text-amber-600"}>
                    {previewTest.success ? "✅ Connected" : "⚠️ Not Available"}
                  </span>
                </div>
                {previewTest.success && (
                  <>
                    <div>
                      <span className="font-medium">Total Entries:</span> {previewTest.totalEntries}
                    </div>
                    <div>
                      <span className="font-medium">Published Blog Posts:</span> {previewTest.blogPosts}
                    </div>
                    <div>
                      <span className="font-medium">Valid Posts:</span> {previewTest.validBlogPosts}
                    </div>
                  </>
                )}
                {!previewTest.success && <div className="text-amber-600">{previewTest.error}</div>}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div>
              <span className="font-medium">Content Type ID:</span>{" "}
              <code className="bg-muted px-2 py-1 rounded">mattsBlog</code>
            </div>
            <div>
              <span className="font-medium">Posts Displayed on Site:</span>{" "}
              <span className={postsCount > 0 ? "text-green-600" : "text-red-600"}>
                {postsCount} {postsCount === 1 ? "post" : "posts"}
              </span>
            </div>
            <div>
              <span className="font-medium">Using API:</span>{" "}
              <span className={`font-bold ${isPreview ? "text-amber-600" : "text-green-600"}`}>
                {isPreview ? "🔍 Preview API" : "🚀 Delivery API"}
              </span>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm font-medium">
                📝 Note: Both preview and production environments now show ONLY published content from Contentful.
              </p>
            </div>
          </div>

          {blogPostsError && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm font-medium mb-2">Blog Posts Error:</p>
              <p className="text-yellow-700 text-sm">{blogPostsError}</p>
            </div>
          )}
        </div>

        {/* Raw Posts Data */}
        {rawPostsData.length > 0 && (
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Raw Posts Data</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">ID</th>
                    <th className="text-left pb-2">Title</th>
                    <th className="text-left pb-2">Slug</th>
                    <th className="text-left pb-2">Published</th>
                    <th className="text-left pb-2">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {rawPostsData.map((post, index) => (
                    <tr key={post.id} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                      <td className="py-2 pr-4">{post.id}</td>
                      <td className="py-2 pr-4">{post.title}</td>
                      <td className="py-2 pr-4">{post.slug}</td>
                      <td className="py-2 pr-4">{post.published}</td>
                      <td className="py-2 pr-4">{new Date(post.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Debug Information */}
        {debugInfo && !debugInfo.error && (
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium">All Content Types in Space:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {debugInfo.contentTypes?.map((type) => (
                    <span
                      key={type}
                      className={`px-2 py-1 rounded text-xs ${
                        type === "mattsBlog"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {type} {type === "mattsBlog" && "✅"}
                    </span>
                  )) || ["None found"]}
                </div>
              </div>

              {debugInfo.items && debugInfo.items.length > 0 && (
                <div>
                  <span className="font-medium">Sample Entries:</span>
                  <div className="mt-2 space-y-2">
                    {debugInfo.items.slice(0, 3).map((entry: any, index: number) => (
                      <div
                        key={entry.sys.id}
                        className={`p-3 rounded text-sm ${
                          entry.sys.contentType?.sys.id === "mattsBlog"
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="font-medium">
                          Entry {index + 1}: {entry.fields.title || "No title"}
                          {entry.sys.contentType?.sys.id === "mattsBlog" && " ✅"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {entry.sys.contentType?.sys.id} | Published: {entry.sys.publishedAt ? "Yes" : "No"} |
                          Fields: {Object.keys(entry.fields).join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Guide</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Common Issues</h3>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>Caching Issues</strong> - Next.js may cache responses. We've added <code>revalidate = 0</code>{" "}
                  to force fresh data on each request.
                </li>
                <li>
                  <strong>Preview API Behavior</strong> - The Preview API might include draft content even when
                  filtering for published content. We've strengthened our validation to ensure only published content is
                  used.
                </li>
                <li>
                  <strong>Environment Detection</strong> - Make sure the preview environment is correctly detected based
                  on VERCEL_ENV and NODE_ENV.
                </li>
                <li>
                  <strong>Client Selection</strong> - Ensure the correct client (preview or delivery) is being used
                  based on the environment.
                </li>
                <li>
                  <strong>Fallback Logic</strong> - The fallback logic should only trigger when no published Contentful
                  content is available.
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-medium mb-2">Steps to Fix</h3>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-2">
                <li>
                  <strong>Clear Cache</strong> - Try hard-refreshing your browser (Ctrl+F5) or clearing browser cache.
                </li>
                <li>
                  <strong>Check Logs</strong> - Look at the browser console and server logs for detailed debugging
                  information.
                </li>
                <li>
                  <strong>Verify Content</strong> - Ensure your Contentful posts are published and have all required
                  fields.
                </li>
                <li>
                  <strong>Check Environment Variables</strong> - Make sure all required environment variables are set
                  correctly.
                </li>
                <li>
                  <strong>Redeploy</strong> - Sometimes a fresh deployment can resolve caching or stale data issues.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
