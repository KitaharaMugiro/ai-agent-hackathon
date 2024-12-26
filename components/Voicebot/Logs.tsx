import React, { useEffect, useRef } from 'react';

interface Props {
    logs: string[];
}

const LogViewer: React.FC<Props> = ({ logs }) => {
    const logEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        if (logEndRef.current) {
            const logContainer = logEndRef.current.parentElement;
            if (logContainer) {
                logContainer.scrollTop = logContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    return (
        <div className="h-64 w-full max-w-4xl p-4 bg-gray-800 rounded-lg overflow-auto">
            {logs.map((log, index) => (
                <div key={index} className="py-1">{log}</div>
            ))}
            <div ref={logEndRef} />
        </div>
    );
};

export default LogViewer;
