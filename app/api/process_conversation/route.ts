import { generateAIContentWithJsonMode } from "@/lib/Gemini";
import { createGithubIssue } from "@/lib/Github";
import { sendSMS } from "@/lib/SMS";
import { writeToSheet } from "@/lib/SpreadSheet";



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

        以下のJSON形式で回答してください:
        {
          "categories": [
            {
              "type": string,      // カテゴリの種類（例: "クレーム", "新規機能要望", "FAQ"）
              "details": string    // 具体的な内容の説明
            }
          ]
        }

        具体例:
        {
          "categories": [
            {
              "type": "クレーム",
              "details": "商品の配送が遅延している件について苦情"
            },
            {
              "type": "新規機能要望",
              "details": "商品のトラッキング機能の追加要望"
            }
          ]
        }
        `

    const response = await generateAIContentWithJsonMode(prompt);
    let response_json;
    try {
      response_json = JSON.parse(response);
      console.log(response_json);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON response' }), { status: 500 });
    }

    const a1 = title;
    const b1 = content;
    const c1 = url;
    const d1 = id;
    const e1 = JSON.stringify(response_json);

    //スプレッドシートに書き込む
    await writeToSheet(a1, b1, c1, d1, e1);

    // カテゴリに基づいて処理を分岐
    for (const category of response_json.categories) {
      switch (category.type) {
        case "クレーム":
          console.log("クレーム検知: 優先対応が必要です");
          const message = `クレーム検知: 優先対応が必要です\n${category.details}`;
          await sendSMS("+818019852272", message);
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
