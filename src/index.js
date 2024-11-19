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

let speakerSound, audioListener;

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

    // Create speaker group
    const speakerGroup = new THREE.Group();
    speakerGroup.position.set(-2.4, 2.0, -1.5);

    // Load speaker model first
    gltfLoader.load('assets/models/speaker.glb', (gltf) => {
        const speaker = gltf.scene;
        speaker.scale.set(25, 25, 25);
        
        // Create positional audio and attach it to the speaker mesh
        const speakerMesh = speaker.children[0];
        speakerSound = new THREE.PositionalAudio(audioListener);
        
        // Load and setup audio
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('assets/audio1.ogg', (buffer) => {
            speakerSound.setBuffer(buffer);
            speakerSound.setRefDistance(0.3);
            speakerSound.setRolloffFactor(1);
            speakerSound.setDistanceModel('inverse');
            speakerSound.setLoop(true);
            speakerSound.setVolume(0.8);
            
            // Only play after both model and audio are loaded
            speakerSound.play();
        });

        // Add the positional audio to the speaker mesh
        speakerMesh.add(speakerSound);
        
        // Add speaker to the group
        speakerGroup.add(speaker);
    });

    // Add the entire group to the scene
    scene.add(speakerGroup);

    // Add score display to the scene
    scene.add(scoreText);

    // Return references if needed for other parts of the game
    return {
        speakerGroup,
        getSpeakerSound: () => speakerSound
    };
}


init(setupScene);