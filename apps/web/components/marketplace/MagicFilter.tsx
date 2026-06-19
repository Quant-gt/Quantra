"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Mic, MicOff, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MagicFilter() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulated trending searches
  const trendingSearches = [
    "safe nifty options under 50k",
    "high return swing strategies",
    "low drawdown intraday",
    "zero fee banknifty algos"
  ];

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length >= 2) {
        // Filter trending searches as suggestions
        const filtered = trendingSearches.filter(s => 
          s.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setShowDropdown(false);
    setLoading(true);

    try {
      // In a real implementation, this would navigate to a search results page
      // or update the marketplace state. For now, we'll just simulate the action.
      console.log(`Searching for: ${searchQuery}`);
      
      // We can call the API here to test it or just redirect
      // router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
      
      // Simulate delay
      await new Promise(r => setTimeout(r, 1000));
      
      toast.success(`AI Search triggered for: "${searchQuery}". Results would be displayed on the marketplace.`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSearch(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      <div className="relative flex items-center h-14 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all overflow-hidden glass-panel">
        <div className="pl-4 flex-shrink-0 text-white/50">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowDropdown(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Ask AI: 'safe nifty options under 50k'..."
          className="flex-1 bg-transparent px-4 py-2 text-white placeholder-white/30 focus:outline-none text-base"
        />

        <div className="pr-2 flex items-center gap-1 flex-shrink-0">
          {query && (
            <button
              onClick={() => { setQuery(""); setShowDropdown(false); }}
              className="p-2 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={startVoiceSearch}
            className={`p-2 rounded-xl transition-colors ${
              isListening 
                ? 'text-red-500 bg-red-500/10 animate-pulse' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query}
            className="ml-1 bg-primary text-primary-foreground p-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && (suggestions.length > 0 || query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden glass-panel">
          {suggestions.length > 0 ? (
            <div className="p-2">
              <p className="text-xs font-semibold text-white/40 px-3 py-1 uppercase">Suggestions</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-3 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-white/30" />
                  {suggestion}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-white/50 text-sm">
              No direct matches. Press Enter to search anyway.
            </div>
          )}
          
          <div className="border-t border-white/10 p-2 bg-black/20">
            <p className="text-xs font-semibold text-white/40 px-3 py-1 uppercase">Trending Searches</p>
            {trendingSearches.slice(0, 3).map((trend, index) => (
              <button
                key={index}
                onClick={() => handleSearch(trend)}
                className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                {trend}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
