"use client";
import React from "react";
import { useCamera } from "@/libs/hooks/use-camera";

const CameraDesktopUi = () => {
  const {
    recording,
    captureSnapshot,
    toggleRecording,
    isARMode,
    switchBetweenARModes,
    stopCamera,
    isCameraStreaming,
    startCamera,
  } = useCamera();

  return (
    <div className="mt-4 flex flex-wrap gap-4 items-center">
      {/* Start/Stop Camera */}
      <button
        type="button"
        onClick={isCameraStreaming ? stopCamera : startCamera}
        aria-label={isCameraStreaming ? "Pause Camera" : "Play Camera"}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        {isCameraStreaming ? "Pause Camera" : "Play Camera"}
      </button>

      {/* Capture Snapshot */}
      <button
        type="button"
        onClick={captureSnapshot}
        aria-label="Capture Snapshot"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        disabled={!isCameraStreaming}
      >
        Capture
      </button>

      {/* Start/Stop Recording */}
      <button
        type="button"
        onClick={toggleRecording}
        aria-label={recording ? "Stop Recording" : "Start Recording"}
        className={`px-4 py-2 rounded text-white ${
          recording ? "bg-red-600" : "bg-green-600"
        } hover:opacity-80 transition`}
        disabled={!isCameraStreaming}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Toggle AR Mode */}
      <button
        type="button"
        onClick={switchBetweenARModes}
        aria-label={isARMode ? "Switch to Normal Mode" : "Enable AR Mode"}
        className="px-4 py-2 bg-yellow-500 text-black rounded shadow hover:bg-yellow-600 transition"
        disabled={!isCameraStreaming}
      >
        {isARMode ? "Switch to Normal" : "Enable AR Mode"}
      </button>
    </div>
  );
};

export default CameraDesktopUi;
