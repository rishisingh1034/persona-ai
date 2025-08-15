export type Persona = 'hitesh' | 'piyush';

export type Language = 'hindi' | 'hinglish' | 'english';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  persona?: Persona;
}

export interface ChatRequest {
  message: string;
  persona: Persona;
  language: Language;
  conversationHistory?: Message[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}

import { StaticImageData } from 'next/image';

export interface PersonaConfig {
  id: Persona;
  name: string;
  displayName: string;
  avatar: string | StaticImageData;
  description: string;
  systemPrompt: string;
  color: string;
}
