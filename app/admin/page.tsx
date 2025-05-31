import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Admin - Contentful Setup",
  description: "Setup instructions for Contentful CMS integration",
}

export default function AdminPage() {
  const envVars = {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID ? "✅ Set" : "❌ Missing",
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ? "✅ Set" : "❌ Missing",
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || "master (default)",
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

      <h1 className="text-3xl font-bold mb-6">Contentful CMS Setup</h1>

      <div className="space-y-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
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
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">1. Create a Contentful Account</h3>
              <p className="text-muted-foreground">
                Sign up at{" "}
                <a
                  href="https://www.contentful.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  contentful.com
                </a>{" "}
                and create a new space.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Create Content Model</h3>
              <p className="text-muted-foreground mb-2">
                In your Contentful space, create a content type called "Blog Post" with the following fields:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
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
              <p className="text-muted-foreground mt-2">
                Make sure the Content Type ID is set to <code className="bg-muted px-1 py-0.5 rounded">blogPost</code>
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Get API Keys</h3>
              <p className="text-muted-foreground">Go to Settings → API keys in your Contentful space and copy:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Space ID</li>
                <li>Content Delivery API access token</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">4. Set Environment Variables</h3>
              <p className="text-muted-foreground mb-2">Add these to your environment variables:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                {`CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">5. Create Content</h3>
              <p className="text-muted-foreground">
                Start creating blog posts in Contentful. Make sure to publish them for them to appear on your site.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Content Model JSON</h2>
          <p className="text-muted-foreground mb-4">You can import this content model directly into Contentful:</p>
          <pre className="bg-muted p-4 rounded text-xs overflow-x-auto max-h-96">
            {`{
  "name": "Blog Post",
  "description": "Blog post content type for the personal blog",
  "displayField": "title",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 200
          }
        }
      ]
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Symbol",
      "required": true,
      "validations": [
        {
          "unique": true
        },
        {
          "regexp": {
            "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
          }
        }
      ]
    },
    {
      "id": "excerpt",
      "name": "Excerpt",
      "type": "Text",
      "required": true,
      "validations": [
        {
          "size": {
            "max": 500
          }
        }
      ]
    },
    {
      "id": "content",
      "name": "Content",
      "type": "RichText",
      "required": true
    },
    {
      "id": "publishedDate",
      "name": "Published Date",
      "type": "Date",
      "required": true
    },
    {
      "id": "tags",
      "name": "Tags",
      "type": "Array",
      "items": {
        "type": "Symbol"
      }
    },
    {
      "id": "featured",
      "name": "Featured",
      "type": "Boolean"
    }
  ]
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
