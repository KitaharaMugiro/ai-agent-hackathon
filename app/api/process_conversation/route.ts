

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== 'test') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { title, content, url, id, conversation_list } = await request.json();

        if (!title || !content || !url || !id || !conversation_list) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // TODO: エージェントによる処理の振り分けを行う


        return new Response(JSON.stringify({ message: 'Data written to spreadsheet' }), { status: 200 });
    } catch (error) {
        console.error('Failed to write data to spreadsheet:', error);
        return new Response(JSON.stringify({ error: 'Failed to write data to spreadsheet' }), { status: 500 });
    }
}
