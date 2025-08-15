'use client';

import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypingIndicator({ 
  className,
  size = 'md' 
}: TypingIndicatorProps) {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  const containerClasses = {
    sm: 'gap-1 p-2',
    md: 'gap-1.5 p-3',
    lg: 'gap-2 p-4'
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-2xl bg-card border border-border shadow-sm animate-fadeInUp",
      containerClasses[size],
      className
    )}>
      <div className="flex items-center gap-1">
        <div 
          className={cn(
            "bg-muted-foreground rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: '0ms', animationDuration: '1.4s' }}
        />
        <div 
          className={cn(
            "bg-muted-foreground rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: '160ms', animationDuration: '1.4s' }}
        />
        <div 
          className={cn(
            "bg-muted-foreground rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: '320ms', animationDuration: '1.4s' }}
        />
      </div>
    </div>
  );
}
