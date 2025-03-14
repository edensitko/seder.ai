import React from 'react';
import { cn } from '@/lib/utils';
import { Brain, User } from 'lucide-react';

export type MessageRole = 'user' | 'assistant';

export interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  timestamp,
}) => {
  const isUser = role === 'user';
  
  return (
    <div
      className={cn(
        "flex w-full gap-2 py-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600">
          <Brain size={16} />
        </div>
      )}
      
      <div
        className={cn(
          "flex flex-col space-y-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isUser
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              : "bg-gray-100 text-gray-800"
          )}
          dir="rtl"
        >
          {content}
        </div>
        
        {timestamp && (
          <span className="text-xs text-gray-500 px-1">
            {timestamp}
          </span>
        )}
      </div>
      
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600">
          <User size={16} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
