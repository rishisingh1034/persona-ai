'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  RefreshCwIcon, 
  BookmarkIcon, 
  ShareIcon,
  HelpCircleIcon,
  XIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClearChat?: () => void;
  onSaveChat?: () => void;
  onShareChat?: () => void;
  onShowHelp?: () => void;
}

export default function FloatingActionButton({
  onClearChat,
  onSaveChat,
  onShareChat,
  onShowHelp
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: RefreshCwIcon,
      label: 'Clear Chat',
      onClick: onClearChat,
      className: 'hover:bg-destructive/10 hover:text-destructive'
    },
    {
      icon: BookmarkIcon,
      label: 'Save Chat',
      onClick: onSaveChat,
      className: 'hover:bg-blue-500/10 hover:text-blue-500'
    },
    {
      icon: ShareIcon,
      label: 'Share Chat',
      onClick: onShareChat,
      className: 'hover:bg-green-500/10 hover:text-green-500'
    },
    {
      icon: HelpCircleIcon,
      label: 'Help',
      onClick: onShowHelp,
      className: 'hover:bg-purple-500/10 hover:text-purple-500'
    }
  ];

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {/* Action Buttons */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-3">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                size="icon"
                variant="outline"
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-12 h-12 rounded-full shadow-lg backdrop-blur-sm bg-background/90 border-border/50",
                  "animate-fadeInUp transition-all duration-200 hover:scale-110",
                  action.className
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                title={action.label}
              >
                <IconComponent className="w-5 h-5" />
              </Button>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground",
          "transition-all duration-300 hover:scale-110 animate-bounceIn",
          isOpen && "rotate-45"
        )}
        title={isOpen ? "Close menu" : "Quick actions"}
      >
        {isOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <PlusIcon className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
}
