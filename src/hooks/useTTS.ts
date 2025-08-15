'use client';

import { useState, useCallback, useRef } from 'react';

interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  voiceConfig?: {
    rate: number;
    pitch: number;
    volume: number;
    voiceIndex: number;
  };
  text: string;
  persona: string;
  message?: string;
  error?: string;
}

interface UseTTSOptions {
  autoPlay?: boolean;
  fallbackEnabled?: boolean;
}

interface UseTTSReturn {
  speak: (text: string, persona: string) => Promise<void>;
  stop: () => void;
  isLoading: boolean;
  isPlaying: boolean;
  error: string | null;
  lastAudioUrl: string | null;
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const { autoPlay = true, fallbackEnabled = true } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAudioUrl, setLastAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Function to play audio using HTML5 Audio API
  const playAudioFile = useCallback(async (audioUrl: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplaythrough = () => setIsLoading(false);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setError('Failed to play audio file');
        setIsLoading(false);
        setIsPlaying(false);
      };

      if (autoPlay) {
        await audio.play();
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      setError('Audio playback failed');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [autoPlay]);

  // Function to use Web Speech API as fallback
  const speakWithWebSpeechAPI = useCallback((text: string, voiceConfig: any) => {
    if (!window.speechSynthesis) {
      throw new Error('Speech synthesis not supported');
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisRef.current = utterance;

    // Apply voice configuration
    utterance.rate = voiceConfig.rate;
    utterance.pitch = voiceConfig.pitch;
    utterance.volume = voiceConfig.volume;

    // Try to select appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > voiceConfig.voiceIndex) {
      utterance.voice = voices[voiceConfig.voiceIndex];
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setError(`Speech synthesis failed: ${event.error}`);
      setIsPlaying(false);
      setIsLoading(false);
    };

    if (autoPlay) {
      window.speechSynthesis.speak(utterance);
    }
  }, [autoPlay]);

  // Main speak function
  const speak = useCallback(async (text: string, persona: string) => {
    try {
      setError(null);
      setIsLoading(true);

      // Call TTS API
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, persona }),
      });

      const data: TTSResponse = await response.json();

      if (data.success && data.audioUrl) {
        // ElevenLabs synthesis successful
        setLastAudioUrl(data.audioUrl);
        await playAudioFile(data.audioUrl);
      } else if (data.voiceConfig && fallbackEnabled) {
        // Fallback to Web Speech API
        console.log('Using Web Speech API fallback');
        setLastAudioUrl(null);
        speakWithWebSpeechAPI(text, data.voiceConfig);
      } else {
        throw new Error(data.error || 'TTS synthesis failed');
      }
    } catch (err) {
      console.error('TTS error:', err);
      setError(err instanceof Error ? err.message : 'TTS synthesis failed');
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [playAudioFile, speakWithWebSpeechAPI, fallbackEnabled]);

  // Function to stop current playback
  const stop = useCallback(() => {
    // Stop HTML5 audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    error,
    lastAudioUrl,
  };
}
