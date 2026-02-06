import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { parsePDF } from "../services/pdf.service.js";
import { parseCSV } from "../services/csv.service.js";
import { generateTextResponse, generateVisionResponse } from "../services/gemini.service.js";

const SYSTEM_PROMPT =
  "You are IntelliAgent, a helpful multimodal assistant. Provide clear summaries and answer questions grounded in the provided content.";

const ensureChat = async (chatId, title) => {
  if (chatId) {
    const existing = await Chat.findById(chatId);
    if (existing) return existing;
  }

  return Chat.create({ title: title.slice(0, 60) || "New Chat" });
};

export const uploadFile = async (req, res, next) => {
  try {
    const { chatId, question } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    let extracted = "";
    if (file.mimetype === "application/pdf") {
      extracted = await parsePDF(file.buffer);
    } else if (file.mimetype.includes("csv")) {
      const rows = await parseCSV(file.buffer);
      extracted = JSON.stringify(rows.slice(0, 80));
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const trimmed = extracted.slice(0, 12000);
    const chat = await ensureChat(chatId, file.originalname);

    await Message.create({
      chatId: chat._id,
      role: "user",
      content: question?.trim() || `Uploaded file: ${file.originalname}`,
      type: "file",
      meta: {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }
    });

    const prompt = `File name: ${file.originalname}\nExtracted content:\n${trimmed}\n\nUser question: ${
      question?.trim() || "Summarize and analyze the file."
    }`;

    const reply = await generateTextResponse([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
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

export const uploadImage = async (req, res, next) => {
  try {
    const { chatId, question } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image is required" });
    }

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Unsupported image type" });
    }

    const chat = await ensureChat(chatId, file.originalname);

    await Message.create({
      chatId: chat._id,
      role: "user",
      content: question?.trim() || `Uploaded image: ${file.originalname}`,
      type: "image",
      meta: {
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }
    });

    const prompt = `${SYSTEM_PROMPT}\nUser question: ${
      question?.trim() || "Describe the image and extract any relevant text."
    }`;

    const reply = await generateVisionResponse({
      prompt,
      image: {
        data: file.buffer.toString("base64"),
        mimeType: file.mimetype
      }
    });

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
