# Gnixy doctor

Voice-based AI Healthcare Agent — UI-only frontend connecting to a Pipecat backend.

## Architecture

```
[Client (Web / Android / iOS)] -- WebSocket --> [Pipecat Backend (Python)]
```

The frontend connects to a Python Pipecat backend via WebSocket. Voice audio flows bidirectionally — microphone input to backend for STT → LLM → TTS processing, and bot audio back for playback.

## Setup

**Prerequisites:** Node.js 18+, Python Pipecat backend running

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure backend connection in `.env`:

   ```env
   BACKEND_URL=http://localhost:7860
   BACKEND_CONNECT_PATH=/connect
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 3000) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript type checking |
| `npm run cap:sync` | Sync web assets to native platforms |
| `npm run cap:open:android` | Open Android project in Android Studio |
| `npm run cap:open:ios` | Open iOS project in Xcode |
| `npm run cap:build:android` | Build web app + sync Android |
| `npm run cap:build:ios` | Build web app + sync iOS |
| `npm run cap:assets` | Regenerate app icons and splash screens |

## Project Structure

```
src/
├── App.tsx                       # Root layout, wires components + hook
├── main.tsx                      # React entry point
├── index.css                     # Tailwind theme + global styles
├── config.ts                     # Environment config reader
├── vite-env.d.ts                 # TypeScript asset declarations
├── assets/
│   └── gnixy_logo.png
├── hooks/
│   └── usePipecat.ts             # Pipecat WebSocket voice hook
└── components/
    ├── Header.tsx                # Sticky header with Gnixy logo
    ├── VoiceVisualizer.tsx       # Mic icon + animations
    ├── ChatInterface.tsx         # Message bubbles
    └── BottomNav.tsx             # Bottom tab navigation
```

## Voice Integration

The `usePipecat` hook wraps `@pipecat-ai/client-js` with `WebSocketTransport`:

- **Connect**: Initializes mic → opens WebSocket to backend
- **Audio**: Bot audio plays through hidden `<audio>` element
- **Transcripts**: Real-time user/bot text appears in chat bubbles
- **States**: Idle → Connecting → Connected → Disconnected

## Mobile App

This project uses [Capacitor](https://capacitorjs.com/) to build native mobile apps for Android and iOS.

### Prerequisites

- **Android**: [Android Studio](https://developer.android.com/studio) (with Android SDK 34+)
- **iOS**: macOS with Xcode 15+

### Building for Android

```bash
# Build web app and sync to Android
npm run cap:build:android

# Open in Android Studio for final build/run
npm run cap:open:android
```

Then in Android Studio, select a device and run the app.

### Building for iOS

```bash
# Build web app and sync to iOS
npm run cap:build:ios

# Open in Xcode for final build/run
npm run cap:open:ios
```

Then in Xcode, select a simulator or device and run the app.

### Microphone Permissions

The app requires microphone access for voice input. Permissions are pre-configured:

- **Android**: `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS` permissions in `AndroidManifest.xml`
- **iOS**: `NSMicrophoneUsageDescription` in `Info.plist`

### Icons

App icons are generated from `design/icon.png`. To regenerate after updating the source:

```bash
npm run cap:assets
```

### Updating After Code Changes

After making changes to the web app code:

```bash
npm run build          # Build web app
npx cap sync           # Sync to native projects
```

Or use the combined commands:

```bash
npm run cap:build:android
npm run cap:build:ios
```
