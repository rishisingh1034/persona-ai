'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, Persona, Language } from '@/types/chat';
import ChatPersonaHeader from './ChatPersonaHeader';
import ModernMessageList from './ModernMessageList';
import ModernChatInput from './ModernChatInput';
import { Button } from '@/components/ui/button';
import { AlertTriangleIcon, XIcon, BotIcon, SparklesIcon, ArrowLeftIcon } from 'lucide-react';
import SuggestedQuestions from './SuggestedQuestions';
import FloatingActionButton from './FloatingActionButton';

interface ModernChatInterfaceProps {
  initialPersona?: Persona;
  onBackToHome?: () => void;
}

export default function ModernChatInterface({
  initialPersona = 'hitesh',
  onBackToHome
}: ModernChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(initialPersona);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('hinglish');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          persona: selectedPersona,
          language: selectedLanguage,
          conversationHistory: messages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setStreamingMessage(assistantContent);
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantContent,
        role: 'assistant',
        timestamp: new Date(),
        persona: selectedPersona,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Chat error:', error);
      setError(error.message || 'An unexpected error occurred');

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, mujhe samajh nahi aaya – ${error.message}. Please try again!`,
        role: 'assistant',
        timestamp: new Date(),
        persona: selectedPersona,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  }, [selectedPersona, selectedLanguage, messages, isLoading]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setStreamingMessage('');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setError(null);
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    setStreamingMessage('');
  };

  const handleSaveChat = () => {
    // TODO: Implement save functionality
    console.log('Save chat functionality to be implemented');
  };

  const handleShareChat = () => {
    // TODO: Implement share functionality
    console.log('Share chat functionality to be implemented');
  };

  const handleShowHelp = () => {
    // TODO: Implement help functionality
    console.log('Help functionality to be implemented');
  };

  return (
    <div className="flex flex-col h-screen bg-background animate-fadeIn">
      {/* Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm animate-fadeInDown">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToHome}
                className="h-10 w-10 rounded-xl hover:bg-accent"
                title="Back to home"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Button>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BotIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                AI Coding Mentors
                <SparklesIcon className="w-4 h-4 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Learn coding with Hitesh Choudhary and Piyush Garg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Persona Header */}
      <ChatPersonaHeader
        selectedPersona={selectedPersona}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3">
              <AlertTriangleIcon className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive flex-1">{error}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setError(null)}
                className="h-6 w-6 text-destructive hover:bg-destructive/20"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative">
        {messages.length > 0 || isLoading ? (
          <ModernMessageList
            messages={messages}
            isLoading={isLoading}
            streamingMessage={streamingMessage}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pb-32">
            <SuggestedQuestions
              persona={selectedPersona}
              onQuestionClick={handleSendMessage}
              isVisible={true}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="animate-fadeInUp">
        <ModernChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStop={handleStop}
          placeholder={`Ask ${selectedPersona === 'hitesh' ? 'Hitesh' : 'Piyush'} your coding question in ${selectedLanguage}...`}
        />
      </div>

      {/* Floating Action Button */}
      {messages.length > 0 && (
        <FloatingActionButton
          onClearChat={handleClearChat}
          onSaveChat={handleSaveChat}
          onShareChat={handleShareChat}
          onShowHelp={handleShowHelp}
        />
      )}
    </div>
  );
}
