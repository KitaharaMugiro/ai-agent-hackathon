"use client"
import { useState } from "react";
import useAudioPlayer from "@/components/Voicebot/useAudioPlayer";

export default function Page() {
    const [isListening, setIsListening] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const onResponse = (type: string, content: any) => {
        if (type === 'user' || type === 'ai') {
            console.log(`${type}: ${content.text}`);
        } else if (type === "tool") {
            console.log(content.arguments);
            setNotification(`「${content.arguments.requestBody.title}」 でを作成しました`);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    const onClose = () => {
        console.log('Session closed');
        setIsListening(false);
    };

    const clientId = "464b9d26-a402-4373-9d5d-a4e1a35447aa";
    const { start, togglePlaybackMute } = useAudioPlayer(onClose, onResponse, clientId);

    const handleStart = async () => {
        await start();
        togglePlaybackMute();
        setIsListening(true);
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            {notification && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-8 py-4 rounded-lg shadow-xl transition-opacity duration-300 text-lg font-medium">
                    {notification}
                </div>
            )}
            <div className="text-center">
                <div className={`w-32 h-32 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center ${isListening ? 'animate-pulse' : ''}`}>
                    <div className="text-6xl">
                        {isListening ? '👂' : '🎤'}
                    </div>
                </div>
                <button
                    onClick={handleStart}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={isListening}
                >
                    {isListening ? 'Listening...' : 'Start'}
                </button>
            </div>
        </div>
    );
}
