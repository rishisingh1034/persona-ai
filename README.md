# AI Coding Mentors - Persona Chat App

A modern full-stack Next.js application featuring AI chat personas of popular Indian coding educators Hitesh Choudhary and Piyush Garg. Users can interact with AI versions of these mentors in Hindi, Hinglish, or English.

## 🌟 Features

- **Dual AI Personas**: Chat with AI versions of Hitesh Choudhary and Piyush Garg
- **Multilingual Support**: Communicate in Hindi, Hinglish, or English
- **Real-time Streaming**: Get responses token-by-token for a natural chat experience
- **Code Highlighting**: Syntax highlighting for code snippets with copy-to-clipboard
- **Responsive Design**: Beautiful UI built with Tailwind CSS and shadcn/ui
- **Accessibility**: Full keyboard navigation and ARIA support
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui, Headless UI
- **AI Integration**: OpenAI GPT-4o
- **State Management**: React hooks + SWR
- **Icons**: Heroicons
- **Markdown**: react-markdown with syntax highlighting
- **TypeScript**: Full type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd persona-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # Chat API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── AudioPlayer.tsx    # TTS placeholder component
│   ├── ChatInput.tsx      # Message input component
│   ├── ChatInterface.tsx  # Main chat interface
│   ├── MessageList.tsx    # Messages display
│   └── PersonaSelector.tsx # Persona/language selector
├── lib/
│   ├── personas.ts        # Persona configurations
│   └── utils.ts           # Utility functions
└── types/
    └── chat.ts            # TypeScript definitions
```

## 🎭 Personas

### Hitesh Choudhary
- **Style**: Friendly, practical, motivational
- **Language**: Uses phrases like "Haanji", "chai pe baat karte hain", "Aap kar sakte hain!"
- **Teaching**: Warm, approachable, uses analogies and real-world examples

### Piyush Garg
- **Style**: Precise, calm, structured
- **Language**: Clear, logical explanations with phrases like "Samjhiye", "Step by step chalte hain"
- **Teaching**: Emphasizes fundamentals and beginner-friendly analogies

## 🌐 API Endpoints

### POST `/api/chat`
Sends a message to the AI persona and returns a streaming response.

**Request Body:**
```json
{
  "message": "How do I learn React?",
  "persona": "hitesh",
  "language": "hinglish",
  "conversationHistory": []
}
```

**Response:** Server-sent events stream with JSON chunks

## 🎨 Customization

### Adding New Personas
1. Update `src/lib/personas.ts` with new persona configuration
2. Add the persona type to `src/types/chat.ts`
3. Update the PersonaSelector component

### Modifying System Prompts
Edit the `systemPrompt` field in `src/lib/personas.ts` to change how personas respond.

### Styling
The app uses Tailwind CSS. Modify styles in component files or `src/app/globals.css`.

## 🔮 Future Enhancements

### Text-to-Speech Integration
The `AudioPlayer` component is ready for TTS integration:

- **ElevenLabs**: Add `ELEVENLABS_API_KEY` and implement `/api/tts` endpoint
- **Azure Speech**: Use Azure Speech Services SDK
- **Local TTS**: Set up XTTS server for voice cloning

### Database Integration
For persistent chat history, add:
- PostgreSQL or Supabase for data storage
- User authentication (NextAuth.js)
- Chat session management

### Additional Features
- Voice input (Speech-to-Text)
- Chat export functionality
- Custom persona creation
- Mobile app (React Native)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out/` folder
- **Railway**: Connect GitHub and add environment variables
- **Docker**: Use the included Dockerfile (if added)

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check your API key is valid and has credits
   - Ensure the key is properly set in `.env.local`

2. **Build Errors**
   - Run `npm run lint` to check for TypeScript errors
   - Clear `.next` folder and rebuild

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for conflicting CSS classes

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues:
- Open a GitHub issue
- Check the troubleshooting section
- Review the Next.js documentation

---

**Built with ❤️ using Next.js, OpenAI, and modern web technologies**
