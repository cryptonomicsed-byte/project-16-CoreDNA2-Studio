"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateText = generateText;
exports.generateJSON = generateJSON;
const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
async function generateText(prompt, responseMimeType = 'text/plain') {
    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
                generationConfig: {
                    responseMimeType,
                },
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(JSON.stringify(error));
        }
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return text;
    }
    catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error(`Gemini generation failed: ${error}`);
    }
}
async function generateJSON(prompt) {
    const json = await generateText(prompt, 'application/json');
    return JSON.parse(json);
}
//# sourceMappingURL=gemini.js.map