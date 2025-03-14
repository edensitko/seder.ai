import React from 'react';
import { motion } from 'framer-motion';
import { SavedThought } from './ThoughtTabs';

interface CategoryViewProps {
  thoughts: SavedThought[];
  onSelectThought: (id: string) => void;
}

const categories = [
  { id: 'tasks', label: 'משימות', color: 'bg-blue-100 text-blue-800' },
  { id: 'ideas', label: 'רעיונות', color: 'bg-green-100 text-green-800' },
  { id: 'goals', label: 'מטרות', color: 'bg-purple-100 text-purple-800' },
  { id: 'reflections', label: 'תובנות', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'decisions', label: 'החלטות', color: 'bg-red-100 text-red-800' }
];

export default function CategoryView({ thoughts, onSelectThought }: CategoryViewProps) {
  // מיין מחשבות לפי קטגוריות
  const categorizedThoughts = thoughts.reduce((acc, thought) => {
    Object.entries(thought.analysis.categories).forEach(([category, items]) => {
      if (items.length > 0 && !acc[category].some(t => t.id === thought.id)) {
        acc[category].push(thought);
      }
    });
    return acc;
  }, Object.fromEntries(categories.map(cat => [cat.id, []])) as Record<string, SavedThought[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map(({ id, label, color }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-sm"
        >
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${color}`}>
            {label}
          </div>
          
          <div className="space-y-3">
            {categorizedThoughts[id].map((thought, index) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectThought(thought.id)}
                className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm line-clamp-2">{thought.text}</p>
                {thought.analysis.themes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {thought.analysis.themes.slice(0, 2).map((theme, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 bg-white rounded text-xs text-gray-600"
                      >
                        {theme}
                      </span>
                    ))}
                    {thought.analysis.themes.length > 2 && (
                      <span className="inline-block px-2 py-0.5 bg-white rounded text-xs text-gray-600">
                        +{thought.analysis.themes.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            
            {categorizedThoughts[id].length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                אין מחשבות בקטגוריה זו
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
