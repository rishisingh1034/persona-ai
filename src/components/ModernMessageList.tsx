'use client';

import { Message, Persona } from '@/types/chat';
import { personas } from '@/lib/personas';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardIcon, CheckIcon, UserIcon, BotIcon } from 'lucide-react';
import { useState } from 'react';
import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ai-elements/conversation';
import TypingIndicator from './TypingIndicator';
import Image from 'next/image';

interface ModernMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  streamingMessage?: string;
  currentPersona?: Persona;
}

interface CodeBlockProps {
  children: string;
  className?: string;
}

function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || 'text';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-background hover:bg-accent rounded transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <ClipboardIcon className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          border: '1px solid hsl(var(--border))',
          borderTop: 'none',
          fontSize: '0.875rem',
          background: 'hsl(var(--muted))',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

function MessageBubble({ message, isStreaming = false, streamingContent = '', currentPersona }: {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
  currentPersona?: Persona;
}) {
  const isUser = message.role === 'user';
  const persona = message.persona ? personas[message.persona] : (currentPersona ? personas[currentPersona] : null);

  return (
    <div className={cn(
      "flex gap-3 mb-6 animate-fadeInUp",
      isUser ? "justify-end" : "justify-start"
    )}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 animate-bounceIn">
          {persona?.avatar ? (
            <Image
              src={persona.avatar}
              alt={persona.displayName || 'AI'}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full shadow-sm object-cover flex-shrink-0 transition-transform duration-200 hover:scale-110"
            />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-500 text-white text-sm font-bold shadow-sm flex-shrink-0 transition-transform duration-200 hover:scale-110">
              <BotIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md",
        isUser
          ? "bg-primary text-primary-foreground ml-12 animate-slideInRight"
          : "bg-card text-card-foreground border border-border animate-slideInLeft hover:border-primary/20"
      )}>
        {/* Persona Name */}
        {!isUser && persona && (
          <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1 animate-fadeIn">
            {persona.displayName}
            <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        )}

        {/* Message Text */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !className;
                return !isInline && match ? (
                  <CodeBlock className={className}>
                    {String(children).replace(/\n$/, '')}
                  </CodeBlock>
                ) : (
                  <code
                    className={cn(
                      'px-1.5 py-0.5 rounded text-sm font-mono',
                      isUser
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-foreground'
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm">{children}</li>,
              h1: ({ children }) => <h1 className="text-lg font-semibold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-2">{children}</h3>,
            }}
          >
            {isStreaming ? streamingContent : message.content}
          </ReactMarkdown>
        </div>

        {/* Timestamp */}
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
            <UserIcon className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModernMessageList({
  messages,
  isLoading = false,
  streamingMessage = '',
  currentPersona,
}: ModernMessageListProps) {
  return (
    <Conversation className="flex-1">
      <ConversationContent className="max-w-3xl mx-auto pt-4">
        {/* Welcome Message */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <BotIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Welcome to AI Coding Mentors! 👋
            </h3>
            <p className="text-muted-foreground max-w-md">
              Choose your mentor and start asking coding questions in Hindi, Hinglish, or English.
              Get personalized guidance from AI versions of your favorite educators.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} currentPersona={currentPersona} />
        ))}

        {/* Streaming Message */}
        {isLoading && streamingMessage && messages.length > 0 && (
          <MessageBubble
            message={{
              id: 'streaming',
              content: streamingMessage,
              role: 'assistant',
              timestamp: new Date(),
              persona: messages[messages.length - 1]?.persona || currentPersona || 'hitesh'
            }}
            isStreaming={true}
            streamingContent={streamingMessage}
            currentPersona={currentPersona}
          />
        )}

        {/* Loading Indicator */}
        {isLoading && !streamingMessage && (
          <div className="flex gap-3 justify-start mb-6 animate-fadeInUp">
            <div className="flex-shrink-0 animate-bounceIn">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center animate-pulse">
                <BotIcon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TypingIndicator size="md" />
              <span className="text-sm text-muted-foreground animate-fadeIn">Thinking...</span>
            </div>
          </div>
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
