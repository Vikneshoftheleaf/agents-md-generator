import { GoogleGenerativeAI } from "@google/generative-ai";

// Files we always want to fetch if they exist
const PRIORITY_FILES = [
  "README.md",
  "readme.md",
  "README.rst",
  "package.json",
  "Cargo.toml",
  "pyproject.toml",
  "setup.py",
  "setup.cfg",
  "go.mod",
  "go.sum",
  "Gemfile",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "Makefile",
  "CMakeLists.txt",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  ".github/workflows",
  "tsconfig.json",
  "jsconfig.json",
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
  "vite.config.js",
  "vite.config.ts",
  "webpack.config.js",
  "tailwind.config.js",
  "tailwind.config.ts",
  ".eslintrc.json",
  "eslint.config.mjs",
  ".prettierrc",
  "CONTRIBUTING.md",
  "ARCHITECTURE.md",
  "AGENTS.md",
  "CLAUDE.md",
  "COPILOT.md",
  ".cursorrules",
  ".clinerules",
  "DEVELOPMENT.md",
  "LICENSE",
];

// File extensions to include when sampling source files
const SOURCE_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".py", ".rs", ".go", ".java", ".kt",
  ".rb", ".php", ".cs", ".cpp", ".c", ".h", ".hpp", ".swift", ".dart",
  ".vue", ".svelte", ".astro", ".md", ".mdx", ".sql", ".sh", ".bash",
  ".yml", ".yaml", ".toml", ".json", ".xml", ".graphql", ".gql",
  ".prisma", ".proto",
]);

// Directories/patterns to always skip
const SKIP_PATTERNS = [
  "node_modules", ".git", "dist", "build", ".next", "__pycache__",
  ".cache", "coverage", ".nyc_output", "vendor", "target/debug",
  "target/release", ".idea", ".vscode", ".env", "package-lock.json",
  "yarn.lock", "pnpm-lock.yaml", "Cargo.lock", "Gemfile.lock",
  "poetry.lock", "composer.lock", ".DS_Store", "thumbs.db",
];

function shouldSkipPath(path) {
  const lower = path.toLowerCase();
  return SKIP_PATTERNS.some(
    (p) => lower.includes(`/${p}`) || lower.includes(`/${p}/`) || lower === p || lower.endsWith(`/${p}`)
  );
}

function getExtension(filename) {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : "";
}

function parseGitHubUrl(url) {
  // Supports: https://github.com/owner/repo, github.com/owner/repo, etc.
  const cleaned = url.trim().replace(/\/+$/, "");
  const match = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)/
  );
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function githubFetch(url, token) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "agents-md-generator",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `GitHub API error ${res.status}: ${res.statusText}. ${body}`
    );
  }
  return res.json();
}

async function fetchRepoMetadata(owner, repo, token) {
  return githubFetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    token
  );
}

async function fetchRepoTree(owner, repo, token) {
  return githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    token
  );
}

async function fetchFileContent(owner, repo, path, token) {
  try {
    const data = await githubFetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`,
      token
    );
    if (data.content && data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    // If it's too large, try raw
    if (data.download_url) {
      const rawRes = await fetch(data.download_url);
      return rawRes.text();
    }
    return null;
  } catch {
    return null;
  }
}

function selectFilesToFetch(treeItems) {
  const selected = [];
  const allPaths = treeItems
    .filter((item) => item.type === "blob")
    .map((item) => item.path);

  // 1. Priority files
  for (const pf of PRIORITY_FILES) {
    const found = allPaths.find(
      (p) => p === pf || p.toLowerCase() === pf.toLowerCase()
    );
    if (found) selected.push(found);
  }

  // 2. Sample source files from key directories (entry points, configs, etc.)
  // Get unique top-level directories
  const topDirs = new Set();
  for (const p of allPaths) {
    const parts = p.split("/");
    if (parts.length > 1) {
      topDirs.add(parts[0]);
    }
  }

  // For each top-level dir, grab a few representative files
  const MAX_FILES_PER_DIR = 3;
  const MAX_TOTAL_SOURCE = 25;
  let sourceCount = 0;

  // Prioritize src, lib, app, pages, components, api, cmd, pkg, internal
  const priorityDirs = [
    "src", "lib", "app", "pages", "components", "api", "cmd", "pkg",
    "internal", "server", "client", "core", "utils", "services",
  ];

  const orderedDirs = [
    ...priorityDirs.filter((d) => topDirs.has(d)),
    ...[...topDirs].filter((d) => !priorityDirs.includes(d)),
  ];

  for (const dir of orderedDirs) {
    if (sourceCount >= MAX_TOTAL_SOURCE) break;

    const dirFiles = allPaths
      .filter((p) => p.startsWith(dir + "/") && !shouldSkipPath(p))
      .filter((p) => SOURCE_EXTENSIONS.has(getExtension(p)))
      .filter((p) => !selected.includes(p));

    // Prioritize index/main/mod files
    const sorted = dirFiles.sort((a, b) => {
      const aName = a.split("/").pop().toLowerCase();
      const bName = b.split("/").pop().toLowerCase();
      const priority = ["index", "main", "mod", "app", "server", "lib"];
      const aScore = priority.findIndex((p) => aName.startsWith(p));
      const bScore = priority.findIndex((p) => bName.startsWith(p));
      return (aScore === -1 ? 99 : aScore) - (bScore === -1 ? 99 : bScore);
    });

    for (const file of sorted.slice(0, MAX_FILES_PER_DIR)) {
      if (sourceCount >= MAX_TOTAL_SOURCE) break;
      selected.push(file);
      sourceCount++;
    }
  }

  // 3. Root-level source files
  const rootFiles = allPaths
    .filter((p) => !p.includes("/") && SOURCE_EXTENSIONS.has(getExtension(p)))
    .filter((p) => !selected.includes(p));
  for (const f of rootFiles.slice(0, 5)) {
    selected.push(f);
  }

  return [...new Set(selected)];
}

function buildPrompt(metadata, tree, fileContents) {
  const treeList = tree
    .filter((item) => item.type === "blob" && !shouldSkipPath(item.path))
    .map((item) => item.path)
    .sort()
    .join("\n");

  const filesSection = Object.entries(fileContents)
    .map(
      ([path, content]) =>
        `\n--- ${path} ---\n${content ? content.slice(0, 8000) : "(could not fetch)"}\n`
    )
    .join("\n");

  return `You are an expert developer tasked with generating a comprehensive AGENTS.md file for a GitHub repository.

An AGENTS.md file provides instructions and context for AI coding agents (like GitHub Copilot, Cursor, Claude Code, Gemini CLI, etc.) so they can work effectively with the codebase.

## Repository Information

- **Name**: ${metadata.full_name}
- **Description**: ${metadata.description || "No description provided"}
- **Primary Language**: ${metadata.language || "Not specified"}
- **Topics**: ${metadata.topics?.join(", ") || "None"}
- **Default Branch**: ${metadata.default_branch}
- **Stars**: ${metadata.stargazers_count}
- **License**: ${metadata.license?.name || "Not specified"}

## File Tree (filtered)
\`\`\`
${treeList}
\`\`\`

## Key File Contents
${filesSection}

## Instructions

Generate a comprehensive, well-structured AGENTS.md file for this repository. The file should include:

1. **Project Overview** — Brief description of what the project does, its purpose, and key goals
2. **Architecture & Structure** — How the codebase is organized, key directories, and their purposes
3. **Tech Stack** — Languages, frameworks, libraries, and tools used
4. **Development Setup** — How to install dependencies, run the project, and set up the dev environment
5. **Coding Conventions** — Style guidelines, naming conventions, patterns used in the codebase
6. **Key Patterns & Abstractions** — Important design patterns, abstractions, and architectural decisions
7. **Testing** — How to run tests, testing frameworks used, and testing conventions
8. **Build & Deployment** — Build process, CI/CD pipeline, deployment instructions
9. **Common Tasks** — How to add new features, fix bugs, or extend the project
10. **Important Notes** — Any gotchas, known issues, or things agents should be aware of

Guidelines:
- Be specific to THIS project — don't give generic advice
- Reference actual file paths and directory names from the repository
- Include actual commands (like \`npm run dev\`, \`cargo build\`, etc.) found in the project
- Keep it practical and actionable
- Use markdown formatting with proper headers, code blocks, and lists
- If you can't determine something from the provided files, make a reasonable inference based on the project structure and conventions, or note it as something to verify
- The output should be ONLY the AGENTS.md content — no preamble, no explanation, just the file content
- Start with a top-level heading like "# AGENTS.md — [Project Name]"
`;
}

export async function POST(request) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return Response.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return Response.json(
        { error: "Invalid GitHub URL. Please use format: https://github.com/owner/repo" },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;
    const githubToken = process.env.GITHUB_TOKEN || "";
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured. Please add it to your .env.local file." },
        { status: 500 }
      );
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        function sendEvent(type, data) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type, ...data })}\n\n`)
          );
        }

        try {
          // Step 1: Fetch repo metadata
          sendEvent("progress", {
            step: "metadata",
            message: "Fetching repository metadata...",
          });
          const metadata = await fetchRepoMetadata(owner, repo, githubToken);

          // Step 2: Fetch file tree
          sendEvent("progress", {
            step: "tree",
            message: `Scanning ${metadata.full_name} file structure...`,
          });
          const treeData = await fetchRepoTree(owner, repo, githubToken);
          const treeItems = treeData.tree || [];

          sendEvent("progress", {
            step: "tree_done",
            message: `Found ${treeItems.filter((i) => i.type === "blob").length} files`,
          });

          // Step 3: Select and fetch key files
          const filesToFetch = selectFilesToFetch(treeItems);
          sendEvent("progress", {
            step: "files",
            message: `Fetching ${filesToFetch.length} key files for analysis...`,
          });

          const fileContents = {};
          // Batch fetch with concurrency limit
          const BATCH_SIZE = 5;
          for (let i = 0; i < filesToFetch.length; i += BATCH_SIZE) {
            const batch = filesToFetch.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(
              batch.map((path) => fetchFileContent(owner, repo, path, githubToken))
            );
            batch.forEach((path, idx) => {
              fileContents[path] = results[idx];
            });
          }

          sendEvent("progress", {
            step: "generating",
            message: "Analyzing codebase and generating AGENTS.md with Gemini...",
          });

          // Step 4: Generate with Gemini (streaming)
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",
          });

          const prompt = buildPrompt(metadata, treeItems, fileContents);

          const result = await model.generateContentStream(prompt);

          sendEvent("stream_start", {});

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              sendEvent("chunk", { content: text });
            }
          }

          sendEvent("done", { message: "Generation complete!" });
        } catch (err) {
          sendEvent("error", {
            message: err.message || "An unexpected error occurred",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
