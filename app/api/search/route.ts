
export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return new Response(JSON.stringify({ error: 'Query is required' }), { status: 400 });
        }

        const query_text = `なるべく情報をまとめて短く回答してください。クエリ: 「${query}」`
        const response = await fetch('https://gemini-search.onrender.com/api/gemini_search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query_text })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from gemini_search API');
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
    }
}


