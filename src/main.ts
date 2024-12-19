import * as THREE from 'three';
import getStarfield from './utils/getStarfield';
import { latLonToVector3 } from './utils/latLonToVector3';
import { initializeScene } from './components/SceneInitializer';
import { getControls } from './components/Controls';
import { createEarth } from './components/Earth';
import { createSkyBox } from './components/SkyBox';
import { createClouds } from './components/Clouds';
import { createAtmosphere } from './components/Atmosphere';
import { createSun } from './components/Sun';
import { getCurrentLocation } from './components/CurrentLocation';
import { getAudio } from './components/Audio';
import { getSpeechBubbledAndInput } from './components/SpeechBubblesAndInput';
import './css/styles.css';

const loadingManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadingManager);
const markerRadius = 1.00;

loadingManager.onProgress = (url, loaded, total) => {
    const progress = (loaded / total) * 100;
    document.getElementById('loading-bar')!.style.width = `${progress}%`;
};

loadingManager.onLoad = () => {
    document.getElementById('loader')!.style.display = 'none';
};

const { scene, camera, renderer } = initializeScene();
document.body.appendChild(renderer.domElement);

getControls(camera, renderer);

const { earthGroup, hemisphereLight, geometry } = createEarth(loader);
scene.add(earthGroup);
scene.add(hemisphereLight);

const skyBox = createSkyBox(loader);
scene.add(skyBox);

const clouds = createClouds(loader, geometry);
earthGroup.add(clouds);

const glowMesh = createAtmosphere(geometry);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = createSun();
scene.add(sunLight);

getCurrentLocation(earthGroup, markerRadius);

getAudio(camera);

const existentialQuestions = getSpeechBubbledAndInput(scene, camera, markerRadius);

let sunAngle = 0;
const sunOrbitRadius = 10; // Distance of Sunlight source from Earth's center

function animate() {
    requestAnimationFrame(animate);

    // Earth rotation
    const spinSpeed = 0.00058;
    earthGroup.rotation.y += spinSpeed;
    clouds.rotation.y += spinSpeed * 0.15; // Slightly faster for atmospheric layers
    stars.rotation.y -= 0.0001;
    skyBox.rotation.y -= 0.00002;

    // Animate Sunlight (move around Earth)
    sunAngle += 0.0002; // Adjust speed for sunlight movement
    sunLight.position.set(
        sunOrbitRadius * Math.cos(sunAngle), // X-coordinate
        0, // Y-coordinate
        sunOrbitRadius * Math.sin(sunAngle * 0.5), // Z-coordinate for depth
    );

    existentialQuestions.forEach(({ lat, lon }, index) => {
        const bubble = document.querySelectorAll('.speech-bubble')[index] as HTMLElement;

        // Get the 3D position of the bubble relative to Earth's rotation
        const position = latLonToVector3(lat, lon, markerRadius + 0.05)
            .applyMatrix4(earthGroup.matrixWorld);

        // Check if the bubble is in front of the camera
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        const isVisible = position.dot(cameraDirection) > 0;

        if (isVisible) {
            // Project the bubble's 3D position to screen space
            const vector = position.clone().project(camera);
            const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

            bubble.style.left = `${x}px`;
            bubble.style.top = `${y}px`;
            bubble.style.opacity = '1';
        }
        else {
            bubble.style.opacity = '0'; // Hide behind the Earth
        }
    });

    renderer.render(scene, camera);
}

animate();

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleWindowResize, false);
