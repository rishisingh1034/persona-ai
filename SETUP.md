# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Optional: For future TTS integration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

## Testing the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Try these test messages:
   - "How do I learn React hooks?"
   - "JavaScript mein closures kya hain?"
   - "Explain async/await in simple terms"

## Troubleshooting

If you see "OpenAI API key not configured" error:
- Make sure `.env.local` exists in the root directory
- Check that the API key is correctly formatted
- Restart the development server after adding the key
