# 🤖 AITeam — Multi-Provider AI Website Builder

> Built with Node.js + TiDB Cloud · Supports 9 AI providers · GitHub Portfolio Project

![Status](https://img.shields.io/badge/Status-Beta-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-green)

---

## What is AITeam?

AITeam is a full-stack AI platform where **4 specialized AI agents** collaborate to build complete websites. You describe what you want; the team plans, designs, codes, and reviews it.

| Agent | Role |
|---|---|
| 🏗️ Architect | Plans structure & features |
| 🎨 Designer | Creates HTML/CSS |
| ⚡ Developer | Writes JavaScript |
| ✅ QA Agent | Reviews & improves code |

---

## Supported AI Providers

| Provider | Icon | Get Key |
|---|---|---|
| Anthropic Claude | 🧠 | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI GPT | 🤖 | [platform.openai.com](https://platform.openai.com) |
| Groq (ultra-fast) | ⚡ | [console.groq.com](https://console.groq.com) |
| **NVIDIA NIM** | 🎮 | [build.nvidia.com](https://build.nvidia.com) |
| Perplexity AI | 🔍 | [perplexity.ai/settings](https://perplexity.ai/settings) |
| Mistral AI | 🌪️ | [console.mistral.ai](https://console.mistral.ai) |
| Together AI | 🤝 | [api.together.xyz](https://api.together.xyz) |
| Cohere | 🌊 | [dashboard.cohere.com](https://dashboard.cohere.com) |
| Custom / OpenAI-compatible | ⚙️ | Your own endpoint (Ollama, LM Studio, etc.) |

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/YouROpsps/AI.git
cd ai
npm install
```

### 2. Configure (optional)

```bash
cp .env.example .env
# edit .env if you want to change the DB credentials
```

### 3. Run

```bash
npm start
# Server starts on http://localhost:5000
```

### 4. Open

Open `index.html` in your browser, or serve it:

```bash
npx serve . -p 8000
# visit http://localhost:8000
```

### 5. Connect

1. Pick an AI provider (e.g. **NVIDIA NIM**)
2. Select a model
3. Paste your API key
4. Click **Connect & Validate**
5. Describe a website → **Build with AI Team**

---

## Project Structure

```
aiteam/
├── server.js          # Express backend (Node.js)
├── index.html         # Frontend dashboard
├── package.json
├── .env.example       # Environment config template
└── README.md
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/providers` | List all AI providers |
| GET | `/api/agents` | List all agents |
| POST | `/api/validate-key` | Validate API key & create session |
| POST | `/api/create-website` | Full website generation (4 agents) |
| POST | `/api/call-agent` | Call a single agent |
| GET | `/api/history/:session_id` | Session history (from TiDB) |
| GET | `/api/projects/:session_id` | Saved projects |
| POST | `/api/clear-session/:id` | End session |

---

## Database (TiDB Cloud)

Projects and history are persisted in **TiDB Cloud** (MySQL-compatible):

- `sessions` — active sessions with provider/model info
- `history` — every agent call logged
- `projects` — full website outputs saved

---

## Deploy

### Render / Railway / Fly.io

```bash
# Set env vars in dashboard, then:
npm start
```

### Docker

```bash
docker build -t aiteam .
docker run -p 5000:5000 aiteam
```

### Replit

Import repo → add `.env` secrets → Run `npm start`

---

## Adding a New Provider

In `server.js`, add to `AI_PROVIDERS`:

```js
mynewai: {
  name: 'My New AI',
  icon: '🆕',
  models: ['model-v1'],
  default_model: 'model-v1',
  docs: 'https://mynewai.com/docs',
  key_prefix: '',
},
```

Then add a case in `callAI()` if it uses a non-standard API format, or reuse the OpenAI-compatible block.

---

*Made with ❤️ at age 15 | Always learning 🚀*
