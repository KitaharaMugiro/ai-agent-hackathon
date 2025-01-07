"use client"
import Avatar from "@/components/Voicebot/Avatar";
import useAudioPlayer from "@/components/Voicebot/useAudioPlayer";
import { useState, useEffect } from "react";
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { Input } from "@/components/ui/input";

interface Message {
    type: 'user' | 'ai';
    content: string;
}

export default function VoicebotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [textMessage, setTextMessage] = useState('');
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const resultUrl = "https://docs.google.com/spreadsheets/d/1IjXpZXKhbsxkuo4Fo3r80HYonebVoYsamSwtWxZVGOQ/edit?gid=0#gid=0"; // 結果表示用のURL

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

    const onClose = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setShowResultPopup(true);
        }, 5000);
    };

    const { isPlaying, stop, start, interrupt, isConnected, sendTextMessage, getRecording, micPermissionError, toggleMute, togglePlaybackMute } = useAudioPlayer(onClose, onResponse, "d007274c-07b3-4f25-9b32-2ef437ff106c");

    const handleStopClick = () => {
        stop();
        setIsChatMode(false);
    };

    const handleStartClick = async () => {
        start();
        setIsChatMode(false);
    };

    const handleStartChat = async () => {
        start();
        toggleMute();
        togglePlaybackMute(); // チャットモードの時は音声をミュート
        setIsChatMode(true);
    };

    const handlePhoneCall = () => {
        window.location.href = 'tel:05011112222';
    };

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
        {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-700">AIエージェントが会話を分析中...</p>
                    </div>
                </div>
            </div>
        )}
        {showResultPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-[90%] w-[400px]">
                    <h3 className="text-lg font-semibold mb-2">通話が終了しました</h3>
                    <p className="mb-4">結果は以下のURLで確認できます：</p>
                    <a
                        href={resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline break-all"
                    >
                        {resultUrl}
                    </a>
                    <button
                        onClick={() => setShowResultPopup(false)}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        )}
        <div className="flex flex-col h-screen">
            <div className="flex justify-center mt-4">
                <div>

                    <details className="bg-white/80 p-4 rounded-lg shadow-sm max-w-2xl mx-auto">
                        <summary className="cursor-pointer text-gray-700 font-medium">
                            本AIオペレーターについて
                        </summary>
                        <div className="mt-3 text-sm text-gray-600">
                            <p className="mb-2">
                                Google Cloudのサービスに関する質問、クレーム、新規機能要望を受け付けるAIオペレーターです。
                            </p>
                            <p className="mb-2 text-xs">対象サービス:</p>
                            <div className="text-xs text-gray-500 grid grid-cols-2 gap-1">
                                <div>• Vertex AI Studio</div>
                                <div>• Vertex AI Agent Builder</div>
                                <div>• Vertex AI Platform</div>
                                <div>• Vertex AI Notebooks</div>
                                <div>• Gemini API in Vertex AI</div>
                                <div>• AutoML</div>
                                <div>• Natural Language AI</div>
                                <div>• Speech to Text</div>
                                <div>• Text to Speech</div>
                                <div>• Translation AI</div>
                                <div>• Vision AI</div>
                                <div>• Video AI</div>
                                <div>• Document AI</div>
                                <div>• DialogFlow</div>
                                <div>• Contact Center AI</div>
                                <div>• Cloud Functions</div>
                                <div>• App Engine</div>
                                <div>• Cloud Run</div>
                                <div>• Google Kubernetes Engine</div>
                                <div>• Google Compute Engine</div>
                            </div>
                        </div>
                    </details>


                    <div className="mt-12 flex flex-col items-center">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => window.location.href = "tel:+12407700503"}
                                    className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                                >
                                    <IoIosCall size={24} color="white" className="mr-2" />
                                    <span className="text-white font-semibold">+12407700503に電話する</span>
                                </button>
                                <button
                                    onClick={() => setShowResultPopup(true)}
                                    className="text-sm text-gray-500 mt-2 hover:text-gray-700"
                                >
                                    電話を切ったらこちらをクリック
                                </button>
                            </div>

                            <div className="flex items-center w-full">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="px-4 text-gray-500 font-medium">または</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {!isConnected ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleStartClick}
                                        className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                                    >
                                        <IoIosCall size={24} color="white" className="mr-2" />
                                        <span className="text-white font-semibold">Webで話す</span>
                                    </button>
                                    <button
                                        onClick={handleStartChat}
                                        className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                                    >
                                        <BsChatDots size={24} color="white" className="mr-2" />
                                        <span className="text-white font-semibold">チャットで話す</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleStopClick}
                                    className="relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                >
                                    <MdCallEnd size={24} color="white" className="mr-2" />
                                    <span className="text-white font-semibold">{isChatMode ? "チャットを終了" : "通話を終了"}</span>
                                </button>
                            )}

                            {isConnected && isChatMode && (
                                <div className="w-96">
                                    <Input
                                        type="text"
                                        value={textMessage}
                                        onChange={(e) => setTextMessage(e.target.value)}
                                        onKeyPress={handleTextSubmit}
                                        placeholder="メッセージを入力してEnterを押してください"
                                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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
        </div>
    </div>
}
