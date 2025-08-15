'use client';

import { Persona, Language } from '@/types/chat';
import { personas } from '@/lib/personas';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlobeIcon } from 'lucide-react';
import Image from 'next/image';

interface ChatPersonaHeaderProps {
  selectedPersona: Persona;
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { id: Language; label: string; flag: string; description: string }[] = [
  { id: 'hindi', label: 'हिंदी', flag: '🇮🇳', description: 'Pure Hindi' },
  { id: 'hinglish', label: 'Hinglish', flag: '🌏', description: 'Hindi + English' },
  { id: 'english', label: 'English', flag: '🇺🇸', description: 'Pure English' },
];

export default function ChatPersonaHeader({
  selectedPersona,
  selectedLanguage,
  onLanguageChange,
}: ChatPersonaHeaderProps) {
  const persona = personas[selectedPersona];

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm animate-fadeInDown">
      <div className="max-w-3xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between animate-slideInLeft">
          {/* Selected Persona Display - Compact */}
          <div className="flex items-center gap-3 animate-bounceIn">
            <Image
              src={persona.avatar}
              alt={persona.displayName}
              className="w-8 h-8 rounded-xl shadow-sm object-cover transition-transform duration-200 hover:scale-110"
            />
            <div>
              <div className="flex items-center gap-2 animate-fadeIn">
                <h3 className="text-sm font-semibold text-foreground">
                  {persona.displayName}
                </h3>
                <Badge variant="secondary" className="text-xs px-2 py-0 animate-pulse">
                  Your Mentor
                </Badge>
              </div>
            </div>
          </div>

          {/* Language Selection - Compact */}
          <div className="flex items-center gap-2">
            <GlobeIcon className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1">
              {languages.map((language) => (
                <Button
                  key={language.id}
                  variant={selectedLanguage === language.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onLanguageChange(language.id)}
                  className={cn(
                    'h-8 px-3 text-xs transition-all duration-200',
                    selectedLanguage === language.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <span className="mr-1">{language.flag}</span>
                  <span>{language.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
