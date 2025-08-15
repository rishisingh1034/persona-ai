'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, MicIcon, PlusIcon, StopCircleIcon, VolumeXIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/useTTS';
import { Persona } from '@/types/chat';

interface ModernChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  onStop?: () => void;
  persona?: Persona;
}

export default function ModernChatInput({
  onSendMessage,
  isLoading = false,
  placeholder = "Ask your coding question...",
  onStop,
  persona = 'hitesh',
}: ModernChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // TTS hook for voice functionality
  const { speak, isPlaying: isSpeaking, isLoading: isGeneratingVoice } = useTTS({
    autoPlay: true,
    fallbackEnabled: true
  });

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

  // Handle speaker button click for voice demo
  const handleSpeakerDemo = async () => {
    if (persona === 'hitesh') {
      const demoMessage = "Hello! I'm Hitesh. Ready to learn coding together?";
      await speak(demoMessage, 'hitesh');
    }
  };

  const handleStop = () => {
    if (onStop) {
      onStop();
    }
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm transition-all duration-300">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex gap-3 items-end animate-slideInLeft">
          {/* Attachment Button */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-10 w-10 rounded-full hover:bg-accent transition-all duration-200 hover:scale-110 animate-bounceIn"
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
                  "focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
                  "placeholder:text-muted-foreground hover:border-primary/50",
                  "focus:shadow-lg focus:shadow-primary/20",
                  isLoading && "opacity-50",
                  message.trim() && "animate-pulseGlow"
                )}
                maxLength={1000}
              />
              
              {/* Voice Input Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceInput}
                className="absolute right-12 h-8 w-8 rounded-full hover:bg-accent transition-all duration-200 hover:scale-110"
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
                  className="absolute right-2 h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-110 animate-pulse"
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
                    "absolute right-2 h-8 w-8 rounded-full transition-all duration-300",
                    message.trim() 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:scale-110 animate-bounceIn" 
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
        
        {/* Voice Demo Message - Only for Hitesh */}
        {persona === 'hitesh' && (
          <div className="mt-2 px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeakerDemo}
                disabled={isGeneratingVoice || isSpeaking}
                className="h-5 w-5 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full flex-shrink-0"
                title="Hear Hitesh's voice"
              >
                {isGeneratingVoice || isSpeaking ? (
                  <div className="h-3 w-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <VolumeXIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                )}
              </Button>
              <span className="text-blue-700 dark:text-blue-300">
                {isGeneratingVoice ? 'Generating voice...' : isSpeaking ? 'Playing voice...' : 'Click 🔊 to hear Hitesh\'s voice! You can also click on any response to hear it.'}
              </span>
            </div>
          </div>
        )}

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
