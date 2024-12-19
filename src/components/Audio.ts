import * as THREE from 'three';

export function getAudio(camera) {
    // Create the AudioListener and attach it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Create a global audio source
    const backgroundAudio = new THREE.Audio(listener);

    // Load the audio file
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./audio/ambient-space-noise-55472.mp3', (buffer) => {
        backgroundAudio.setBuffer(buffer);
        backgroundAudio.setLoop(true);
        backgroundAudio.setVolume(0.5); // Adjust volume as needed
    });

    // Play/Pause logic
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');

    audioToggle?.addEventListener('click', () => {
        if (backgroundAudio.isPlaying) {
            backgroundAudio.pause();
            audioIcon!.textContent = '🔈'; // Update icon to muted
        }
        else {
            // Resume AudioContext if needed
            if (listener.context.state === 'suspended') {
                listener.context.resume();
            }
            backgroundAudio.play();
            audioIcon!.textContent = '🔊'; // Update icon to unmuted
        }
    });
}
