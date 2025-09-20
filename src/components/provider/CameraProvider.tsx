"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

interface CameraContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  snapshotUrl: string | null;
  recording: boolean;
  recordedChunks: Blob[];
  startCamera: () => void;
  captureSnapshot: () => void;
  toggleRecording: () => void;
  downloadVideo: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setStream(mediaStream);
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
  };

  const captureSnapshot = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    setSnapshotUrl(canvasRef.current.toDataURL("image/png"));
  };

  const toggleRecording = () => {
    if (!stream) return;
    if (!recording) {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
      };
      recorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    }
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
    URL.revokeObjectURL(url);
    setRecordedChunks([]);
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <CameraContext.Provider
      value={{
        videoRef,
        canvasRef,
        snapshotUrl,
        recording,
        recordedChunks,
        startCamera,
        captureSnapshot,
        toggleRecording,
        downloadVideo,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context)
    throw new Error("useCameraContext must be used within CameraProvider");
  return context;
};
