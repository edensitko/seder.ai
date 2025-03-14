import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { SavedThought } from './ThoughtTabs';

interface TimelineViewProps {
  thoughts: SavedThought[];
  onSelectThought: (id: string) => void;
}

export default function TimelineView({ thoughts, onSelectThought }: TimelineViewProps) {
  // מיין את המחשבות לפי תאריך
  const sortedThoughts = [...thoughts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // קבץ מחשבות לפי תאריך
  const groupedThoughts = sortedThoughts.reduce((groups, thought) => {
    const date = format(new Date(thought.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(thought);
    return groups;
  }, {} as Record<string, SavedThought[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedThoughts).map(([date, dayThoughts], groupIndex) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="relative"
        >
          <div className="sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg mb-4 z-10">
            <h3 className="text-lg font-medium">
              {format(new Date(date), 'EEEE, d בMMMM yyyy', { locale: he })}
            </h3>
          </div>
          
          <div className="space-y-4 relative">
            <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-purple-100"></div>
            
            {dayThoughts.map((thought, index) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pr-8"
                onClick={() => onSelectThought(thought.id)}
              >
                <div className="absolute right-2 top-3 w-4 h-4 rounded-full bg-purple-600 border-4 border-white"></div>
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-sm text-muted-foreground mb-2">
                    {format(new Date(thought.date), 'HH:mm')}
                  </div>
                  <p className="text-gray-800">{thought.text}</p>
                  {thought.analysis.themes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {thought.analysis.themes.map((theme, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
