import { POST } from '../app/api/process_conversation/route';

// Mock the dependencies
jest.mock('@/lib/Gemini', () => ({
    generateAIContentWithJsonMode: jest.fn(),
}));

const { generateAIContentWithJsonMode } = require('@/lib/Gemini');

describe('POST function in process_conversation/route.ts', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const request = new Request('', { method: 'POST', body: JSON.stringify({}) });
        const response = await POST(request);
        const result = await response.json();
        expect(response.status).toBe(400);
        expect(result.error).toBe('Missing required fields');
    });

    it('should return 200 and process the conversation', async () => {
        const mockResponse = { categories: [] };
        generateAIContentWithJsonMode.mockResolvedValueOnce(mockResponse);

        const request = new Request('', {
            method: 'POST', body: JSON.stringify({
                title: 'Test Title',
                content: 'Test Content',
                url: 'http://example.com',
                id: '123',
                conversation_list: [{ role: 'user', content: 'Hello' }],
            })
        });

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(200);
        expect(result).toEqual(mockResponse);
        expect(generateAIContentWithJsonMode).toHaveBeenCalled();
    });

    it('should return 500 if an error occurs', async () => {
        generateAIContentWithJsonMode.mockRejectedValueOnce(new Error('Processing error'));

        const request = new Request('', {
            method: 'POST', body: JSON.stringify({
                title: 'Test Title',
                content: 'Test Content',
                url: 'http://example.com',
                id: '123',
                conversation_list: [{ role: 'user', content: 'Hello' }],
            })
        });

        const response = await POST(request);
        const result = await response.json();

        expect(response.status).toBe(500);
        expect(result.error).toBe('Failed to process request');
    });
}); 