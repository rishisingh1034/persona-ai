'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, MicIcon, PlusIcon, StopCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  onStop?: () => void;
}

export default function ModernChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = "Ask your coding question...",
  onStop,
}: ModernChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceInput = () => {
    console.log('Voice input not implemented yet');
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex gap-3 items-end">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-accent"
            title="Attach file (coming soon)"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>

          {/* Input Container */}
          <div className="flex-1 relative">
            <div className="relative flex items-center">
              <Input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className={cn(
                  "pr-20 min-h-[48px] text-sm bg-background border-border rounded-2xl",
                  "focus:ring-2 focus:ring-primary focus:border-transparent",
                  "placeholder:text-muted-foreground",
                  isLoading && "opacity-50"
                )}
                maxLength={1000}
              />
              
              {/* Voice Input Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                className="absolute right-12 h-8 w-8 rounded-full hover:bg-accent"
                title="Voice input (coming soon)"
                disabled={isLoading}
              >
                <MicIcon className="w-4 h-4" />
              </Button>

              {/* Send/Stop Button */}
              {isLoading ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleStop}
                  className="absolute right-2 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  title="Stop generation"
                >
                  <StopCircleIcon className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                  size="icon"
                  className={cn(
                    "absolute right-2 h-8 w-8 rounded-full transition-all duration-200",
                    message.trim() 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="flex justify-between items-center mt-3 px-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Press Enter to send</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Shift+Enter for new line</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className={cn(
              message.length > 800 && "text-orange-500",
              message.length > 950 && "text-destructive"
            )}>
              {message.length}
            </span>
            <span className="opacity-50">/1000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
