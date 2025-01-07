"use client"
import { useState } from "react";
import useAudioPlayer from "@/components/Voicebot/useAudioPlayer";

export default function Page() {
    const onResponse = (type: string, content: any) => {
        if (type === 'user' || type === 'ai') {
            console.log(`${type}: ${content.text}`);
        }
    };

    const onClose = () => {
        console.log('Session closed');
    };

    const clientId = "d007274c-07b3-4f25-9b32-2ef437ff106c";
    const { start, togglePlaybackMute } = useAudioPlayer(onClose, onResponse, clientId);

    const handleStart = () => {
        start();
        togglePlaybackMute(); // 音声再生をミュート
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <button
                onClick={handleStart}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Start
            </button>
        </div>
    );
}
