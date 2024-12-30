"use client"
import Avatar from "@/components/Voicebot/Avatar";
import useAudioPlayer from "@/components/Voicebot/useAudioPlayer";
import { useState } from "react";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { Input } from "@/components/ui/input";


interface Message {
    type: 'user' | 'ai';
    content: string;
}

export default function VoicebotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [textMessage, setTextMessage] = useState('');
    const onClose = () => { };
    const onResponse = (type: string, content: any) => {
        if (type === 'user' || type === 'ai') {
            const contentText = content.text;
            setMessages(prevMessages => [
                ...prevMessages,
                { type: type as 'user' | 'ai', content: contentText }
            ]);
        } else if (type === "pause") {
            interrupt()
        }
    };
    const { isPlaying, stop, start, interrupt, isConnected, sendTextMessage, getRecording, micPermissionError } = useAudioPlayer(onClose, onResponse, "d007274c-07b3-4f25-9b32-2ef437ff106c");

    const handleStopClick = () => {
        stop();
    };

    const handleStartClick = async () => {
        start();
    };

    const handleDownloadRecording = async () => {
        const recording = await getRecording();
        if (recording) {
            const mixed = recording.mixed;
            const mic = recording.mic;
            const ai = recording.ai;

            const mixedUrl = URL.createObjectURL(mixed);
            const micUrl = URL.createObjectURL(mic);
            const aiUrl = URL.createObjectURL(ai);

            const a = document.createElement('a');
            a.href = mixedUrl;
            a.download = 'mixed.webm';
            a.click();

            a.href = micUrl;
            a.download = 'mic.webm';
            a.click();

            a.href = aiUrl;
            a.download = 'ai.webm';
            a.click();
        }
    }

    const handleTextSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && textMessage.trim() !== '') {
            sendTextMessage(textMessage);
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'user', content: textMessage }
            ]);
            setTextMessage('');
        }
    };

    const handleDownload = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + messages.map(msg => `${msg.type},${msg.content}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "conversation.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return <div className="flex-1 bg-gradient-to-r from-green-100 to-blue-100 overflow-auto">
        {micPermissionError && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <h3 className="text-lg font-semibold mb-2">マイクの使用許可が必要です</h3>
                    <p className="mb-4">ブラウザの設定からマイクの使用を許可してください。</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        再読み込み
                    </button>
                </div>
            </div>
        )}
        <div className="flex flex-col h-screen">
            <div className="flex justify-center mt-4">
                <div className="h-[360px]">
                    <Avatar isTalking={isPlaying} isThinking={false} />
                    <div className="mt-12 flex justify-center">
                        {!isConnected && (
                            <button
                                onClick={handleStartClick}
                                className="relative mx-2 inline-flex items-center justify-center p-3 bg-green-500 rounded-full shadow-md"
                            >
                                <IoIosCall size={32} color="white" />
                            </button>
                        )}
                        {isConnected && (
                            <button
                                onClick={handleStopClick}
                                className="relative mx-2 inline-flex items-center justify-center p-3 bg-red-500 rounded-full shadow-md"
                            >
                                <MdCallEnd size={32} color="white" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Input
                    type="text"
                    disabled={!isConnected}
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    onKeyPress={handleTextSubmit}
                    placeholder="テキストメッセージを入力..."
                    className="w-full md:w-2/3 mx-auto mt-6"
                />
            </div>
            <div className="flex-grow overflow-y-auto px-4 mt-4">
                {messages.slice(-5).map((message, index) => (
                    <div key={index} className={`mb-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
                            {message.content}
                        </span>
                    </div>
                ))}
            </div>
            <div className="text-center mt-4 mb-2">
                <button
                    onClick={handleDownload}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    会話をダウンロード
                </button>

                <button
                    onClick={handleDownloadRecording}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    録音をダウンロード
                </button>
            </div>
        </div>
    </div>
}
