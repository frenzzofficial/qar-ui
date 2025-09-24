"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

interface CameraContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  overlayRef: React.RefObject<HTMLCanvasElement | null>;
  capturedMediaRef: React.RefObject<HTMLCanvasElement | null>;

  startCamera: () => void;
  switchCamera: () => void;
  stopCamera: () => void;

  setIsARMode: (isARMode: boolean) => void;
  switchBetweenARModes: () => void;
  switchBetweenVideoMode: () => void;
  switchBetweenPreviewMode: () => void;

  isPreviewMode: boolean;
  isARMode: boolean;
  isHydrated: boolean;
  isVideoMode: boolean;
  isCameraStreaming: boolean;

  captureSnapshot: () => void;
  toggleRecording: () => void;
  downloadVideo: () => void;
  snapshotUrl: string | null;
  recording: boolean;
  recordedChunks: Blob[];
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const capturedMediaRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isARMode, setIsARMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [recording, setRecording] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);

  const startCamera = useCallback(
    async (facingMode: "user" | "environment" = "user") => {
      try {
        const hasPermission = await (async () => {
          try {
            const result = await navigator.permissions.query({
              name: "camera" as PermissionName,
            });
            return result.state !== "denied";
          } catch {
            return true; // fallback for unsupported browsers
          }
        })();

        if (!hasPermission) {
          alert("Camera permission denied.");
          console.warn("Camera access denied.");
          return;
        }

        // Stop previous stream if active
        stream?.getTracks().forEach((track) => track.stop());

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        setRecordedChunks([]);
        setSnapshotUrl(null);
        setIsPreviewMode(false);
        setStream(mediaStream);
        setIsCameraStreaming(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("Failed to start camera:", error);
        alert(
          "Unable to access camera. Please check permissions or device availability."
        );
      }
    },
    [stream, videoRef]
  );

  const switchCamera = async () => {
    try {
      const currentFacingMode = stream
        ?.getVideoTracks()[0]
        ?.getSettings()?.facingMode;
      const newFacingMode =
        currentFacingMode === "user" ? "environment" : "user";

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
      });

      stream?.getTracks().forEach((track) => track.stop());

      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const stopCamera = () => {
    try {
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setStream(null);
      setIsCameraStreaming(false);
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !capturedMediaRef.current) return;
    const ctx = capturedMediaRef.current.getContext("2d");
    if (!ctx) return;

    capturedMediaRef.current.width = videoRef.current.videoWidth;
    capturedMediaRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    setSnapshotUrl(capturedMediaRef.current.toDataURL("image/png"));
  };

  const toggleRecording = () => {
    if (!stream) return;

    if (!recording) {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      recorder.onstop = () => {
        mediaRecorderRef.current = null;
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

    a.addEventListener("click", () => {
      setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    a.click();
    setRecordedChunks([]);
  };

  const switchBetweenARModes = () => setIsARMode((prev) => !prev);
  const switchBetweenVideoMode = () => setIsVideoMode((prev) => !prev);
  const switchBetweenPreviewMode = () => {
    if (isPreviewMode) {
      // Exiting preview mode: clear snapshot and start camera
      setSnapshotUrl(null);
      startCamera();
    } else {
      // Entering preview mode: stop camera to freeze frame
      stopCamera();
    }
    setIsPreviewMode((prev) => !prev);
  };

  const setOverlayContext = useCallback(() => {
    const video = videoRef.current;
    const canvas = overlayRef.current;
    if (!video || !canvas) return;

    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width * 1, canvas.height * 1);
  }, [videoRef, overlayRef]);

  useEffect(() => {
    let animationFrameId: number;

    const drawOverlay = () => {
      setOverlayContext();
      animationFrameId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
    return () => cancelAnimationFrame(animationFrameId);
  }, [setOverlayContext]);

  useEffect(() => {
    setIsHydrated(true);
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => startCamera(), 300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [startCamera]);

  const value = useMemo(
    () => ({
      videoRef,
      overlayRef,
      capturedMediaRef,
      startCamera,
      switchCamera,
      stopCamera,
      setIsARMode,
      switchBetweenARModes,
      switchBetweenVideoMode,
      switchBetweenPreviewMode,
      isPreviewMode,
      isARMode,
      isHydrated,
      isVideoMode,
      isCameraStreaming,
      snapshotUrl,
      recording,
      recordedChunks,
      captureSnapshot,
      toggleRecording,
      downloadVideo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isARMode,
      isHydrated,
      isVideoMode,
      isCameraStreaming,
      snapshotUrl,
      recording,
      recordedChunks,
    ]
  );

  return (
    <CameraContext.Provider value={value}>{children}</CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCameraContext must be used inside <CameraProvider>");
  }
  return context;
};
