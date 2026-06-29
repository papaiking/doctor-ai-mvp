# CLAUDE.md: Doctor AI Project Guide

## 1. Project Overview
*   **Context:** Voice-based AI Healthcare Agent for the Gnixy Platform.
*   **Frontend:** React + Vite (located in the project root/frontend folder).
*   **Backend:** Python-based using the **Pipecat** framework for real-time multimodal AI (Voice/Text).
*   **Design Language:** strictly follows `design.md` and the Gnixy platform aesthetic.

## 2. Technical Stack & Architecture
### Frontend (React/Vite)
*   **State Management:** React Hooks (useState, useEffect).
*   **Voice Integration:** Pipecat Client SDK for Web.
*   **Visuals:** Canvas API or Framer Motion for the voice wave animations.
*   **Styling:** Tailwind CSS (consistent with Gnixy dashboard variables).

### Backend (Pipecat)
*   **Framework:** Pipecat (python-pipecat).
*   **Core Services:** VAD (Voice Activity Detection), STT (Deepgram/Whisper), LLM (GPT/Qwen), TTS (Cartesia/ElevenLabs).
*   **Transport:** WebRTC (daily-python) for low-latency voice interaction.

## 3. Development Commands
### Frontend (Root or /frontend)
*   `npm install`: Install dependencies.
*   `npm run dev`: Start Vite development server.
*   `npm run build`: Build for production.
*   `npm run lint`: Run ESLint.

### Backend (Root or /backend)
*   `pip install -r requirements.txt`: Install Python packages.
*   `python main.py`: Start the Pipecat agent.
*   `python -m pytest`: Run backend tests.

## 4. Coding Standards & Patterns
*   **Naming:** 
    *   Frontend: PascalCase for components, camelCase for functions.
    *   Backend: snake_case for Python methods and variables.
*   **Component Structure:** Separate the `VoiceCanvas` (visuals) from the `ChatInterface` (logic/history).
*   **Error Handling:** Always use the Gnixy-themed error styles defined in `design.md`.
*   **Voice Workflow:** Ensure the agent prioritizes "Interruptibility" (Pipecat feature) so users can stop the AI mid-sentence.

## 5. Design Constraints (Referencing design.md)
*   **Primary Color:** #0052CC (Gnixy Blue).
*   **Logo:** Always include the Gnixy logo in the `<Header />`.
*   **Voice State:** The Canvas must visually change state when the user is speaking vs. when the AI is speaking.