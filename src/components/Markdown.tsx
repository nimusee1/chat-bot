import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownProps {
  content: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={atomDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline" />
        ),
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-2" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-gray-400 pl-4 italic text-gray-600" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table className="border-collapse border border-gray-400" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-400 px-4 py-2 bg-gray-100" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-400 px-4 py-2" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
