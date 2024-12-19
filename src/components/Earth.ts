import * as THREE from 'three';

export function createEarth(loader: THREE.TextureLoader) {
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180; // Tilt Earth's axis

    function configureTexture(texture) {
        texture.offset.set(0.5, 0); // Offset for longitude alignment (center on 0°)
        texture.wrapS = THREE.RepeatWrapping; // Seamless horizontal wrapping
        texture.wrapT = THREE.ClampToEdgeWrapping; // Prevent vertical wrapping

        return texture;
    }

    const geometry = new THREE.IcosahedronGeometry(1, 50);

    const material = new THREE.MeshPhongMaterial({
        map: configureTexture(loader.load('./textures/8081_earthmap10k.jpg')),
        specularMap: configureTexture(loader.load('./textures/8081_earthspec10k.jpg')),
        bumpMap: configureTexture(loader.load('./textures/8081_earthbump10k.jpg')),
        bumpScale: 1,
    });

    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    const lightsMat = new THREE.MeshBasicMaterial({
        map: configureTexture(loader.load('./textures/8081_earthlights10k.jpg')),
        blending: THREE.AdditiveBlending,
    });

    const lightsMesh = new THREE.Mesh(geometry, lightsMat);
    earthGroup.add(lightsMesh);

    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x222222, 0.6);

    return { earthGroup, hemisphereLight, lightsMesh, geometry };
}
