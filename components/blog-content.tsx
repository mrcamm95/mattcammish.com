interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  // In a real blog, you'd parse markdown here
  // For this demo, we'll render the content as HTML
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-muted-foreground"
    />
  )
}
