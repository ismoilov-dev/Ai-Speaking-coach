# 🎙️ English Coach — AI Speaking Practice App

A full-stack web application for practicing English conversation with an AI coach.
Uses **voice input**, **AI responses**, and **text-to-speech** for a natural speaking practice experience.

---

## ✨ Features

- 🎤 **Voice input** — speak directly using your microphone (Web Speech API)
- 🔊 **AI voice output** — the AI coach reads its responses aloud
- 💬 **Real-time chat** — natural conversation with context memory
- 📚 **Session history** — all conversations saved to SQLite database
- 🆓 **100% free AI** — uses Ollama (local) or HuggingFace (free tier)
- 🎨 **Clean dark UI** — minimal, elegant dark theme

---

## 🏗️ Project Structure

```
english-coach/
├── backend/                    # Django REST API
│   ├── chat/
│   │   ├── models.py           # Message & Conversation models
│   │   ├── views.py            # API logic + AI integration
│   │   ├── serializers.py      # JSON serialization
│   │   ├── urls.py             # URL routing
│   │   └── apps.py
│   ├── englishcoach/
│   │   ├── settings.py         # Django config
│   │   └── urls.py             # Root URL config
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                   # React + Tailwind UI
│   ├── src/
│   │   ├── App.jsx             # Main component
│   │   ├── components/
│   │   │   ├── MessageBubble.jsx   # Chat bubbles
│   │   │   ├── ChatInput.jsx       # Input + voice button
│   │   │   ├── VoiceButton.jsx     # Mic button
│   │   │   └── HistoryPanel.jsx    # Sessions sidebar
│   │   ├── hooks/
│   │   │   ├── useChat.js          # Chat state + API
│   │   │   └── useSpeech.js        # Web Speech API
│   │   └── utils/
│   │       └── api.js              # Axios API client
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- A modern browser (Chrome or Edge recommended for voice features)

---

### Option A: Use Ollama (Recommended — 100% Free & Offline)

Ollama runs AI models locally on your computer. No API key needed!

#### Step 1: Install Ollama

**macOS / Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from: https://ollama.ai/download

#### Step 2: Pull a model

```bash
# Recommended: fast and capable
ollama pull llama3.2

# Alternative: smaller, faster for low-end hardware
ollama pull phi3
```

#### Step 3: Start Ollama

```bash
ollama serve
```
Keep this terminal open! Ollama must be running for the app to work.

---

### Option B: Use HuggingFace (Free API Key)

1. Create a free account at https://huggingface.co
2. Get your API key at: https://huggingface.co/settings/tokens
3. Set `AI_MODEL_PROVIDER=huggingface` and `HF_API_KEY=your_key` in `backend/.env`

---

### Step 4: Setup Django Backend

```bash
# Navigate to backend
cd english-coach/backend

# Create Python virtual environment
python -m venv venv

# Activate it:
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Edit .env if needed (default settings work with Ollama)

# Run database migrations (creates SQLite file)
python manage.py migrate

# Start Django server
python manage.py runserver
```

Django will run at: **http://localhost:8000**

---

### Step 5: Setup React Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend
cd english-coach/frontend

# Install Node.js packages
npm install

# Create .env from example
cp .env.example .env

# Start development server
npm run dev
```

React will run at: **http://localhost:5173**

---

### Step 6: Open the App

Open your browser to: **http://localhost:5173**

> 💡 **Browser tip:** Chrome and Edge have the best Web Speech API support. Safari has limited support. Firefox does not support speech recognition.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_MODEL_PROVIDER` | `ollama` | AI provider: `ollama` or `huggingface` |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Ollama model name |
| `HF_API_KEY` | *(empty)* | HuggingFace API key (free) |
| `HF_MODEL` | `mistralai/Mistral-7B-Instruct-v0.3` | HuggingFace model |
| `SECRET_KEY` | dev key | Django secret key |
| `DEBUG` | `True` | Debug mode |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Django backend URL |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/` | Send message, get AI reply |
| `GET` | `/api/history/` | List all sessions |
| `GET` | `/api/history/?conversation_id=1` | Get specific session |
| `DELETE` | `/api/history/clear/` | Clear all history |

---

## 🎙️ Voice Features

- **Microphone button** → Click to start recording, click again to stop
- **Auto-play voice** → AI responses are read aloud automatically
- **Toggle voice** → Use the "Voice On/Off" button in the header to mute

> Voice features require microphone permission in your browser.
> Works best in **Google Chrome** or **Microsoft Edge**.

---

## 🛠️ Troubleshooting

### "Cannot connect to Ollama"
- Make sure `ollama serve` is running in a separate terminal
- Check that `OLLAMA_URL=http://localhost:11434` in your `.env`

### "Connection Error" in the app
- Make sure Django is running: `python manage.py runserver`
- Check for CORS errors in browser console

### Voice not working
- Use Chrome or Edge (Firefox doesn't support Web Speech API)
- Allow microphone access when prompted
- Make sure you're on `localhost` (not `127.0.0.1`) for Chrome

### Slow AI responses
- Ollama response time depends on your hardware. Try `phi3` (smaller model) for faster responses
- First response is slower as the model loads into memory

---

## 🔧 Development Tips

- **Django admin**: Create a superuser with `python manage.py createsuperuser`, then visit `http://localhost:8000/admin`
- **View SQLite data**: Use [DB Browser for SQLite](https://sqlitebrowser.org/) to inspect `backend/db.sqlite3`
- **Add a new AI provider**: Edit `backend/chat/views.py` and add a new function following the same pattern as `get_ai_response_ollama`

---

## 📄 License

MIT — free to use and modify.
