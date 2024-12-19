import * as THREE from 'three';

export function createClouds(loader, geometry) {
    const cloudsMat = new THREE.MeshStandardMaterial({
        map: loader.load('./textures/8081_earthcloudmaptrans.jpg'),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        alphaMap: loader.load('./textures/8081_earthcloudmaptrans.jpg'),
    });

    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);

    return cloudsMesh;
}
