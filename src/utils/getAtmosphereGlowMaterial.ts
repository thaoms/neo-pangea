import * as THREE from 'three';

export function getAtmosphereGlowMaterial({
    glowColor = 0x5E8DB8, // Light blue atmosphere glow
    lightDirection = new THREE.Vector3(1, 1, -1).normalize(), // Default light direction
    atmosphereDensity = 2, // Controls thickness of the atmosphere
    glowIntensity = 1.5, // Brightness of the glow
    edgeFadeFactor = 1.25, // Controls fading of the glow at the edges
    outerFadeFactor = 2, // Extends glow farther into space
    spaceFadeFactor = 2, // Extends light farther into space
} = {}) {
    const uniforms = {
        lightDirection: { value: lightDirection },
        glowColor: { value: new THREE.Color(glowColor) },
        atmosphereDensity: { value: atmosphereDensity },
        glowIntensity: { value: glowIntensity },
        edgeFadeFactor: { value: edgeFadeFactor },
        outerFadeFactor: { value: outerFadeFactor },
        spaceFadeFactor: { value: spaceFadeFactor },
    };

    const vs = `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vNormal = normalize(mat3(modelMatrix) * normal);

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fs = `
        uniform vec3 lightDirection;
        uniform vec3 glowColor;
        uniform float atmosphereDensity;
        uniform float glowIntensity;
        uniform float edgeFadeFactor;
        uniform float outerFadeFactor;
        uniform float spaceFadeFactor;

        varying vec3 vWorldPosition;
        varying vec3 vNormal;

        void main() {
            // Calculate view direction
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

            // Fresnel effect for rim glow
            float viewAngle = dot(viewDirection, normalize(vWorldPosition));
            float fresnel = pow(1.0 - viewAngle, edgeFadeFactor);

            // Determine if the surface is lit based on light direction
            float lighting = max(dot(vNormal, lightDirection), 0.0);

            // Simulate atmospheric scattering
            float scattering = pow(fresnel, atmosphereDensity);

            // Extend the glow outward with outer fade
            float outerGlow = pow(fresnel, outerFadeFactor);

            // Simulate light extending into space
            float spaceGlow = pow(1.0 - viewAngle, spaceFadeFactor) * fresnel;

            // Combine lighting, scattering, outer glow, and space glow
            vec3 glow = glowColor * (scattering + outerGlow + spaceGlow) * glowIntensity * lighting;

            // Final color with alpha for smooth fading
            gl_FragColor = vec4(glow, (scattering + outerGlow + spaceGlow) * fresnel * lighting);
        }
    `;

    return new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
    });
}
