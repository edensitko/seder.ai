import React from 'react';
import { TagCloud } from 'react-tagcloud';
import { Tag } from 'lucide-react';

interface TagCloudViewProps {
  thoughts: any[];
  onSelectThought: (id: string) => void;
  height?: number;
}

const TagCloudView: React.FC<TagCloudViewProps> = ({ thoughts, onSelectThought, height = 400 }) => {
  const tags = thoughts
  .flatMap(t => t.analysis.themes)
  .reduce((acc: Record<string, number>, theme: string) => {
    acc[theme] = (acc[theme] || 0) + 1; // Ensure count is a number
    return acc;
  }, {});

  // Generate a consistent color based on the tag name
  const getTagColor = (tag: string) => {
    const colors = [
      'rgb(99, 102, 241)', // indigo-600
      'rgb(124, 58, 237)', // purple-600
      'rgb(79, 70, 229)',  // indigo-700
      'rgb(139, 92, 246)', // purple-500
      'rgb(67, 56, 202)',  // indigo-700
    ];
    
    // Use the sum of character codes to determine color index
    const charSum = tag.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  const data = Object.entries(tags).map(([value, count]) => ({
    value,
    count: count as number,
    color: getTagColor(value)
  }));

  // Handle tag click to find and select a thought with that tag
  const handleTagClick = (tag: { value: string }) => {
    const matchingThoughts = thoughts.filter(t => 
      t.analysis.themes.includes(tag.value)
    );
    if (matchingThoughts.length > 0) {
      onSelectThought(matchingThoughts[0].id);
    }
  };

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <div className="flex items-center justify-center gap-2 mb-6">
        <Tag size={20} className="text-indigo-600" />
        <h3 className="text-lg font-medium text-gray-900">תגיות נפוצות</h3>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-6 rounded-xl">
        <TagCloud
          minSize={16}
          maxSize={36}
          tags={data}
          onClick={handleTagClick}
          renderer={(tag: any, size: number) => (
            <span
              key={tag.value}
              style={{
                fontSize: `${size}px`,
                color: tag.color,
                margin: '8px',
                cursor: 'pointer',
                fontWeight: size > 25 ? 'bold' : 'normal',
              }}
              className="hover:opacity-80 transition-all duration-300 hover:scale-110 inline-block"
            >
              {tag.value}
            </span>
          )}
        />
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        לחץ על תגית כדי לראות מחשבות קשורות
      </p>
    </div>
  );
}

export default TagCloudView;
