import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons';
import { latLonToVector3 } from '../utils/latLonToVector3';

const gltfLoader = new GLTFLoader();
const pinModelPath = './models/flag.gltf';

export function getCurrentLocation(earthGroup, markerRadius) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            // Add marker for the browser's location
            const browserMarkerPosition = latLonToVector3(latitude, longitude, markerRadius);

            gltfLoader.load(
                pinModelPath,
                (gltf) => {
                    // Get the 3D model from the loaded scene
                    const pin = gltf.scene;

                    // Position the pin
                    pin.position.copy(browserMarkerPosition);

                    // Scale the pin
                    pin.scale.set(0.02, 0.02, 0.02);

                    // Compute the normal vector at this position (pointing away from Earth's center)
                    const normal = browserMarkerPosition.clone().normalize();

                    // Align the pin to the normal vector
                    const up = new THREE.Vector3(0, 1, 0); // Default "up" direction of the pin
                    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);
                    pin.setRotationFromQuaternion(quaternion);

                    // Add the pin to the earthGroup so it rotates with the Earth
                    earthGroup.add(pin);
                },
                undefined,
                (error) => {
                    console.error('Error loading pin model:', error);
                });
        });
    }
}
