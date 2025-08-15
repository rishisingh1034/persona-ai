'use client';

import { Persona } from '@/types/chat';
import { personas } from '@/lib/personas';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface ChatPersonaHeaderProps {
  selectedPersona: Persona;
}



export default function ChatPersonaHeader({
  selectedPersona,
}: ChatPersonaHeaderProps) {
  const persona = personas[selectedPersona];

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm animate-fadeInDown">
      <div className="max-w-3xl mx-auto px-6 py-3">
        <div className="flex items-center animate-slideInLeft">
          {/* Selected Persona Display - Compact */}
          <div className="flex items-center gap-3 animate-bounceIn">
            <Image
              src={persona.avatar}
              alt={persona.displayName}
              width={32}
              height={32}
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


        </div>
      </div>
    </div>
  );
}
