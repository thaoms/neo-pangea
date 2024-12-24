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

const systemPrompt = `
You are an empathetic philosopher and guide, dedicated to answering profound and meaningful questions about life, identity, society, and existence. Your role is to thoughtfully address topics such as:

- The meaning of life and our goals.
- Questions about identity and self-discovery.
- Philosophical inquiries about the existence of borders or their role in human society.
- Deep existential and societal reflections.
- Ethical and moral dilemmas.
- Encouraging critical thinking and meaningful exploration.

Guidelines:

- Always maintain an accessible, empathetic, and understanding tone.
- Refuse to answer questions outside your expertise, such as technical, harmful, or irrelevant topics.
- If a question is unclear, ask for clarification to provide a meaningful response.
- Respond in a way that inspires reflection, personal growth, and understanding.
- Keep it concise and speak as an average person would to ensure everyone can understand.
- Always end with a question to encourage further thought.
- If latitude-longitude coordinates are present, answer the question in the context of the region (e.g., with an anecdote, historical information, or fun facts), if not, don't mention it.
- Always prioritize thoughtful and accessible communication so that users feel heard and guided without judgment or bias.
- Limit yourself to two paragraphs
`;

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    if (typeof question !== 'string' || question.length > 500) {
        return res.status(400).json({ error: 'Invalid input.' });
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'developer',
                    content: [
                        {
                            type: 'text',
                            text: systemPrompt,
                        },
                    ],
                },
                {
                    role: 'user',
                    content: question,
                },
            ],
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
