'use client';

import { useState } from 'react';
import { Persona } from '@/types/chat';
import HeroSection from './HeroSection';
import ModernChatInterface from './ModernChatInterface';

export default function MainApp() {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleSelectPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    setShowChat(true);
  };

  const handleBackToHome = () => {
    setShowChat(false);
    setSelectedPersona(null);
  };

  if (showChat && selectedPersona) {
    return (
      <ModernChatInterface 
        initialPersona={selectedPersona}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return <HeroSection onSelectPersona={handleSelectPersona} />;
}
