import * as THREE from 'three';

export function getFresnelMat({
    rimHex = 0x0088ff,
    facingHex = 0x000000,
    defaultLightDirection = new THREE.Vector3(1, 1, -1).normalize(), // Default light direction
} = {}) {
    const uniforms = {
        color1: { value: new THREE.Color(rimHex) },
        color2: { value: new THREE.Color(facingHex) },
        fresnelBias: { value: 0.1 },
        fresnelScale: { value: 1.0 },
        fresnelPower: { value: 4.0 },
        lightDirection: { value: defaultLightDirection },
        lightIntensity: { value: 0.1 }, // Light intensity control
    };

    const vs = `
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
        uniform vec3 lightDirection;

        varying float vReflectionFactor;
        varying float vLightEffect;

        void main() {
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

            vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

            vec3 I = worldPosition.xyz - cameraPosition;

            vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

            // Simulated light effect using default or provided light direction
            vLightEffect = max(dot(worldNormal, lightDirection), 0.0);

            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fs = `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float lightIntensity;

        varying float vReflectionFactor;
        varying float vLightEffect;

        void main() {
            float f = clamp(vReflectionFactor, 0.0, 1.0);

            vec3 blendedColor = mix(color2, color1, vec3(f)) + vec3(vLightEffect * lightIntensity);

            gl_FragColor = vec4(blendedColor, f * vLightEffect);
        }
    `;

    return new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        blending: THREE.AdditiveBlending,
    });
}
