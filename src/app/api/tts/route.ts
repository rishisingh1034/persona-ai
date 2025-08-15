import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import crypto from 'crypto';

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY
});

// Voice configuration for different personas
const VOICE_CONFIG = {
  hitesh: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_HITESH || 'default_voice_id',
    settings: {
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: true
    }
  },
  piyush: {
    voiceId: process.env.ELEVENLABS_VOICE_ID_PIYUSH || 'default_voice_id',
    settings: {
      stability: 0.6,
      similarityBoost: 0.8,
      style: 0.0,
      useSpeakerBoost: true
    }
  }
};

// Model ID from environment or default
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

// Function to generate a unique filename for the audio
function generateAudioFilename(text: string, persona: string): string {
  const hash = crypto.createHash('md5').update(`${text}-${persona}`).digest('hex');
  return `${persona}_${hash.substring(0, 8)}.mp3`;
}

// Function to check if audio file already exists
function audioFileExists(filename: string): boolean {
  const filePath = join(process.cwd(), 'public', 'generated-audio', filename);
  return existsSync(filePath);
}

// Function to generate speech with ElevenLabs
async function generateSpeech(text: string, persona: string): Promise<string> {
  const config = VOICE_CONFIG[persona as keyof typeof VOICE_CONFIG] || VOICE_CONFIG.hitesh;
  const filename = generateAudioFilename(text, persona);
  
  // Check if audio already exists (caching)
  if (audioFileExists(filename)) {
    console.log(`Using cached audio for ${persona}: ${filename}`);
    return `/generated-audio/${filename}`;
  }

  try {
    console.log(`Generating speech for ${persona} with voice ID: ${config.voiceId}`);
    
    // Generate audio using ElevenLabs
    const audio = await elevenlabs.textToSpeech.convert(config.voiceId, {
      text: text,
      modelId: MODEL_ID,
      voiceSettings: {
        stability: config.settings.stability,
        similarityBoost: config.settings.similarityBoost,
        style: config.settings.style,
        useSpeakerBoost: config.settings.useSpeakerBoost
      }
    });

    // Convert the audio stream to a buffer
    const chunks: Uint8Array[] = [];
    const reader = audio.getReader();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    // Combine all chunks into a single buffer
    const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // Ensure the generated-audio directory exists
    const audioDir = join(process.cwd(), 'public', 'generated-audio');
    if (!existsSync(audioDir)) {
      mkdirSync(audioDir, { recursive: true });
    }

    // Save the audio file
    const filePath = join(audioDir, filename);
    await writeFile(filePath, audioBuffer);
    
    console.log(`Audio saved successfully: ${filename}`);
    return `/generated-audio/${filename}`;
    
  } catch (error) {
    console.error('ElevenLabs API error:', error);
    throw new Error(`Failed to generate speech: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, persona } = await request.json();

    // Validate required fields
    if (!text || !persona) {
      return NextResponse.json(
        { error: 'Missing required fields: text and persona are required.' },
        { status: 400 }
      );
    }

    // Validate persona
    if (!Object.keys(VOICE_CONFIG).includes(persona)) {
      return NextResponse.json(
        { error: `Invalid persona. Supported personas: ${Object.keys(VOICE_CONFIG).join(', ')}` },
        { status: 400 }
      );
    }

    // Check if ElevenLabs API key is configured
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    // Validate text length (ElevenLabs has character limits)
    if (text.length > 2500) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 2500 characters allowed.' },
        { status: 400 }
      );
    }

    try {
      // Generate speech using ElevenLabs
      const audioUrl = await generateSpeech(text, persona);
      
      return NextResponse.json({
        success: true,
        audioUrl: audioUrl,
        text: text,
        persona: persona,
        message: 'Speech generated successfully'
      });
      
    } catch (speechError) {
      console.error('Speech generation failed:', speechError);
      
      // Return fallback response for client-side synthesis
      const fallbackConfig = {
        hitesh: { rate: 0.9, pitch: 0.8, volume: 1.0, voiceIndex: 0 },
        piyush: { rate: 0.95, pitch: 1.1, volume: 1.0, voiceIndex: 1 }
      };
      
      const config = fallbackConfig[persona as keyof typeof fallbackConfig] || fallbackConfig.hitesh;
      
      return NextResponse.json({
        success: false,
        audioUrl: null,
        voiceConfig: config,
        text: text,
        persona: persona,
        message: 'Fallback to client-side synthesis',
        error: speechError instanceof Error ? speechError.message : 'Speech generation failed'
      }, { status: 200 }); // Return 200 to allow fallback
    }

  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to process TTS request' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to list available voices or check status
export async function GET() {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: 'ElevenLabs API key not configured' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      availablePersonas: Object.keys(VOICE_CONFIG),
      modelId: MODEL_ID,
      message: 'TTS service is ready'
    });
  } catch (error) {
    console.error('TTS status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check TTS service status' },
      { status: 500 }
    );
  }
}
