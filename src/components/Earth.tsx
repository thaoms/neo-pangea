import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { SpeechBubbles3D } from './SpeechBubbles';
import { CurrentLocation } from './CurrentLocation';
import { Question } from './SpeechBubble';
import { Atmosphere } from './Atmosphere';
import { Loader } from './Loader';
import { useIsMobile } from '../utils/useIsMobile';

export function Earth({ onClick }: { onClick: (question: Question) => void }) {
    const earthGroupRef = useRef<THREE.Group>(null);
    const earthRef = useRef<THREE.Mesh>(null);
    const earthMat = useRef<THREE.MeshStandardMaterial>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const localEarth = useRef<THREE.Group>(null);
    const isMobile = useIsMobile();

    const markerRadius = 1;

    const params = {
        speedFactor: 2.0, // rotation speed of the earth
    };

    const texturePaths = isMobile
        ? [
                '/textures/2k/earthmap.jpg',
                '/textures/2k/earthspec.jpg',
                '/textures/2k/earthbump.jpg',
                '/textures/2k/earthlights.jpg',
                '/textures/2k/oceanmap.jpg',
                '/textures/2k/earthcloudmaptrans.jpg',
            ]
        : [
                '/textures/earthmap.jpg',
                '/textures/earthspec.jpg',
                '/textures/earthbump.jpg',
                '/textures/earthlights.jpg',
                '/textures/oceanmap.jpg',
                '/textures/earthcloudmaptrans.jpg',
            ];

    const [earthMap, earthSpec, earthBump, earthLights, oceanMap, cloudTexture] = useLoader(
        THREE.TextureLoader,
        texturePaths,
    );

    function configureTexture(texture: THREE.Texture) {
        texture.offset.set(0.5, 0); // Offset for longitude alignment (center on 0°)
        texture.wrapS = THREE.RepeatWrapping; // Seamless horizontal wrapping
        texture.wrapT = THREE.ClampToEdgeWrapping; // Prevent vertical wrapping

        return texture;
    }

    [earthMap, earthSpec, earthBump, earthLights, oceanMap, cloudTexture].forEach(configureTexture);

    useFrame((_, delta) => {
        // Rotate Earth and Clouds
        if (localEarth.current) {
            localEarth.current.rotation.y += delta * 0.005 * params.speedFactor;
        }

        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.01 * params.speedFactor;
        }

        // Update the shader's UV offset
        if (earthMat.current?.userData?.shader) {
            const shader = earthMat.current.userData.shader;

            // Calculate offset based on Earth's rotation
            const offset = (delta * 0.005 * params.speedFactor) / (2 * Math.PI);
            shader.uniforms.uv_xOffset.value = (shader.uniforms.uv_xOffset.value + offset) % 1; // Keep UV offset in [0, 1]
        }
    });

    return (
        <group ref={earthGroupRef}>
            <group ref={localEarth}>
                <mesh ref={earthRef}>
                    <icosahedronGeometry args={[1, 20]} />
                    <meshStandardMaterial
                        ref={earthMat}
                        map={earthMap}
                        metalnessMap={earthSpec}
                        roughnessMap={earthSpec}
                        emissiveMap={earthLights}
                        emissive={new THREE.Color(0xffff88)}
                        bumpMap={earthBump}
                        bumpScale={1}
                        onBeforeCompile={(shader) => {
                        // Add cloud uniform
                            shader.uniforms.tClouds = { value: cloudTexture };
                            shader.uniforms.uv_xOffset = { value: 0.005 };

                            // Inject cloud-related uniforms and logic
                            shader.fragmentShader = shader.fragmentShader.replace(
                                '#include <common>',
                                `
                            #include <common>
                            uniform sampler2D tClouds;
                            uniform float uv_xOffset;
                            `,
                            );

                            shader.fragmentShader = shader.fragmentShader.replace(
                                '#include <roughnessmap_fragment>',
                                `
                            float roughnessFactor = roughness;

                            #ifdef USE_ROUGHNESSMAP
                                vec4 texelRoughness = texture2D(roughnessMap, vRoughnessMapUv);
                                texelRoughness = vec4(1.0) - texelRoughness; // Reverse black/white values
                                roughnessFactor *= clamp(texelRoughness.g, 0.5, 1.0);
                            #endif
                            `,
                            );

                            shader.fragmentShader = shader.fragmentShader.replace(
                                '#include <emissivemap_fragment>',
                                `
                            #ifdef USE_EMISSIVEMAP
                                vec4 emissiveColor = texture2D(emissiveMap, vEmissiveMapUv);
                                emissiveColor *= 1.0 - smoothstep(-0.5, 0.0, dot(normal, directionalLights[0].direction));
                                totalEmissiveRadiance *= emissiveColor.rgb;
                            #endif

                            // Cloud shadowing
                            float cloudsMapValue = texture2D(tClouds, vec2(vMapUv.x - uv_xOffset, vMapUv.y)).r;
                            diffuseColor.rgb *= max(1.0 - cloudsMapValue, 0.2);

                            // Atmospheric coloring
                            float intensity = 1.4 - dot(normal, vec3(0.0, 0.0, 1.0));
                            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 5.0);
                            diffuseColor.rgb += atmosphere;
                            `,
                            );

                            earthMat.current.userData.shader = shader; // Attach shader for updates
                        }}
                    />
                </mesh>
                <Suspense fallback={<Loader />}>
                    <SpeechBubbles3D markerRadius={markerRadius} onClick={onClick} earthGroupRef={earthGroupRef} />
                    <CurrentLocation markerRadius={markerRadius} />
                </Suspense>
            </group>
            <mesh
                ref={cloudsRef}
                scale={[1.003, 1.003, 1.003]}
            >
                <icosahedronGeometry args={[1, 20]} />
                <meshStandardMaterial
                    map={cloudTexture}
                    transparent
                    blending={THREE.AdditiveBlending}
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <Atmosphere
                markerRadius={markerRadius}
            />
            <hemisphereLight color={0x87ceeb} groundColor={0x222222} intensity={0.6} />
        </group>
    );
}
