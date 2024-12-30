"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIContentWithJsonMode(prompt: string) {
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set');
        return;
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "models/gemini-2.0-flash-exp",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
}