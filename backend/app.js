import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import fileRoutes from "./routes/file.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/chat", chatRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/voice", voiceRoutes);

app.use(errorHandler);

export default app;
