
import React from "react";

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = "Organizing your thoughts..."
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="glass rounded-xl p-8 flex flex-col items-center justify-center">
        <div className="relative flex">
          <div className="h-10 w-10 rounded-full border-t-2 border-b-2 border-primary animate-rotate-circle"></div>
          <div className="absolute inset-0 h-10 w-10 rounded-full border-r-2 border-transparent border-primary opacity-40 animate-rotate-circle" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-foreground/80 animate-pulse-subtle">{message}</p>
          <div className="mt-2 flex space-x-1 justify-center">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className="h-1.5 w-1.5 rounded-full bg-primary/60"
                style={{ animationDelay: `${i * 0.3}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
