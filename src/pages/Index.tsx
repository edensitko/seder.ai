import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThoughtInput from "@/components/ThoughtInput";
import LoadingIndicator from "@/components/LoadingIndicator";
import ThoughtTabs, { SavedThought } from "@/components/ThoughtTabs";
import ThoughtResultDialog from "@/components/ThoughtResultDialog";
import ThoughtRequestDialog from "@/components/ThoughtRequestDialog";
import BrainThoughtVisual from "@/components/BrainThoughtVisual";
import TagCloudView from "@/components/TagCloudView";
import TableView from "@/components/TableView";
import HeatmapView from "@/components/HeatmapView";
import GlobalSearch from "@/components/GlobalSearch";
import SettingsDialog, { AppSettings } from "@/components/SettingsDialog";
import { analyzeThoughts } from "@/utils/openai";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Brain, Tag, Table, Calendar, Sparkles, Menu, X, ChevronRight, RefreshCw, Clock, ChevronLeft, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResult {
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
}

const STORAGE_KEY = "saved_thoughts";

const Index = () => {
  const [thought, setThought] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [savedThoughts, setSavedThoughts] = useState<SavedThought[]>([]);
  const [currentThought, setCurrentThought] = useState("");
  const [currentThoughtId, setCurrentThoughtId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    theme: "light",
    autoAnalyze: true,
    language: "he",
    apiKey: "",
    modelType: "gpt-4",
    analysisDepth: 3,
    saveHistory: true,
    continuousChatEnabled: true,
    notificationsEnabled: true,
  });

  // טען מחשבות שמורות מהאחסון המקומי בטעינת הדף
  useEffect(() => {
    const storedThoughts = localStorage.getItem(STORAGE_KEY);
    if (storedThoughts) {
      try {
        const parsed = JSON.parse(storedThoughts);
        setSavedThoughts(parsed);
      } catch (error) {
        console.error("שגיאה בטעינת מחשבות שמורות:", error);
      }
    }
  }, []);

  // שמור מחשבות באחסון המקומי כשהן משתנות
  useEffect(() => {
    if (savedThoughts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedThoughts));
    }
  }, [savedThoughts]);

  const handleSubmitThought = async (thought: string) => {
    setIsLoading(true);
    setCurrentThought(thought);

    try {
      const result = await analyzeThoughts(thought);
      setAnalysis(result);

      // שמור את המחשבה בהיסטוריה
      const thoughtId = uuidv4();
      const newThought: SavedThought = {
        id: thoughtId,
        text: thought,
        date: new Date().toLocaleString('he-IL'),
        analysis: result
      };

      setSavedThoughts(prev => [newThought, ...prev]);
      setCurrentThoughtId(thoughtId);

      // פתח את הדיאלוג עם התוצאה
      setDialogOpen(true);

      toast.success("המחשבות שלך אורגנו בהצלחה");
    } catch (error) {
      console.error("שגיאה בניתוח המחשבות:", error);
      toast.error("לא ניתן לנתח את המחשבות שלך. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectThought = (thoughtId: string) => {
    setCurrentThoughtId(thoughtId);
    const thought = savedThoughts.find(t => t.id === thoughtId);
    if (thought) {
      setAnalysis(thought.analysis);
      setCurrentThought(thought.text);
      setDialogOpen(true);
    }
  };

  // עדכון מחשבה קיימת
  const handleEditThought = async (editedThought: string) => {
    if (!currentThoughtId) return;

    setIsLoading(true);

    try {
      // נתח מחדש את המחשבה המעודכנת
      const result = await analyzeThoughts(editedThought);

      // עדכן את המחשבה בהיסטוריה
      setSavedThoughts(prev => prev.map(thought =>
        thought.id === currentThoughtId
          ? { ...thought, text: editedThought, analysis: result }
          : thought
      ));

      // עדכן את הניתוח הנוכחי
      setAnalysis(result);
      setCurrentThought(editedThought);

      toast.success("המחשבה עודכנה בהצלחה");
    } catch (error) {
      console.error("שגיאה בעדכון המחשבה:", error);
      toast.error("לא ניתן לעדכן את המחשבה. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // ניתוח מחדש של אותה מחשבה
  const handleReanalyzeThought = async () => {
    if (!currentThought) return;

    setIsLoading(true);
    setDialogOpen(false); // סגור את הדיאלוג בזמן העיבוד

    try {
      // נתח מחדש את אותה מחשבה
      const result = await analyzeThoughts(currentThought);

      if (currentThoughtId) {
        // עדכן את המחשבה בהיסטוריה
        setSavedThoughts(prev => prev.map(thought =>
          thought.id === currentThoughtId
            ? { ...thought, analysis: result }
            : thought
        ));
      }

      // עדכן את הניתוח הנוכחי
      setAnalysis(result);

      // פתח מחדש את הדיאלוג עם התוצאה
      setDialogOpen(true);

      toast.success("המחשבה נותחה מחדש בהצלחה");
    } catch (error) {
      console.error("שגיאה בניתוח מחדש של המחשבה:", error);
      toast.error("לא ניתן לנתח מחדש את המחשבה. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // פתיחת דיאלוג בקשה חדשה
  const handleOpenRequestDialog = () => {
    setRequestDialogOpen(true);
  };

  // טיפול בבקשה חדשה
  const handleNewRequest = async (prompt: string, options: any) => {
    setIsLoading(true);
    setCurrentThought(prompt);
    
    try {
      // הוסף פרמטרים מותאמים לבקשה בהתאם לסוג הבקשה
      let requestPrompt = prompt;
      
      switch (options.requestType) {
        case 'summarize':
          requestPrompt = `סכם את המחשבות הבאות באופן תמציתי: ${prompt}`;
          break;
        case 'actionPlan':
          requestPrompt = `צור תוכנית פעולה מפורטת מהמחשבות הבאות: ${prompt}`;
          break;
        case 'deepAnalysis':
          requestPrompt = `בצע ניתוח פסיכולוגי מעמיק של המחשבות הבאות: ${prompt}`;
          break;
        case 'creativeIdeas':
          requestPrompt = `הצע רעיונות יצירתיים הקשורים למחשבות הבאות: ${prompt}`;
          break;
        case 'questions':
          requestPrompt = `הצע שאלות להרהור שיעזרו להעמיק את החשיבה על הנושאים הבאים: ${prompt}`;
          break;
        default:
          requestPrompt = prompt;
      }
      
      const result = await analyzeThoughts(requestPrompt);
      setAnalysis(result);
      
      // שמור את המחשבה בהיסטוריה
      const thoughtId = uuidv4();
      const newThought: SavedThought = {
        id: thoughtId,
        text: prompt,
        date: new Date().toLocaleString('he-IL'),
        analysis: result
      };
      
      setSavedThoughts(prev => [newThought, ...prev]);
      setCurrentThoughtId(thoughtId);
      
      // פתח את הדיאלוג עם התוצאה
      setDialogOpen(true);
      
      toast.success("הבקשה החדשה עובדה בהצלחה");
    } catch (error) {
      console.error("שגיאה בעיבוד הבקשה החדשה:", error);
      toast.error("לא ניתן לעבד את הבקשה החדשה. אנא נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  // עיבוד המחשבות לתצוגה הויזואלית
  const thoughtsForVisual = savedThoughts.map(thought => ({
    id: thought.id,
    text: thought.text,
    category: thought.analysis?.themes?.[0] || "כללי" // שימוש בנושא הראשון כקטגוריה
  }));

  // מחיקת מחשבה
  const handleDeleteThought = (thoughtId: string) => {
    if (!thoughtId) return;

    // מחק את המחשבה מההיסטוריה
    setSavedThoughts(prev => prev.filter(thought => thought.id !== thoughtId));
    
    // אם המחשבה הנוכחית היא זו שנמחקה, סגור את הדיאלוג
    if (currentThoughtId === thoughtId) {
      setDialogOpen(false);
      setCurrentThoughtId("");
      setCurrentThought("");
      setAnalysis(null);
    }

    toast.success("המחשבה נמחקה בהצלחה");
  };

  function handleSendChatMessage(message: string): Promise<string> {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8f9ff] to-[#f0f4ff]" dir="rtl">
      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="relative h-10 w-10 mr-2">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-30"></div>
                  <div className="relative bg-white p-2 rounded-full">
                    <Brain size={24} className="text-purple-600" />
                  </div>
                </div>
                <span className="font-bold text-xl text-gray-900">סדר</span>
              </div>
              <div className="mr-6">
                <GlobalSearch 
                  thoughts={savedThoughts} 
                  onSelectThought={(id) => {
                    const thought = savedThoughts.find(t => t.id === id);
                    if (thought) {
                      setCurrentThoughtId(thought.id);
                      setAnalysis(thought.analysis);
                      setCurrentThought(thought.text);
                      setDialogOpen(true);
                    }
                  }} 
                />
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">ראשי</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">אודות</button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">יצירת קשר</button>
              <button className="ml-4 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:shadow-lg transition-all">התחל עכשיו</button>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-500 hover:text-gray-700">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-100/50 via-transparent to-transparent opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-r from-purple-100/50 via-transparent to-transparent opacity-70"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-right mb-10 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-indigo-50 border border-indigo-100"
              >
                <Sparkles size={16} className="text-indigo-600 mr-2" />
                <span className="text-xs font-medium text-indigo-700">בינה מלאכותית לארגון מחשבות</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight"
              >
                הפוך את <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">המחשבות</span> שלך לבהירות מאורגנת
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0"
              >
                סדר מנצל את כוח הבינה המלאכותית כדי לארגן את המחשבות המפוזרות שלך לתובנות ברורות ומאורגנות, מה שמאפשר לך לחשוב בצורה יעילה יותר.
              </motion.p>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/40">
                  <ThoughtInput onSubmit={handleSubmitThought} isLoading={isLoading} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {isLoading && (
          <div className="w-full flex justify-center py-20">
            <LoadingIndicator />
          </div>
        )}

        {!isLoading && savedThoughts.length > 0 && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">המחשבות המאורגנות שלך</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">צפה במחשבות שלך בצורות שונות כדי לקבל תובנות עמוקות יותר</p>
            </div>

            <Tabs defaultValue="brain" className="w-full">
              <TabsList className="w-full mb-8 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl p-1.5 shadow-sm flex flex-wrap">
                <TabsTrigger value="brain" className="flex-1 gap-2 rounded-lg py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                  <Brain size={18} />
                  תצוגת מוח
                </TabsTrigger>
                <TabsTrigger value="tags" className="flex-1 gap-2 rounded-lg py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                  <Tag size={18} />
                  תצוגת תגיות
                </TabsTrigger>
                <TabsTrigger value="table" className="flex-1 gap-2 rounded-lg py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                  <Table size={18} />
                  תצוגת טבלה
                </TabsTrigger>
                <TabsTrigger value="heatmap" className="flex-1 gap-2 rounded-lg py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
                  <Calendar size={18} />
                  תצוגת חום
                </TabsTrigger>
              </TabsList>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6">
                <TabsContent value="brain">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="brain-view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      {/* תצוגה ויזואלית של המוח והמחשבות */}
                      <BrainThoughtVisual
                        thoughts={thoughtsForVisual}
                        onSelectThought={handleSelectThought}
                        onRemoveThought={handleDeleteThought}
                      />

                      
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="tags">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="tags-view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TagCloudView thoughts={savedThoughts} onSelectThought={handleSelectThought} />
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="table">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="table-view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <TableView
                        thoughts={savedThoughts}
                        onSelectThought={handleSelectThought}
                      />
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>

                <TabsContent value="heatmap">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="heatmap-view"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <HeatmapView
                        thoughts={savedThoughts}
                        onSelectThought={handleSelectThought}
                      />
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              </div>
            </Tabs>
            
            {/* היסטוריית מחשבות - מוצג מתחת לטאבים */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-800">היסטוריית מחשבות</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} className="text-indigo-600" />
                  <span>{savedThoughts.length} מחשבות</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedThoughts.map(thought => (
                  <div 
                    key={thought.id}
                    className={`p-4 bg-white border rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                      thought.id === currentThoughtId 
                        ? 'border-indigo-200 shadow-md shadow-indigo-100/50' 
                        : 'border-gray-100'
                    }`}
                    onClick={() => handleSelectThought(thought.id)}
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
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {thought.analysis.themes.slice(0, 2).map((theme, i) => (
                          <span 
                            key={i} 
                            className="inline-block text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full"
                          >
                            {theme}
                          </span>
                        ))}
                        {thought.analysis.themes.length > 2 && (
                          <span className="text-xs text-gray-500">+{thought.analysis.themes.length - 2}</span>
                        )}
                      </div>
                      <button 
                        className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectThought(thought.id);
                        }}
                      >
                        <span>פרטים</span>
                        <ChevronLeft size={14} />
                      </button>
                      <button 
                        className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteThought(thought.id);
                        }}
                      >
                        <span>מחק</span>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {!isLoading && savedThoughts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Brain size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">התחל לארגן את המחשבות שלך</h2>
            <p className="text-gray-600 max-w-md text-center mb-6">
              שתף את מה שעל דעתך, ואני אעזור לך לארגן את המחשבות שלך לקטגוריות ברורות ופעילות.
            </p>
            <p className="text-sm text-gray-500">המחשבות שלך נשארות פרטיות ולא נשמרות בשרת.</p>
          </div>
        )}

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">יכולות חזקות מבוססות בינה מלאכותית</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">סדר משתמש בטכנולוגיות AI מתקדמות כדי לעזור לך לארגן את המחשבות שלך בדרכים חדשניות</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <Brain size={24} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ניתוח מחשבות</h3>
              <p className="text-gray-600">מנתח את המחשבות שלך ומארגן אותן לקטגוריות ברורות ומובנות.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <Tag size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">זיהוי נושאים</h3>
              <p className="text-gray-600">מזהה נושאים מרכזיים ומגמות בתוך המחשבות שלך לתובנות עמוקות יותר.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <ChevronRight size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">צעדים הבאים</h3>
              <p className="text-gray-600">מציע צעדים מעשיים הבאים על בסיס המחשבות שלך לעזור לך להתקדם.</p>
            </div>
          </div>
        </section>

        {/* דיאלוג עם תוצאות הניתוח */}
        <ThoughtResultDialog 
          isOpen={dialogOpen} 
          onOpenChange={setDialogOpen} 
          result={analysis}
          currentThought={currentThought}
          currentThoughtId={currentThoughtId}
          savedThoughts={savedThoughts}
          onEditThought={handleEditThought}
          onReanalyzeThought={handleReanalyzeThought}
          onSendChatMessage={handleSendChatMessage}
          settings={settings}
          onOpenSettings={() => setSettingsDialogOpen(true)}
          onClose={() => setDialogOpen(false)}
          addThought={handleEditThought}
          onDeleteThought={handleDeleteThought}
        />

        {/* דיאלוג בקשה חדשה */}
        <ThoughtRequestDialog
          isOpen={requestDialogOpen}
          onOpenChange={setRequestDialogOpen}
          onSubmit={handleNewRequest}
          isLoading={isLoading}
          currentThought={currentThought}
        />

        {/* דיאלוג הגדרות */}
        <SettingsDialog
          isOpen={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
          settings={settings}
          onChange={(newSettings) => setSettings(newSettings)}
        />
      </main>
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative h-8 w-8 mr-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-30"></div>
                <div className="relative bg-white p-1.5 rounded-full">
                  <Brain size={20} className="text-purple-600" />
                </div>
              </div>
              <span className="font-bold text-lg text-gray-900">סדר</span>
            </div>
            <div className="text-sm text-gray-500">
              2023 סדר. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
