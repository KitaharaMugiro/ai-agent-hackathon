import { useState, useRef, useEffect } from 'react';


const StreamProcessorWorklet = `
class StreamProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.hasStarted = false;
    this.hasInterrupted = false;
    this.outputBuffers = [];
    this.bufferLength = 128;
    this.write = { buffer: new Float32Array(this.bufferLength), trackId: null };
    this.writeOffset = 0;
    this.trackSampleOffsets = {};
    this.port.onmessage = (event) => {
      if (event.data) {
        const payload = event.data;
        if (payload.event === 'write') {
          const int16Array = payload.buffer;
          const float32Array = new Float32Array(int16Array.length);
          for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / 0x8000; // Convert Int16 to Float32
          }
          this.writeData(float32Array, payload.trackId);
        } else if (
          payload.event === 'offset' ||
          payload.event === 'interrupt'
        ) {
          const requestId = payload.requestId;
          const trackId = this.write.trackId;
          const offset = this.trackSampleOffsets[trackId] || 0;
          this.port.postMessage({
            event: 'offset',
            requestId,
            trackId,
            offset,
          });
          if (payload.event === 'interrupt') {
            this.hasInterrupted = true;
          }
        } else {
          throw new Error(\`Unhandled event "\${payload.event}"\`);
        }
      }
    };
  }

  writeData(float32Array, trackId = null) {
    let { buffer } = this.write;
    let offset = this.writeOffset;
    for (let i = 0; i < float32Array.length; i++) {
      buffer[offset++] = float32Array[i];
      if (offset >= buffer.length) {
        this.outputBuffers.push(this.write);
        this.write = { buffer: new Float32Array(this.bufferLength), trackId };
        buffer = this.write.buffer;
        offset = 0;
      }
    }
    this.writeOffset = offset;
    return true;
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outputChannelData = output[0];
    const outputBuffers = this.outputBuffers;
    if (this.hasInterrupted) {
      this.port.postMessage({ event: 'stop' });
      return false;
    } else if (outputBuffers.length) {
      this.hasStarted = true;
      const { buffer, trackId } = outputBuffers.shift();
      for (let i = 0; i < outputChannelData.length; i++) {
        outputChannelData[i] = buffer[i] || 0;
      }
      if (trackId) {
        this.trackSampleOffsets[trackId] =
          this.trackSampleOffsets[trackId] || 0;
        this.trackSampleOffsets[trackId] += buffer.length;
      }
      return true;
    } else if (this.hasStarted) {
      this.port.postMessage({ event: 'stop' });
      return false;
    } else {
      return true;
    }
  }
}

registerProcessor('stream_processor', StreamProcessor);
`;

const StreamProcessorSrc = URL.createObjectURL(new Blob([StreamProcessorWorklet], { type: 'application/javascript' }));

class WavStreamPlayer {
    private scriptSrc: string;
    private sampleRate: number;
    private context: AudioContext;
    private stream: AudioWorkletNode | null;
    private analyser: AnalyserNode | null;
    private trackSampleOffsets: Record<string, { trackId: string, offset: number, currentTime: number }>;
    private interruptedTrackIds: Record<string, boolean>;
    private destinations: AudioNode[];

    constructor({ sampleRate = 44100, audioContext }: { sampleRate?: number, audioContext: AudioContext }) {
        this.scriptSrc = StreamProcessorSrc;
        this.sampleRate = sampleRate;
        this.context = audioContext;
        this.stream = null;
        this.analyser = null;
        this.trackSampleOffsets = {};
        this.interruptedTrackIds = {};
        this.destinations = [];
    }

    async connect() {
        if (!this.context) {
            throw new Error('AudioContext is not initialized.');
        }
        if (this.context.state === 'suspended') {
            await this.context.resume();
        }
        try {
            await this.context.audioWorklet.addModule(this.scriptSrc);
        } catch (e) {
            console.error(e);
            throw new Error(`Could not add audioWorklet module: ${this.scriptSrc}`);
        }
        const analyser = this.context.createAnalyser();
        analyser.fftSize = 8192;
        analyser.smoothingTimeConstant = 0.1;
        this.analyser = analyser;
        return true;
    }

    private _start() {
        if (!this.context) return false;
        const streamNode = new AudioWorkletNode(this.context, 'stream_processor');
        streamNode.connect(this.context.destination);
        streamNode.port.onmessage = (e) => {
            const { event } = e.data;
            if (event === 'stop') {
                streamNode.disconnect();
                this.stream = null;
            } else if (event === 'offset') {
                const { requestId, trackId, offset } = e.data;
                const currentTime = offset / this.sampleRate;
                this.trackSampleOffsets[requestId] = { trackId, offset, currentTime };
                console.log("trackSampleOffsets", this.trackSampleOffsets);
            }
        };
        this.analyser?.disconnect();
        streamNode.connect(this.analyser!);

        // 全ての出力先に接続
        this.destinations.forEach(dest => streamNode.connect(dest));

        this.stream = streamNode;
        return true;
    }

    public startPlayback(destinationNodes: AudioNode | AudioNode[]) {
        if (Array.isArray(destinationNodes)) {
            this.destinations = destinationNodes;
        } else {
            this.destinations = [destinationNodes];
        }
        this._start();
    }

    add16BitPCM(arrayBuffer: ArrayBuffer | Int16Array, trackId = 'default') {
        if (typeof trackId !== 'string') {
            throw new Error(`trackId must be a string`);
        } else if (trackId === "no-interrupt") {
            // dont do anything
        } else if (this.interruptedTrackIds[trackId]) {
            return;
        }
        // console.log("stream", this.stream);
        if (!this.stream && this.destinations.length > 0) {
            this.startPlayback(this.destinations);
        } else if (!this.stream) {
            throw new Error('Stream not initialized. Call startPlayback first.');
        }
        let buffer: Int16Array;
        if (arrayBuffer instanceof Int16Array) {
            buffer = arrayBuffer;
        } else if (arrayBuffer instanceof ArrayBuffer) {
            buffer = new Int16Array(arrayBuffer);
        } else {
            throw new Error(`argument must be Int16Array or ArrayBuffer`);
        }
        this.stream?.port.postMessage({ event: 'write', buffer, trackId });
        return buffer;
    }

    async getTrackSampleOffset(interrupt = false) {
        if (!this.stream) {
            return null;
        }
        const requestId = crypto.randomUUID();
        this.stream.port.postMessage({
            event: interrupt ? 'interrupt' : 'offset',
            requestId,
        });
        let trackSampleOffset;
        while (!trackSampleOffset) {
            trackSampleOffset = this.trackSampleOffsets[requestId];
            await new Promise<void>((r) => setTimeout(r, 1));
        }
        const { trackId } = trackSampleOffset;
        if (interrupt && trackId) {
            this.interruptedTrackIds[trackId] = true;
        }
        return trackSampleOffset;
    }

    async interrupt() {
        return this.getTrackSampleOffset(true);
    }

    isPlaying() {
        return this.stream !== null && this.stream.port !== null;
    }
}

const useAudioPlayer = (onClose: () => void, onResponse: (type: string, content: string) => void, clientId: string = "callcenter") => {
    const [hasMicPermission, setHasMicPermission] = useState<boolean>(false);
    const [micPermissionError, setMicPermissionError] = useState<boolean>(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const websocketRef = useRef<WebSocket | null>(null);
    const wavStreamPlayerRef = useRef<WavStreamPlayer | null>(null);
    const BUFFER_SIZE = 4096;
    const speakingStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMutedRef = useRef<boolean>(false);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const micRecorderRef = useRef<MediaRecorder | null>(null); // マイク音声用
    const aiRecorderRef = useRef<MediaRecorder | null>(null); // AI音声用
    const chunksRef = useRef<Blob[]>([]);
    const micChunksRef = useRef<Blob[]>([]); // マイク音声用
    const aiChunksRef = useRef<Blob[]>([]); // AI音声用

    const start = async () => {
        let micStream;
        try {
            micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            setHasMicPermission(true);
        } catch (error) {
            setHasMicPermission(false);
            setMicPermissionError(true);
            console.error("Error getting microphone permission", error);
            return
        }
        const newAudioContext = new AudioContext({ sampleRate: 44100 });
        const micSource = newAudioContext.createMediaStreamSource(micStream);
        const destination = newAudioContext.createMediaStreamDestination();
        const aiDestination = newAudioContext.createMediaStreamDestination(); // AI音声用の出力先

        micSource.connect(destination);
        const processor = newAudioContext.createScriptProcessor(BUFFER_SIZE, 1, 1);
        const wsProtocol = "wss://voicebot-api.langcore.org";
        const newWebsocket = new WebSocket(`${wsProtocol}/ws/user/${clientId}`);
        websocketRef.current = newWebsocket;

        micSource.connect(processor);
        processor.connect(newAudioContext.destination);

        processor.onaudioprocess = function (e: AudioProcessingEvent) {
            if (isMutedRef.current) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const outputData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
                outputData[i] = Math.max(-32768, Math.min(32767, Math.round(inputData[i] * 32767)));
            }
            const base64Audio = btoa(
                Array.from(new Uint8Array(outputData.buffer))
                    .map(byte => String.fromCharCode(byte))
                    .join('')
            );
            if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                const message = JSON.stringify({ event: 'media', payload: base64Audio });
                websocketRef.current.send(message);
            } else {
                console.warn('WebSocket接続が準備できていません');
            }
        };

        newWebsocket.onclose = async function () {
            _stopAudio();
            onClose();
        };

        newWebsocket.onmessage = function (event: MessageEvent) {
            const parsedData = JSON.parse(event.data);
            const type = parsedData.type;
            const content = parsedData.content;
            if (type === "audio") {
                const audioData = content.data;
                const trackId = content.track_id;
                const bytes = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
                const audioBuffer = new Blob([bytes], { type: "audio/wav" });
                _addAudioChunk(audioBuffer, trackId);
                return;
            } else {
                onResponse(type, content);
                if (type === "user_speaking") {
                    if (content.status === "SPEAKING") {
                        interrupt();
                    }
                } else if (type === "conversation_start") {
                    setConversationId(content.conversation_id);
                }
            }
        };

        wavStreamPlayerRef.current = new WavStreamPlayer({ sampleRate: 44100, audioContext: newAudioContext });
        await wavStreamPlayerRef.current.connect();

        // マイク音声の録音設定
        micRecorderRef.current = new MediaRecorder(micStream);
        micChunksRef.current = [];
        micRecorderRef.current.ondataavailable = (event) => {
            micChunksRef.current.push(event.data);
        };
        micRecorderRef.current.start();

        // AI音声の録音設定
        aiRecorderRef.current = new MediaRecorder(aiDestination.stream);
        aiChunksRef.current = [];
        aiRecorderRef.current.ondataavailable = (event) => {
            aiChunksRef.current.push(event.data);
        };
        aiRecorderRef.current.start();

        // ミックスされた音声の録音設定
        const mixedStream = destination.stream;
        recorderRef.current = new MediaRecorder(mixedStream);
        chunksRef.current = [];
        recorderRef.current.ondataavailable = (event) => {
            chunksRef.current.push(event.data);
        };
        recorderRef.current.start();

        // 複数の出力先を指定して再生を開始
        wavStreamPlayerRef.current.startPlayback([destination, aiDestination]);

    }

    const _addAudioChunk = (chunk: Blob, trackId: string) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (reader.result instanceof ArrayBuffer && wavStreamPlayerRef.current) {
                wavStreamPlayerRef.current.add16BitPCM(reader.result, trackId);

                if (speakingStopTimeoutRef.current) {
                    clearTimeout(speakingStopTimeoutRef.current);
                }
                speakingStopTimeoutRef.current = setTimeout(() => {
                    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                        websocketRef.current.send(JSON.stringify({ event: "mark", payload: { mark: "ai_speak_stop" } }));
                    } else {
                        console.log("WebSocket connection is not open so cannot send ai_speak_stop");
                    }
                    speakingStopTimeoutRef.current = null;
                }, 500);
            }
        };
        reader.onerror = function (error) {
            console.log('Error reading audio blob', error);
        };
        reader.readAsArrayBuffer(chunk);
    };

    const _stopAudio = () => {
        wavStreamPlayerRef.current?.interrupt();
        if (speakingStopTimeoutRef.current) {
            clearTimeout(speakingStopTimeoutRef.current);
            speakingStopTimeoutRef.current = null;
        }
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({ event: "mark", payload: { mark: "ai_speak_stop" } }));
        }
    };

    const stop = () => {
        return new Promise<void>((resolve) => {
            const stopRecorders = () => {
                if (micRecorderRef.current) {
                    micRecorderRef.current.stop();
                }
                if (aiRecorderRef.current) {
                    aiRecorderRef.current.stop();
                }
            };

            if (recorderRef.current) {
                recorderRef.current.addEventListener(
                    'dataavailable',
                    () => {
                        websocketRef.current?.close();
                        stopRecorders();
                        resolve();
                    },
                    { once: true }
                );
                recorderRef.current.stop();
            } else {
                websocketRef.current?.close();
                stopRecorders();
                resolve();
            }
        });
    }

    const interrupt = () => {
        _stopAudio();
    }

    const sendTextMessage = (text: string) => {
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify({ event: "text", payload: { text } }));
        }
    }

    const toggleMute = () => {
        isMutedRef.current = !isMutedRef.current;
    }


    const getRecording = async () => {
        if (chunksRef.current.length === 0) {
            console.warn('No recorded data available');
            return null;
        }
        const mixedBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const micBlob = new Blob(micChunksRef.current, { type: 'audio/webm' });
        const aiBlob = new Blob(aiChunksRef.current, { type: 'audio/webm' });
        return {
            mixed: mixedBlob,
            mic: micBlob,
            ai: aiBlob
        };
    }

    const isPlaying = wavStreamPlayerRef.current?.isPlaying() || false;
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const checkConnection = () => {
            setIsConnected(websocketRef.current?.readyState === WebSocket.OPEN);
        };

        checkConnection();

        const interval = setInterval(checkConnection, 100);

        return () => clearInterval(interval);
    }, []);

    return { isPlaying, isConnected, stop, start, interrupt, sendTextMessage, toggleMute, isMuted: isMutedRef.current, getRecording, hasMicPermission, micPermissionError };
};

export default useAudioPlayer;