import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownProps {
  content: string
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-900" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold mt-3 mb-2 text-gray-900" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-bold mt-2 mb-1 text-gray-900" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-2 text-gray-800 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-gray-800" {...props} />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block bg-gray-100 text-gray-900 p-3 rounded text-sm font-mono overflow-x-auto my-2"
              {...props}
            />
          ),
        pre: ({ node, ...props }) => (
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto my-2" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-2"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-blue-600 hover:text-blue-800 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-2">
            <table className="min-w-full border border-gray-300" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-4 py-2" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-gray-900" {...props} />
        ),
        em: ({ node, ...props }) => (
          <em className="italic text-gray-800" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
