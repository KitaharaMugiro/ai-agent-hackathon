export const maxDuration = 60;
export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400 });
        }
        console.log("=== クエリ ====")
        console.log(query);

        const query_text = `背景: Google Cloud製品についての質問です。
        簡潔に必要な情報だけをまとめて返してください。
        
        クエリ: 「${query}」`
        const response = await fetch('https://gemini-search-61718451716.asia-northeast1.run.app/api/gemini_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_text })
        });

        if (!response.ok) {
            console.error('Failed to fetch from gemini_search API');
            return new Response(JSON.stringify({ error: 'Failed to fetch from gemini_search API' }), { status: 200 });
        }

        const data = await response.json();
        console.log("=== レスポンス ====")
        const decodedText = data.text;
        console.log(decodedText);
        return new Response(JSON.stringify({ text: decodedText }), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
    }
}


