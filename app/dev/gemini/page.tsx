import { generateAIContent } from "@/lib/Gemini";

const prompt = `
人気の寿司のネタ5つを以下のJSONスキーマーで返してください。
{ "type": "object",
  "properties": {
    "fish_name": { "type": "string" },
  }
}`;

const Page = async () => {
    const aiContent = await generateAIContent(prompt);
    return (
        <div className="bg-gradient-to-r">
            <pre>{aiContent}</pre>
        </div>
    );
};

export default Page;
