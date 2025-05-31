import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types"

interface BlogContentProps {
  content: any // Can be string or Contentful rich text document
}

export function BlogContent({ content }: BlogContentProps) {
  // Check if content is a Contentful rich text document
  if (content && typeof content === "object" && content.nodeType === "document") {
    // Render rich text content with custom styling
    const options = {
      renderNode: {
        [BLOCKS.HEADING_1]: (node: any, children: any) => (
          <h1 className="text-3xl font-bold mt-8 mb-6 text-foreground">{children}</h1>
        ),
        [BLOCKS.HEADING_2]: (node: any, children: any) => (
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: any, children: any) => (
          <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">{children}</h3>
        ),
        [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
          <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
        ),
        [BLOCKS.UL_LIST]: (node: any, children: any) => (
          <ul className="list-disc pl-6 mb-4 text-muted-foreground">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: any) => (
          <ol className="list-decimal pl-6 mb-4 text-muted-foreground">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (node: any, children: any) => <li className="mb-1">{children}</li>,
        [BLOCKS.QUOTE]: (node: any, children: any) => (
          <blockquote className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground">{children}</blockquote>
        ),
        [INLINES.HYPERLINK]: (node: any, children: any) => (
          <a
            href={node.data.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
          >
            {children}
          </a>
        ),
      },
      renderMark: {
        [MARKS.BOLD]: (text: any) => <strong className="font-semibold text-foreground">{text}</strong>,
        [MARKS.ITALIC]: (text: any) => <em>{text}</em>,
        [MARKS.UNDERLINE]: (text: any) => <u>{text}</u>,
        [MARKS.CODE]: (text: any) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{text}</code>,
      },
    }

    return <div className="prose max-w-none">{documentToReactComponents(content, options)}</div>
  }

  // Fallback to regular HTML rendering for string content
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground"
    />
  )
}
