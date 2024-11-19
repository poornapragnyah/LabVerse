import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Text } from 'troika-three-text';
import { init } from './init.js';

const scoreText = new Text();
scoreText.fontSize = 0.52;
scoreText.font = 'assets/SpaceMono-Bold.ttf';
scoreText.position.z = -2;
scoreText.color = 0xffa276;
scoreText.anchorX = 'center';
scoreText.anchorY = 'middle';

let speakerSound, speakerSound2, audioListener;

function setupScene({ scene, camera}) {
    const gltfLoader = new GLTFLoader();
    
    // Load room
    gltfLoader.load('assets/models/stylised_room.glb', (gltf) => {
        scene.add(gltf.scene);
        gltf.scene.scale.set(1, 1, 1);
    });

    // Setup audio listener
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);

    // Create speaker group 1
    const speakerGroup1 = new THREE.Group();
    speakerGroup1.position.set(-2.4, 2.0, -1.5);

    // Load speaker model for the first speaker
    gltfLoader.load('assets/models/speaker.glb', (gltf) => {
        const speaker = gltf.scene;
        speaker.scale.set(0.25, 0.25, 0.25);
        
        // Create positional audio and attach it to the speaker mesh
        const speakerMesh = speaker.children[0];
        speakerSound = new THREE.PositionalAudio(audioListener);
        
        // Load and setup audio for the first speaker
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('assets/Mii.ogg', (buffer) => {
            speakerSound.setBuffer(buffer);
            speakerSound.setRefDistance(0.3);
            speakerSound.setRolloffFactor(1);
            speakerSound.setDistanceModel('inverse');
            speakerSound.setLoop(true);
            speakerSound.setVolume(0.8);
            
            // Only play after both model and audio are loaded
            speakerSound.play();
        });

        // Add the positional audio to the first speaker mesh
        speakerMesh.add(speakerSound);
        
        // Add the first speaker to the group
        speakerGroup1.add(speaker);
    });

    // Add the first speaker group to the scene
    scene.add(speakerGroup1);

    // Create speaker group 2 (slightly different position)
    const speakerGroup2 = new THREE.Group();
    const targetPosition = new THREE.Vector3(10, 0, 0); 
    speakerGroup2.lookAt(targetPosition);

    speakerGroup2.position.set(1.8, 2.0, 2.0); // Different position

    // Load speaker model for the second speaker
    gltfLoader.load('assets/models/speaker.glb', (gltf) => {
        const speaker = gltf.scene;
        speaker.scale.set(0.25, 0.25, 0.25);
        
        // Create positional audio and attach it to the speaker mesh
        const speakerMesh = speaker.children[0];
        speakerSound2 = new THREE.PositionalAudio(audioListener);
        
        // Load and setup audio for the second speaker
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('assets/Hands.ogg', (buffer) => {
            speakerSound2.setBuffer(buffer);
            speakerSound2.setRefDistance(0.3);
            speakerSound2.setRolloffFactor(1);
            speakerSound2.setDistanceModel('inverse');
            speakerSound2.setLoop(true);
            speakerSound2.setVolume(0.8);
            
            // Only play after both model and audio are loaded
            speakerSound2.play();
        });

        // Add the positional audio to the second speaker mesh
        speakerMesh.add(speakerSound2);
        
        // Add the second speaker to the group
        speakerGroup2.add(speaker);
    });

    // Add the second speaker group to the scene
    scene.add(speakerGroup2);

    // Add score display to the scene
    scene.add(scoreText);

    // Return references if needed for other parts of the game
    return {
        speakerGroup1,
        speakerGroup2,
        getSpeakerSound: () => speakerSound,
        getSpeakerSound2: () => speakerSound2
    };
}

init(setupScene);
