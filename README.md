<div align="center">

<img src="https://i.pinimg.com/736x/9a/d1/f9/9ad1f90c20367df906dc8fb9a93c4e2d.jpg" width="120" alt="Pom-Pom happy" />

# 🚂 Pom-Pom

> <img src="https://i.pinimg.com/736x/1c/54/68/1c5468ee0a6dfb942163409e1a3ebbc3.jpg" width="60" align="left" alt="Pom-Pom embarrassed" /> *"Not to brag or anything, but Pom-Pom knows every passenger on this train!"* 🐾

<br/>

A web app for Honkai Star Rail players to get team building and relic advice through a conversational AI interface. Ask about any character, get recommendations tailored to your roster.

**🌐 Live demo:** [hsr-buddy.vercel.app](https://hsr-buddy.vercel.app)
**📬 Contact:** [azan.sikder1@gmail.com](mailto:azan.sikder1@gmail.com)

</div>

---

## <img src="https://i.pinimg.com/736x/08/76/95/087695e76226c12c1fb4bfd6db4346e0.jpg" width="40" align="center" alt="Pom-Pom question" /> What it does

You type in a question like *"I have Acheron and Mortenax Blade, who should I run with them?"* and Pom-Pom gives you a breakdown of team compositions, relic sets, and playstyle tips. It knows the current roster and pulls in relevant character data based on what you ask about.

---

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, deployed on Vercel |
| Backend | Node.js + Express, deployed on Railway |
| AI | Claude API (Anthropic) with dynamic context injection |
| Data | Community-sourced character and relic data, updated per patch cycle |

---

## <img src="https://i.pinimg.com/736x/5f/89/59/5f895945aeaaa109c753c5c4e55c5693.jpg" width="40" align="center" alt="Pom-Pom teaching" /> How it works

The React frontend sends your message to an Express proxy server, which injects relevant HSR character data into the prompt before forwarding it to the Claude API. The proxy keeps the API key secure server-side and handles CORS between the two deployed services.

Character data lives in a structured JSON file. When you mention a character, the server pulls their entry plus their recommended teammates and injects all of it as context — so the AI has accurate, up-to-date game data to reason from rather than relying on potentially outdated training data.

```
User message
    ↓
React frontend  →  Express proxy  →  Claude API
                       ↑
               characters.json
          (context injected per query)
```

---

## 🚀 Running locally

```bash
# Clone the repo
git clone https://github.com/Axxaan/hsr-buddy.git

# Start the backend
cd server
npm install
npm run dev

# Start the frontend (new terminal)
cd client
npm install
npm run dev
```

You'll need an Anthropic API key in `server/.env`:

```
ANTHROPIC_API_KEY=your_key_here
```

---

<div align="center">

> *"La la la la la~ All aboard the Astral Express, Trailblazer!"* 🌟

</div>
