import { POST } from '../app/api/search/route';

// Mock the fetch function
const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('POST function in search/route.ts', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should return 400 if query is missing', async () => {
        const request = new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({}) });
        const response = await POST(request);
        const result = await response.json();
        expect(response.status).toBe(400);
        expect(result.error).toBe('Query is required');
    });

    it('should return 200 and fetch data from gemini_search API', async () => {
        const mockResponse = { text: 'Mocked response text' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const request = new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({ query: 'test query' }) });
        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result.text).toBe(mockResponse.text);
        expect(mockFetch).toHaveBeenCalledWith(
            'https://gemini-search.onrender.com/api/gemini_search',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            })
        );
    });

    it('should return 500 if an error occurs', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Fetch error'));

        const request = new Request('http://localhost/api/search', { method: 'POST', body: JSON.stringify({ query: 'test query' }) });
        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe('Failed to process request');
    });
}); 