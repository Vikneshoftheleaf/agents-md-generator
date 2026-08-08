# 🚀 AGENTS.md Generator — AI-Powered Agent Instructions for GitHub Repos

> **Hackathon Submission Project**  
> Streamlining context and instruction generation for AI Coding Agents using **Gemini 3.5 Flash** and **Next.js**.

---

## 💡 Inspiration & Problem Statement

AI coding tools and agents (such as Claude Code, Cursor, Copilot, Windsurf, and Gemini CLI) have transformed modern software engineering. However, for an agent to work effectively in a codebase, it requires structured context about design patterns, tech stack, build commands, and coding conventions — usually documented in an `AGENTS.md` file.

Manually writing an `AGENTS.md` file for every repository is time-consuming, tedious, and easy to get wrong.

**AGENTS.md Generator** solves this problem instantly! Simply paste any public GitHub repository link, and our application fetches key repository files, analyzes the architecture, and uses **Gemini 3.5 Flash** to generate a complete, high-quality `AGENTS.md` file streamed live to your browser.

---

## ✨ Features

- ⚡ **Real-Time Streaming Generation**: Watch your `AGENTS.md` file get authored live via Server-Sent Events (SSE) powered by **Gemini 3.5 Flash**.
- 🧠 **Smart Context Selection**: Automatically prioritizes essential configuration files (`package.json`, `Cargo.toml`, `pyproject.toml`, `Dockerfile`, etc.), documentation (`README.md`, `CONTRIBUTING.md`), and key source code entry points while ignoring noise (`node_modules`, lock files, binaries).
- 🎨 **Sleek Dark Glassmorphism UI**: Beautiful, responsive, modern interface built with Tailwind CSS v4 and micro-animations.
- 👁️ **Dual View Mode**: Seamlessly switch between **Raw Markdown** and **Rendered Preview**.
- 📋 **Copy & Download**: Instant one-click clipboard copying or direct `.md` file download.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **AI Model**: Google **Gemini 3.5 Flash** (`@google/generative-ai`)
- **API Integration**: GitHub REST API v3
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design System
- **Rendering**: `react-markdown`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- A Gemini API Key (Get one free at [Google AI Studio](https://aistudio.google.com/apikey))

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vikneshoftheleaf/agents-md-generator.git
   cd agent-md-file-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Required: Your Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional: GitHub Personal Access Token (Increases rate limit from 60 to 5000 requests/hr)
   GITHUB_TOKEN=
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ How It Works

```
1. User enters GitHub Repo URL (e.g., https://github.com/owner/repo)
                  │
                  ▼
2. API route parses owner/repo & queries GitHub REST API
   ├── Fetches Repository Metadata (Language, Description, Topics)
   ├── Scans Recursive Git Tree
   └── Selects Key Files (Configs, READMEs, Entrypoints, Core Modules)
                  │
                  ▼
3. Constructs Context Prompt & Streams Gemini 3.5 Flash Response
                  │
                  ▼
4. Frontend displays real-time progress steps & streams markdown output
                  │
                  ▼
5. User copies or downloads the ready-to-use AGENTS.md file!
```

---

## 🔮 Future Roadmap

- [ ] Support for Private Repositories via GitHub OAuth
- [ ] Custom prompt controls (e.g., focus on testing guidelines, security rules, or specific agent formats)
- [ ] Direct Pull Request creation to add `AGENTS.md` directly to the target repository
- [ ] Multi-file export (`AGENTS.md`, `.cursorrules`, `CLAUDE.md`)

---

## 📄 License

[MIT](LICENSE) © 2026
