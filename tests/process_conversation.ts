import { POST } from '@/app/api/process_conversation/route';
// 動作確認用の簡易テスト
async function testProcessConversation() {
    try {
        // 正常系のテスト
        console.log('=== 正常系テスト開始 ===');
        const validRequest = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify({
                title: 'テストタイトル',
                content: 'テスト内容',
                url: 'http://test.com',
                id: '123',
                conversation_list: [{ "id": 6984, "conversation_id": 1515, "role": "assistant", "content": "こんにちは！AIボイスボットについてのお問い合わせありがとうございます。ご興味のあることをなんでも聞いてください！", "created_at": "2024-12-16T07:53:42.929394+00:00" }, { "id": 6985, "conversation_id": 1515, "role": "user", "content": "ジリシシャで刺さられている例で", "created_at": "2024-12-16T07:54:10.030732+00:00" }, { "id": 6986, "conversation_id": 1515, "role": "assistant", "content": "申し訳ございません。ジリシシャで刺さられている例については回答できません。詳細はお問い合わせください。", "created_at": "2024-12-16T07:54:12.070601+00:00" }]
            })
        });

        const response = await POST(validRequest);
        const result = await response.json();
        console.log('レスポンス:', result);
    } catch (error) {
        console.error('テスト実行中にエラーが発生:', error);
    }
}

// テストを実行
testProcessConversation();

