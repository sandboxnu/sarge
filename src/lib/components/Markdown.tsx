import Markdown from 'react-markdown';

export default function MarkdownViewer({ content }: { content: string }) {
    return (
        <div className="markdown-content">
            <Markdown
                components={{
                    h1: ({ node: _node, ...props }) => (
                        <h1 className="mb-4 text-2xl font-bold" {...props} />
                    ),
                    h2: ({ node: _node, ...props }) => (
                        <h2 className="mb-3 text-xl font-semibold" {...props} />
                    ),
                    h3: ({ node: _node, ...props }) => (
                        <h3 className="mb-2 text-lg font-medium" {...props} />
                    ),
                    h4: ({ node: _node, ...props }) => (
                        <h4 className="mb-2 text-base font-medium" {...props} />
                    ),
                    h5: ({ node: _node, ...props }) => (
                        <h5 className="mb-1 text-sm font-medium" {...props} />
                    ),
                    h6: ({ node: _node, ...props }) => (
                        <h6 className="mb-1 text-xs font-medium" {...props} />
                    ),
                    p: ({ node: _node, ...props }) => (
                        <p className="mb-3 leading-relaxed" {...props} />
                    ),
                    ul: ({ node: _node, ...props }) => (
                        <ul className="mb-3 list-inside list-disc pl-4" {...props} />
                    ),
                    ol: ({ node: _node, ...props }) => (
                        <ol className="mb-3 list-inside list-decimal pl-4" {...props} />
                    ),
                    li: ({ node: _node, ...props }) => <li className="mb-1" {...props} />,
                    blockquote: ({ node: _node, ...props }) => (
                        <blockquote
                            className="my-4 border-l-4 border-gray-300 pl-4 text-gray-700 italic"
                            {...props}
                        />
                    ),
                    code: ({ node: _node, ...props }) => (
                        <code
                            className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm"
                            {...props}
                        />
                    ),
                    pre: ({ node: _node, ...props }) => (
                        <pre className="mb-3 overflow-x-auto rounded bg-gray-100 p-4" {...props} />
                    ),
                    strong: ({ node: _node, ...props }) => (
                        <strong className="font-bold" {...props} />
                    ),
                    em: ({ node: _node, ...props }) => <em className="italic" {...props} />,
                    a: ({ node: _node, ...props }) => (
                        <a className="text-blue-600 underline hover:text-blue-800" {...props} />
                    ),
                    hr: ({ node: _node, ...props }) => (
                        <hr className="my-6 border-gray-300" {...props} />
                    ),
                    table: ({ node: _node, ...props }) => (
                        <table
                            className="mb-3 w-full border-collapse border border-gray-300"
                            {...props}
                        />
                    ),
                    th: ({ node: _node, ...props }) => (
                        <th
                            className="border border-gray-300 bg-gray-100 px-3 py-2 text-left font-semibold"
                            {...props}
                        />
                    ),
                    td: ({ node: _node, ...props }) => (
                        <td className="border border-gray-300 px-3 py-2" {...props} />
                    ),
                }}
            >
                {content}
            </Markdown>
        </div>
    );
}
