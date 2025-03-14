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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Save, Settings as SettingsIcon } from "lucide-react";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  autoAnalyze: boolean;
  language: "he" | "en";
  apiKey: string;
  modelType: "gpt-4" | "gpt-3.5-turbo";
  analysisDepth: number; // 1-5 scale
  saveHistory: boolean;
  continuousChatEnabled: boolean;
  notificationsEnabled: boolean;
}

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  settings: AppSettings;
  onChange: (settings: AppSettings) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onOpenChange,
  settings,
  onChange,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  const handleSave = () => {
    onChange(localSettings);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl border-none shadow-lg p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-medium text-indigo-700 flex items-center gap-2">
              <SettingsIcon size={18} />
              הגדרות
            </DialogTitle>
            <DialogClose className="rounded-full p-1 hover:bg-black/5 transition-colors">
              <X size={16} className="text-gray-500" />
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto" dir="rtl">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">הגדרות כלליות</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="text-sm">ערכת נושא</Label>
              <Select
                value={localSettings.theme}
                onValueChange={(value) => setLocalSettings({...localSettings, theme: value as "light" | "dark" | "system"})}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="בחר ערכת נושא" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">בהיר</SelectItem>
                  <SelectItem value="dark">כהה</SelectItem>
                  <SelectItem value="system">ברירת מחדל מערכת</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="language" className="text-sm">שפה</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) => setLocalSettings({...localSettings, language: value as "he" | "en"})}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="בחר שפה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he">עברית</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="saveHistory" className="text-sm">שמירת היסטוריה</Label>
              <Switch
                id="saveHistory"
                checked={localSettings.saveHistory}
                onCheckedChange={(checked) => setLocalSettings({...localSettings, saveHistory: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notificationsEnabled" className="text-sm">התראות</Label>
              <Switch
                id="notificationsEnabled"
                checked={localSettings.notificationsEnabled}
                onCheckedChange={(checked) => setLocalSettings({...localSettings, notificationsEnabled: checked})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">הגדרות ניתוח</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autoAnalyze" className="text-sm">ניתוח אוטומטי</Label>
              <Switch
                id="autoAnalyze"
                checked={localSettings.autoAnalyze}
                onCheckedChange={(checked) => setLocalSettings({...localSettings, autoAnalyze: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="continuousChatEnabled" className="text-sm">צ'אט רציף עם המחשבות</Label>
              <Switch
                id="continuousChatEnabled"
                checked={localSettings.continuousChatEnabled}
                onCheckedChange={(checked) => setLocalSettings({...localSettings, continuousChatEnabled: checked})}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="analysisDepth" className="text-sm">עומק ניתוח</Label>
                <span className="text-xs text-gray-500">{localSettings.analysisDepth}/5</span>
              </div>
              <Slider
                id="analysisDepth"
                min={1}
                max={5}
                step={1}
                value={[localSettings.analysisDepth]}
                onValueChange={(value) => setLocalSettings({...localSettings, analysisDepth: value[0]})}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>בסיסי</span>
                <span>מעמיק</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="modelType" className="text-sm">מודל AI</Label>
              <Select
                value={localSettings.modelType}
                onValueChange={(value) => setLocalSettings({...localSettings, modelType: value as "gpt-4" | "gpt-3.5-turbo"})}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="בחר מודל" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (מדויק יותר)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 (מהיר יותר)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-sm">מפתח API (אופציונלי)</Label>
              <input
                id="apiKey"
                type="password"
                value={localSettings.apiKey}
                onChange={(e) => setLocalSettings({...localSettings, apiKey: e.target.value})}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
                placeholder="sk-..."
              />
              <p className="text-xs text-gray-500">השאר ריק כדי להשתמש במפתח ברירת המחדל</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 p-3 border-t flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm flex items-center gap-1"
          >
            <Save size={14} />
            <span>שמור הגדרות</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
