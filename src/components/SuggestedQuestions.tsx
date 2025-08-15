'use client';

import { Button } from '@/components/ui/button';
import { Persona } from '@/types/chat';
import {
  CodeIcon,
  RocketIcon,
  BugIcon,
  LightbulbIcon
} from 'lucide-react';

interface SuggestedQuestionsProps {
  persona: Persona;
  onQuestionClick: (question: string) => void;
  isVisible: boolean;
}

const questionSets = {
  hitesh: [
    {
      icon: CodeIcon,
      question: "Sir Nextjs kya hai?"
    },
    {
      icon: RocketIcon,
      question: "Sir Aaj Konsi chai pi rahe ho?"
    },
    {
      icon: BugIcon,
      question: "Chai ke saath kaunsa project banana shuru karun?"
    },
    {
      icon: LightbulbIcon,
      question: "Sir, 2012 mein aapne jaipur police ki kaise help ki thi?"
    }
  ],
  piyush: [
    {
      icon: CodeIcon,
      question: "Sir Mujhe Docker Samajh nhi aata, kya karu?"
    },
    {
      icon: RocketIcon,
      question: "Piyush bhai, hoodie bina code sahi nahi chalta kya? 😂"
    },
    {
      icon: BugIcon,
      question: "Aapke Patila wale log ka asli matlab kya hai?"
    },
    {
      icon: LightbulbIcon,
      question: "Piyush bhai, latest frontend trends kya hai?"
    }
  ]
};

export default function SuggestedQuestions({
  persona,
  onQuestionClick,
  isVisible
}: SuggestedQuestionsProps) {
  const questions = questionSets[persona];

  if (!isVisible) return null;

  return (
    <div className="animate-fadeInUp">
      <div className="max-w-2xl mx-auto px-4 pb-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            💡 Suggested Questions
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started with these popular questions for {persona === 'hitesh' ? 'Hitesh' : 'Piyush'}
          </p>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {questions.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => onQuestionClick(item.question)}
                className="h-auto min-h-[80px] p-4 text-left justify-start hover:bg-accent/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-fadeInUp group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-wrap font-medium text-foreground text-left leading-relaxed break-words">
                      {item.question}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            💡 Click on any question to start the conversation
          </p>
        </div>
      </div>
    </div>
  );
}
