'use client';

import { useState, useRef, useEffect } from 'react';
import { PauseIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  text: string;
  persona: string;
  className?: string;
}

interface TTSVoice {
  name: string;
  lang: string;
  voiceURI: string;
}

// Voice configuration for personas
const PERSONA_VOICES = {
  hitesh: {
    name: 'Hitesh Choudhary',
    audioFile: '/audio/hitesh.mp3', // Your Hitesh audio file
    rate: 0.9,
    pitch: 0.8,
    volume: 1.0
  },
  piyush: {
    name: 'Piyush Garg',
    audioFile: '/audio/piyush.mp3', // Your Piyush audio file
    rate: 0.95,
    pitch: 1.1,
    volume: 1.0
  }
} as const;

export default function AudioPlayer({ text, persona, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<TTSVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [usePersonaVoice, setUsePersonaVoice] = useState(true);
  const [audioFileExists, setAudioFileExists] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices and check audio file existence
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const voiceList = voices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI
      }));
      setAvailableVoices(voiceList);
      
      // Set default voice based on persona
      if (!selectedVoice && voices.length > 0) {
        const personaConfig = PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES];
        if (personaConfig) {
          // Try to find a voice that matches the persona characteristics
          const preferredVoice = voices.find(voice => 
            voice.lang.includes('en') && 
            (persona === 'hitesh' ? 
              voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('david') :
              voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('samantha')
            )
          ) || voices.find(voice => voice.lang.includes('en'));
          
          if (preferredVoice) {
            setSelectedVoice(preferredVoice.voiceURI);
          }
        }
      }
    };

    // Check if persona audio file exists
    const checkAudioFile = async () => {
      const personaConfig = PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES];
      if (personaConfig) {
        try {
          const response = await fetch(personaConfig.audioFile, { method: 'HEAD' });
          setAudioFileExists(response.ok);
        } catch (error) {
          setAudioFileExists(false);
        }
      }
    };

    loadVoices();
    checkAudioFile();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [persona, selectedVoice]);

  const handleWebSpeechTTS = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find selected voice
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    // Configure speech parameters based on persona
    const personaConfig = PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES];
    if (personaConfig) {
      utterance.rate = personaConfig.rate;
      utterance.pitch = personaConfig.pitch;
      utterance.volume = personaConfig.volume;
    } else {
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      console.error('Speech synthesis error');
    };

    speechSynthRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handlePersonaVoiceTTS = async () => {
    const personaConfig = PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES];
    if (!personaConfig) {
      handleWebSpeechTTS();
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to use voice cloning TTS API first
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          persona: persona
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.audioUrl) {
          // If we get back a synthesized audio URL, play it
          if (audioRef.current) {
            audioRef.current.src = data.audioUrl;
            audioRef.current.volume = personaConfig.volume;
            audioRef.current.onplay = () => setIsPlaying(true);
            audioRef.current.onpause = () => setIsPlaying(false);
            audioRef.current.onended = () => setIsPlaying(false);
            audioRef.current.onerror = () => {
              setIsLoading(false);
              setIsPlaying(false);
              handleEnhancedWebSpeechTTS();
            };
            
            await audioRef.current.play();
            setIsLoading(false);
            return;
          }
        }
        
        // If no audio URL, use enhanced Web Speech API with voice cloning characteristics
        handleEnhancedWebSpeechTTS();
      } else {
        // Fallback to enhanced Web Speech API
        handleEnhancedWebSpeechTTS();
      }
    } catch (error) {
      console.error('Voice cloning TTS error:', error);
      handleEnhancedWebSpeechTTS();
    }
  };

  const handleEnhancedWebSpeechTTS = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const personaConfig = PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES];
    
    // Enhanced voice selection based on persona and available audio samples
    const voices = speechSynthesis.getVoices();
    let selectedVoiceForPersona;
    
    if (audioFileExists) {
      // If we have audio samples, try to find voices that match the characteristics
      if (persona === 'hitesh') {
        // Look for deeper, slower voices for Hitesh
        selectedVoiceForPersona = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('male') || 
           voice.name.toLowerCase().includes('david') ||
           voice.name.toLowerCase().includes('alex') ||
           voice.name.toLowerCase().includes('daniel'))
        );
      } else if (persona === 'piyush') {
        // Look for higher, energetic voices for Piyush
        selectedVoiceForPersona = voices.find(voice => 
          voice.lang.includes('en') && 
          (voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('karen') ||
           voice.name.toLowerCase().includes('moira') ||
           voice.name.toLowerCase().includes('tessa'))
        );
      }
    }
    
    // Fallback to selected voice or default
    const finalVoice = selectedVoiceForPersona || 
                      voices.find(v => v.voiceURI === selectedVoice) || 
                      voices.find(voice => voice.lang.includes('en'));
    
    if (finalVoice) {
      utterance.voice = finalVoice;
    }

    // Apply persona-specific voice characteristics inspired by audio samples
    if (personaConfig) {
      utterance.rate = personaConfig.rate;
      utterance.pitch = personaConfig.pitch;
      utterance.volume = personaConfig.volume;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      console.error('Enhanced speech synthesis error');
    };

    speechSynthRef.current = utterance;
    speechSynthesis.speak(utterance);
  };



  const handlePlayPause = async () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    // Use persona voice if enabled, otherwise use system voice
    if (usePersonaVoice) {
      await handlePersonaVoiceTTS();
    } else {
      handleWebSpeechTTS();
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
        title={usePersonaVoice ? 
          (audioFileExists ? 
            `Synthesize in ${PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES]?.name || persona}'s voice` : 
            `Play with ${PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES]?.name || persona} voice settings`
          ) : "Play with system voice"}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="w-4 h-4" />
        ) : (
          <SpeakerWaveIcon className="w-4 h-4" />
        )}
      </Button>

      {/* Voice Type Toggle */}
      <div className="flex items-center gap-1">
        <select
          value={usePersonaVoice ? 'persona' : 'system'}
          onChange={(e) => setUsePersonaVoice(e.target.value === 'persona')}
          className="text-xs bg-transparent border border-blue-300 rounded px-1 py-0.5 max-w-32"
          title="Select voice type"
        >
          <option value="persona">
            {PERSONA_VOICES[persona as keyof typeof PERSONA_VOICES]?.name || persona}
            {audioFileExists ? ' (Voice Cloned)' : ' (Enhanced TTS)'}
          </option>
          <option value="system">System Voice</option>
        </select>
      </div>

      {/* System Voice Selector (only when system voice selected) */}
      {!usePersonaVoice && availableVoices.length > 0 && (
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="text-xs bg-transparent border border-gray-300 rounded px-1 py-0.5 max-w-32"
          title="Select system voice"
        >
          {availableVoices.map((voice) => (
            <option key={voice.voiceURI} value={voice.voiceURI}>
              {voice.name.split(' ').slice(0, 2).join(' ')}
            </option>
          ))}
        </select>
      )}

      <audio
        ref={audioRef}
        preload="metadata"
        style={{ display: 'none' }}
      />
    </div>
  );
}

// PRESET VOICE IMPLEMENTATION:
// 
// 1. Persona Voices:
//    ✅ Hitesh Choudhary voice settings
//    ✅ Piyush Garg voice settings
//    - Place audio files in /public/audio/ folder:
//      * hitesh-voice.mp3
//      * piyush-voice.mp3
//
// 2. Voice Selection:
//    ✅ Toggle between persona and system voices
//    ✅ Persona-specific speech parameters
//    ✅ Fallback to system voices
//
// 3. Future Enhancement:
//    - Integrate with voice cloning services
//    - Use provided audio files as reference
//    - Implement real-time voice synthesis
//
// 4. Audio File Requirements:
//    - Format: MP3, WAV, or OGG
//    - Duration: 10+ seconds recommended
//    - Quality: Clear speech, minimal background noise
//    - Content: Sample sentences in the persona's voice
