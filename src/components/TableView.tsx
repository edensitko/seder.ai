import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Table as TableIcon } from 'lucide-react';

interface TableViewProps {
  thoughts: any[];
  onSelectThought: (id: string) => void;
  height?: number;
}

const TableView: React.FC<TableViewProps> = ({ thoughts, onSelectThought, height = 400 }) => {
  return (
    <div className="relative" style={{ height: `${height}px`, overflowY: 'auto' }}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <TableIcon size={20} className="text-indigo-600" />
        <h3 className="text-lg font-medium text-gray-900">טבלת מחשבות</h3>
      </div>
      
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <TableHead className="text-indigo-700 font-medium">תאריך</TableHead>
              <TableHead className="text-indigo-700 font-medium">מחשבה</TableHead>
              <TableHead className="text-indigo-700 font-medium">תגיות</TableHead>
              <TableHead className="text-indigo-700 font-medium text-center">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {thoughts.map((thought, index) => (
              <TableRow 
                key={thought.id} 
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
                onClick={() => onSelectThought(thought.id)}
              >
                <TableCell className="text-sm text-gray-600 whitespace-nowrap">{thought.date}</TableCell>
                <TableCell className="max-w-[300px] truncate text-sm">{thought.text}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {thought.analysis.themes.slice(0, 3).map((theme: string) => (
                      <span 
                        key={theme}
                        className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700"
                      >
                        {theme}
                      </span>
                    ))}
                    {thought.analysis.themes.length > 3 && (
                      <span className="text-xs text-gray-500 px-1">
                        +{thought.analysis.themes.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <button 
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectThought(thought.id);
                    }}
                  >
                    <Eye size={14} />
                    <span>צפה</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        לחץ על שורה כדי לצפות בניתוח המלא של המחשבה
      </p>
    </div>
  );
}

export default TableView;
