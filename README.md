# Spatial Audio VR Experience

A WebXR-based virtual reality experience featuring spatial audio implementation using Three.js. The project creates an immersive environment where users can experience positional audio in a stylized room setting.

## 🎯 Features

- Immersive VR environment with a stylized room
- Spatial audio implementation using Three.js PositionalAudio
- Custom 3D speaker model with audio source
- VR controller support with Meta Quest 3 compatibility
- Desktop fallback with OrbitControls
- Dynamic text rendering using Troika
- Environment mapping for realistic lighting

## 🚀 Getting Started

### Prerequisites

- A modern web browser with WebXR support
- A VR headset (optional, Meta Quest 3 recommended)
- Node.js and npm installed on your development machine

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spatial-audio-project
```

2. Install dependencies:
```bash
npm install
```

### Required Dependencies

- three.js
- troika-three-text
- iwer (for VR device emulation)
- gamepad-wrapper

## 📁 Project Structure

```
├── assets/
│   ├── models/
│   │   ├── stylised_room.glb
│   │   └── speaker.glb
│   ├── audio1.ogg
│   └── SpaceMono-Bold.ttf
├── src/
│   ├── index.js
│   └── init.js
```

## 🎮 Usage

### VR Mode
1. Launch the application on a WebXR-compatible browser
2. Click the "Enter VR" button
3. Explore the space to experience the spatial audio effects
4. Use VR controllers to interact with the environment

### Desktop Mode
- Use mouse to orbit around the scene
- Left click + drag to rotate
- Right click + drag to pan
- Scroll to zoom

## 🔊 Audio Implementation

The project uses Three.js PositionalAudio for spatial audio implementation:
- Audio source is attached to a 3D speaker model
- Distance-based volume attenuation
- Inverse distance model for realistic falloff
- Configurable reference distance and rolloff factor

```javascript
speakerSound = new THREE.PositionalAudio(audioListener);
speakerSound.setRefDistance(0.3);
speakerSound.setRolloffFactor(1);
speakerSound.setDistanceModel('inverse');
```

## 🛠️ Technical Details

### Scene Setup
- Custom environment mapping using RoomEnvironment
- Dynamic text rendering with Troika
- Automatic window resize handling
- VR controller model loading and setup

### VR Support
- Native WebXR support detection
- Fallback to iwer emulation for development
- Meta Quest 3 controller mapping
- Gamepad API integration

## 📝 License

This project includes code licensed under the MIT license. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ✨ Acknowledgments

- Three.js team for the WebXR implementation
- Meta Quest for VR device support
- Contributors to the iwer and gamepad-wrapper libraries
