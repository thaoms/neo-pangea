import * as THREE from 'three';

export function createSkyBox(loader) {
    const galaxyTexture = loader.load('./textures/milkywayskybox.png');

    const skyGeometry = new THREE.SphereGeometry(100, 32, 32); // Large radius to surround the scene
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: galaxyTexture,
        side: THREE.BackSide,
    });

    return new THREE.Mesh(skyGeometry, skyMaterial);
}
