import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import {
  clearChat,
  deleteChat,
  getChats,
  getMessages,
  sendMessage,
  uploadFile,
  uploadImage
} from "../services/api.js";

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);

  const activeChat = chats.find((chat) => chat._id === activeChatId);

  const refreshChats = async (preferredId) => {
    const res = await getChats();
    const list = res.data.chats || [];
    setChats(list);

    if (preferredId) {
      setActiveChatId(preferredId);
      return;
    }

    if (!activeChatId && list.length) {
      setActiveChatId(list[0]._id);
      await loadMessages(list[0]._id);
    }
  };

  const loadMessages = async (chatId) => {
    const res = await getMessages(chatId);
    setMessages(res.data.messages || []);
  };

  useEffect(() => {
    refreshChats();
  }, []);

  const handleSelectChat = async (chatId) => {
    setSidebarOpen(false);
    setActiveChatId(chatId);
    await loadMessages(chatId);
  };

  const handleNewChat = () => {
    setSidebarOpen(false);
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    setLoading(true);

    const optimistic = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      type: "text",
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await sendMessage({ chatId: activeChatId, message: trimmed });

      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: res.data.reply,
        type: "text",
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, reply]);
      await refreshChats(res.data.chatId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (file, question) => {
    if (!file || loading) return;

    setError("");
    setLoading(true);

    const optimistic = {
      id: `f-${Date.now()}`,
      role: "user",
      content: question?.trim() || `Uploaded file: ${file.name}`,
      type: "file",
      meta: {
        name: file.name
      },
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await uploadFile({ file, chatId: activeChatId, question });
      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: res.data.reply,
        type: "text",
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, reply]);
      await refreshChats(res.data.chatId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze file");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (file, question) => {
    if (!file || loading) return;

    setError("");
    setLoading(true);

    const previewUrl = URL.createObjectURL(file);

    const optimistic = {
      id: `i-${Date.now()}`,
      role: "user",
      content: question?.trim() || `Uploaded image: ${file.name}`,
      type: "image",
      meta: {
        name: file.name,
        previewUrl
      },
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await uploadImage({ file, chatId: activeChatId, question });
      const reply = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: res.data.reply,
        type: "text",
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, reply]);
      await refreshChats(res.data.chatId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!activeChatId) return;

    setError("");
    setLoading(true);

    try {
      await clearChat(activeChatId);
      setMessages([]);
      await refreshChats(activeChatId);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to clear chat");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    setError("");
    setLoading(true);

    try {
      await deleteChat(chatId);
      if (activeChatId === chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
      await refreshChats();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete chat");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (message) => {
    if (!message?.content || !window.speechSynthesis) return;

    const messageId = message._id || message.id;

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(messageId);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chats={chats}
          activeChatId={activeChatId}
          onSelect={handleSelectChat}
          onNewChat={handleNewChat}
          onDelete={handleDeleteChat}
        />

        <ChatContainer
          messages={messages}
          loading={loading}
          error={error}
          activeChatTitle={activeChat?.title || "New Chat"}
          onSend={handleSend}
          onUploadFile={handleUploadFile}
          onUploadImage={handleUploadImage}
          onClearChat={handleClearChat}
          onToggleSidebar={() => setSidebarOpen(true)}
          onSpeak={handleSpeak}
          speakingId={speakingId}
        />
      </div>
    </div>
  );
}
