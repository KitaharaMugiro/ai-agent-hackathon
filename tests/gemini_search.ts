
// 動作確認用の簡易テスト
async function testGeminiSearch() {
    try {
        // 正常系のテスト
        console.log('=== 正常系テスト開始 ===')
        const response = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: "Contact Center AIの料金体系について教えてください" })
        });
        const result = await response.json();
        console.log('レスポンス:', result);
    } catch (error) {
        console.error('テスト実行中にエラーが発生:', error);
    }
}

// テストを実行
testGeminiSearch();
