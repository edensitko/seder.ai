import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "react-use";

interface Thought {
  id: string;
  text: string;
  date: string;
  analysis?: {
    themes?: string[];
    summary?: string;
  };
}

interface GlobalSearchProps {
  thoughts: Thought[];
  onSelectThought: (id: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  thoughts,
  onSelectThought,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Thought[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useClickAway(searchRef, () => {
    setIsOpen(false);
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      
      // Close with Escape
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results = thoughts.filter(thought => {
      // Search in thought text
      if (thought.text.toLowerCase().includes(term)) return true;
      
      // Search in themes
      if (thought.analysis?.themes?.some(theme => 
        theme.toLowerCase().includes(term)
      )) return true;
      
      // Search in summary
      if (thought.analysis?.summary?.toLowerCase().includes(term)) return true;
      
      return false;
    });

    setSearchResults(results);
  }, [searchTerm, thoughts]);

  // Handle result selection
  const handleSelectResult = (id: string) => {
    onSelectThought(id);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("he-IL", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search trigger button */}
      <Button
        variant="outline"
        size="sm"
        className="h-9 px-3 border-gray-200 text-gray-700 hover:text-gray-900 hover:border-gray-300 flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        <span>חיפוש גלובלי</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 mr-1">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 w-screen max-w-md bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            style={{ maxHeight: "80vh", overflow: "hidden" }}
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  ref={inputRef}
                  type="text"
                  id="global-search"
                  name="global-search"
                  placeholder="חפש מחשבות, נושאים, או סיכומים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-8 h-10 text-base"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((thought) => (
                    <button
                      key={thought.id}
                      className="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-start gap-3 transition-colors"
                      onClick={() => handleSelectResult(thought.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">
                          {thought.text.length > 100
                            ? `${thought.text.substring(0, 100)}...`
                            : thought.text}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-1">
                          {thought.analysis?.themes?.slice(0, 3).map((theme, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(thought.date)}
                        </p>
                      </div>
                      <ArrowLeft size={16} className="text-gray-400 mt-1" />
                    </button>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">לא נמצאו תוצאות עבור "{searchTerm}"</p>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">התחל להקליד כדי לחפש</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
              <div>נמצאו {searchResults.length} תוצאות</div>
              <div className="flex items-center gap-2">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-600">
                  ESC
                </kbd>
                <span>לסגירה</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
