import Message from "../models/Message.js";

export const buildContext = async (chatId, limit = 12) => {
  const messages = await Message.find({ chatId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return messages.reverse();
};
