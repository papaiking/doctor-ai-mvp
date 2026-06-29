# Gnixy Doctor AI

Voice-based AI Healthcare Agent for the Gnixy Platform.

## Architecture

```
[Browser Client (React + Vite)] -- WebSocket --> [Pipecat Backend (Python)]
```

The frontend connects to a Python Pipecat backend via WebSocket through Vite's dev proxy. Voice audio flows bidirectionally — microphone input to backend for STT → LLM → TTS processing, and bot audio back for playback.

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

## Project Structure

```
src/
├── App.tsx                       # Root layout, wires components + hook
├── main.tsx                      # React entry point
├── index.css                     # Tailwind theme + global styles
├── config.ts                     # Environment config reader
├── vite-env.d.ts                 # TypeScript asset declarations
├── assets/                       # Static images
│   ├── gnixy_logo.png
│   ├── doctor_icon.png
│   └── chat_icon_100x100.png
├── hooks/
│   └── usePipecat.ts             # Pipecat WebSocket voice hook
└── components/
    ├── Header.tsx                # Sticky header with Gnixy logo
    ├── GnixyLogo.tsx             # Gnixy brand mark
    ├── VoiceCanvas.tsx           # Doctor image + animations
    ├── Controls.tsx              # Start/stop button + status
    └── ChatInterface.tsx         # Message bubbles + text input
```

## Voice Integration

The `usePipecat` hook wraps `@pipecat-ai/client-js` with `WebSocketTransport`:

- **Connect**: Initializes mic → opens WebSocket to backend
- **Audio**: Bot audio plays through hidden `<audio>` element
- **Transcripts**: Real-time user/bot text appears in chat bubbles
- **States**: Idle → Connecting → Connected → Disconnected

---

## Mobile App (Capacitor)

The app is wrapped with [Capacitor](https://capacitorjs.com) to run natively on Android and iOS tablets in full-screen landscape mode.

### Prerequisites

- Node.js 18+
- **Android**: [Android Studio](https://developer.android.com/studio) (latest version recommended — AGP 8.13+ support required)
- **iOS** (macOS only): Xcode 15+

### Environment

The native app connects to your Pipecat backend via WebSocket. Configure in `.env`:

```env
# Backend HTTP URL (for Vite dev proxy fallback)
BACKEND_URL=https://demo.gnixy.com:8443

# Full WebSocket endpoint — overrides Vite proxy for direct connection
WEB_SOCKET_URL=https://demo.gnixy.com:8443

# Connect path (auto-appended to WEB_SOCKET_URL)
BACKEND_CONNECT_PATH=/connect
```

The app uses `WEB_SOCKET_URL + BACKEND_CONNECT_PATH` as the bot-start HTTP endpoint, and derives the WebSocket URL by replacing `https://` with `wss://` and overriding the host from the backend's response.

### Build & Run

#### 1. Build web app and sync to native projects

```bash
npm run build:app
```

This runs `vite build` then `npx cap sync` — copies the built web assets into both `android/` and `ios/` platform folders.

#### 2. Run on Android

```bash
# Open in Android Studio, then press Run
npm run open:android

# Or build APK directly from CLI
npm run build:android
# APK at: android/app/build/outputs/apk/release/app-release-unsigned.apk

# Or run on connected device / emulator
npx cap run android
```

#### 3. Run on iOS (macOS only)

```bash
# Open in Xcode, select a simulator/device, press Run
npm run open:ios

# Or run on connected device
npx cap run ios
```

### Development with Live Reload

Test on a real tablet during development:

```bash
# Start Vite dev server
npm run dev

# Option A: Open tablet browser to http://<your-IP>:3000

# Option B: Capacitor live reload on connected device
npx cap run android --livereload --host=<your-IP> --port=3000
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run build:app` | Build web + sync to native projects |
| `npm run open:android` | Open Android project in Android Studio |
| `npm run open:ios` | Open iOS project in Xcode |
| `npm run build:android` | Build unsigned release APK |
| `npm run run:android` | Run on connected Android device |
| `npx cap run ios` | Run on connected iOS device |

### Native Configurations

| Setting | Android | iOS |
|---|---|---|
| Orientation | Landscape (locked) | Landscape only |
| Status bar | Hidden (fullscreen theme) | Hidden (`UIStatusBarHidden`) |
| Mic permission | `RECORD_AUDIO` + `MODIFY_AUDIO_SETTINGS` | `NSMicrophoneUsageDescription` |
| WebView scheme | `https://` (secure context) | `https://` (secure context) |

### Troubleshooting

**"The project is using an incompatible version (AGP 8.13.0)"**
→ Update Android Studio to the latest version (Help → Check for Updates).

**Mic does not work on device**
1. The app now shows a Vietnamese error message if mic access is denied.
2. On Android: go to Settings → Apps → Gnixy Doctor AI → Permissions → enable Microphone.
3. On iOS: the mic permission prompt appears automatically on first connect.
4. If the error is not shown but voice isn't captured, check that the backend WebSocket URL (`wsUrl` returned by the bot-start endpoint) is reachable from your tablet.

**WebSocket connects to localhost instead of remote server**
→ Set `WEB_SOCKET_URL` in `.env` to your backend's HTTPS URL. The app will use this for both the bot-start HTTP request and override the WebSocket host in the backend response.

**App doesn't build (dependency mismatch)**
```bash
npm run build:app
npx cap sync
```

**Clean native build**
```bash
cd android && ./gradlew clean && cd ..
npm run build:app
```

### Project Structure (Mobile)

```
android/                      # Native Android project (Capacitor)
  app/src/main/
    AndroidManifest.xml       # Permissions, orientation, theme
    java/com/gnixy/doctorai/
      MainActivity.java       # Android entry point
ios/                          # Native iOS project (Capacitor)
  App/App/
    Info.plist                # Permissions, orientation, status bar
capacitor.config.ts           # Capacitor configuration
```
