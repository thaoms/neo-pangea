import { DepthOfField, Bloom, ToneMapping, Vignette, EffectComposer, GodRays, Glitch, Scanline, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { useState } from 'react';
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
                    <Scanline
                        blendFunction={BlendFunction.MULTIPLY} // blend mode
                        density={1.25} // scanline density
                    />
                    <Glitch
                        delay={[10, 45]} // min and max glitch delay
                        duration={[0.6, 0.8]} // min and max glitch duration
                        strength={[0.01, 0.2]} // min and max glitch strength
                        mode={GlitchMode.SPORADIC} // glitch mode
                        active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
                        ratio={0.5} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
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
