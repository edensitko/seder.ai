import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ThoughtAnalysis from "./ThoughtAnalysis";
import {
  X,
  Edit,
  RefreshCw,
  Save,
  Check,
  MessageSquarePlus,
  Sparkles,
  Tag,
  Table,
  Calendar,
  Brain,
  Send,
  Settings as SettingsIcon,
  ListChecks,
  LightbulbIcon,
  Target,
  BarChart,
} from "lucide-react";
import TagCloudView from "./TagCloudView";
import TableView from "./TableView";
import HeatmapView from "./HeatmapView";
import BrainThoughtVisual from "./BrainThoughtVisual";
import ChatMessage, { MessageRole } from "./ChatMessage";
import { format } from "date-fns";

interface ChatMessageType {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
}

interface ThoughtResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  } | null;
  currentThought?: string;
  currentThoughtId?: string;
  savedThoughts?: any[];
  onEditThought?: (editedThought: string) => void;
  onReanalyzeThought?: () => void;
  onSendChatMessage?: (message: string) => Promise<string>;
  settings?: {
    continuousChatEnabled: boolean;
    [key: string]: any;
  };
  onOpenSettings?: () => void;
  onClose?: () => void;
  addThought?: (thought: string) => void;
  onDeleteThought?: (thoughtId: string) => void;
}

const ThoughtResultDialog: React.FC<ThoughtResultDialogProps> = ({
  isOpen,
  onOpenChange,
  result,
  currentThought = "",
  currentThoughtId,
  savedThoughts = [],
  onEditThought,
  onReanalyzeThought,
  onSendChatMessage,
  settings = { continuousChatEnabled: true },
  onOpenSettings,
  onClose,
  addThought,
  onDeleteThought,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedThought, setEditedThought] = useState(currentThought);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for sub-thoughts
  const [subThoughts, setSubThoughts] = useState<Array<{id: string; text: string; category: string}>>([]);
  const [selectedSubThought, setSelectedSubThought] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentThought && settings.continuousChatEnabled && chatMessages.length === 0) {
      const initialUserMessage: ChatMessageType = {
        id: Date.now().toString(),
        content: currentThought,
        role: 'user',
        timestamp: format(new Date(), 'HH:mm')
      };
      
      const initialAssistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: result?.summary || "ניתוח המחשבה שלך...",
        role: 'assistant',
        timestamp: format(new Date(), 'HH:mm')
      };
      
      setChatMessages([initialUserMessage, initialAssistantMessage]);
    }
  }, [isOpen, currentThought, settings.continuousChatEnabled, result]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (result) {
      console.log("Result received in ThoughtResultDialog:", result);
      const newSubThoughts = [
        ...result.categories.tasks.map((text, index) => ({
          id: `task-${index}`,
          text,
          category: 'משימות'
        })),
        ...result.categories.ideas.map((text, index) => ({
          id: `idea-${index}`,
          text,
          category: 'רעיונות'
        })),
        ...result.categories.goals.map((text, index) => ({
          id: `goal-${index}`,
          text,
          category: 'מטרות'
        })),
        ...result.categories.reflections.map((text, index) => ({
          id: `reflection-${index}`,
          text,
          category: 'רפלקציות'
        })),
        ...result.categories.decisions.map((text, index) => ({
          id: `decision-${index}`,
          text,
          category: 'החלטות'
        }))
      ];
      console.log("Generated subThoughts:", newSubThoughts);
      setSubThoughts(newSubThoughts);
    }
  }, [result]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'משימות':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'רעיונות':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'מטרות':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'רפלקציות':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'החלטות':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'משימות':
        return <ListChecks size={14} className="text-blue-500" />;
      case 'רעיונות':
        return <LightbulbIcon size={14} className="text-yellow-500" />;
      case 'מטרות':
        return <Target size={14} className="text-green-500" />;
      case 'רפלקציות':
        return <MessageSquarePlus size={14} className="text-purple-500" />;
      case 'החלטות':
        return <Check size={14} className="text-red-500" />;
      default:
        return <Sparkles size={14} className="text-gray-500" />;
    }
  };

  // Function to create a new thought from a sub-thought
  const handleCreateNewThought = (subThoughtText: string) => {
    if (onClose && addThought) {
      onClose();
      // Wait for the dialog to close before adding the new thought
      setTimeout(() => {
        addThought(subThoughtText);
      }, 300);
    }
  };

  // Function to remove a sub-thought
  const handleRemoveSubThought = (id: string) => {
    setSubThoughts(prev => prev.filter(st => st.id !== id));
    if (selectedSubThought === id) {
      setSelectedSubThought(null);
    }
  };

  // Function to clear all sub-thoughts
  const handleClearAllSubThoughts = () => {
    setSubThoughts([]);
    setSelectedSubThought(null);
  };

  // Function to reanalyze the thought
  const handleReanalyze = () => {
    if (onReanalyzeThought) {
      onReanalyzeThought();
    }
  };

  if (!result) return null;

  const handleSaveEdit = () => {
    if (onEditThought && editedThought.trim()) {
      onEditThought(editedThought);
    }
    setIsEditing(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !onSendChatMessage || isLoading) return;
    
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content: chatInput,
      role: 'user',
      timestamp: format(new Date(), 'HH:mm')
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true);
    
    try {
      const response = await onSendChatMessage(chatInput);
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: format(new Date(), 'HH:mm')
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending chat message:", error);
      
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: "אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.",
        role: 'assistant',
        timestamp: format(new Date(), 'HH:mm')
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" dir="rtl">
        <DialogHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-medium text-indigo-700">תוצאות הניתוח</DialogTitle>
            <div className="flex items-center gap-2">
              {currentThoughtId && (
                <div className="text-xs text-gray-600 bg-white/80 px-2 py-0.5 rounded-full border border-gray-200">
                  מזהה: {currentThoughtId}
                </div>
              )}
              {onEditThought && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-gray-500 hover:text-gray-700" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Check size={14} /> : <Edit size={14} />}
                </Button>
              )}
              {onDeleteThought && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 text-gray-500 hover:text-gray-700" 
                  onClick={() => onDeleteThought(currentThoughtId || '')}
                >
                  <X size={14} />
                </Button>
              )}
              <DialogClose className="h-7 w-7 rounded-full inline-flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <X size={14} />
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Shared thought info panel */}
          {isEditing ? (
            <div className="p-3 border-b">
              <Textarea
                value={editedThought}
                onChange={(e) => setEditedThought(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 resize-none text-right text-sm"
                dir="rtl"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs flex items-center gap-1"
                >
                  <Save size={14} />
                  <span>שמור</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-3 border-b">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-gray-500">
                  תאריך: {savedThoughts && currentThoughtId && savedThoughts.find(t => t.id === currentThoughtId)?.date}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 text-right mb-2">
                {currentThought}
              </div>
              {result && (
                <div className="flex flex-wrap gap-1 mb-1">
                  <div className="text-xs text-gray-700 font-medium">נושאים:</div>
                  {result.themes.map((theme, index) => (
                    <span key={index} className="inline-block text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {theme}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Sub-thoughts summary */}
              {subThoughts.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-700 font-medium">תת-מחשבות ({subThoughts.length}):</div>
                    <div className="flex gap-1">
                      <button 
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                        onClick={handleClearAllSubThoughts}
                      >
                        <X size={12} />
                        <span>נקה</span>
                      </button>
                      <button 
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        onClick={() => {
                          const tabTrigger = document.querySelector('[data-state="inactive"][value="subthoughts"]') as HTMLElement;
                          if (tabTrigger) tabTrigger.click();
                        }}
                      >
                        <span>הצג הכל</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(
                      subThoughts.reduce((acc, st) => {
                        acc[st.category] = (acc[st.category] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([category, count]) => (
                      <div 
                        key={category} 
                        className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${getCategoryColor(category)}`}
                      >
                        {getCategoryIcon(category)}
                        <span>{category}: {count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Tabs defaultValue="analysis" className="w-full">
            <div className="border-b">
              <TabsList className="w-full bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="analysis" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  ניתוח
                </TabsTrigger>
                <TabsTrigger 
                  value="tags" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  תגיות
                </TabsTrigger>
                <TabsTrigger 
                  value="table" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  טבלה
                </TabsTrigger>
                <TabsTrigger 
                  value="heatmap" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  מפת חום
                </TabsTrigger>
                <TabsTrigger 
                  value="brain" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  מוח
                </TabsTrigger>
                <TabsTrigger 
                  value="subthoughts" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  תת-מחשבות
                </TabsTrigger>
                <TabsTrigger 
                  value="chat" 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-1.5 text-xs"
                >
                  צ'אט
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="analysis" className="mt-0 p-0">
              <div className="p-3">
                {result && (
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                        <Sparkles size={16} className="text-indigo-500" />
                        סיכום
                      </h3>
                      <p className="text-sm text-gray-700">{result.summary}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                        <Sparkles size={16} className="text-indigo-500" />
                        עצות
                      </h3>
                      <p className="text-sm text-gray-700">{result.advice}</p>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                        <ListChecks size={16} className="text-blue-500" />
                        משימות
                      </h3>
                      <ul className="space-y-1">
                        {result.categories.tasks.length > 0 ? (
                          result.categories.tasks.map((item, index) => (
                            <li key={index} className="text-xs text-gray-700 flex items-start gap-1">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-gray-500 italic">אין משימות</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                      <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                        <LightbulbIcon size={16} className="text-yellow-500" />
                        רעיונות
                      </h3>
                      <ul className="space-y-1">
                        {result.categories.ideas.length > 0 ? (
                          result.categories.ideas.map((item, index) => (
                            <li key={index} className="text-xs text-gray-700 flex items-start gap-1">
                              <span className="text-yellow-500 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-gray-500 italic">אין רעיונות</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tags" className="mt-0 p-0">
              <div className="p-3">
                {result && (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-1">
                      <Tag size={16} className="text-indigo-500" />
                      נושאים מרכזיים
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.themes.map((theme, index) => (
                        <div 
                          key={index} 
                          className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                          style={{
                            fontSize: `${Math.max(0.8, Math.min(1.5, 1 + index * 0.1))}rem`
                          }}
                        >
                          {theme}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-3">
                  <TagCloudView 
                    thoughts={savedThoughts || []} 
                    onSelectThought={() => {}} 
                    height={250}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-0 p-0">
              <div className="p-3">
                {result && (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm mb-3">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                      <Table size={16} className="text-indigo-500" />
                      סיווג מחשבה
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs font-medium text-gray-700 mb-1">
                          סיכום
                        </div>
                        <p className="text-xs text-gray-600">{result.summary}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <TableView 
                  thoughts={savedThoughts || []} 
                  onSelectThought={() => {}} 
                  height={250}
                />
              </div>
            </TabsContent>

            <TabsContent value="heatmap" className="mt-0 p-0">
              <div className="p-3">
                {result && (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm mb-3">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                      <Calendar size={16} className="text-indigo-500" />
                      תובנות מחשבה
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {result.themes.slice(0, 3).map((theme, index) => (
                        <span key={index} className="inline-block text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <HeatmapView 
                  thoughts={savedThoughts || []} 
                  onSelectThought={() => {}} 
                  height={250}
                />
              </div>
            </TabsContent>

            <TabsContent value="brain" className="mt-0 p-0">
              <div className="p-3">
                {subThoughts.length > 0 ? (
                  <>
                    <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm mb-3">
                      <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                        <Brain size={16} className="text-indigo-500" />
                        תת-מחשבות במוח
                      </h3>
                      <p className="text-xs text-gray-700 mb-3">
                        הצגה ויזואלית של תת-המחשבות לפי קטגוריה. לחץ על תת-מחשבה כדי לראות את הפרטים שלה.
                      </p>
                    
                      <BrainThoughtVisual 
                        thoughts={subThoughts.map(subThought => ({
                          id: subThought.id,
                          text: subThought.text,
                          category: subThought.category
                        }))} 
                        onSelectThought={(id) => {
                          setSelectedSubThought(id);
                          // מעבר ללשונית תת-מחשבות
                          const tabTrigger = document.querySelector('[data-state="inactive"][value="subthoughts"]') as HTMLElement;
                          if (tabTrigger) tabTrigger.click();
                        }}
                        onRemoveThought={handleRemoveSubThought}
                        height={250}
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm text-center">
                    <div className="text-gray-500 text-sm">אין תת-מחשבות זמינות להצגה במוח</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="subthoughts" className="mt-0 p-0">
              <div className="p-3">
                {subThoughts.length > 0 ? (
                  <>
                    {selectedSubThought ? (
                      <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-gray-800 flex items-center gap-1">
                            {getCategoryIcon(subThoughts.find(st => st.id === selectedSubThought)?.category || '')}
                            <span>פרטי תת-מחשבה</span>
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedSubThought(null)}
                            className="h-6 px-2 text-xs"
                          >
                            חזרה לרשימה
                          </Button>
                        </div>
                        
                        <div className={`p-3 rounded-lg text-sm ${getCategoryColor(subThoughts.find(st => st.id === selectedSubThought)?.category || '')}`}>
                          {subThoughts.find(st => st.id === selectedSubThought)?.text}
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="text-xs font-medium text-gray-700 mb-1">קטגוריה</div>
                            <div className="text-sm">{subThoughts.find(st => st.id === selectedSubThought)?.category}</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg">
                            <div className="text-xs font-medium text-gray-700 mb-1">מזהה</div>
                            <div className="text-sm">{selectedSubThought}</div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-xs font-medium text-gray-700 mb-1">פעולות אפשריות</div>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => {
                                setChatInput(`איך אני יכול לפתח את התת-מחשבה: "${subThoughts.find(st => st.id === selectedSubThought)?.text}"?`);
                                const tabTrigger = document.querySelector('[data-state="inactive"][value="chat"]') as HTMLElement;
                                if (tabTrigger) tabTrigger.click();
                              }}
                            >
                              שאל על תת-מחשבה זו
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => handleCreateNewThought(subThoughts.find(st => st.id === selectedSubThought)?.text || '')}
                            >
                              צור מחשבה חדשה
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={() => handleRemoveSubThought(selectedSubThought || '')}
                            >
                              מחק תת-מחשבה
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                              <Sparkles size={16} className="text-indigo-500" />
                              תת-מחשבות לפי קטגוריה
                            </h3>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 px-2 text-xs"
                              onClick={handleClearAllSubThoughts}
                            >
                              נקה הכל
                            </Button>
                          </div>
                          
                          {Object.entries(
                            subThoughts.reduce((acc, st) => {
                              acc[st.category] = acc[st.category] || [];
                              acc[st.category].push(st);
                              return acc;
                            }, {} as Record<string, typeof subThoughts>)
                          ).map(([category, thoughts]) => (
                            <div key={category} className="mb-3">
                              <div className={`text-xs font-medium mb-1 flex items-center gap-1 ${getCategoryColor(category).replace('bg-', 'text-').replace('-50', '-700')}`}>
                                {getCategoryIcon(category)}
                                <span>{category} ({thoughts.length})</span>
                              </div>
                              <div className="space-y-1">
                                {thoughts.map((thought) => (
                                  <div 
                                    key={thought.id} 
                                    className={`p-2 text-xs rounded-lg border cursor-pointer hover:opacity-80 ${getCategoryColor(thought.category)} relative group`}
                                  >
                                    <div 
                                      className="flex justify-between items-start"
                                      onClick={() => setSelectedSubThought(thought.id)}
                                    >
                                      <div>{thought.text}</div>
                                    </div>
                                    <button
                                      className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-gray-200"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveSubThought(thought.id);
                                      }}
                                    >
                                      <X size={12} className="text-gray-500" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm text-center">
                    <div className="text-gray-500 text-sm">אין תת-מחשבות זמינות</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="mt-0 p-0">
              <div className="p-3 flex flex-col h-[350px]">
                {result && chatMessages.length === 0 && (
                  <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm mb-3">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
                      <MessageSquarePlus size={16} className="text-indigo-500" />
                      שאל על המחשבה
                    </h3>
                    <p className="text-xs text-gray-700 mb-2">
                      אתה יכול לשאול שאלות על המחשבה הזו. הנה כמה רעיונות:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <button 
                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-100"
                        onClick={() => setChatInput("איך אני יכול לפתח את הרעיון הזה?")}
                      >
                        איך אני יכול לפתח את הרעיון הזה?
                      </button>
                      <button 
                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-100"
                        onClick={() => setChatInput("מה הצעדים הבאים שכדאי לי לעשות?")}
                      >
                        מה הצעדים הבאים שכדאי לי לעשות?
                      </button>
                      <button 
                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-100"
                        onClick={() => setChatInput("איך המחשבה הזו קשורה למחשבות קודמות שלי?")}
                      >
                        איך המחשבה הזו קשורה למחשבות קודמות שלי?
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto mb-3 bg-gray-50 rounded-lg p-3 space-y-3" dir="rtl">
                  {chatMessages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-2 rounded-lg text-sm ${
                          message.role === 'user' 
                            ? 'bg-indigo-100 text-indigo-900 rounded-bl-none' 
                            : 'bg-white border border-gray-200 text-gray-800 rounded-br-none'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-2 rounded-lg text-gray-500 text-sm rounded-br-none">
                        <span className="inline-block animate-pulse">...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex gap-2" dir="rtl">
                  <Textarea 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="שאל שאלה על המחשבות שלך..."
                    className="flex-1 p-2 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-right"
                    dir="rtl"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="h-8 px-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Send size={14} className="rotate-180" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="bg-gray-50 p-2 border-t flex justify-between items-center">
          <div className="flex items-center gap-2 justify-end">
            {onReanalyzeThought && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReanalyze}
                className="text-xs flex items-center gap-1 h-7 px-2"
              >
                <RefreshCw size={12} className="text-indigo-600" />
                <span>נתח מחדש</span>
              </Button>
            )}
            
            {onOpenSettings && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onOpenSettings}
                className="text-xs flex items-center gap-1 h-7 px-2"
              >
                <SettingsIcon size={12} className="text-indigo-600" />
                <span>הגדרות</span>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearAllSubThoughts}
              className="text-xs flex items-center gap-1 h-7 px-2"
            >
              <X size={12} className="text-indigo-600" />
              <span>נקה תת-מחשבות</span>
            </Button>

            {onDeleteThought && currentThoughtId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  if (onDeleteThought) {
                    onDeleteThought(currentThoughtId);
                  }
                }}
                className="text-xs flex items-center gap-1 h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <X size={12} className="text-red-600" />
                <span>מחק מחשבה</span>
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            לחץ מחוץ לחלון כדי לסגור
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThoughtResultDialog;
