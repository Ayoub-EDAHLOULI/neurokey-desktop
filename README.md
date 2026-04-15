# 🧠 NeuroKey Desktop - Zero-Knowledge Password Manager

The official desktop companion for the NeuroKey ecosystem. NeuroKey Desktop is a highly secure, offline-first password manager and digital wallet. By abandoning bloated frameworks like Electron in favor of **Tauri**, NeuroKey delivers a native, blazing-fast desktop experience with a highly secure Rust backend.

[Insert Screenshot of your Desktop App Here]

## 🚀 Key Features

### 🔒 Uncompromising Security
* **Zero-Knowledge Architecture:** Your vault never touches a cloud server. All encryption and decryption happen strictly on your local machine.
* **Rust-Powered Backend:** Utilizes Rust's low-level system access for ultra-secure AES-256 file encryption and memory safety.
* **No Trackers, No Telemetry:** 100% private. We collect absolutely nothing.

### ⚡ Blazing Fast & Lightweight
* **Powered by Tauri:** Unlike Electron apps that consume gigabytes of RAM, NeuroKey uses the OS-native webview. The final application size is incredibly small (often under 10MB) and uses minimal system resources.

### 🔄 Multi-Device Ecosystem (Work in Progress)
* **Local Wi-Fi Sync:** Securely sync your encrypted vault between the NeuroKey Android app and your Desktop using a secure, peer-to-peer WebSocket connection and a QR code handshake. Data transfers instantly over your local LAN without ever touching the internet.

### 🎨 Intelligent UX
* **Seamless UI:** Built with React and Tailwind CSS, perfectly mirroring the premium, dark-mode aesthetic of the mobile application.
* **Fluid Animations:** Powered by Framer Motion for a native desktop feel.

## 🛠️ Tech Stack

* **Core Framework:** [Tauri](https://tauri.app/)
* **Backend / System Logic:** Rust
* **Frontend:** React 18 & TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion

## 📦 Installation & Development

### Prerequisites
Before running this project, you must install:
1.  [Node.js](https://nodejs.org/) (v18 or higher)
2.  [Rust](https://rustup.rs/) (Required to compile the Tauri backend)
3.  *Windows Users only:* [C++ Build Tools](https://tauri.app/v1/guides/getting-started/prerequisites#windows)

### Getting Started

1. Clone the repository:
```bash
git clone [https://github.com/Ayoub-EDAHLOULI/neurokey-desktop.git](https://github.com/Ayoub-EDAHLOULI/neurokey-desktop.git)
cd neurokey-desktop
```

2. Install frontend dependencies:

npm install

3. Start the development server and boot the native desktop window:

npm run tauri dev

4. Build for production (Generates .msi, .exe, or .dmg installers):

npm run tauri build

Built with ❤️ by Ayoub Edahlouli.
