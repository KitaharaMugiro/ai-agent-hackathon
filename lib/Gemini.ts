"use server"
import { GoogleGenerativeAI, ResponseSchema } from "@google/generative-ai";

export async function generateAIContentWithJsonMode(prompt: string, responseSchema: ResponseSchema) {
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set');
        return { error: 'GEMINI_API_KEY is not set' };
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "models/gemini-2.0-flash-exp",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema
        }
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        return text;
    }
}