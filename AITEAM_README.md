\# 🤖 AITeam - Website Creation Platform



A powerful full-stack AI team platform that orchestrates multiple AI agents to collaboratively build websites. Built with Flask backend and modern frontend, powered by Anthropic's Claude API.



!\[Status Badge](https://img.shields.io/badge/Status-Beta-blue)

!\[Python](https://img.shields.io/badge/Python-3.8%2B-green)

!\[License](https://img.shields.io/badge/License-MIT-green)



---



\## 🎯 What is AITeam?



AITeam is a website creation platform where \*\*4 specialized AI agents\*\* work together to build websites:



\- 🏗️ \*\*Architect Agent\*\* - Plans website structure and features

\- 🎨 \*\*Designer Agent\*\* - Creates beautiful HTML/CSS code

\- ⚡ \*\*Developer Agent\*\* - Writes interactive JavaScript

\- ✅ \*\*QA Agent\*\* - Reviews and improves code



You describe what you want, and the team collaborates to build it. It's like having a freelance web development team in your pocket!



---



\## 🌟 Features



✅ \*\*Multi-Agent Collaboration\*\* - Agents work together with specialized roles

✅ \*\*API Key Management\*\* - Securely handle your own API key (frontend)

✅ \*\*Real-time Processing\*\* - Watch agents work in real-time

✅ \*\*Session Management\*\* - Maintain context across multiple requests

✅ \*\*Activity Tracking\*\* - See full history of agent interactions

✅ \*\*Direct Agent Access\*\* - Call specific agents for custom tasks

✅ \*\*Beautiful Dashboard\*\* - Modern, responsive UI

✅ \*\*Production Ready\*\* - Error handling, validation, security



---



\## 🚀 Quick Start



\### Prerequisites

\- Python 3.8 or higher

\- Node.js/npm (optional, for local development)

\- Anthropic API key (get free credits at https://console.anthropic.com)



\### Installation



1\. \*\*Clone the repository\*\*

```bash

git clone https://github.com/yourusername/aiteam.git

cd aiteam

```



2\. \*\*Install Python dependencies\*\*

```bash

pip install -r requirements.txt

```



3\. \*\*Start the backend server\*\*

```bash

python backend.py

```



You should see:

```

🤖 AITeam Backend Starting...

&nbsp;\* Running on http://0.0.0.0:5000

```



4\. \*\*Open the frontend\*\*

\- Simply open `index.html` in your browser

\- Or serve it with: `python -m http.server 8000`

\- Visit: `http://localhost:8000`



5\. \*\*Connect your API key\*\*

\- Paste your Anthropic API key in the frontend

\- Click "Connect \& Validate"

\- See the status change to "Connected" ✅



---



\## 💡 Usage Examples



\### Example 1: Create a Portfolio Website

```

Describe what you want:

"A modern dark-themed portfolio website for a software engineer. 

Include hero section with name and bio, projects showcase in a grid layout, 

skills section with icons, and a contact form. Make it responsive and minimalist."



The team will:

1\. Architect creates the structure and plan

2\. Designer builds beautiful HTML/CSS

3\. Developer adds interactions (smooth scroll, form handling)

4\. QA reviews and suggests improvements

```



\### Example 2: Ask a Specific Agent

```

Select: Designer Agent

Prompt: "Create an elegant dark mode CSS for a SaaS landing page"



The designer will provide optimized CSS code you can use immediately!

```



---



\## 📁 Project Structure



```

aiteam/

├── backend.py                 # Flask server with AI team logic

├── index.html                 # Frontend dashboard

├── requirements.txt           # Python dependencies

├── README.md                  # This file

├── .gitignore                 # Git ignore rules

└── .env.example              # Environment variables template

```



---



\## 🔌 API Endpoints



\### Core Endpoints



\*\*POST `/api/validate-key`\*\*

\- Validate Anthropic API key and create session

\- Returns: `session\_id`



\*\*POST `/api/create-website`\*\*

\- Orchestrate team to create website

\- Body: `{ "session\_id": "...", "requirements": "..." }`

\- Returns: `{ architecture, design, development, review }`



\*\*POST `/api/call-agent`\*\*

\- Call specific agent with custom prompt

\- Body: `{ "session\_id": "...", "agent": "designer", "prompt": "..." }`

\- Returns: Agent's response



\*\*GET `/api/agents`\*\*

\- Get list of available agents



\*\*GET `/api/history/<session\_id>`\*\*

\- Get all interactions in session



\*\*GET `/api/project/<session\_id>`\*\*

\- Get current project details



---



\## 🔐 Security Notes



⚠️ \*\*Important for Production:\*\*



1\. \*\*Never commit API keys\*\* - Use environment variables

2\. \*\*Use HTTPS\*\* - When deploying, enable SSL/TLS

3\. \*\*Rate limiting\*\* - Implement rate limits on your backend

4\. \*\*CORS\*\* - Currently allows all origins (change in production)

5\. \*\*Session timeout\*\* - Implement session expiration



\### Production Setup Example



```python

\# backend.py

app.config\['SESSION\_COOKIE\_SECURE'] = True

app.config\['SESSION\_COOKIE\_HTTPONLY'] = True

app.config\['CORS\_ORIGINS'] = \["https://yourdomain.com"]

```



---



\## 🎓 Learning Path



\*\*For Beginners:\*\*

1\. Run the app locally

2\. Try creating simple websites first

3\. Look at the HTML/CSS output to learn

4\. Modify outputs and experiment

5\. Try specific agent prompts



\*\*For Intermediate:\*\*

1\. Read through `backend.py` to understand API orchestration

2\. Customize agent system prompts

3\. Add new agent types (e.g., "SEO Agent", "Copywriter")

4\. Modify frontend to add new features



\*\*For Advanced:\*\*

1\. Deploy to cloud (Heroku, Replit, AWS)

2\. Add database to store projects

3\. Implement user authentication

4\. Build mobile app version

5\. Add image generation integration



---



\## 🚢 Deployment



\### Deploy on Replit (Easiest)



1\. Go to https://replit.com

2\. Click "Import from GitHub"

3\. Paste this repo URL

4\. Click "Import"

5\. In Secrets, add `ANTHROPIC\_API\_KEY`

6\. Run `python backend.py`

7\. Share the Repl URL!



\### Deploy on Heroku



```bash

\# Create Procfile

echo "web: python backend.py" > Procfile



\# Create runtime.txt

echo "python-3.11.0" > runtime.txt



\# Deploy

git push heroku main

```



\### Deploy on DigitalOcean / AWS



```bash

\# Install Gunicorn

pip install gunicorn



\# Run with Gunicorn

gunicorn -w 4 backend:app

```



---



\## 🐛 Troubleshooting



\### "Cannot connect to backend"

\- Make sure Flask server is running: `python backend.py`

\- Check backend URL in frontend matches (default: http://localhost:5000)

\- Check CORS is enabled (should be by default)



\### "Invalid API key"

\- Double-check your API key is copied completely

\- Make sure it starts with `sk-ant-`

\- Create a new key at https://console.anthropic.com



\### "API Error: Rate Limited"

\- You've hit Anthropic's rate limit

\- Wait a few minutes before trying again

\- Consider upgrading your API tier



\### "Agent timeout"

\- Complex requests can take 30+ seconds

\- Be patient, the AI is thinking!

\- Try simpler, shorter prompts



---



\## 📊 How It Works



```

1\. User enters website requirements

&nbsp;           ↓

2\. Architect Agent creates structured plan

&nbsp;           ↓

3\. Designer Agent builds HTML/CSS from plan

&nbsp;           ↓

4\. Developer Agent adds JavaScript interactivity

&nbsp;           ↓

5\. QA Agent reviews everything and gives feedback

&nbsp;           ↓

6\. User gets complete website code

```



Each agent has a specialized system prompt that guides its behavior:

\- \*\*Architect\*\*: Strategic thinking, planning, structure

\- \*\*Designer\*\*: Visual design, HTML semantics, responsiveness

\- \*\*Developer\*\*: JavaScript, interactivity, performance

\- \*\*QA\*\*: Testing, accessibility, best practices



---



\## 🎨 Customization



\### Add New Agent Type



In `backend.py`:



```python

team\_agents\['copywriter'] = {

&nbsp;   'name': 'Copywriter Agent',

&nbsp;   'role': 'Creates compelling website copy',

&nbsp;   'system\_prompt': 'You are a professional copywriter...'

}

```



\### Modify Agent Behavior



Change the `system\_prompt` for any agent to adjust its focus:



```python

team\_agents\['designer']\['system\_prompt'] = 'You are a minimalist UI designer...'

```



\### Change Color Scheme



In `index.html`, modify CSS variables:



```css

:root {

&nbsp;   --primary: #0f172a;      /\* Background \*/

&nbsp;   --accent: #3b82f6;       /\* Buttons \*/

&nbsp;   --success: #10b981;      /\* Success messages \*/

}

```



---



\## 📈 What You Can Build



With AITeam, you can generate:



✅ Portfolio websites

✅ Landing pages

✅ E-commerce product pages

✅ SaaS dashboards

✅ Documentation sites

✅ Blog templates

✅ Event pages

✅ Corporate websites



Each one is fully functional, responsive, and production-ready!



---



\## 🤝 Contributing



Found a bug or want to add a feature?



1\. Fork the repository

2\. Create feature branch: `git checkout -b feature/amazing-feature`

3\. Commit changes: `git commit -m 'Add amazing feature'`

4\. Push to branch: `git push origin feature/amazing-feature`

5\. Open a Pull Request



---



\## 📝 License



This project is licensed under the MIT License - see LICENSE file for details.



---



\## 🎓 Credits



\- Built with \[Flask](https://flask.palletsprojects.com/)

\- Powered by \[Anthropic's Claude API](https://anthropic.com)

\- Designed with modern web standards



---



\## 📞 Support



\- 📧 Email: support@example.com

\- 🐛 Issues: https://github.com/yourusername/aiteam/issues

\- 💬 Discussions: https://github.com/yourusername/aiteam/discussions



---



\## 🚀 Roadmap



\- \[ ] User authentication \& project saving

\- \[ ] Image generation integration

\- \[ ] Mobile app version

\- \[ ] Team collaboration features

\- \[ ] Advanced prompt templates

\- \[ ] Website preview in editor

\- \[ ] Export to different frameworks

\- \[ ] Deployment to GitHub Pages / Vercel



---



\## 🎯 Future Ideas



\*\*Short term:\*\*

\- Add website preview/iframe

\- Save projects to localStorage

\- Export as ZIP file

\- Add more agent types



\*\*Medium term:\*\*

\- User accounts with database

\- Real-time collaboration

\- Version history

\- Team workspaces



\*\*Long term:\*\*

\- Mobile app

\- AI-powered SEO optimization

\- A/B testing suggestions

\- Analytics integration



---



\*\*Made with ❤️ at age 15 | Building the future with AI\*\* 🚀



Last updated: 2024 | Version: 1.0.0

