/**
 * @file init.js
 * Sets up a WebXR-compatible 3D environment using THREE.js and iwer for immersive VR applications.
 * Handles rendering, camera controls, controllers, and environment configuration.
 */

import * as THREE from 'three';
import { XRDevice, metaQuest3 } from 'iwer';
import { DevUI } from '@iwer/devui';
import { GamepadWrapper } from 'gamepad-wrapper';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

/**
 * Initializes a WebXR 3D scene.
 * 
 * @param {Function} setupScene - A callback function to set up the scene and add custom objects.
 *                                Receives an object with references to the scene, camera, renderer, player, and controllers.
 * @param {Function} onFrame - A callback function executed on each animation frame.
 *                             Receives delta time, elapsed time, and an object with global references.
 */
export async function init(setupScene = () => {}, onFrame = () => {}) {
    // Check for native WebXR support
    let nativeWebXRSupport = false;
    if (navigator.xr) {
        nativeWebXRSupport = await navigator.xr.isSessionSupported('immersive-vr');
    }

    // Set up iwer XRDevice if native WebXR is not supported
    if (!nativeWebXRSupport) {
        const xrDevice = new XRDevice(metaQuest3);
        xrDevice.installRuntime(); // Install iwer runtime
        xrDevice.fovy = (75 / 180) * Math.PI; // Set field of view
        xrDevice.ipd = 0; // Set inter-pupillary distance to 0 for default
        window.xrdevice = xrDevice;

        // Configure initial positions and orientations of controllers
        xrDevice.controllers.right.position.set(0.15649, 1.43474, -0.38368);
        xrDevice.controllers.right.quaternion.set(
            0.14766305685043335,
            0.02471366710960865,
            -0.0037767395842820406,
            0.9887216687202454,
        );
        xrDevice.controllers.left.position.set(-0.15649, 1.43474, -0.38368);
        xrDevice.controllers.left.quaternion.set(
            0.14766305685043335,
            0.02471366710960865,
            -0.0037767395842820406,
            0.9887216687202454,
        );

        // Add DevUI for debugging and visualization
        new DevUI(xrDevice);
    }

    // Create a container for the renderer
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Initialize the main THREE.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080); // Set background color

    // Set up the camera
    const camera = new THREE.PerspectiveCamera(
        50, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        100, // Far clipping plane
    );
    camera.position.set(0, 1.6, 3); // Position the camera

    // Add orbit controls for non-VR debugging
    const controls = new OrbitControls(camera, container);
    controls.target.set(0, 1.6, 0); // Set the control target
    controls.update();

    // Initialize the WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // Set device pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight); // Set the size of the renderer
    renderer.xr.enabled = true; // Enable WebXR
    container.appendChild(renderer.domElement);

    // Set up the room environment using PMREM for lighting and reflections
    const environment = new RoomEnvironment(renderer);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    // Create a player group to manage camera and controller attachments
    const player = new THREE.Group();
    scene.add(player);
    player.add(camera); // Add camera to the player group

    // Set up VR controllers using XRControllerModelFactory
    const controllerModelFactory = new XRControllerModelFactory();
    const controllers = {
        left: null, // Placeholder for the left controller
        right: null, // Placeholder for the right controller
    };

    for (let i = 0; i < 2; i++) {
        const raySpace = renderer.xr.getController(i); // Ray space for controller
        const gripSpace = renderer.xr.getControllerGrip(i); // Grip space for controller
        const mesh = controllerModelFactory.createControllerModel(gripSpace); // Add visual model
        gripSpace.add(mesh);

        player.add(raySpace, gripSpace);

        // Hide controllers initially
        raySpace.visible = false;
        gripSpace.visible = false;

        // Handle connection of controllers
        gripSpace.addEventListener('connected', (e) => {
            raySpace.visible = true;
            gripSpace.visible = true;

            // Assign controllers based on handedness
            const handedness = e.data.handedness;
            controllers[handedness] = {
                raySpace,
                gripSpace,
                mesh,
                gamepad: new GamepadWrapper(e.data.gamepad),
            };
        });

        // Handle disconnection of controllers
        gripSpace.addEventListener('disconnected', (e) => {
            raySpace.visible = false;
            gripSpace.visible = false;

            const handedness = e.data.handedness;
            controllers[handedness] = null;
        });
    }

    // Handle window resizing
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // Global references passed to the setupScene and onFrame callbacks
    const globals = {
        scene,
        camera,
        renderer,
        player,
        controllers,
    };

    // Call the setupScene function with global references
    setupScene(globals);

    // Animation loop with time tracking
    const clock = new THREE.Clock();
    function animate() {
        const delta = clock.getDelta(); // Time elapsed since last frame
        const time = clock.getElapsedTime(); // Total time elapsed
        Object.values(controllers).forEach((controller) => {
            if (controller?.gamepad) {
                controller.gamepad.update(); // Update gamepad inputs
            }
        });

        // Call the onFrame callback for custom animations
        onFrame(delta, time, globals);

        // Render the scene
        renderer.render(scene, camera);
    }

    // Set the renderer's animation loop
    renderer.setAnimationLoop(animate);

    // Add VRButton to enable WebXR
    document.body.appendChild(VRButton.createButton(renderer));
}
