import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkle, Send } from "lucide-react";
import { toast } from "sonner";

interface ThoughtInputProps {
  onSubmit: (thought: string) => void;
  isLoading: boolean;
}

const ThoughtInput: React.FC<ThoughtInputProps> = ({ onSubmit, isLoading }) => {
  const [thought, setThought] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  }, [thought]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim()) {
      onSubmit(thought);
      setThought(""); // Clear input after submission
    } else {
      toast.error("אנא הזן מחשבה לפני שליחה");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Sparkle size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">שתף את המחשבות שלך</h3>
        </div>
        
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="מה על דעתך היום? שתף את המחשבות שלך בחופשיות ואני אעזור לארגן אותן..."
            className="w-full min-h-[120px] p-4 rounded-xl bg-white border border-gray-200 
                     focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                     transition-all duration-300 resize-none text-right"
            dir="rtl"
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            disabled={!thought.trim() || isLoading}
            className="absolute bottom-3 left-3 h-10 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 
                     hover:shadow-lg transition-all duration-300 rounded-lg"
          >
            <span className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} className="text-white" />
              )}
              <span>{isLoading ? "מארגן..." : "ארגן מחשבות"}</span>
            </span>
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-right">
          המחשבות שלך נשארות פרטיות ולא נשמרות בשרת.
        </div>
      </form>
    </div>
  );
};

export default ThoughtInput;
