'use client';

import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  text: string;
  persona: string;
  className?: string;
}

export default function AudioPlayer({ text, persona, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Placeholder for TTS API integration
      // In a real implementation, you would:
      // 1. Send text to TTS service (ElevenLabs, Azure, etc.)
      // 2. Get audio URL/blob back
      // 3. Play the audio
      
      console.log(`TTS requested for ${persona}:`, text);
      
      // For now, show a message that TTS is not implemented
      alert('Text-to-Speech feature is not implemented yet. This is a placeholder for future TTS integration with services like ElevenLabs or Azure Speech.');
      
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayPause}
        disabled={isLoading}
        className="p-1 h-8 w-8"
        title="Play audio (TTS)"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="w-4 h-4" />
        ) : (
          <SpeakerWaveIcon className="w-4 h-4" />
        )}
      </Button>
      
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        style={{ display: 'none' }}
      />
    </div>
  );
}

// Future TTS Integration Guide:
// 
// 1. ElevenLabs Integration:
//    - Add ELEVENLABS_API_KEY to environment
//    - Create API route: /api/tts
//    - Use ElevenLabs API to generate speech
//    - Return audio URL or blob
//
// 2. Azure Speech Services:
//    - Add Azure Speech credentials
//    - Use Speech SDK for text-to-speech
//    - Configure voice based on persona
//
// 3. Local TTS (XTTS):
//    - Set up local TTS server
//    - Configure voice cloning for personas
//    - Handle audio streaming
