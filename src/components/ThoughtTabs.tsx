import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scroll, Clock, ChevronLeft } from "lucide-react";
import ThoughtAnalysis from "./ThoughtAnalysis";

export interface SavedThought {
  id: string;
  text: string;
  date: string;
  analysis: {
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

interface ThoughtTabsProps {
  thoughts: SavedThought[];
  currentThoughtId: string | null;
  onSelectThought: (thoughtId: string) => void;
}

const ThoughtTabs: React.FC<ThoughtTabsProps> = ({
  thoughts,
  currentThoughtId,
  onSelectThought,
}) => {
  if (thoughts.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8" dir="rtl">
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="w-full mb-4 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl p-1.5 shadow-sm">
          <TabsTrigger 
            value="current" 
            className="flex-1 gap-1.5 rounded-lg py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <Scroll size={16} />
            <span>מחשבה נוכחית</span>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="flex-1 gap-1.5 rounded-lg py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
          >
            <Clock size={16} />
            <span>היסטוריה</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current">
          {currentThoughtId && 
            thoughts.find(t => t.id === currentThoughtId) && (
              <div className="animate-fade-in">
                <ThoughtAnalysis 
              result={{
                summary: "",
                themes: [],
                categories: {
                  tasks: [],
                  ideas: [],
                  goals: [],
                  reflections: [],
                  decisions: []
                },
                nextSteps: {
                  tasks: [],
                  ideas: [],
                  goals: [],
                  reflections: [],
                  decisions: []
                },
                advice: ""
              }} {...thoughts.find(t => t.id === currentThoughtId)?.analysis!}                />
              </div>
            )
          }
        </TabsContent>
        
        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {thoughts.map(thought => (
              <div 
                key={thought.id}
                className={`p-4 bg-white border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                  thought.id === currentThoughtId 
                    ? 'border-indigo-200 shadow-md shadow-indigo-100/50' 
                    : 'border-gray-100'
                }`}
                onClick={() => onSelectThought(thought.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs text-gray-500 font-medium">
                    {thought.date}
                  </div>
                  {thought.id === currentThoughtId && (
                    <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      נוכחי
                    </div>
                  )}
                </div>
                <div className="line-clamp-2 text-sm text-gray-800 mb-3">
                  {thought.text}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {thought.analysis.themes.slice(0, 3).map((theme, i) => (
                    <div key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {theme}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors">
                    <span>צפה בניתוח</span>
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThoughtTabs;
