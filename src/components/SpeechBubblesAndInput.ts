import * as THREE from 'three';
import { latLonToVector3 } from '../utils/latLonToVector3';

export function getSpeechBubbledAndInput(scene, camera, markerRadius) {
    const existentialQuestions = [
        { text: 'Waarom bestaan we?', lat: 51.0, lon: 3.7 }, // Voorbeeld voor Gent
        { text: 'Waarom hebben we grenzen?', lat: 40.7, lon: -74.0 }, // Voorbeeld voor New York
        { text: 'Hoe definiëren we identiteit?', lat: 35.7, lon: 139.7 }, // Voorbeeld voor Tokio
        { text: 'Wat maakt ons menselijk?', lat: -33.9, lon: 151.2 }, // Voorbeeld voor Sydney
        { text: 'Waarom bestaat oorlog?', lat: -23.5, lon: -46.6 }, // Voorbeeld voor São Paulo
    ];

    const questionGroup = new THREE.Group();
    scene.add(questionGroup);

    const questionInput = document.getElementById('question')! as HTMLInputElement;
    const responseField = document.getElementById('response-field')!;
    const responseText = document.getElementById('response-text')!;
    const closeButton = document.getElementById('close-response')!;
    const spinner = document.getElementById('spinner')!;
    const askButton = document.getElementById('askButton')!;

    questionInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleQuestionSubmission();
        }
    });

    async function handleQuestionSubmission() {
        const question = questionInput.value.trim();
        if (!question) {
            responseText.textContent = 'Please enter a question.';
            responseField.classList.remove('opacity-0');

            return;
        }

        // Show spinner and response field
        responseField.classList.remove('opacity-0', 'hidden');
        spinner.classList.remove('hidden');
        responseText.classList.add('opacity-0');

        try {
            // Simulate API call
            const response = await fetch('http://localhost:3000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await response.json();
            if (response.ok) {
                responseText.textContent = `${data.reply}`;
            }
            else {
                responseText.textContent = `Error: ${data.error}`;
            }
        }
        catch (error) {
            responseText.textContent = 'Failed to fetch response from the server.' + error;
        }
        finally {
            // Hide spinner and show response text
            spinner.classList.add('hidden');
            responseText.classList.remove('opacity-0');
        }
    }

    existentialQuestions.forEach(({ text, lat, lon }) => {
        const div = document.createElement('div');
        div.textContent = text;
        div.className = 'speech-bubble';

        const position = latLonToVector3(lat, lon, markerRadius + 0.05);
        const vector = position.clone().project(camera);

        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
        const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

        div.style.left = `${x}px`;
        div.style.top = `${y}px`;

        closeButton.addEventListener('click', () => {
            responseField.classList.add('opacity-0');
            setTimeout(() => {
                responseField.classList.add('hidden');
                responseText.textContent = ''; // Reset text
            }, 500);
        });

        askButton.addEventListener('click', handleQuestionSubmission);

        div.addEventListener('click', async () => {
            // Reset field visibility and content
            responseField.classList.remove('hidden');
            responseField.classList.remove('opacity-0');
            responseText.classList.add('opacity-0');
            closeButton.classList.add('hidden');
            spinner.classList.remove('hidden');

            try {
                const response = await fetch('http://localhost:3000/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: text }),
                });

                const data = await response.json();
                if (response.ok) {
                    responseText.textContent = `${data.reply}`;
                }
                else {
                    responseText.textContent = `Error: ${data.error}`;
                }
            }
            catch (error) {
                responseField.textContent = 'Failed to fetch response from the server.' + error;
            }

            // Hide spinner and show text with fade-in
            setTimeout(() => {
                spinner.classList.add('hidden');
                responseText.classList.remove('opacity-0');
                closeButton.classList.remove('hidden');
            }, 1000);

            closeButton.addEventListener('click', () => {
                responseField.classList.add('opacity-0');
                responseField.classList.add('hidden');
                setTimeout(() => responseField.classList.add('hidden'), 500);
            });
        });

        document.body.appendChild(div);
    });

    return existentialQuestions;
}
