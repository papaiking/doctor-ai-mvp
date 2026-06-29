# Gnixy Doctor AI

## Project Description

**Gnixy Doctor AI** is a state-of-the-art voice-based healthcare assistant designed to support families with daily health monitoring, medical inquiries, and remote doctor consultations. It acts as an always-available triage and support agent, specifically targeted at families, elderly care, and chronic disease management.

The system architecture is highly interactive and real-time, divided into three primary modules:

1. **`websocket/server`**: The backend engine of the project. It creates a robust socket server responsible for handling real-time audio streams, processing user inputs, and generating AI responses (leveraging the Pipecat framework and LLMs). It manages the state of the conversation and integrates with medical knowledge bases.
2. **`doctor-mobile`**: A cross-platform mobile application (for iOS and Android) built using React, Vite, and Capacitor. It allows users to track their health history (like blood pressure and temperature charts) and chat with the AI on the go.
3. **`doctor-robot`**: A specialized frontend web application built for smart displays and tablet kiosks. It features a simplified landscape user interface, dynamic voice visualizers, and a moving "doctor" idle screen designed to make the AI feel approachable and present in the home.

---

## User Guide: How to Run the Project

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Python 3.10+** (depending on the exact Pipecat/Websocket server implementation)
- **Android Studio** and **Xcode** (if you intend to compile the `doctor-mobile` app natively)

### 1. Running the WebSocket Server
The backend server must be running first, as the clients rely on it for AI generation and communication.

1. Navigate to the server directory:
   ```bash
   cd websocket/server
   ```
2. Install the necessary dependencies (varies based on Node or Python implementation):
   ```bash
   npm install 
   # OR if Python based: pip install -r requirements.txt
   ```
3. Configure your environment variables (API keys, ports).
4. Start the socket server:
   ```bash
   npm start
   # OR if Python based: python main.py
   ```

### 2. Running the Doctor Mobile Client (`doctor-mobile`)
To test or deploy the mobile application targeted for end-users:

1. Open a new terminal and navigate to the mobile module:
   ```bash
   cd doctor-mobile
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure the WebSocket URL to point to your running server:
   ```bash
   cp .env.example .env
   # Edit .env to set something like VITE_WS_URL=ws://localhost:<PORT>
   ```
4. Run the web-based development server:
   ```bash
   npm run dev
   ```
5. **To deploy to a mobile emulator/device:**
   ```bash
   npx cap sync
   npx cap open android  # Opens Android Studio
   # OR
   npx cap open ios      # Opens Xcode
   ```

### 3. Running the Doctor Robot Client (`doctor-robot`)
To test or deploy the application targeted for dedicated tablet/robot hardware:

1. Open a new terminal and navigate to the robot module:
   ```bash
   cd doctor-robot
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables to point to the server:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

Once running, the application will be available at `http://localhost:5173` (or the port specified by Vite) and will automatically attempt to connect to the `websocket/server` for AI capabilities.