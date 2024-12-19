import * as THREE from 'three';

export function createSun() {
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.0);
    sunLight.position.set(5, 0, 0); // Sunlight starts from one side

    return sunLight;
}
