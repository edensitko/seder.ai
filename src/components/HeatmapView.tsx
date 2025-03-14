import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import '../styles/heatmap.css';
import { SavedThought } from './ThoughtTabs';
import { format, subDays } from 'date-fns';
import { Calendar } from 'lucide-react';

interface HeatmapViewProps {
  thoughts: SavedThought[];
  onSelectThought: (id: string) => void;
  height?: number;
}

interface HeatmapValue {
  date: string;
  count: number;
  thoughts: SavedThought[];
}

const heatmapStyles = {
  colorEmpty: { fill: '#f3f4f6' },
  colorScale1: { fill: '#e0e7ff' }, // indigo-100
  colorScale2: { fill: '#c7d2fe' }, // indigo-200
  colorScale3: { fill: '#a5b4fc' }, // indigo-300
  colorScale4: { fill: '#818cf8' }  // indigo-400
};

const HeatmapView: React.FC<HeatmapViewProps> = ({ thoughts, onSelectThought, height = 400 }) => {
  // קבץ מחשבות לפי תאריך
  const groupedThoughts = thoughts.reduce((acc, thought) => {
    const date = format(new Date(thought.date), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {
        date,
        count: 0,
        thoughts: []
      };
    }
    acc[date].count++;
    acc[date].thoughts.push(thought);
    return acc;
  }, {} as Record<string, HeatmapValue>);

  const values = Object.values(groupedThoughts);
  const startDate = subDays(new Date(), 365); // שנה אחורה

  // חישוב סטטיסטיקות
  const totalThoughts = thoughts.length;
  const totalDays = Object.keys(groupedThoughts).length;
  const mostActiveDay = values.length > 0 
    ? values.reduce((max, day) => day.count > max.count ? day : max, values[0])
    : null;

  return (
    <div className="relative" style={{ height: `${height}px` }}>
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-lg" dir="rtl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Calendar size={20} className="text-indigo-600" />
          <h3 className="text-lg font-medium text-gray-900">דפוסי חשיבה לאורך זמן</h3>
        </div>
        
        {/* סטטיסטיקות */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-xs text-indigo-600 mb-1">סה"כ מחשבות</p>
            <p className="text-xl font-bold text-indigo-700">{totalThoughts}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-xs text-indigo-600 mb-1">ימים פעילים</p>
            <p className="text-xl font-bold text-indigo-700">{totalDays}</p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 text-center">
            <p className="text-xs text-indigo-600 mb-1">יום הכי פעיל</p>
            <p className="text-xl font-bold text-indigo-700">
              {mostActiveDay ? mostActiveDay.count : 0}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto bg-gradient-to-r from-indigo-50/50 to-purple-50/50 p-4 rounded-xl">
          <div className="min-w-[800px]">
            <CalendarHeatmap
              startDate={startDate}
              endDate={new Date()}
              values={values}
              classForValue={(value) => {
                if (!value || !value.count) {
                  return 'color-empty';
                }
                return `color-scale-${Math.min(value.count, 4)}`;
              }}
              titleForValue={(value) => {
                if (!value || !value.count) {
                  return 'אין מחשבות';
                }
                return `${value.count} מחשבות ב-${value.date}`;
              }}
              onClick={(value: HeatmapValue) => {
                if (value?.thoughts?.length > 0) {
                  onSelectThought(value.thoughts[0].id);
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">פחות</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
              <div className="w-3 h-3 rounded-sm bg-indigo-100"></div>
              <div className="w-3 h-3 rounded-sm bg-indigo-200"></div>
              <div className="w-3 h-3 rounded-sm bg-indigo-300"></div>
              <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
            </div>
            <span className="text-xs text-gray-500">יותר</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          לחץ על יום כדי לראות את המחשבות מאותו יום
        </p>
      </div>
    </div>
  );
}

export default HeatmapView;
