# LabVerse - Cave Labs at PES University RR Campus

**LabVerse** is an immersive virtual reality experience that brings the Cave Labs of PES University RR Campus to life. Using cutting-edge technologies like WebXR and Three.js, LabVerse provides a detailed exploration of the environment.

---

## 🎯 **Features**
- **Immersive VR Experience**: Dive into a fully interactive and realistic virtual laboratory environment using WebXR.
- **Room Exploration**: Experience the Cave Labs at PES University RR Campus with detailed 3D models and physics-based interactions.
- **Controller Support**: Fully integrated VR controllers for navigation and interaction.
- **Cross-Platform Compatibility**: Works with both native WebXR-supported devices and fallback options using iwer's XRDevice.
- **Dynamic Lighting and Environments**: Enhanced visuals using RoomEnvironment for realistic reflections and lighting.

---

## **Technologies Used**
- **Three.js**: 3D rendering engine for creating and rendering the scene.
- **WebXR**: Enables immersive VR experiences directly in the browser.
- **iwer**: Provides fallback support for devices without native WebXR.
- **Gamepad Wrapper**: Simplifies controller input handling.
- **Three.js Add-ons**: Includes VRButton, OrbitControls, RoomEnvironment, and XRControllerModelFactory for extended functionality.

---

## 🚀 **Getting Started**
### Prerequisites
To get started with LabVerse, ensure you have the following installed:
- **Node.js** (v16 or higher recommended)
- A compatible **WebXR device** (e.g., Meta Quest 3) or a fallback setup using iwer's XRDevice.
- A modern browser with WebXR support (e.g., Chrome, Edge).

---
## **Setup**
To set up LabVerse on your local system, follow these steps:

1. **Clone the Repository**:  
   Clone the LabVerse repository to your local machine using Git:  
   ```bash
   git clone https://github.com/poornapragnyah/LabVerse.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd LabVerse
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 🎮 **Usage**
### VR Mode
1. **Launch the Application**:
    - In your headset, open the browser and navigate to the IP address on which the app is running, as shown in the terminal. Ensure both the headset and the server are on the same network if you are accessing it after cloning the repo.
2. **Enter VR**:
   - Click on the "Enter VR" button to start the immersive experience.

### Desktop Mode
- Use mouse to orbit around the scene
- Left click + drag to rotate
- Right click + drag to pan
- Scroll to zoom

---

## 🛠️ Technical Details

### Scene Setup
- Custom environment mapping using RoomEnvironment
- Automatic window resize handling
- VR controller model loading and setup

### VR Support
- Native WebXR support detection
- Fallback to iwer emulation for development
- Meta Quest 3 controller mapping
- Gamepad API integration

---

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

---

## **Acknowledgments**
We would like to express our sincere gratitude to Dr. Adithya Balasubramanyam, the instructor of the Augmented Reality and Virtual Reality course at PES University, for providing us with access to Cave Labs and for his support throughout this project.

