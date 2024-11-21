/**
 * @file index.js
 * This file sets up the main 3D scene for a WebXR-based navigation project with spatial audio using THREE.js. 
 * It handles loading 3D models, configuring spatial audio, and creating a visual score display for the scene.
 */

import * as THREE from 'three'; // Import the main THREE.js library
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Import the GLTF loader for 3D models
import { init } from './init.js'; // Import the initialization function for setting up the scene

// Variables to hold the positional audio object and audio listener
let speakerSound, audioListener;

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

    gltfLoader.load('/models/stylised_room.glb', (gltf) => {
        scene.add(gltf.scene); // Add the room model to the scene
        gltf.scene.scale.set(1, 1, 1); // Set the scale of the room
    });

    // Set up the audio listener and attach it to the camera
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Create a group to hold the speaker model and its audio
    const speakerGroup = new THREE.Group();
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
            
            // Play the audio only after it is fully loaded
            speakerSound.play();
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

// Call the initialization function with the setupScene function
init(setupScene);
