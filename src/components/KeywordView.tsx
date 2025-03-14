import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { SavedThought } from './ThoughtTabs';

interface KeywordViewProps {
  thoughts: SavedThought[];
  onSelectThought: (id: string) => void;
}

interface KeywordData {
  word: string;
  count: number;
  thoughts: SavedThought[];
}

export default function KeywordView({ thoughts, onSelectThought }: KeywordViewProps) {
  const keywordData = useMemo(() => {
    const wordMap = new Map<string, KeywordData>();
    
    thoughts.forEach(thought => {
      // פצל את הטקסט למילים והסר מילות קישור נפוצות
      const words = thought.text.split(/\s+/)
        .map(word => word.replace(/[.,!?]/g, '').toLowerCase())
        .filter(word => word.length > 2);
      
      words.forEach(word => {
        if (!wordMap.has(word)) {
          wordMap.set(word, { word, count: 0, thoughts: [] });
        }
        const data = wordMap.get(word)!;
        data.count++;
        if (!data.thoughts.some(t => t.id === thought.id)) {
          data.thoughts.push(thought);
        }
      });
    });
    
    // מיין לפי תדירות ולקח את ה-50 המילים הנפוצות ביותר
    return Array.from(wordMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  }, [thoughts]);

  const maxCount = Math.max(...keywordData.map(d => d.count));
  
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-medium mb-6 text-center">מילים נפוצות במחשבות שלך</h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {keywordData.map(({ word, count, thoughts }, index) => {
          const size = 0.5 + (count / maxCount) * 1.5; // גודל יחסי בין 0.5 ל-2
          
          return (
            <motion.div
              key={word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectThought(thoughts[0].id)}
              className="cursor-pointer relative group"
              style={{
                fontSize: `${size}rem`,
              }}
            >
              <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 hover:bg-purple-100 transition-colors">
                {word}
                <span className="text-xs ml-1 text-purple-600">
                  {count}
                </span>
              </span>
              
              {/* טולטיפ עם דוגמאות */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="text-center mb-1 font-medium">דוגמאות:</div>
                {thoughts.slice(0, 2).map((thought, i) => (
                  <div key={i} className="line-clamp-1 text-gray-300">
                    {thought.text}
                  </div>
                ))}
                {thoughts.length > 2 && (
                  <div className="text-center text-gray-400 mt-1">
                    +{thoughts.length - 2} נוספים
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
