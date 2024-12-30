import { generateAIContentWithJsonMode } from "@/lib/Gemini";
import { ResponseSchema, SchemaType } from "@google/generative-ai";

const prompt = `
人気の寿司のネタ5つを以下のJSONスキーマーで返してください。`;

const responseSchema: ResponseSchema = {
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            お魚: { type: SchemaType.STRING },
        },
    },
};

const Page = async () => {
    const aiContent = await generateAIContentWithJsonMode(prompt, responseSchema);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                    人気の寿司ネタ
                </h1>
                <div className="bg-white rounded-lg shadow-xl p-6">
                    <pre className="bg-gray-50 rounded-md p-4 overflow-auto text-sm text-gray-800">
                        {JSON.stringify(aiContent, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Page;
