"use client";

import { useState } from "react";
import { Search, Loader2, Globe, FileText } from "lucide-react";

export default function ScraperPage() {
  const [url, setUrl] = useState("https://example.com");
  const [prompt, setPrompt] = useState("Extract the titles and dates of the articles");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Calling the scraper service directly
      const response = await fetch("http://localhost:3004/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, prompt }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to scrape");
      }

      setResult(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">AI Web Scraper</h1>
        <p className="text-white/50 mb-8">Test the ScrapeGraphAI integration for gathering alternative data.</p>

        <div className="glass-panel p-6 rounded-xl border border-white/10 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/70 mb-1 block">Target URL</label>
              <div className="relative">
                <Globe className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-1 block">Prompt / Instructions</label>
              <div className="relative">
                <FileText className="w-5 h-5 absolute left-3 top-3 text-white/30" />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary min-h-[100px]"
                  placeholder="What do you want to extract?"
                />
              </div>
            </div>

            <button
              onClick={handleScrape}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Scraping with AI...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Run Scraper
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8">
            <p className="font-semibold">Error</p>
            <p className="text-sm opacity-80">{error}</p>
            {error.includes("OPENAI_API_KEY") && (
              <p className="text-xs mt-2 text-white/50">
                Tip: Make sure to set the `OPENAI_API_KEY` environment variable in the terminal where the scraper service is running.
              </p>
            )}
          </div>
        )}

        {result && (
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Results</h3>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto text-sm text-green-400 max-h-[400px]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

