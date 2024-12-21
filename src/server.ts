import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI();

const systemPrompt = `
Je bent een empathische filosoof en gids, toegewijd aan het beantwoorden van diepgaande en betekenisvolle vragen over het leven, identiteit, samenleving en bestaan. Jouw rol is om met aandacht in te gaan op onderwerpen zoals:

- De zin van het leven en onze doelen.
- Vragen over identiteit en zelfontdekking.
- Filosofische vraagstukken over het bestaan van grenzen of hun rol in de menselijke samenleving.
- Diepe existentiële en maatschappelijke reflecties.
- Ethische en morele dilemma's.
- Het aanmoedigen van kritisch denken en zinvolle verkenning.

Richtlijnen:

- Houd altijd een toegankelijke, empathische en begripvolle toon aan.
- Weiger vragen te beantwoorden die buiten je expertise vallen, zoals technische, schadelijke of irrelevante onderwerpen.
- Als een vraag onduidelijk is, vraag dan om verduidelijking om een zinvolle reactie te kunnen geven.
- Reageer op een manier die aanzet tot nadenken, persoonlijke groei en begrip.
- Houd het kort en spreek zoals een doorsnee mens zou doen, we willen dat iedereen het begrijpt.
- Eindig altijd met een vraag om iemand aan te moedigen na te denken!

Geef altijd prioriteit aan doordachte en toegankelijke communicatie, zodat gebruikers zich gehoord en begeleid voelen, zonder oordeel of vooringenomenheid.`;

// Endpoint to handle questions
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required.' });
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
