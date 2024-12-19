import * as THREE from 'three';

export function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180); // Latitude to polar angle
    const theta = (lon + 180) * (Math.PI / 180); // Longitude to azimuthal angle

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}
