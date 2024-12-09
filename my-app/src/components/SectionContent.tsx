// src/components/SectionContent.tsx

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { pojoaque } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SectionContentProps {
  content: string;
}

export function SectionContent({ content }: SectionContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3 text-neutral-800 dark:text-neutral-200">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-neutral-800 dark:text-neutral-200">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 text-neutral-700 dark:text-neutral-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 text-neutral-700 dark:text-neutral-300">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 p-3 rounded">
              {children}
            </blockquote>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {children}
            </p>
          ),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          code({ node, className, children, ref, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            // If there's a language specified or it's a multi-line code block
            if (match || code.includes("\n")) {
              return (
                <div className="my-6">
                  <SyntaxHighlighter
                    // eslint-disable-next-line
                    style={pojoaque as any}
                    language={match?.[1] || "text"}
                    PreTag="div"
                    className="rounded-lg !bg-neutral-900 dark:!bg-neutral-950 !mt-0"
                    showLineNumbers={true}
                    customStyle={{
                      margin: 0,
                      padding: "1.5rem",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            // For inline code (single backticks)
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-emerald-600 dark:text-yellow-400 font-mono text-sm whitespace-nowrap"
                {...props}
              >
                {code}
              </code>
            );
          },

          // code: ({ node, className, children, ...props }) => {
          //   const match = /language-(\w+)/.exec(className || "");

          //   // Handle code blocks
          //   return (
          //     <div className="my-6">
          //       <SyntaxHighlighter
          //         // useInlineStyles={true}
          //         style={pojoaque}
          //         language={match?.[1] || "text"}
          //         PreTag="div"
          //         className="rounded-lg !bg-neutral-900 dark:!bg-neutral-950 !mt-0"
          //         showLineNumbers
          //         customStyle={{
          //           margin: 0,
          //           padding: "1.5rem",
          //           fontSize: "0.95rem",
          //           lineHeight: "1.5",
          //         }}
          //         {...props}
          //       >
          //         {String(children).replace(/\n$/, "")}
          //       </SyntaxHighlighter>
          //     </div>
          //   );
          // },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
