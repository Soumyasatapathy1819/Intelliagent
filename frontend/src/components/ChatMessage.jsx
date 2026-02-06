import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock.jsx";

export default function ChatMessage({ message, onSpeak, isSpeaking }) {
  const isUser = message.role === "user";
  const timestamp = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl w-full md:w-auto rounded-2xl px-4 py-3 shadow-soft border ${
          isUser
            ? "bg-accent text-slate-900 border-transparent"
            : "bg-panelAlt/80 text-slate-100 border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide mb-2 text-slate-400">
          <span>{isUser ? "You" : "IntelliAgent"}</span>
          <span>{timestamp}</span>
        </div>

        {message.type === "image" && message.meta?.previewUrl && (
          <img
            src={message.meta.previewUrl}
            alt={message.meta?.name || "Uploaded"}
            className="rounded-lg mb-3 max-h-64 w-full object-cover"
          />
        )}

        {message.type === "file" && (
          <div className="text-xs text-slate-400 mb-2">
            Attached file: {message.meta?.name || "Document"}
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: CodeBlock
          }}
        >
          {message.content}
        </ReactMarkdown>

        {!isUser && onSpeak && (
          <button
            onClick={() => onSpeak(message)}
            className="mt-3 text-xs text-slate-200 border border-slate-700 px-3 py-1 rounded-full hover:border-slate-500"
          >
            {isSpeaking ? "Stop Voice" : "Play Voice"}
          </button>
        )}
      </div>
    </div>
  );
}
