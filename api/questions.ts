import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import cors from 'cors'; // Import CORS
import helmet from 'helmet';

const app = express();
const clientUrl = process.env.VERCEL_URL || 'http://localhost:3001';

app.use(cors({ origin: clientUrl }));
app.use(bodyParser.json());
app.use(helmet());

const openai = new OpenAI();

const questionsPrompt = `
Generate a JavaScript array of objects with philosophical questions linked to specific geographical locations. The structure should look like this: { text: 'question', lat: latitude, lon: longitude }.

Ensure that the questions are thematically relevant to the location (historical, cultural, or current events).
For example, use questions about freedom in London, identity in Paris, or conflicts in modern conflict zones.
Vary the questions so that they remain philosophically, socially, or culturally relevant, with an emphasis on the individual.
Add current context if applicable to the location (e.g., conflict zones, technological hubs, cultural events, etc.).
Use cities distributed across the world, and ensure the coordinates are consistent and not too close to one another.

Keep the questions short and concise, without unnecessary explanation or complex wording, so they are accessible to everyone. Ensure the locations are well-distributed across the globe and not clustered too closely together. 

Examples (do not copy, for inspiration only):

const questions = [
    { text: 'What does freedom mean in a world full of limitations?', lat: 51.5, lon: -0.1 }, // London, UK
    { text: 'How has technology shaped our identity?', lat: 37.8, lon: -122.4 }, // San Francisco, USA
    { text: 'What is the role of spirituality in a modern society?', lat: 27.9, lon: 86.9 }, // Kathmandu, Nepal
    { text: 'Why do conflicts arise in a world striving for peace?', lat: 34.0, lon: -118.2 }, // Los Angeles, USA
    { text: 'Can traditions help us understand the future?', lat: -13.5, lon: -71.9 }, // Cusco, Peru
    { text: 'How does art shape our collective identity?', lat: 48.8, lon: 2.3 }, // Paris, France
    { text: 'Why does inequality persist, even in prosperous societies?', lat: 52.5, lon: 13.4 }, // Berlin, Germany
    { text: 'How can we balance progress and nature conservation?', lat: 1.3, lon: 103.8 }, // Singapore
    { text: 'What does justice mean in a society in transition?', lat: 43.6, lon: -79.3 }, // Toronto, Canada
    { text: 'How do wars shape our understanding of humanity?', lat: 35.6, lon: 139.7 }, // Tokyo, Japan
    { text: 'What can we learn from societies that transcend borders?', lat: 55.7, lon: 37.6 }, // Moscow, Russia
    { text: 'How do we define identity in a multicultural world?', lat: 19.4, lon: -99.1 }, // Mexico City, Mexico
    { text: 'What makes friendship authentic in a digital world?', lat: -33.9, lon: 151.2 }, // Sydney, Australia
    { text: 'Why do we dream, and what does it mean for our consciousness?', lat: 40.4, lon: -3.7 }, // Madrid, Spain
    { text: 'How has apartheid changed the definition of justice?', lat: -26.2, lon: 28.0 }, // Johannesburg, South Africa
    { text: 'What does faith mean in times of uncertainty?', lat: 28.6, lon: 77.2 }, // New Delhi, India
    { text: 'How vast is the universe, and what role do we play in it?', lat: 60.2, lon: 24.9 }, // Helsinki, Finland
    { text: 'Why do borders persist when people are so alike?', lat: -23.5, lon: -46.6 }, // São Paulo, Brazil
    { text: 'How do our values shape our future?', lat: 33.7, lon: -84.4 }, // Atlanta, USA
    { text: 'What does love mean in an ever-faster changing world?', lat: 41.9, lon: 12.5 }, // Rome, Italy
];

Generate a new, original array with a maximum of 15 questions that meet the above criteria. Do not copy the examples literally and make the questions unique and relevant to the location. Important: Ensure there is a minimum distance of 2000 km between any two locations to avoid clustering.
`;

app.get('/api/questions', async (_req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: questionsPrompt,
                },
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'questions_schema',
                    schema: {
                        type: 'object',
                        properties: {
                            questions: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        text: {
                                            description: 'A question relevant to the specified region',
                                            type: 'string',
                                        },
                                        lat: {
                                            description: 'Latitude of the region',
                                            type: 'number',
                                        },
                                        lon: {
                                            description: 'Longitude of the region',
                                            type: 'number',
                                        },
                                    },
                                    required: ['text', 'lat', 'lon'],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ['questions'],
                        additionalProperties: false,
                    },
                },
            },
        });

        let reply = '';
        if (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
            reply = response.choices[0].message.content.trim();
        }
        else {
            reply = 'No responses';
        }

        res.json({ reply });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get a response from OpenAI.' });
    }
});

// Export app for serverless
export default app;
