import * as THREE from 'three';
import { getFresnelMat } from '../utils/getFresnelMat';

export function createAtmosphere(geometry) {
    const fresnelMat = getFresnelMat({
        rimHex: 0x4fa3ff, // More realistic light blue for atmospheric glow
        facingHex: 0x002244, // Dark blue for subtle fade-out effect
    });

    const glowMesh = new THREE.Mesh(geometry, fresnelMat);
    glowMesh.scale.setScalar(1.01);

    return glowMesh;
}
