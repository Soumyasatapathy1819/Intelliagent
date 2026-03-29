# IntelliAgent

IntelliAgent is a multimodal assistant web app: a Vite + React frontend with an Express + MongoDB backend, using Google Generative AI (Gemini) for text and vision. The app supports conversational chat, file upload (PDF/CSV) analysis, image analysis, optional web search augmentation, and client-side speech synthesis.

Repository structure (top-level):

- backend/
	- app.js                 # Express app, middleware
	- server.js              # Server entrypoint
	- package.json
	- config/db.js           # MongoDB connector
	- controllers/           # Request handlers (chat, file, voice)
	- routes/                # API routes: /api/chat, /api/file, /api/voice
	- services/              # Helpers: gemini, tts/pdf/csv, web search
	- models/                # Mongoose models: Chat, Message
	- middleware/            # upload, error handler

- frontend/
	- src/
		- components/         # Chat UI components (ChatContainer, ChatInput, ChatMessage, Sidebar, etc.)
		- pages/              # `ChatPage.jsx`
		- services/api.js     # API client (uses VITE_API_URL)
	- package.json

Key features
- Conversational chat with context persistence (MongoDB).
- File uploads: PDF and CSV parsing, adding document context to chats.
- Image uploads: vision analysis via Gemini and adding image context.
- Optional web search augmentation (backend decides when to use web results).
- Client-side text-to-speech (browser SpeechSynthesis) with selectable voices.

API endpoints (backend)
- GET /api/health — health check (app.js)
- GET /api/chat — list chats
- POST /api/chat — send message (create chat if needed)
- GET /api/chat/:chatId — get messages for a chat
- POST /api/chat/:chatId/clear — clear messages in a chat
- DELETE /api/chat/:chatId — delete a chat
- POST /api/file — upload PDF/CSV (field `file`)
- POST /api/file/image — upload image (field `image`)
- POST /api/voice/tts — simple TTS endpoint (client uses browser TTS)

Environment variables
Backend (required/optional):
- `PORT` — optional, default 5000.
- `MONGO_URI` — MongoDB connection string (required in production).
- `GEMINI_API_KEY` — Google Generative AI key (required).
- `GEMINI_TEXT_MODEL` — optional (default: `gemini-2.5-flash`).
- `GEMINI_VISION_MODEL` — optional (default: `gemini-2.5-flash`).

Frontend: set `VITE_API_URL` to your backend API base (for example `https://your-backend.example.com/api`). Local default points to `https://intelliagent-ai.onrender.com/api`.

Quickstart — local development
1. Install dependencies and run backend:

```bash
cd backend
npm install
# create backend/.env from backend/.env.example
npm run dev
```

2. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

3. Open the frontend at http://localhost:5173 and verify backend at http://localhost:5000/api/health

- Security and secrets
- Do NOT commit `.env` files. This repo previously contained `backend/.env` — rotate any exposed keys immediately.
- To stop tracking `backend/.env` and remove it from the index:

```bash
git rm --cached backend/.env
git commit -m "Remove sensitive env file"
git push
```

- To scrub secrets from git history, use `git filter-repo` or BFG Repo-Cleaner and rotate keys afterwards.

Usage examples
- Send a chat message (replace URL):

```bash
curl -X POST https://your-backend.onrender.com/api/chat \
	-H "Content-Type: application/json" \
	-d '{"message":"Hello world"}'
```

- Upload a PDF:

```bash
curl -X POST https://your-backend.onrender.com/api/file \
	-F "file=@./report.pdf" \
	-F "question=Summarize this report"
```

Files and code pointers
- Frontend components: `frontend/src/components/ChatContainer.jsx`, `ChatInput.jsx`, `ChatMessage.jsx`, `Sidebar.jsx`.
- API client: `frontend/src/services/api.js`.
- Backend core: `backend/app.js`, `backend/server.js`, `backend/config/db.js`.
- Controllers: `backend/controllers/chat.controller.js`, `file.controller.js`, `voice.controller.js`.
- Services: `backend/services/gemini.service.js`, `pdf.service.js`, `csv.service.js`, `webSearch.service.js`.

---
License

This project is licensed under the MIT License.

Author

Soumya Prakash Satapathy

B.Tech CSE (Hons.), XIM University
Data Analyst | AI Enthusiast | Developer

