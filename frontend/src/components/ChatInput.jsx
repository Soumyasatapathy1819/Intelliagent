import { useEffect, useRef, useState } from "react";
import FileUpload from "./FileUpload.jsx";

export default function ChatInput({ onSend, onUploadFile, onUploadImage, loading }) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => `${prev} ${transcript}`.trim());
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  const handleFile = async (file) => {
    const question = text.trim();
    if (question) setText("");
    await onUploadFile?.(file, question || undefined);
  };

  const handleImage = async (file) => {
    const question = text.trim();
    if (question) setText("");
    await onUploadImage?.(file, question || undefined);
  };

  return (
    <div className="p-4 border-t border-slate-800/70 bg-panel/70 backdrop-blur">
      <div className="flex flex-col gap-3">
        <textarea
          className="w-full bg-panelAlt/80 border border-slate-800 rounded-xl p-3 text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-accent/60"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything, paste code, or describe the file you are about to upload..."
        />

        <div className="flex flex-wrap items-center gap-2">
          <FileUpload
            label="Upload PDF/CSV"
            accept=".pdf,.csv"
            onFile={handleFile}
          />
          <FileUpload
            label="Upload Image"
            accept="image/*"
            onFile={handleImage}
          />
          <button
            onClick={toggleListening}
            disabled={!voiceSupported}
            className={`px-3 py-2 rounded-full border text-sm ${
              listening
                ? "border-accent text-accent"
                : "border-slate-700 text-slate-300"
            } ${!voiceSupported ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {voiceSupported ? (listening ? "Listening..." : "Voice Input") : "Voice N/A"}
          </button>
          <div className="flex-1" />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-accent text-slate-900 px-5 py-2 rounded-full font-semibold shadow-glow disabled:opacity-60"
          >
            {loading ? "Working..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
