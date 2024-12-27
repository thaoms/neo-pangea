import { DepthOfField, Bloom, ToneMapping, Vignette, EffectComposer, GodRays } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import {useState } from 'react';
import { Mesh } from 'three';
import { Sun } from './Sun';
import * as THREE from 'three';

export function Effects() {
    const [material, set] = useState<Mesh | null>();

    return (
        <>
            <fog attach="fog" args={['#d7dfff', 50, 250]} />
            <Sun
                onRefReady={ref => set(ref)}
            />
            {material && (
                <EffectComposer multisampling={0} enableNormalPass={false}>
                    <ToneMapping
                        blendFunction={BlendFunction.NORMAL}
                        mode={THREE.CineonToneMapping}
                        resolution={256} // texture resolution of the luminance map
                        middleGrey={0.1}
                        maxLuminance={16.0}
                        averageLuminance={1.0}
                    />
                    <DepthOfField
                        focusDistance={0}
                        focalLength={0.08}
                        bokehScale={0.5}
                        height={300}
                    />
                    <Bloom
                        luminanceThreshold={0.6}
                        luminanceSmoothing={0.6}
                        opacity={3}
                        intensity={0.2}
                        height={300}
                    />
                    <GodRays
                        blur={true}
                        sun={material}
                        samples={200} // Increase samples for smoother rays
                        density={1.1} // Adjust density for longer rays
                        decay={0.97} // Adjust decay to control how the rays fade
                        weight={0.6} // Increase weight for brighter rays
                        exposure={0.6} // Control the exposure of the rays
                        clampMax={1} // Max brightness
                    />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            )}
        </>
    );
}
