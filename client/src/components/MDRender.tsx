import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";
import remarkGfm from "remark-gfm";

export const MDRender = ({ mdString }: { mdString: string }) => {
  // Function to copy code to clipboard
  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard", {
          duration: 2000,
          style: {
            backgroundColor: "rgb(63 63 70)",
            color: "white",
            border: "2px solid rgb(82 82 91)",
          },
          iconTheme: {
            primary: "green",
            secondary: "white",
          },
        });
      })
      .catch((err) => console.error("Error copying text: ", err));
  };

  return (
    <section className="chat-block">
      <ReactMarkdown
        remarkPlugins={remarkGfm}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1].toLowerCase() : ""; // Enforce lowercase
            const codeString = String(children).replace(/\n$/, "");

            return !inline && language ? (
              <div className="relative">
                <SyntaxHighlighter
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={dracula as any}
                  language={language}
                  PreTag="div"
                  {...props}
                  ref={undefined}
                >
                  {codeString}
                </SyntaxHighlighter>

                {/* Copy button positioned at the top-right of the code block */}
                <button
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 5,
                  }}
                  onClick={() => handleCopy(codeString)}
                  aria-label="Copy code"
                >
                  <img
                    src="../src/assets/copy.svg"
                    alt="Copy"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {mdString}
      </ReactMarkdown>
    </section>
  );
};
