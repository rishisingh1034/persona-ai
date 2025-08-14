'use client';

import { Persona } from '@/types/chat';
import { personas } from '@/lib/personas';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BotIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  CodeIcon, 
  MessageCircleIcon,
  GraduationCapIcon,
  HeartIcon,
  StarIcon
} from 'lucide-react';

interface HeroSectionProps {
  onSelectPersona: (persona: Persona) => void;
}

export default function HeroSection({ onSelectPersona }: HeroSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BotIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                AI Coding Mentors
                <SparklesIcon className="w-4 h-4 text-primary" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Learn coding with India's top educators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Text - Compact */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Powered by AI
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Learn Coding with Your
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {' '}Favorite Mentors
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Get personalized coding guidance from AI versions of Hitesh Choudhary and Piyush Garg in Hindi, Hinglish, or English.
          </p>

          {/* Features - Compact */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircleIcon className="w-4 h-4 text-primary" />
              <span className="text-sm">Multilingual</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CodeIcon className="w-4 h-4 text-primary" />
              <span className="text-sm">Code Examples</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCapIcon className="w-4 h-4 text-primary" />
              <span className="text-sm">Personalized</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <HeartIcon className="w-4 h-4 text-primary" />
              <span className="text-sm">Beginner Friendly</span>
            </div>
          </div>
        </div>

        {/* Mentor Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {Object.values(personas).map((persona) => (
            <Card 
              key={persona.id}
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-pointer bg-card/50 backdrop-blur-sm"
              onClick={() => onSelectPersona(persona.id)}
            >
              {/* Background Gradient */}
              <div className={cn(
                "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity",
                persona.color.replace('bg-', 'bg-gradient-to-br from-') + ' to-transparent'
              )} />
              
              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={persona.avatar} 
                      alt={persona.name}
                      className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {persona.name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        AI Mentor
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {persona.description}
                </p>

                {/* Teaching Style - Compact */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {persona.id === 'hitesh' ? (
                      <>
                        <Badge variant="secondary" className="text-xs">Friendly & Motivational</Badge>
                        <Badge variant="secondary" className="text-xs">Real-world Analogies</Badge>
                        <Badge variant="secondary" className="text-xs">Chai & Code Style</Badge>
                      </>
                    ) : (
                      <>
                        <Badge variant="secondary" className="text-xs">Structured Teaching</Badge>
                        <Badge variant="secondary" className="text-xs">Step-by-step</Badge>
                        <Badge variant="secondary" className="text-xs">Fundamentals Focus</Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full group-hover:shadow-lg transition-all duration-300"
                  size="default"
                >
                  <span>Start Learning with {persona.displayName}</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA - Compact */}
        <div className="text-center mt-8">
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              🇮🇳 Hindi
            </Badge>
            <Badge variant="outline" className="text-xs">
              🌏 Hinglish
            </Badge>
            <Badge variant="outline" className="text-xs">
              🇺🇸 English
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
