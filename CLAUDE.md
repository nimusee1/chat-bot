# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack chatbot application powered by Google's Gemini API. It features a React frontend with a streaming chat interface and an Express backend that handles communication with the Gemini AI model.

**Tech Stack:**
- Frontend: React 19 + Vite + TypeScript + Tailwind CSS
- Backend: Express 5 + TypeScript
- AI: Google Generative AI SDK (`@google/generative-ai`)
- Streaming: Server-Sent Events (SSE) for real-time responses

## Development Commands

```bash
# Install dependencies
npm install

# Run both frontend and backend concurrently (recommended)
npm run dev:all

# Run only frontend (Vite dev server on port 5174)
npm run dev

# Run only backend (Express server on port 3002)
npm run dev:server

# Build for production
npm run build

# Check code style
npm lint

# Preview production build
npm preview
```

## Architecture

### Frontend Structure
- **src/App.tsx**: Main application component
- **src/components/**: React components
  - `ChatRoom.tsx`: Main chat interface component
  - `MessageList.tsx`: Displays chat history
  - `MessageBubble.tsx`: Individual message display with markdown support
  - `InputBox.tsx`: User input field
  - `Markdown.tsx`: Markdown rendering with syntax highlighting
- **src/lib/**: Utility functions
  - `api.ts`: Handles SSE streaming to backend
  - `storage.ts`: localStorage management for chat history
  - `types.ts`: TypeScript type definitions
- **src/main.tsx**: Application entry point

### Backend Structure
- **src/server/index.ts**: Main Express server
  - Loads Gemini API key from `.env.local`
  - Loads system prompt from `src/prompts/system.md`
  - `/api/chat` endpoint: POST endpoint that handles streaming responses
  - `/health` endpoint: Health check endpoint
- **src/prompts/system.md**: System prompt for Gemini model behavior

### Data Flow
1. Frontend sends message array via POST to `/api/chat`
2. Backend formats messages for Gemini Chat API
3. Gemini streams response chunks via SSE
4. Frontend receives chunks and displays them in real-time
5. Frontend saves chat history to localStorage

## Configuration

### Environment Variables (.env.local)
```
GEMINI_API_KEY=your_api_key_here    # Required: Google Generative AI API key
PORT=3002                            # Optional: Backend server port (default: 3002)
NODE_ENV=development                 # Optional: Environment (development/production)
```

**Important:** `.env.local` is in `.gitignore` and should never be committed.

### Frontend API Endpoint
Hardcoded to `http://localhost:3002/api/chat` in [src/lib/api.ts](src/lib/api.ts:3)

## Key Implementation Details

### Gemini API Integration
- Uses official `@google/generative-ai` SDK
- Model: `gemini-2.5-flash`
- Temperature: 0.7
- Max output tokens: 2000
- System instruction format: Object with role and parts structure (required by SDK)

### Message Format
Backend expects:
```typescript
{ messages: Array<{ role: "user" | "assistant", content: string }> }
```

Frontend displays with markdown rendering and syntax highlighting.

### Streaming Implementation
- Uses Server-Sent Events (SSE) for real-time streaming
- Response format: `data: {JSON with text}\n\n`
- Final chunk: `data: [DONE]\n\n`
- Frontend parses chunks and accumulates text

### Storage
Chat history persists to browser localStorage under key `chat_history` using the storage utility.

## Common Tasks

### Debugging API Issues
- Check server logs: `npm run dev:server`
- Verify health: `curl http://localhost:3002/health`
- Check API key: Ensure `.env.local` is present and valid
- Monitor network tab in browser DevTools for SSE streaming

### Adding Frontend Components
Place new React components in `src/components/` directory. Maintain TypeScript types in `src/lib/types.ts`.

### Modifying System Prompt
Edit `src/prompts/system.md` to change the AI behavior. Changes apply on next server restart.

### Adjusting Generation Parameters
Modify generation config in `src/server/index.ts` line 70-73:
- `temperature`: Lower = more focused, higher = more creative
- `maxOutputTokens`: Maximum response length

## Important Notes

- React Markdown components use custom styling via Tailwind classes (not className on ReactMarkdown root)
- Type safety: Project uses TypeScript strict mode
- Both frontend and backend need to be running for full functionality
- API key configuration in Google Cloud Console is required (Generative Language API must be enabled)
