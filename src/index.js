/**
 * @file index.js
 * This file sets up the main 3D scene for a WebXR-based navigation project with spatial audio using THREE.js. 
 * It handles loading 3D models, configuring spatial audio, and creating a visual score display for the scene.
 */

import * as THREE from 'three'; // Import the main THREE.js library
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Import the GLTF loader for 3D models
import { init } from './init.js'; // Import the initialization function for setting up the scene

const modelUrl = 'https://gateway.pinata.cloud/ipfs/QmTgQrjPQxd9u92QweU56mqhdJRsTcWdAv5gwJsQeWw6xP';

//URL for the 3D model hosted on Google Drive
//const modelUrl = 'https://drive.google.com/uc?id=1eIRc74GLypquoD65IGIMUjQ27zkvxRx2'

// Variables to hold the positional audio object and audio listener
let speakerSound, audioListener;
// Add the modal logic
const modal = document.getElementById('progress-modal');
const closeButton = document.getElementById('close-button');

// Handle closing the initial modal
closeButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  modal.innerHTML = `<p>Loading model, please wait...</p>
                     <div id="progress-container">
                       <progress value="0" max="100" id="progress-bar"></progress>
                     </div>`;
  closeButton.style.display = 'none';
  document.getElementById('modal-background').style.display = 'block';
  modal.style.display = 'block';
});

/**
 * Sets up the 3D scene including models, spatial audio, and the score display.
 * 
 * @param {Object} setup - An object containing references to the scene and camera.
 * @param {THREE.Scene} setup.scene - The main THREE.js scene object.
 * @param {THREE.Camera} setup.camera - The camera used for rendering the scene.
 * @returns {Object} - An object containing references to the speaker group and a getter for the speaker sound.
 */
function setupScene({ scene, camera }) {
    const gltfLoader = new GLTFLoader(); // Initialize the GLTFLoader for loading 3D models

    // Load the main room model
    // gltfLoader.load('assets/models/stylised_room.glb', (gltf) => {
    //     scene.add(gltf.scene); // Add the room model to the scene
    //     gltf.scene.scale.set(1, 1, 1); // Set the scale of the room
    // });

    gltfLoader.load(modelUrl, (gltf) => {
        scene.add(gltf.scene); // Add the room model to the scene
        gltf.scene.scale.set(1, 1, 1);
        modal.style.display = 'none'; 
        document.getElementById('modal-background').style.display = 'none';// Hide modal once model is loaded
    },
    (xhr) => {
      // Update the progress bar
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.value = (xhr.loaded / xhr.total) * 100;
      }
    },
    (error) => {
      console.error('Error loading the model', error);
      modal.innerHTML = '<p>Failed to load the model. Please try again later.</p>';
    } // Set the scale of the room
);

    // Load Secondary model 
    // gltfLoader.load('assets/models/stylised_room.glb', (gltf) => {
    //     scene.add(gltf.scene);
    //     gltf.scene.scale.set(1, 1, 1);
    // });

    // Set up the audio listener and attach it to the camera
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Create a group to hold the speaker model and its audio
    const speakerGroup = new THREE.Group();
    // speakerGroup.position.set(-2.4, 2.0, -1.5);
    speakerGroup.position.set(-8, 1.8, 1.2); // Set the position of the speaker group

    // Load the speaker model
    gltfLoader.load('/models/speaker.glb', (gltf) => {
        const speaker = gltf.scene; // Get the speaker model from the loaded GLTF
        speaker.scale.set(0.25, 0.25, 0.25); // Scale the speaker model

        // Access the speaker mesh (assumes the first child is the mesh)
        const speakerMesh = speaker.children[0];

        // Create a positional audio object and attach it to the speaker mesh
        speakerSound = new THREE.PositionalAudio(audioListener);

        // Load the audio file and configure the positional audio
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/audio1.ogg', (buffer) => {
            speakerSound.setBuffer(buffer); // Set the audio buffer
            speakerSound.setRefDistance(0.3); // Set the reference distance for volume adjustment
            speakerSound.setRolloffFactor(1); // Set the rolloff factor for volume attenuation
            speakerSound.setDistanceModel('inverse'); // Use the inverse distance model for spatial audio
            speakerSound.setLoop(true); // Enable looping of the audio
            speakerSound.setVolume(1); // Set the initial volume level
        });

        // Add the positional audio to the speaker mesh
        speakerMesh.add(speakerSound);

        // Add the speaker model to the speaker group
        speakerGroup.add(speaker);
    });

    // Add the speaker group to the scene
    scene.add(speakerGroup);

    // Return references for external use
    return {
        speakerGroup, // Reference to the speaker group
        getSpeakerSound: () => speakerSound // Function to get the positional audio object
    };
}
export { audioListener, speakerSound };
// Call the initialization function with the setupScene function
init(setupScene);
