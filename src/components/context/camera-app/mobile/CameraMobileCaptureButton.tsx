"use client";
import { useCamera } from "@/libs/hooks/use-camera";
import { useRef, useState } from "react";

const CameraMobileCaptureButton = ({}) => {
  const { captureSnapshot, toggleRecording } = useCamera();
  const [recording, setRecording] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const startRecording = () => {
    setRecording(true);
    toggleRecording();
  };

  const stopRecording = () => {
    setRecording(false);
    toggleRecording();
  };

  const handlePointerDown = () => {
    isLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setRecording(true);
      startRecording(); // Start video recording
    }, 500); // Long press threshold
  };

  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);

    if (isLongPress.current) {
      stopRecording(); // Stop video recording
      setRecording(false);
    } else {
      captureSnapshot(); // Take photo
    }
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`w-16 h-16 rounded-full shadow-md border-4 transition-all duration-300 ${
        recording
          ? "bg-red-600 border-red-800 scale-110"
          : "bg-green-500 border-green-700 hover:scale-105"
      }`}
    />
  );
};

export default CameraMobileCaptureButton;
