import { useState } from "react";

export default function CodeBlock({ inline, className, children }) {
  const [copied, setCopied] = useState(false);

  const language = className?.replace("language-", "") || "";
  const code = String(children).replace(/\n$/, "");

  if (inline) {
    return <code className="px-1 py-0.5 rounded bg-slate-800/70">{code}</code>;
  }

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative bg-black/70 rounded-xl p-4 mt-3 border border-slate-800">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span>{language || "code"}</span>
        <button
          onClick={copy}
          className="text-xs bg-accent text-slate-900 px-2 py-1 rounded"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
