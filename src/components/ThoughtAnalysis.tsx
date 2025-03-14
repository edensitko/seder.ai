import React, { useState } from "react";
import { 
  ListChecks, 
  LightbulbIcon, 
  Target, 
  MessageSquare, 
  CheckSquare, 
  Sparkles, 
  Tag 
} from "lucide-react";

interface Category {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: string[];
}

interface ThoughtAnalysisProps {
  result: {
    summary: string;
    themes: string[];
    categories: {
      tasks: string[];
      ideas: string[];
      goals: string[];
      reflections: string[];
      decisions: string[];
    };
    nextSteps: {
      tasks: string[];
      ideas: string[];
      goals: string[];
      reflections: string[];
      decisions: string[];
    };
    advice: string;
  };
}

const ThoughtAnalysis: React.FC<ThoughtAnalysisProps> = ({ result }) => {
  const { summary, themes, categories, nextSteps, advice } = result;
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const categoryItems: Category[] = [
    { id: 'tasks', title: 'משימות', icon: <ListChecks size={16} className="text-blue-500" />, items: categories.tasks },
    { id: 'ideas', title: 'רעיונות', icon: <LightbulbIcon size={16} className="text-yellow-500" />, items: categories.ideas },
    { id: 'goals', title: 'מטרות', icon: <Target size={16} className="text-green-500" />, items: categories.goals },
    { id: 'reflections', title: 'מחשבות', icon: <MessageSquare size={16} className="text-purple-500" />, items: categories.reflections },
    { id: 'decisions', title: 'החלטות', icon: <CheckSquare size={16} className="text-red-500" />, items: categories.decisions }
  ];

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  return (
    <div className="space-y-4 text-right" dir="rtl">
      <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
        <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
          <Sparkles size={16} className="text-indigo-500" />
          סיכום
        </h3>
        <p className="text-sm text-gray-700">{summary}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
        <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
          <Tag size={16} className="text-indigo-500" />
          נושאים מרכזיים
        </h3>
        <div className="flex flex-wrap gap-1">
          {themes.map((theme, index) => (
            <span key={index} className="inline-block text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
              {theme}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {categoryItems.map(category => (
          <div key={category.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div 
              className="p-3 flex items-center justify-between cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center gap-1">
                {category.icon}
                <h3 className="text-sm font-medium text-gray-800">{category.title}</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full ml-2">
                  {category.items.length}
                </span>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategories.includes(category.id) ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expandedCategories.includes(category.id) && (
              <div className="px-3 pb-3">
                <ul className="space-y-1">
                  {category.items.length > 0 ? (
                    category.items.map((item, index) => (
                      <li key={index} className="text-xs text-gray-700 flex items-start gap-1">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500 italic">אין פריטים</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
        <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
          <Sparkles size={16} className="text-indigo-500" />
          עצות
        </h3>
        <p className="text-sm text-gray-700">{advice}</p>
      </div>
    </div>
  );
};

export default ThoughtAnalysis;
