import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { testContentfulConnection, getBlogPostsFromContentful, debugGetAllEntries } from "@/lib/contentful"

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

  // Get debug info about all entries
  const debugInfo = await debugGetAllEntries()

  let postsCount = 0
  let blogPostsError = ""

  // If basic connection works, try to fetch blog posts
  if (connectionTest.success) {
    try {
      const posts = await getBlogPostsFromContentful()
      postsCount = posts.length
      console.log(`📊 Admin page: Found ${postsCount} valid posts`)
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
                  <span className="font-medium">mattsBlog Entries Found:</span> {connectionTest.blogPosts}
                </div>
                <div>
                  <span className="font-medium">Valid Blog Posts:</span>{" "}
                  <span className={postsCount > 0 ? "text-green-600" : "text-red-600"}>
                    {connectionTest.validBlogPosts || 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Content Type Status:</span>{" "}
                  {connectionTest.contentTypeExists ? "✅ Found" : "❌ Not Found"}
                </div>
              </>
            )}
            <div>
              <span className="font-medium">Posts Displayed on Site:</span>{" "}
              <span className={postsCount > 0 ? "text-green-600" : "text-red-600"}>{postsCount}</span>
            </div>
            <div>
              <span className="font-medium">Content Type ID:</span>{" "}
              <code className="bg-muted px-2 py-1 rounded">mattsBlog</code>
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

          {connectionTest.success && postsCount === 0 && connectionTest.blogPosts > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm font-medium mb-2">Posts Found But Not Valid:</p>
              <p className="text-yellow-700 text-sm">
                {connectionTest.blogPosts} entries found with content type "mattsBlog", but none have the required
                fields (title, slug, content) or are not published.
              </p>
            </div>
          )}

          {connectionTest.success && connectionTest.blogPosts === 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm font-medium mb-2">No mattsBlog Entries Found:</p>
              <p className="text-blue-700 text-sm">
                No entries found with content type "mattsBlog". Check that your content type ID is correct.
              </p>
            </div>
          )}
        </div>

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
              <h3 className="font-medium mb-2">Troubleshooting Steps</h3>
              <ol className="list-decimal pl-6 text-sm text-muted-foreground space-y-1">
                <li>Verify your content type ID is exactly "mattsBlog" (case-sensitive)</li>
                <li>Ensure your blog posts have title, slug, and content fields filled</li>
                <li>Make sure your posts are published (not saved as drafts)</li>
                <li>Check that the content field uses Rich Text format</li>
                <li>Refresh this page after making changes in Contentful</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="p-6 border rounded-lg bg-card mt-6">
          <h2 className="text-xl font-semibold mb-4">Field Mapping</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-4">
              Ensure these field names match exactly with your Contentful content model:
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Code Field</th>
                  <th className="text-left pb-2">Contentful Field</th>
                  <th className="text-left pb-2">Type</th>
                  <th className="text-left pb-2">Required</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">title</td>
                  <td className="py-2">Title</td>
                  <td className="py-2">Short text</td>
                  <td className="py-2 text-green-600">Yes ✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">slug</td>
                  <td className="py-2">Slug</td>
                  <td className="py-2">Short text</td>
                  <td className="py-2 text-green-600">Yes ✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">content</td>
                  <td className="py-2">Content</td>
                  <td className="py-2">Rich text</td>
                  <td className="py-2 text-green-600">Yes ✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">excerpt</td>
                  <td className="py-2">Excerpt</td>
                  <td className="py-2">Short text</td>
                  <td className="py-2">No</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">date</td>
                  <td className="py-2">Date</td>
                  <td className="py-2">Date & time</td>
                  <td className="py-2">No</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">tags</td>
                  <td className="py-2">Tags</td>
                  <td className="py-2">Short text</td>
                  <td className="py-2">No</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono">featured</td>
                  <td className="py-2">Featured</td>
                  <td className="py-2">Boolean</td>
                  <td className="py-2">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
