// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
process.env = {
    ...process.env,
    GITHUB_TOKEN: 'mock-token',
    NEXT_PUBLIC_GEMINI_API_KEY: 'mock-key',
}; 