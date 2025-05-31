export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  published: boolean
}

// Mock blog data - in a real app, this would come from a CMS or markdown files
const blogPosts: BlogPost[] = [
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
  {
    slug: "building-sustainable-software",
    title: "Building Sustainable Software: A Developer's Responsibility",
    excerpt:
      "Learn about the environmental impact of software development and discover practical strategies for writing more efficient, sustainable code.",
    content: `
      <p>As developers, we have a responsibility to consider the environmental impact of the software we create. Every line of code we write has the potential to consume energy and resources.</p>
      
      <h2>The Hidden Cost of Code</h2>
      <p>Software consumes energy through CPU cycles, memory usage, and network requests. Inefficient code can lead to higher energy consumption and increased carbon emissions.</p>
      
      <h2>Strategies for Sustainable Development</h2>
      <p>Here are some practical approaches:</p>
      <ul>
        <li>Optimize algorithms and data structures</li>
        <li>Minimize network requests and payload sizes</li>
        <li>Use efficient caching strategies</li>
        <li>Choose green hosting providers</li>
      </ul>
      
      <p>By making conscious choices about how we write and deploy code, we can contribute to a more sustainable digital future.</p>
    `,
    date: "2024-01-05",
    published: true,
  },
]

export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return blogPosts.find((post) => post.slug === slug && post.published) || null
}
