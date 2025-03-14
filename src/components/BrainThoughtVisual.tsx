import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BrainThoughtVisualProps {
  thoughts: {
    id: string;
    text: string;
    category?: string;
  }[];
  onSelectThought?: (id: string) => void;
  onRemoveThought?: (id: string) => void;
  height?: number;
}

const BrainThoughtVisual: React.FC<BrainThoughtVisualProps> = ({
  thoughts,
  onSelectThought,
  onRemoveThought,
  height = 400,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // אם אין מחשבות, לא מציגים כלום
  if (thoughts.length === 0) return null;

  // פונקציה שמחשבת נקודות מסביב לעיגול
  const calculatePosition = (index: number, total: number, radius: number) => {
    // נקבע את המיקום של כל מחשבה סביב המעגל
    const angle = (index / total) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return { x, y };
  };

  // איסוף כל הקטגוריות הייחודיות
  const uniqueCategories = Array.from(
    new Set(thoughts.map(thought => thought.category))
  ).filter(Boolean);

  // סינון המחשבות לפי חיפוש וקטגוריה
  const filteredThoughts = thoughts.filter(thought => {
    const matchesSearch = thought.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || thought.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // הגבלת מספר המחשבות שיוצגו בעיגול
  const displayedThoughts = filteredThoughts.slice(0, 8);

  // צבעים למעגלי המחשבות
  const colors = [
    "bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300",
    "bg-gradient-to-r from-indigo-100 to-indigo-200 border-indigo-300",
    "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300",
    "bg-gradient-to-r from-emerald-100 to-emerald-200 border-emerald-300",
    "bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300",
    "bg-gradient-to-r from-rose-100 to-rose-200 border-rose-300",
    "bg-gradient-to-r from-sky-100 to-sky-200 border-sky-300",
    "bg-gradient-to-r from-lime-100 to-lime-200 border-lime-300",
  ];

  return (
    <div className="relative" style={{ height: `${height}px` }} dir="rtl">
      {/* כותרת וחיפוש */}
      <div className="absolute top-0 right-0 left-0 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-2 px-4">
          <h3 className="text-lg font-medium text-gray-800">ויזואליזציית מחשבות</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} className="text-gray-600" />
            </Button>
            <div className="relative">
              <Search size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                id="thought-search"
                name="thought-search"
                placeholder="חיפוש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-3 pr-8 w-32 text-sm rounded-full border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-3 mb-3 w-full max-w-md"
          >
            <div className="text-sm text-gray-600 mb-2">סנן לפי קטגוריה:</div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs h-7 px-2 rounded-full ${selectedCategory === null ? 'bg-indigo-100 text-indigo-600' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                הכל
              </Button>
              {uniqueCategories.map(category => (
                <Button 
                  key={category} 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs h-7 px-2 rounded-full ${selectedCategory === category ? 'bg-indigo-100 text-indigo-600' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
        <p className="text-xs text-gray-600">לחץ על מעגל כדי לראות את הניתוח המלא</p>
        {filteredThoughts.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            מציג {displayedThoughts.length} מתוך {filteredThoughts.length} מחשבות
            {filteredThoughts.length !== thoughts.length && ` (מסונן מתוך ${thoughts.length})`}
          </p>
        )}
      </div>
      
      {/* תמונת המוח במרכז */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute z-10 w-32 h-32 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center overflow-hidden"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
          <img
            src="/brain-logo.svg"
            alt="מוח"
            className="w-28 h-28 object-contain"
          />
        </div>
      </motion.div>

      {/* מעגלי המחשבות מסביב למוח */}
      <AnimatePresence>
        {displayedThoughts.map((thought, index) => {
          const position = calculatePosition(
            index,
            displayedThoughts.length,
            120
          );

          return (
            <div key={thought.id} className="contents">
              {/* קו המחבר את המוח למחשבה */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "120px",
                  height: "1px",
                  background: "linear-gradient(to right, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.1))",
                  transform: `rotate(${(index / displayedThoughts.length) * 360}deg)`,
                  transformOrigin: "0% 50%",
                  zIndex: 5,
                }}
              />

              {/* מעגל המחשבה */}
              <motion.div
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, x: position.x, y: position.y }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className={`absolute w-18 h-18 rounded-full ${
                  colors[index % colors.length]
                } shadow-md border flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all duration-300 z-20 hover:shadow-lg`}
                style={{
                  top: "calc(50% - 36px)",
                  left: "calc(50% - 36px)",
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  width: "72px",
                  height: "72px"
                }}
                onClick={() => onSelectThought && onSelectThought(thought.id)}
              >
                {thought.category && (
                  <div className="absolute -top-1 -right-1 bg-white text-[8px] px-1.5 py-0.5 rounded-full shadow-sm border border-gray-100 font-medium text-gray-700">
                    {thought.category}
                  </div>
                )}
                <p className="text-xs font-medium text-center text-gray-800 p-1 overflow-hidden line-clamp-3">
                  {thought.text.substring(0, 30)}
                  {thought.text.length > 30 ? "..." : ""}
                </p>
                <button
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveThought && onRemoveThought(thought.id);
                  }}
                >
                  <X size={14} />
                </button>
              </motion.div>
            </div>
          );
        })}
      </AnimatePresence>

      {/* הודעה אם אין תוצאות חיפוש */}
      {searchTerm && filteredThoughts.length === 0 && (
        <div className="absolute bottom-4 text-center w-full">
          <p className="text-sm text-gray-500">לא נמצאו מחשבות התואמות את החיפוש</p>
        </div>
      )}
    </div>
  );
};

export default BrainThoughtVisual;
