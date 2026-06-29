# Gnixy Doctor AI

Gnixy Doctor AI is a comprehensive, voice-first healthcare assistant ecosystem designed to connect patients at home with their relatives and healthcare providers (hospitals, pharmacies, emergency services).

## 🌟 Ecosystem Components

This repository contains three primary modules:

### 1. Doctor Robot (`/doctor-robot`)
- **What it is:** A home device interface (tablet/smart display kiosk) for the patient.
- **Tech Stack:** React, Vite
- **Purpose:** Allows patients to interact with the AI assistant via natural voice, track their daily health schedule, and alert emergency contacts. Features a simplified landscape UI with a dynamic voice visualizer.

### 2. Doctor Mobile (`/doctor-mobile`)
- **What it is:** A mobile application for relatives and caregivers.
- **Tech Stack:** React, Vite, Capacitor (iOS/Android)
- **Purpose:** Enables family members to remotely monitor the health status of their parents/relatives from anywhere, anytime. Features health history charts (blood pressure, temperature) and chat logs.

### 3. AI Agent Server (`/websocket/server` or `/ai-agent`)
- **What it is:** The backend Python module powering the intelligence of the system.
- **Tech Stack:** Python, WebSockets, Pipecat (Real-time voice AI framework)
- **Purpose:** Handles real-time socket connections from the frontend clients, processes voice/text inputs, connects to medical knowledge bases, and generates ultra-low latency AI responses.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (3.10+)
- **Android Studio & Xcode** (for building the mobile app natively)

### Backend (Python AI Agent)
Navigate to the server module, set up your Python environment, and start the WebSocket server:
```bash
cd websocket/server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Configure your .env variables here (e.g., LLM/STT API keys)
python main.py
```

### Frontend (Doctor Robot & Mobile)
Both frontend apps use standard Vite development commands. Run them in separate terminals:

**For the Robot (Tablet UI):**
```bash
cd doctor-robot
npm install
# Copy .env.example to .env and point VITE_WS_URL to your python server
npm run dev
```

**For the Mobile App (Caregiver UI):**
```bash
cd doctor-mobile
npm install
# Copy .env.example to .env and point VITE_WS_URL to your python server
npm run dev
```

**To build and run the mobile app natively via Capacitor:**
```bash
cd doctor-mobile
npx cap sync
npx cap open android # Opens Android Studio
# OR
npx cap open ios     # Opens Xcode
```

---

## 📚 Documentation
For a more detailed architectural overview and usage instructions, please refer to the `docs/` folder, particularly [Agent.md](./docs/Agent.md).