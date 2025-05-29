const { GoogleGenAI, Type } = require("@google/genai");
require("dotenv").config()

const GOOGLE_GENAI_API_KEY = process.env.GOOGLE_GENAI_API_KEY; // isi dengan API key kamu

const ai = new GoogleGenAI({ apiKey: GOOGLE_GENAI_API_KEY });

async function generateContent(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING, // hero names
                    },
                },
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating content:", error);
        if (error.response && error.response.status === 503) {
            throw new Error("Service Unavailable: Please try again later.");
        }
        throw error;
    }
}

module.exports = {
    generateContent,
};
