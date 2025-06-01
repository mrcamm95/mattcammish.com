import { getBlogPostsFromContentful, getBlogPostBySlug, convertContentfulPost } from "./contentful"

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: any // Can be string or Contentful rich text document
  date: string
  published: boolean
  featured?: boolean
  tags?: string[]
}

// Fallback blog posts for when Contentful is unavailable
const fallbackPosts: BlogPost[] = [
  {
    slug: "getting-started-with-nextjs",
    title: "Getting Started with Next.js: A Modern React Framework",
    excerpt:
      "Discover how Next.js revolutionizes React development with its powerful features like server-side rendering, automatic code splitting, and seamless deployment.",
    content: `
      <p>Next.js has become the go-to framework for React developers who want to build production-ready applications with minimal configuration. In this post, we'll explore what makes Next.js special and why you should consider it for your next project.</p>
      
      <h2>What is Next.js?</h2>
      <p>Next.js is a React framework that provides a complete solution for building web applications. It offers features like server-side rendering, static site generation, and automatic code splitting out of the box.</p>
      
      <h2>Key Features</h2>
      <p>Some of the standout features include:</p>
      <ul>
        <li>Server-side rendering for better SEO</li>
        <li>Automatic code splitting for faster page loads</li>
        <li>Built-in CSS and Sass support</li>
        <li>API routes for backend functionality</li>
      </ul>
      
      <p>Whether you're building a simple blog or a complex web application, Next.js provides the tools you need to create fast, scalable, and SEO-friendly websites.</p>
    `,
    date: "2024-01-15",
    published: true,
  },
  {
    slug: "the-art-of-minimalist-design",
    title: "The Art of Minimalist Design in Web Development",
    excerpt:
      "Explore how minimalist design principles can create more effective and user-friendly web experiences through thoughtful use of whitespace, typography, and color.",
    content: `
      <p>Minimalist design isn't just about using less—it's about using what you need most effectively. In web development, this philosophy can lead to cleaner, faster, and more user-friendly experiences.</p>
      
      <h2>Less is More</h2>
      <p>The principle of "less is more" applies perfectly to web design. By removing unnecessary elements, we can focus the user's attention on what truly matters.</p>
      
      <h2>Typography Matters</h2>
      <p>Good typography is the foundation of minimalist design. Choose fonts that are readable and convey the right tone for your content.</p>
      
      <h2>Whitespace as a Design Element</h2>
      <p>Whitespace isn't empty space—it's a powerful design tool that can improve readability and create visual hierarchy.</p>
      
      <p>Remember, minimalist design is about intentionality. Every element should have a purpose and contribute to the overall user experience.</p>
    `,
    date: "2024-01-10",
    published: true,
  },
]

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log("📚 Starting to fetch blog posts...")

    // Try to fetch from Contentful first
    const contentfulPosts = await getBlogPostsFromContentful()

    if (contentfulPosts.length > 0) {
      console.log(`📚 Successfully fetched ${contentfulPosts.length} posts from Contentful`)

      // Convert Contentful posts to our format
      const convertedPosts = contentfulPosts.map(convertContentfulPost)

      // Sort by date (newest first)
      return convertedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } else {
      console.log("📚 No posts found in Contentful, using fallback posts")
      return fallbackPosts
        .filter((post) => post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  } catch (error) {
    console.error("📚 Error in getBlogPosts, using fallback posts:", error)

    // Return fallback posts if Contentful fails
    return fallbackPosts
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`📖 Fetching blog post with slug: ${slug}`)

    // Try to fetch from Contentful first
    const contentfulPost = await getBlogPostBySlug(slug)

    if (contentfulPost) {
      console.log(`📖 Found post in Contentful: ${contentfulPost.fields.title}`)
      return convertContentfulPost(contentfulPost)
    } else {
      console.log(`📖 Post not found in Contentful, checking fallback posts`)

      // Fallback to local posts
      const fallbackPost = fallbackPosts.find((post) => post.slug === slug && post.published)

      if (fallbackPost) {
        console.log(`📖 Found post in fallback: ${fallbackPost.title}`)
      } else {
        console.log(`📖 Post not found anywhere: ${slug}`)
      }

      return fallbackPost || null
    }
  } catch (error) {
    console.error(`📖 Error fetching blog post ${slug}, checking fallback:`, error)

    // Fallback to local posts
    return fallbackPosts.find((post) => post.slug === slug && post.published) || null
  }
}
