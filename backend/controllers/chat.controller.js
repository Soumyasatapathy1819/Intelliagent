import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { buildContext } from "../utils/contextBuilder.js";
import { generateTextResponse } from "../services/gemini.service.js";

const SYSTEM_PROMPT =
  "You are IntelliAgent, a helpful multimodal assistant. Provide clear, concise, and correct answers. When responding with code, include complete runnable snippets and explain assumptions.";

export const listChats = async (req, res, next) => {
  try {
    const chats = await Chat.find()
      .sort({ updatedAt: -1 })
      .limit(100)
      .lean();
    res.json({ chats });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();
    res.json({ messages });
  } catch (err) {
    next(err);
  }
};

export const clearChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await Message.deleteMany({ chatId });
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: "",
      lastMessageAt: null
    });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    await Message.deleteMany({ chatId });
    await Chat.findByIdAndDelete(chatId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chat = null;

    if (chatId) {
      chat = await Chat.findById(chatId);
    }

    if (!chat) {
      chat = await Chat.create({
        title: message.slice(0, 60)
      });
    }

    await Message.create({
      chatId: chat._id,
      role: "user",
      content: message,
      type: "text"
    });

    const context = await buildContext(chat._id);

    const reply = await generateTextResponse([
      { role: "system", content: SYSTEM_PROMPT },
      ...context.map((m) => ({ role: m.role, content: m.content }))
    ]);

    await Message.create({
      chatId: chat._id,
      role: "assistant",
      content: reply,
      type: "text"
    });

    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: reply.slice(0, 200),
      lastMessageAt: new Date()
    });

    res.json({ chatId: chat._id, reply });
  } catch (err) {
    next(err);
  }
};
