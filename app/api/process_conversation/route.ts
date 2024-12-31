import { generateAIContentWithJsonMode } from "@/lib/Gemini";
import { createGithubIssue } from "@/lib/Github";
import { sendSMS } from "@/lib/SMS";
import { writeToSheet } from "@/lib/SpreadSheet";
import { ResponseSchema, SchemaType } from "@google/generative-ai";



export async function POST(request: Request) {
  try {
    const { title, content, url, id, conversation_list } = await request.json();

    if (!title || !content || !url || !id || !conversation_list) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const prompt = `
        以下の会話履歴から、会話の内容を分析してください。

        会話履歴:
        ${conversation_list.map((item: any) => `${item.role}: ${item.content}`).join('\n')}
        `
    const responseSchema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        categories: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              type: { type: SchemaType.STRING, enum: ["クレーム", "新規機能要望", "FAQ", "その他"] },
              details: { type: SchemaType.STRING, description: "カテゴリに応じた詳細な内容" },
              action: { type: SchemaType.BOOLEAN, description: "有人による対応が必要か。解決済みであればfalse, 未解決であればtrue" }
            }
          }
        }
      }
    };

    const response_json = await generateAIContentWithJsonMode(prompt, responseSchema);


    // カテゴリに基づいて処理を分岐
    for (const category of response_json.categories) {
      const a1 = title;
      const b1 = content;
      const c1 = category.type;
      const d1 = category.details;
      const e1 = category.action;

      //スプレッドシートに書き込む
      await writeToSheet(a1, b1, c1, d1, e1);

      switch (category.type) {
        case "クレーム":
          console.log("クレーム検知: 優先対応が必要です");
          const message = `クレーム検知: 優先対応が必要です\n${category.details}`;
          await sendSMS(process.env.ADMIN_PHONE_NUMBER || "", message);
          break;

        case "新規機能要望":
          console.log("機能要望検知: 製品開発チームへ転送");
          await createGithubIssue(title, content, ["feature-request"]);
          break;

        case "FAQ":
          console.log("FAQ検知: ナレッジベースの更新を検討");
          // TODO: FAQデータベースへの追加検討など
          break;
        default:
          console.log(`未分類のカテゴリ: ${category.type}`);
      }
    }

    return new Response(JSON.stringify({ message: 'Data written to spreadsheet' }), { status: 200 });
  } catch (error) {
    console.error('Failed to write data to spreadsheet:', error);
    return new Response(JSON.stringify({ error: 'Failed to write data to spreadsheet' }), { status: 500 });
  }
}
