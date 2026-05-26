\# AITeam Setup Guide



\## System Requirements



\- Python 3.8 or higher

\- pip (Python package manager)

\- Modern web browser (Chrome, Firefox, Safari, Edge)

\- Anthropic API key (free credits available)



\## Step-by-Step Setup



\### 1. Get Your API Key



1\. Go to https://console.anthropic.com

2\. Sign up or log in

3\. Navigate to "API Keys"

4\. Create a new API key

5\. Copy it somewhere safe

6\. The key will look like: `sk-ant-xxxxxxxxxxxxx`



\### 2. Install Dependencies



```bash

\# Navigate to project folder

cd aiteam



\# Install required Python packages

pip install -r requirements.txt

```



Expected output:

```

Successfully installed anthropic-0.28.0 flask-3.0.0 flask-cors-4.0.0

```



\### 3. Start the Backend



```bash

python backend.py

```



You should see:

```

🤖 AITeam Backend Starting...



Make sure you have Flask and required packages installed:

pip install flask flask-cors anthropic



&nbsp;\* Running on http://0.0.0.0:5000

&nbsp;\* Debug mode: on

```



Keep this terminal window open!



\### 4. Open Frontend in Browser



\- \*\*Option A (Easiest):\*\* Just double-click `index.html`

\- \*\*Option B (Better):\*\* Run a local server:

&nbsp; ```bash

&nbsp; # In a new terminal, in the project folder

&nbsp; python -m http.server 8000

&nbsp; ```

&nbsp; Then visit: http://localhost:8000



\### 5. Connect Your API Key



1\. In the frontend, you'll see "Connect to Backend" section

2\. Paste your Anthropic API key

3\. Make sure Backend URL is: `http://localhost:5000`

4\. Click "Connect \& Validate"

5\. You should see ✅ "Connected! Team ready to work."



\### 6. Create Your First Website!



1\. In the "Create Website" section, describe what you want:

&nbsp;  ```

&nbsp;  A modern dark portfolio website for a web developer with:

&nbsp;  - Beautiful hero section

&nbsp;  - Projects showcase

&nbsp;  - Skills list

&nbsp;  - Contact form

&nbsp;  - Responsive design

&nbsp;  ```



2\. Click "🚀 Let Team Create Website"

3\. Wait 30-60 seconds

4\. Watch your AI team create the website!

5\. Get: Architecture, HTML/CSS, JavaScript, and QA review



---



\## Troubleshooting



\### Error: "Command 'python' not found"



You might have Python 3 installed as `python3`:



```bash

python3 --version

pip3 install -r requirements.txt

python3 backend.py

```



\### Error: "Cannot connect to backend"



\*\*Check 1:\*\* Is Flask server running?

\- Terminal should show: `\* Running on http://0.0.0.0:5000`

\- If not, go back and run `python backend.py` again



\*\*Check 2:\*\* Is the URL correct?

\- Backend URL should be: `http://localhost:5000`

\- Not: `http://127.0.0.1:5000` (might not work with some systems)



\*\*Check 3:\*\* CORS issues?

\- Try clearing browser cache

\- Try in a different browser

\- Try in incognito/private window



\### Error: "Invalid API key"



\- Make sure you copied the entire key (starts with `sk-ant-`)

\- Don't have any extra spaces

\- Create a fresh API key at https://console.anthropic.com

\- Check your Anthropic account has credits



\### Error: "API Error: 401 Unauthorized"



\- Your API key is invalid or expired

\- Generate a new key

\- Or your API account might be out of credits



\### Error: "ModuleNotFoundError: No module named 'flask'"



Run this:

```bash

pip install -r requirements.txt

```



If that doesn't work:

```bash

pip install flask flask-cors anthropic

```



\### Requests are very slow (30+ seconds)



That's normal! The AI is thinking and generating code. Be patient! 🤖



\### HTML output doesn't look right



That's expected! The AI generates raw code. You might need to refine it. Try:

1\. Ask Designer Agent specifically to improve styling

2\. Give more detailed descriptions in requirements

3\. Ask QA Agent to review and suggest improvements



---



\## Tips \& Tricks



\### 1. Be Specific with Requirements



❌ Bad: "Create a website"

✅ Good: "Create a modern dark-themed e-commerce product page with hero image, product details, reviews section, and add-to-cart button. Use blue and white colors."



\### 2. Copy and Use the Code



All generated HTML, CSS, and JS can be copied directly from the output!

1\. Click "Copy" button on any result

2\. Paste into your own project

3\. Customize as needed



\### 3. Ask for Specific Things



Instead of full website, try:

\- "Design a responsive navigation bar with dropdown menu"

\- "Create a contact form with email validation"

\- "Build a card-based grid layout for products"

\- "Make a dark mode toggle button"



\### 4. Iterate and Improve



1\. Generate a website

2\. Review the QA feedback

3\. Ask specific agents to improve parts

4\. Keep refining until you like it



\### 5. Save Your Work



The frontend doesn't save automatically! You should:

\- Copy generated code to your own editor

\- Save in GitHub or your computer

\- Take screenshots of the architecture plan



---



\## Common Use Cases



\### Use Case 1: Learn Web Development

1\. Generate a website

2\. Study the HTML/CSS/JS code

3\. Modify it to learn

4\. Generate another version to compare



\### Use Case 2: Quickly Create Website

1\. Describe what you need

2\. Generate with AITeam

3\. Use the code directly

4\. Make small tweaks



\### Use Case 3: Get Design Ideas

1\. Ask Designer Agent for multiple styles

2\. Describe the same thing differently

3\. See variations

4\. Pick your favorite



\### Use Case 4: Learn Prompting

1\. Try different descriptions

2\. See how wording affects output

3\. Learn what works best

4\. Practice AI prompting skills



---



\## Customization



\### Change Agent Behavior



In `backend.py`, modify agent system prompts:



```python

team\_agents\['designer']\['system\_prompt'] = 'You are a minimalist designer...'

```



\### Add Your Own Agents



In `backend.py`:



```python

team\_agents\['seo\_agent'] = {

&nbsp;   'name': 'SEO Expert',

&nbsp;   'role': 'Optimizes for search engines',

&nbsp;   'system\_prompt': 'You are an SEO expert...'

}

```



\### Change UI Theme



In `index.html`, modify CSS variables:



```css

:root {

&nbsp;   --primary: #1a1a1a;    /\* Dark background \*/

&nbsp;   --accent: #ff6b6b;     /\* Red accent \*/

&nbsp;   --success: #51cf66;    /\* Green success \*/

}

```



---



\## Next Steps



\### Learning Path



1\. ✅ Get it running locally

2\. ✅ Create your first website

3\. 📚 Read through `backend.py` to understand how it works

4\. 🎨 Customize the frontend or agent prompts

5\. 🚀 Deploy to cloud (Replit, Heroku, etc.)

6\. 🤝 Share with friends!



\### Advanced Options



\- Deploy to cloud server

\- Add database to save projects

\- Create user authentication

\- Build mobile version

\- Integrate image generation

\- Add more specialized agents



---



\## Common Questions



\*\*Q: Can I use this commercially?\*\*

A: It depends on your Anthropic API plan. Check their terms. You also need to decide on your own license.



\*\*Q: How much does it cost?\*\*

A: Anthropic offers free credits. After that, pricing is per token used. Check https://anthropic.com/pricing



\*\*Q: Can I deploy this?\*\*

A: Yes! See the README for deployment options (Replit, Heroku, etc.)



\*\*Q: Is my API key safe?\*\*

A: You provide it through the frontend, but for production, use environment variables and HTTPS.



\*\*Q: Can multiple people use one API key?\*\*

A: Technically yes, but they all share the same rate limit and usage quota. Not recommended.



\*\*Q: How good is the generated code?\*\*

A: Pretty good! It's production-ready for simple websites. Complex apps might need tweaking.



---



\## File Structure Explained



```

aiteam/

├── backend.py              # Flask server

│   └── Contains: API endpoints, AI team logic, agent definitions

│

├── index.html              # Frontend dashboard

│   └── Contains: UI, styling, JavaScript for interaction

│

├── requirements.txt        # Python packages needed

│   └── Lists: flask, flask-cors, anthropic

│

└── README.md              # Full documentation

```



---



\## Getting Help



1\. \*\*Check troubleshooting section above\*\*

2\. \*\*Read the full README.md\*\*

3\. \*\*Check Flask error messages in terminal\*\*

4\. \*\*Check browser console for errors (F12)\*\*

5\. \*\*Ask in GitHub issues\*\*

6\. \*\*Post on Anthropic community forum\*\*



---



\*\*You're all set! Enjoy building with AITeam! 🚀\*\*



Questions? Having issues? Share your feedback!

