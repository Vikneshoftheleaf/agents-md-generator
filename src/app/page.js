"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";

// ---- Icons & Loaders (inline SVGs & Components) ----
function GreenBlinkingDot({ className = "" }) {
  return <span className={`green-blinking-dot ${className}`} />;
}

function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconZerops() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconSparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconFileText() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconCpu() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="15" x2="23" y2="15" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="15" x2="4" y2="15" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// ---- Progress steps config ----
const STEPS = [
  { id: "metadata", label: "Fetching repo info" },
  { id: "tree", label: "Scanning file structure" },
  { id: "files", label: "Analyzing key files" },
  { id: "generating", label: "Generating AGENTS.md" },
];

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(null);
  const [stepMessage, setStepMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("raw"); // "raw" or "preview"
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll during streaming
  useEffect(() => {
    if (isStreaming && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, isStreaming]);

  const isValidGitHubUrl = useCallback((url) => {
    return /^(https?:\/\/)?(www\.)?github\.com\/[^/]+\/[^/]+\/?$/i.test(
      url.trim()
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!repoUrl.trim() || !isValidGitHubUrl(repoUrl)) {
      setError("Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo)");
      return;
    }

    setIsGenerating(true);
    setOutput("");
    setError("");
    setCurrentStep("metadata");
    setStepMessage("Starting...");
    setIsStreaming(false);
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case "progress":
                setCurrentStep(event.step);
                setStepMessage(event.message);
                break;
              case "stream_start":
                setIsStreaming(true);
                setCurrentStep("generating");
                break;
              case "chunk":
                setOutput((prev) => prev + event.content);
                break;
              case "done":
                setIsStreaming(false);
                setCurrentStep(null);
                break;
              case "error":
                throw new Error(event.message);
            }
          } catch (parseErr) {
            if (parseErr.message && !parseErr.message.includes("JSON")) {
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsStreaming(false);
      setCurrentStep(null);
    } finally {
      setIsGenerating(false);
    }
  }, [repoUrl, isValidGitHubUrl]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AGENTS.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !isGenerating) {
        handleGenerate();
      }
    },
    [handleGenerate, isGenerating]
  );

  const getStepStatus = (stepId) => {
    if (!currentStep) return output ? "completed" : "pending";
    const stepIdx = STEPS.findIndex((s) => s.id === stepId);
    const currentIdx = STEPS.findIndex((s) => s.id === currentStep);
    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  };

  return (
    <>
      {/* Animated background */}
      <div className="gradient-bg" />

      {/* Top Banner - Zerops Hackathon */}
      <div className="relative z-20 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 border-b border-purple-500/20 backdrop-blur-md py-2.5 px-4 text-center text-xs sm:text-sm text-purple-200 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Built &amp; Deployed on <strong>Zerops Cloud</strong></span>
        <a
          href="https://zerops.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-2 hover:text-purple-300 transition-colors ml-1"
        >
          Explore Zerops <IconExternalLink />
        </a>
      </div>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 sm:py-12 max-w-6xl mx-auto">
        {/* Hero Header */}
        <header className="text-center mb-10 sm:mb-14 max-w-3xl fade-in">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <IconZerops /> Powewred by Zerops
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <IconSparkles /> Powered by Gemini 3.5 Flash
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-5 bg-gradient-to-r from-white via-purple-100 to-indigo-300 bg-clip-text text-transparent">
            AGENTS.md Generator
          </h1>
          <p className="text-[var(--foreground-muted)] text-base sm:text-xl leading-relaxed font-normal max-w-2xl mx-auto">
            Supercharge AI coding tools like Cursor, Claude Code &amp; Copilot. Automatically analyze any public GitHub repo and generate a comprehensive <code className="bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono text-sm">AGENTS.md</code> file in seconds.
          </p>
        </header>

        {/* Generator Input Section */}
        <section className="w-full max-w-2xl mb-12 fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card glass-card-glow p-6 sm:p-8">
            <label
              htmlFor="repo-url-input"
              className="block text-sm font-medium text-[var(--foreground-muted)] mb-3"
            >
              Paste Public GitHub Repository URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-dim)]">
                  <IconGitHub />
                </div>
                <input
                  ref={inputRef}
                  id="repo-url-input"
                  type="url"
                  value={repoUrl}
                  onChange={(e) => {
                    setRepoUrl(e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="https://github.com/owner/repo"
                  className="input-glow w-full pl-11 pr-4 py-3.5 text-sm font-mono"
                  disabled={isGenerating}
                  autoFocus
                />
              </div>
              <button
                id="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !repoUrl.trim()}
                className="btn-primary px-7 py-3.5 flex items-center justify-center gap-2 text-sm whitespace-nowrap shadow-lg shadow-purple-900/30"
              >
                {isGenerating ? (
                  <>
                    <span>Generating</span>
                    <GreenBlinkingDot />
                  </>
                ) : (
                  <>
                    Generate AGENTS.md
                    <IconArrowRight />
                  </>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-[var(--error)] flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {error}
              </p>
            )}
          </div>
        </section>

        {/* Progress indicators */}
        {isGenerating && (
          <section className="w-full max-w-2xl mb-10 fade-in">
            <div className="glass-card p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STEPS.map((step) => {
                  const status = getStepStatus(step.id);
                  return (
                    <div
                      key={step.id}
                      className={`step-indicator ${status}`}
                    >
                      {status === "active" && <GreenBlinkingDot />}
                      {status === "completed" && (
                        <span className="text-[var(--success)]">
                          <IconCheck />
                        </span>
                      )}
                      {status === "pending" && (
                        <span className="w-[18px] h-[18px] rounded-full border border-[var(--foreground-dim)] block" />
                      )}
                      <span className="text-xs">{step.label}</span>
                    </div>
                  );
                })}
              </div>
              {stepMessage && (
                <p className="text-xs text-[var(--foreground-muted)] mt-3 text-center flex items-center justify-center gap-2">
                  <span>{stepMessage}</span>
                  <GreenBlinkingDot />
                </p>
              )}
            </div>
          </section>
        )}

        {/* Output section */}
        {(output || isStreaming) && (
          <section className="w-full max-w-4xl mb-16 fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="glass-card glass-card-glow overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="flex items-center bg-[var(--surface)] rounded-lg p-0.5 border border-[var(--border)]">
                    <button
                      onClick={() => setViewMode("raw")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "raw"
                        ? "bg-[var(--accent-glow)] text-[var(--accent-light)] border border-[var(--border-highlight)]"
                        : "text-[var(--foreground-dim)] hover:text-[var(--foreground-muted)]"
                        }`}
                    >
                      <IconCode />
                      Raw
                    </button>
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "preview"
                        ? "bg-[var(--accent-glow)] text-[var(--accent-light)] border border-[var(--border-highlight)]"
                        : "text-[var(--foreground-dim)] hover:text-[var(--foreground-muted)]"
                        }`}
                    >
                      <IconFileText />
                      Preview
                    </button>
                  </div>
                  <span className="text-xs text-[var(--foreground-dim)] hidden sm:block">
                    AGENTS.md
                    {output && ` · ${(new Blob([output]).size / 1024).toFixed(1)} KB`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!output}
                    className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 text-xs"
                  >
                    {copied ? (
                      <>
                        <IconCheck />
                        Copied!
                      </>
                    ) : (
                      <>
                        <IconCopy />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!output}
                    className="btn-secondary px-3 py-1.5 flex items-center gap-1.5 text-xs"
                  >
                    <IconDownload />
                    Download
                  </button>
                </div>
              </div>

              {/* Content */}
              <div
                ref={outputRef}
                className="p-5 sm:p-6 max-h-[600px] overflow-y-auto"
              >
                {viewMode === "raw" ? (
                  <pre className={`markdown-output ${isStreaming ? "streaming-cursor" : ""}`}>
                    {output}
                  </pre>
                ) : (
                  <div className={`markdown-output ${isStreaming ? "streaming-cursor" : ""}`}>
                    <Markdown>{output}</Markdown>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 1: What is AGENTS.md & Why is it needed? */}
        <section className="w-full max-w-5xl my-10 fade-in">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Understanding <span className="text-purple-400 font-mono">AGENTS.md</span>
            </h2>
            <p className="text-[var(--foreground-muted)] text-sm sm:text-base max-w-2xl mx-auto">
              The emerging universal open standard to guide AI Coding Agents in software repositories.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: What is AGENTS.md */}
            <div className="glass-card p-6 sm:p-8 flex flex-col justify-between border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                  <IconFileText />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">What is an AGENTS.md file?</h3>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-4">
                  An <code className="bg-purple-950/60 text-purple-300 px-1.5 py-0.5 rounded font-mono text-xs border border-purple-500/30">AGENTS.md</code> file is placed at the root of a project repository to serve as the master manual for AI coding assistants (such as Cursor, Claude Code, GitHub Copilot, and Windsurf).
                </p>
                <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                  Unlike human-centric README files, an AGENTS.md explicitly documents architecture blueprints, directory structures, style guides, test execution commands, and critical codebase constraints.
                </p>
              </div>
            </div>

            {/* Card 2: Why is it needed */}
            <div className="glass-card p-6 sm:p-8 flex flex-col justify-between border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5">
                  <IconZap />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Why is it essential for modern AI dev?</h3>
                <ul className="space-y-3 text-sm text-[var(--foreground-muted)]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5"><IconCheck /></span>
                    <span><strong>Prevents AI Hallucinations:</strong> Directs agents to exact helper utilities and prevents reinventing existing logic.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5"><IconCheck /></span>
                    <span><strong>Enforces Code Standards:</strong> Ensures generated code adheres strictly to existing linter, path, and naming conventions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 mt-0.5"><IconCheck /></span>
                    <span><strong>Seamless Onboarding:</strong> New developers and AI agents can execute tests, builds, and scripts without trial &amp; error.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: How this web app generates it easily */}
        <section className="w-full max-w-5xl my-10 fade-in">
          <div className="glass-card p-8 sm:p-10 border-purple-500/20 relative overflow-hidden">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                Automated Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">
                How We Generate It Automatically
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto mt-2">
                Our multi-step analysis pipeline extracts repository knowledge without wasting LLM context budget.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 relative z-10">
              <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] hover:border-purple-500/30 transition-all">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-sm flex items-center justify-center mb-4">
                  1
                </div>
                <h4 className="font-semibold text-white mb-2 text-base">Smart Tree Scan</h4>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Fetches the recursive repository tree via GitHub REST API. Selects top priority configuration files, entry points, and documentation while ignoring lock files and build artifacts.
                </p>
              </div>

              <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] hover:border-purple-500/30 transition-all">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-sm flex items-center justify-center mb-4">
                  2
                </div>
                <h4 className="font-semibold text-white mb-2 text-base">Gemini 3.5 Analysis</h4>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Passes structured codebase context into <strong>Gemini 3.5 Flash</strong> to identify frameworks, dependencies, design patterns, testing strategies, and build commands.
                </p>
              </div>

              <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border)] hover:border-purple-500/30 transition-all">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-sm flex items-center justify-center mb-4">
                  3
                </div>
                <h4 className="font-semibold text-white mb-2 text-base">Live Streaming Output</h4>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Streams the formatted markdown directly to your browser with live preview, instant clipboard copying, and single-click <code className="text-purple-300">AGENTS.md</code> file download.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Zerops Platform Showcase */}
        <section className="w-full max-w-5xl my-10 fade-in">
          <div className="glass-card p-8 sm:p-10 border-indigo-500/30 bg-gradient-to-br from-purple-950/40 via-slate-900/70 to-indigo-950/40 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <IconShield /> Hosted &amp; Deployed on Zerops Cloud
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Powered by <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">Zerops</span> — The Developer-First Cloud Platform
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  This project was built for the <strong>Zerops Hackathon</strong> and is running live on Zerops Node.js infrastructure. With Zerops, full-stack applications build and scale effortlessly using a simple, declarative <code className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-700">zerops.yml</code> configuration file.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-purple-400"><IconZap /></span> Zero-Downtime Deploys
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-purple-400"><IconCpu /></span> Automated Scaling
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-purple-400"><IconShield /></span> Developer Native
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
                <a
                  href="https://zerops.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-purple-900/50"
                >
                  Discover Zerops Cloud <IconExternalLink />
                </a>
                <a
                  href="https://github.com/Vikneshoftheleaf/agents-md-generator/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-6 py-3 flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-white"
                >
                  <IconGitHub /> View Hackathon Source Code
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-xs text-[var(--foreground-dim)] border-t border-[var(--border)] bg-black/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Built with <strong>Next.js</strong> &amp; <strong>Gemini 3.5 Flash</strong> for the <strong>Zerops Hackathon</strong>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://zerops.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline flex items-center gap-1"
            >
              Zerops Cloud <IconExternalLink />
            </a>
            <span>·</span>
            <a
              href="https://github.com/Vikneshoftheleaf/agents-md-generator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline flex items-center gap-1"
            >
              GitHub Repository <IconExternalLink />
            </a>
          </div>
        </div>
      </footer>

      {/* Toast for copy */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 toast bg-[var(--success)] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
          <IconCheck />
          Copied to clipboard!
        </div>
      )}
    </>
  );
}
