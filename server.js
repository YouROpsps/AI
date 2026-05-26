/**
 * AITeam Backend - Node.js + TiDB (MySQL) with in-memory fallback
 * Supports: Anthropic, OpenAI, Groq, NVIDIA NIM, Perplexity, Mistral, Together AI, Cohere, Custom
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve index.html at root
app.use(express.static(path.join(__dirname)));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

// ─── In-Memory Fallback Store ─────────────────────────────────────────────────
const memStore = {
  sessions: {},
  history: [],
  projects: [],
};

// ─── TiDB Connection ──────────────────────────────────────────────────────────
let db = null;
let dbReady = false;

async function initDB() {
  try {
    db = mysql.createPool({
      host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
      port: parseInt(process.env.DB_PORT || '4000'),
      user: process.env.DB_USER || '3xE2U1kiZ7Gdoz7.root',
      password: process.env.DB_PASSWORD || 'E8y7JIXdl68u9lNI',
      database: process.env.DB_NAME || 'sys',
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 10000,
    });

    // Test connection first
    await db.execute('SELECT 1');

    // Try creating tables — if user lacks CREATE permission, catch and continue
    const tables = [
      `CREATE TABLE IF NOT EXISTS aiteam_sessions (
        id VARCHAR(36) PRIMARY KEY,
        provider VARCHAR(50) NOT NULL,
        model VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS aiteam_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(36) NOT NULL,
        agent VARCHAR(50),
        agent_name VARCHAR(100),
        provider VARCHAR(50),
        prompt TEXT,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS aiteam_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(36) NOT NULL,
        requirements TEXT,
        architecture TEXT,
        design LONGTEXT,
        development LONGTEXT,
        review TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const sql of tables) {
      try { await db.execute(sql); } catch (e) {
        console.warn('⚠️  Table create skipped (permission):', e.message.slice(0, 60));
      }
    }

    // Check if tables actually exist and are usable
    await db.execute('SELECT 1 FROM aiteam_sessions LIMIT 1');
    dbReady = true;
    console.log('✅ TiDB connected & tables ready');
  } catch (e) {
    dbReady = false;
    console.warn('⚠️  TiDB unavailable, using in-memory storage:', e.message.slice(0, 80));
  }
}

// ─── DB Helpers with fallback ─────────────────────────────────────────────────
async function dbSaveSession(id, provider, model) {
  if (dbReady) {
    try {
      await db.execute('INSERT INTO aiteam_sessions (id, provider, model) VALUES (?,?,?)', [id, provider, model]);
      return;
    } catch (_) {}
  }
  memStore.sessions[id] = { id, provider, model, created_at: new Date().toISOString() };
}

async function dbGetSession(id) {
  if (dbReady) {
    try {
      const [rows] = await db.execute('SELECT * FROM aiteam_sessions WHERE id=?', [id]);
      if (rows.length) return rows[0];
    } catch (_) {}
  }
  return memStore.sessions[id] || null;
}

async function dbDeleteSession(id) {
  if (dbReady) {
    try { await db.execute('DELETE FROM aiteam_sessions WHERE id=?', [id]); return; } catch (_) {}
  }
  delete memStore.sessions[id];
}

async function dbSaveHistory(session_id, agent, agent_name, provider, prompt, result) {
  if (dbReady) {
    try {
      await db.execute(
        'INSERT INTO aiteam_history (session_id,agent,agent_name,provider,prompt,result) VALUES (?,?,?,?,?,?)',
        [session_id, agent, agent_name, provider, prompt.slice(0,500), result.slice(0,3000)]
      ); return;
    } catch (_) {}
  }
  memStore.history.push({ session_id, agent, agent_name, provider, prompt, result, created_at: new Date().toISOString() });
}

async function dbGetHistory(session_id) {
  if (dbReady) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM aiteam_history WHERE session_id=? ORDER BY created_at DESC LIMIT 50', [session_id]
      );
      return rows;
    } catch (_) {}
  }
  return memStore.history.filter(h => h.session_id === session_id).reverse().slice(0, 50);
}

async function dbSaveProject(session_id, requirements, architecture, design, development, review) {
  if (dbReady) {
    try {
      await db.execute(
        'INSERT INTO aiteam_projects (session_id,requirements,architecture,design,development,review) VALUES (?,?,?,?,?,?)',
        [session_id, requirements, architecture, design, development, review]
      ); return;
    } catch (_) {}
  }
  memStore.projects.push({ id: memStore.projects.length + 1, session_id, requirements, architecture, design, development, review, created_at: new Date().toISOString() });
}

// ─── AI Providers ─────────────────────────────────────────────────────────────
const AI_PROVIDERS = {
  anthropic: {
    name: 'Anthropic Claude', icon: '🧠',
    models: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    default_model: 'claude-3-5-sonnet-20241022', docs: 'https://docs.anthropic.com', key_prefix: 'sk-ant-',
  },
  openai: {
    name: 'OpenAI GPT', icon: '🤖',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    default_model: 'gpt-4o', docs: 'https://platform.openai.com/docs', key_prefix: 'sk-',
  },
  groq: {
    name: 'Groq (Ultra-Fast)', icon: '⚡',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    default_model: 'llama-3.3-70b-versatile', docs: 'https://console.groq.com', key_prefix: 'gsk_',
  },
  nvidia: {
    name: 'NVIDIA NIM', icon: '🎮',
    models: ['meta/llama-3.1-405b-instruct', 'meta/llama-3.1-70b-instruct', 'nvidia/nemotron-4-340b-instruct', 'mistralai/mixtral-8x22b-instruct-v0.1'],
    default_model: 'meta/llama-3.1-70b-instruct', docs: 'https://build.nvidia.com', key_prefix: 'nvapi-',
  },
  perplexity: {
    name: 'Perplexity AI', icon: '🔍',
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online'],
    default_model: 'llama-3.1-sonar-large-128k-online', docs: 'https://docs.perplexity.ai', key_prefix: 'pplx-',
  },
  mistral: {
    name: 'Mistral AI', icon: '🌪️',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'open-mistral-7b'],
    default_model: 'mistral-large-latest', docs: 'https://docs.mistral.ai', key_prefix: '',
  },
  together: {
    name: 'Together AI', icon: '🤝',
    models: ['meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', 'mistralai/Mixtral-8x7B-Instruct-v0.1', 'Qwen/Qwen2.5-72B-Instruct-Turbo'],
    default_model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo', docs: 'https://docs.together.ai', key_prefix: '',
  },
  cohere: {
    name: 'Cohere', icon: '🌊',
    models: ['command-r-plus', 'command-r', 'command-light'],
    default_model: 'command-r-plus', docs: 'https://cohere.com/docs', key_prefix: '',
  },
  custom: {
    name: 'Custom / OpenAI-Compatible', icon: '⚙️',
    models: ['custom-model'],
    default_model: 'custom-model', docs: '', key_prefix: '',
  },
};

// ─── Agents ───────────────────────────────────────────────────────────────────
const AGENTS = {
  architect: {
    name: '🏗️ Architect', role: 'Plans website structure & features',
    system_prompt: 'You are a senior solution architect. Create detailed website structure plans with sections, components, user journeys, and technical requirements. Be concise and specific.',
  },
  designer: {
    name: '🎨 Designer', role: 'Creates HTML/CSS code',
    system_prompt: 'You are an expert UI/UX designer. Generate complete, modern, responsive HTML and CSS. Focus on beautiful aesthetics, accessibility, and clean semantic markup. Output full working code.',
  },
  developer: {
    name: '⚡ Developer', role: 'Writes JavaScript functionality',
    system_prompt: 'You are an expert JavaScript developer. Write clean, efficient vanilla JS for interactivity, events, animations, and form handling. Output complete working code.',
  },
  reviewer: {
    name: '✅ QA Agent', role: 'Reviews and improves code quality',
    system_prompt: 'You are a code quality expert. Review HTML/CSS/JS for bugs, accessibility issues, performance problems, and best practices. Provide specific actionable feedback.',
  },
};

// ─── AI Call Router ───────────────────────────────────────────────────────────
async function callAI(provider, apiKey, model, systemPrompt, userPrompt, customEndpoint = null) {
  const msgs = [{ role: 'user', content: userPrompt }];

  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': apiKey, 'content-type': 'application/json', 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: 4096, system: systemPrompt, messages: msgs }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
    return data.content[0].text;
  }

  if (provider === 'cohere') {
    const res = await fetch('https://api.cohere.ai/v2/chat', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, message: userPrompt, preamble: systemPrompt, max_tokens: 4096 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data.text || data.message?.content?.[0]?.text || JSON.stringify(data);
  }

  // OpenAI-compatible providers
  const endpoints = {
    openai: 'https://api.openai.com/v1/chat/completions',
    groq: 'https://api.groq.com/openai/v1/chat/completions',
    nvidia: 'https://integrate.api.nvidia.com/v1/chat/completions',
    perplexity: 'https://api.perplexity.ai/chat/completions',
    mistral: 'https://api.mistral.ai/v1/chat/completions',
    together: 'https://api.together.xyz/v1/chat/completions',
    custom: customEndpoint || 'http://localhost:11434/v1/chat/completions',
  };

  const url = endpoints[provider];
  if (!url) throw new Error(`Unknown provider: ${provider}`);

  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'system', content: systemPrompt }, ...msgs] }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `HTTP ${res.status}`);
  return data.choices[0].message.content;
}

async function validateKey(provider, apiKey, model, customEndpoint) {
  try {
    await callAI(provider, apiKey, model, 'You are a test assistant.', 'Reply with the single word: OK', customEndpoint);
    return true;
  } catch (e) {
    console.error('Validation error:', e.message);
    return false;
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/health', (_, res) => res.json({ status: 'ok', db: dbReady ? 'tidb' : 'memory', service: 'AITeam v2' }));

app.get('/api/providers', (_, res) => {
  res.json({ providers: Object.entries(AI_PROVIDERS).map(([id, p]) => ({ id, ...p })) });
});

app.get('/api/agents', (_, res) => {
  res.json({ agents: Object.entries(AGENTS).map(([id, a]) => ({ id, name: a.name, role: a.role })) });
});

app.post('/api/validate-key', async (req, res) => {
  const { provider, api_key, model, custom_endpoint } = req.body;
  if (!provider || !AI_PROVIDERS[provider]) return res.status(400).json({ valid: false, error: 'Invalid provider' });
  if (!api_key) return res.status(400).json({ valid: false, error: 'API key required' });

  const resolvedModel = model || AI_PROVIDERS[provider].default_model;
  const valid = await validateKey(provider, api_key, resolvedModel, custom_endpoint);
  if (!valid) return res.status(401).json({ valid: false, error: `Invalid API key for ${AI_PROVIDERS[provider].name}` });

  const session_id = uuidv4();
  await dbSaveSession(session_id, provider, resolvedModel);

  res.json({ valid: true, session_id, provider, model: resolvedModel, message: `✅ Connected to ${AI_PROVIDERS[provider].name}!` });
});

app.post('/api/call-agent', async (req, res) => {
  const { session_id, agent, prompt, api_key, provider, model, custom_endpoint } = req.body;
  if (!agent || !AGENTS[agent]) return res.status(400).json({ error: 'Invalid agent' });
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  if (!api_key) return res.status(400).json({ error: 'api_key required' });

  let prov = provider, mdl = model;
  if (session_id) {
    const sess = await dbGetSession(session_id);
    if (sess) { prov = prov || sess.provider; mdl = mdl || sess.model; }
  }

  try {
    const agentDef = AGENTS[agent];
    const result = await callAI(prov, api_key, mdl, agentDef.system_prompt, prompt, custom_endpoint);
    if (session_id) await dbSaveHistory(session_id, agent, agentDef.name, prov, prompt, result);
    res.json({ success: true, agent, result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/create-website', async (req, res) => {
  const { session_id, requirements, api_key, provider, model, custom_endpoint } = req.body;
  if (!requirements) return res.status(400).json({ error: 'Requirements required' });
  if (!api_key) return res.status(400).json({ error: 'api_key required' });

  let prov = provider, mdl = model;
  if (session_id) {
    const sess = await dbGetSession(session_id);
    if (sess) { prov = prov || sess.provider; mdl = mdl || sess.model; }
  }

  try {
    const call = (agentId, prompt) => callAI(prov, api_key, mdl, AGENTS[agentId].system_prompt, prompt, custom_endpoint);

    const architecture = await call('architect', `Plan the structure for this website: ${requirements}`);
    const design = await call('designer', `Based on this plan:\n${architecture.slice(0, 800)}\n\nCreate complete HTML/CSS for: ${requirements}`);
    const development = await call('developer', `Add JavaScript interactivity:\n${design.slice(0, 800)}\n\nRequirements: ${requirements}`);
    const review = await call('reviewer', `Review this code:\nHTML/CSS: ${design.slice(0, 500)}\nJS: ${development.slice(0, 500)}`);

    const results = { architecture, design, development, review };
    if (session_id) await dbSaveProject(session_id, requirements, architecture, design, development, review);

    res.json({ success: true, results, provider: prov, model: mdl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/history/:session_id', async (req, res) => {
  try {
    res.json({ history: await dbGetHistory(req.params.session_id) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/clear-session/:id', async (req, res) => {
  await dbDeleteSession(req.params.id);
  res.json({ message: 'Session cleared' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
🤖 AITeam v2 running → http://localhost:${PORT}
📦 Storage: ${dbReady ? 'TiDB Cloud' : 'In-Memory (DB unavailable)'}
🌐 Open http://localhost:${PORT} in your browser
    `);
  });
});