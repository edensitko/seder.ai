import { toast } from "sonner";

interface OpenAIResponse {
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

// OpenAI API Key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Make sure the API key is set
if (!OPENAI_API_KEY) {
  console.warn("Warning: VITE_OPENAI_API_KEY environment variable is not set");
}

export async function analyzeThoughts(thoughts: string): Promise<OpenAIResponse> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `אתה עוזר חכם שמארגן מחשבות לקטגוריות מובנות. 
            נתח את הקלט והחזר תשובת JSON במבנה הבא:
            {
              "summary": "סקירה קצרה של הנקודות העיקריות",
              "themes": ["נושא מרכזי 1", "נושא מרכזי 2"],
              "categories": {
                "tasks": ["משימה 1", "משימה 2"],
                "ideas": ["רעיון 1", "רעיון 2"],
                "goals": ["מטרה 1", "מטרה 2"],
                "reflections": ["מחשבה 1", "מחשבה 2"],
                "decisions": ["החלטה 1", "החלטה 2"]
              },
              "nextSteps": {
                "tasks": ["צעד הבא 1", "צעד הבא 2"],
                "ideas": ["צעד הבא 1", "צעד הבא 2"],
                "goals": ["צעד הבא 1", "צעד הבא 2"],
                "reflections": ["צעד הבא 1", "צעד הבא 2"],
                "decisions": ["צעד הבא 1", "צעד הבא 2"]
              },
              "advice": "עצה מותאמת אישית המבוססת על הניתוח"
            }`
          },
          {
            role: "user",
            content: thoughts
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'נכשל בניתוח המחשבות');
    }

    const data = await response.json();
    try {
      // לנסות לפרסר את התוכן כ-JSON, או לקחת את הטקסט גולמי במקרה של שגיאת פרסור
      const content = data.choices[0].message.content;
      
      // לחפש JSON בתוך התוכן אם יש
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      let jsonStr = jsonMatch ? jsonMatch[1] : content;
      
      // לנסות להסיר תגי JSON אם קיימים
      if (jsonStr.includes('```json')) {
        jsonStr = jsonStr.replace(/```json\n/g, '').replace(/\n```/g, '');
      }
      
      return JSON.parse(jsonStr) as OpenAIResponse;
    } catch (parseError) {
      console.error('שגיאה בפרסור JSON:', parseError);
      toast.error('נכשל בפענוח תשובת ה-AI');
      throw new Error('נכשל בפענוח תשובת ה-AI');
    }
  } catch (error) {
    console.error('שגיאה בניתוח המחשבות:', error);
    throw error;
  }
}
