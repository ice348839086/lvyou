import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义表格样式
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full" {...props} />
            </div>
          ),
          // 自定义链接(在新标签页打开)
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          // 自定义代码块
          code: ({ node, className, children, ...props }) => {
            // 检查是否是内联代码
            const isInline = !className || !className.includes('language-');
            
            if (isInline) {
              return <code className={className} {...props}>{children}</code>;
            }
            
            return (
              <pre className={className}>
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
