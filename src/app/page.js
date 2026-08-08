"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";

// ---- Icons (inline SVGs) ----
function IconGitHub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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
      // Fallback
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

      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
        {/* Hero */}
        <header className="text-center mb-10 sm:mb-14 max-w-2xl fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-glow)] border border-[var(--border-highlight)] text-[var(--accent-light)] text-xs font-medium mb-6">
            <IconSparkles />
            Powered by Gemini 2.5 Flash
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-[var(--accent-light)] to-[var(--accent)] bg-clip-text text-transparent">
            AGENTS.md Generator
          </h1>
          <p className="text-[var(--foreground-muted)] text-base sm:text-lg leading-relaxed">
            Generate comprehensive AI agent instructions for any public GitHub
            repository. Just paste a link and let Gemini analyze your codebase.
          </p>
        </header>

        {/* Input section */}
        <section className="w-full max-w-2xl mb-8 fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card glass-card-glow p-6">
            <label
              htmlFor="repo-url-input"
              className="block text-sm font-medium text-[var(--foreground-muted)] mb-3"
            >
              GitHub Repository URL
            </label>
            <div className="flex gap-3">
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
                  className="input-glow w-full pl-11 pr-4 py-3.5 text-sm"
                  disabled={isGenerating}
                  autoFocus
                />
              </div>
              <button
                id="generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating || !repoUrl.trim()}
                className="btn-primary px-6 py-3.5 flex items-center gap-2 text-sm whitespace-nowrap"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
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
          <section className="w-full max-w-2xl mb-8 fade-in">
            <div className="glass-card p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STEPS.map((step) => {
                  const status = getStepStatus(step.id);
                  return (
                    <div
                      key={step.id}
                      className={`step-indicator ${status}`}
                    >
                      {status === "active" && <div className="spinner" />}
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
                <p className="text-xs text-[var(--foreground-muted)] mt-3 text-center">
                  {stepMessage}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Output section */}
        {(output || isStreaming) && (
          <section className="w-full max-w-4xl fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="glass-card glass-card-glow overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="flex items-center bg-[var(--surface)] rounded-lg p-0.5 border border-[var(--border)]">
                    <button
                      onClick={() => setViewMode("raw")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewMode === "raw"
                          ? "bg-[var(--accent-glow)] text-[var(--accent-light)] border border-[var(--border-highlight)]"
                          : "text-[var(--foreground-dim)] hover:text-[var(--foreground-muted)]"
                      }`}
                    >
                      <IconCode />
                      Raw
                    </button>
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        viewMode === "preview"
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

        {/* Empty state / instructions */}
        {!output && !isGenerating && (
          <section
            className="w-full max-w-2xl text-center fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="glass-card p-8 sm:p-10">
              <div className="flex justify-center gap-4 mb-6">
                {["Fetch", "Analyze", "Generate"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-glow)] border border-[var(--border-highlight)] flex items-center justify-center text-xs font-bold text-[var(--accent-light)]">
                      {i + 1}
                    </div>
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {label}
                    </span>
                    {i < 2 && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-dim)" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                How it works
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-md mx-auto">
                Paste any public GitHub repository URL above. We&apos;ll fetch the
                repo structure, analyze key files like README, configs, and
                source code, then use Gemini to craft a tailored AGENTS.md file
                for AI coding assistants.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-[var(--foreground-dim)] border-t border-[var(--border)]">
        Built with Next.js & Gemini 2.5 Flash ·{" "}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-light)] hover:underline"
        >
          GitHub
        </a>
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
