#!/usr/bin/env node

/**
 * Test script for ElevenLabs TTS integration
 * Run with: node scripts/test-tts.js
 */

const baseUrl = 'http://localhost:3000';

async function testTTSAPI() {
  console.log('🎵 Testing ElevenLabs TTS Integration...\n');

  // Test 1: Check TTS service status
  console.log('1. Checking TTS service status...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/tts`);
    const statusData = await statusResponse.json();
    console.log('   Status:', statusData);
  } catch (error) {
    console.error('   Status check failed:', error.message);
  }

  console.log('\n2. Testing speech generation for Hitesh...');
  try {
    const hiteshResponse = await fetch(`${baseUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello! This is Hitesh speaking. I am testing the ElevenLabs voice cloning integration.',
        persona: 'hitesh'
      })
    });

    const hiteshData = await hiteshResponse.json();
    console.log('   Hitesh response:', hiteshData);
    
    if (hiteshData.success && hiteshData.audioUrl) {
      console.log(`   ✅ Audio generated successfully: ${baseUrl}${hiteshData.audioUrl}`);
    } else if (hiteshData.voiceConfig) {
      console.log('   ⚠️  Fallback to client-side synthesis');
    }
  } catch (error) {
    console.error('   Hitesh test failed:', error.message);
  }

  console.log('\n3. Testing speech generation for Piyush...');
  try {
    const piyushResponse = await fetch(`${baseUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hi there! This is Piyush here. Testing the voice synthesis with different persona settings.',
        persona: 'piyush'
      })
    });

    const piyushData = await piyushResponse.json();
    console.log('   Piyush response:', piyushData);
    
    if (piyushData.success && piyushData.audioUrl) {
      console.log(`   ✅ Audio generated successfully: ${baseUrl}${piyushData.audioUrl}`);
    } else if (piyushData.voiceConfig) {
      console.log('   ⚠️  Fallback to client-side synthesis');
    }
  } catch (error) {
    console.error('   Piyush test failed:', error.message);
  }

  console.log('\n4. Testing error handling (invalid persona)...');
  try {
    const errorResponse = await fetch(`${baseUrl}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'This should fail',
        persona: 'invalid_persona'
      })
    });

    const errorData = await errorResponse.json();
    console.log('   Error response:', errorData);
    
    if (errorResponse.status === 400) {
      console.log('   ✅ Error handling works correctly');
    }
  } catch (error) {
    console.error('   Error test failed:', error.message);
  }

  console.log('\n🎉 TTS testing completed!');
  console.log('\n📝 Setup Instructions:');
  console.log('1. Add your ElevenLabs API key to .env.local');
  console.log('2. Add voice IDs for Hitesh and Piyush personas');
  console.log('3. Start the development server: npm run dev');
  console.log('4. Check generated audio files in public/generated-audio/');
}

// Run the test if this script is executed directly
if (require.main === module) {
  testTTSAPI().catch(console.error);
}

module.exports = { testTTSAPI };
