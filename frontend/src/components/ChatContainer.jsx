import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";

export default function ChatContainer({
  messages,
  loading,
  error,
  activeChatTitle,
  onSend,
  onUploadFile,
  onUploadImage,
  onClearChat,
  onToggleSidebar,
  onSpeak,
  speakingId
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between border-b border-slate-800/60 bg-panel/70 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div>
            <p className="text-sm text-slate-400">Active Chat</p>
            <h2 className="text-lg font-semibold text-white">{activeChatTitle}</h2>
          </div>
        </div>
        <button
          onClick={onClearChat}
          className="text-sm text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 rounded-full"
        >
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center text-slate-400 space-y-4 animate-fade-up">
            <div className="text-3xl font-semibold text-white">IntelliAgent</div>
            <p>
              Ask anything, upload files, or drop images for instant analysis. Use the
              mic to speak and let IntelliAgent respond with voice.
            </p>
            <div className="grid gap-3 text-left text-sm">
              <div className="bg-panelAlt/70 border border-slate-800 rounded-xl p-4">
                “Explain this error stack trace.”
              </div>
              <div className="bg-panelAlt/70 border border-slate-800 rounded-xl p-4">
                “Summarize this PDF and highlight key risks.”
              </div>
              <div className="bg-panelAlt/70 border border-slate-800 rounded-xl p-4">
                “Analyze this UI screenshot and suggest improvements.”
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg._id || msg.id}
            message={msg}
            onSpeak={onSpeak}
            isSpeaking={speakingId === (msg._id || msg.id)}
          />
        ))}

        {loading && (
          <div className="text-slate-400 text-sm">Thinking...</div>
        )}

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={onSend}
        onUploadFile={onUploadFile}
        onUploadImage={onUploadImage}
        loading={loading}
      />
    </div>
  );
}
