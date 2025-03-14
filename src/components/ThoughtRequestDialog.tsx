import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Send, Sparkle } from "lucide-react";

interface ThoughtRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (prompt: string, options: any) => void;
  isLoading: boolean;
  currentThought?: string;
}

const ThoughtRequestDialog: React.FC<ThoughtRequestDialogProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  currentThought = "",
}) => {
  const [prompt, setPrompt] = useState(currentThought);
  const [requestType, setRequestType] = useState<string>("summarize");
  
  const requestOptions = [
    { id: "summarize", label: "סיכום מחשבות", description: "סיכום תמציתי של המחשבות העיקריות" },
    { id: "actionPlan", label: "תוכנית פעולה", description: "צעדים מעשיים להתקדמות" },
    { id: "deepAnalysis", label: "ניתוח מעמיק", description: "ניתוח פסיכולוגי מעמיק של המחשבות" },
    { id: "creativeIdeas", label: "רעיונות יצירתיים", description: "הצעות יצירתיות הקשורות למחשבות" },
    { id: "questions", label: "שאלות להרהור", description: "שאלות שיעזרו לך להעמיק את החשיבה" },
  ];

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt, { requestType });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-none shadow-lg p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-medium text-indigo-700">בקשה חדשה</DialogTitle>
            <DialogClose className="rounded-full p-1 hover:bg-black/5 transition-colors">
              <X size={16} className="text-gray-500" />
            </DialogClose>
          </div>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Sparkle size={12} className="text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">בחר סוג בקשה</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2 mb-4">
            {requestOptions.map((option) => (
              <div 
                key={option.id}
                onClick={() => setRequestType(option.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  requestType === option.id 
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border ${
                    requestType === option.id 
                      ? 'border-indigo-500 bg-indigo-500' 
                      : 'border-gray-300'
                  }`}>
                    {requestType === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-auto mt-[3px]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{option.label}</h4>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">המחשבה שלך</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="הזן את המחשבה שלך כאן..."
              className="w-full min-h-[100px] p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-right"
              dir="rtl"
            />
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 p-3 border-t flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm flex items-center gap-1"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={14} className="text-white" />
            )}
            <span>{isLoading ? "מעבד..." : "שלח בקשה"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThoughtRequestDialog;
