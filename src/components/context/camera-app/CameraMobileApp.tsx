"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useCamera } from "../../../libs/hooks/use-camera";

const CameraMobileApp: React.FC = () => {
  const {
    videoRef,
    canvasRef,
    snapshotUrl,
    recording,
    recordedChunks,
    captureSnapshot,
    toggleRecording,
    downloadVideo,
    startCamera,
  } = useCamera();

  useEffect(() => {
    const handleResize = () => {
      startCamera();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [startCamera]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Desktop Camera */}
      <div className="hidden md:flex flex-col items-center gap-4">
        <div className="w-[640px] h-[480px] bg-white rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={captureSnapshot}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Capture
          </button>
          <button
            onClick={toggleRecording}
            className={`px-4 py-2 text-white rounded ${
              recording ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {recording ? "Stop Recording" : "Start Recording"}
          </button>
          {!recording && recordedChunks.length > 0 && (
            <button
              onClick={downloadVideo}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Download
            </button>
          )}
        </div>
      </div>

      {/* Mobile Camera */}
      <div className="md:hidden relative w-full h-full flex flex-col">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="flex-1 w-full object-cover"
          style={{ aspectRatio: "9/16" }}
        />

        {/* Bottom Controls */}
        <div className="absolute bottom-0 w-full flex justify-center gap-6 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={captureSnapshot}
            className="w-16 h-16 bg-white rounded-full border-4 border-blue-500 shadow-md"
          />
          <button
            onClick={toggleRecording}
            className={`w-16 h-16 rounded-full shadow-md border-4 ${
              recording
                ? "bg-red-600 border-red-800"
                : "bg-green-500 border-green-700"
            }`}
          />
        </div>

        {/* Snapshot Preview */}
        {snapshotUrl && (
          <div className="absolute top-4 right-4">
            <Image
              src={snapshotUrl}
              alt="Snapshot"
              className="w-20 h-32 object-cover rounded shadow"
              width={512}
              height={512}
            />
          </div>
        )}

        {/* Download Button */}
        {!recording && recordedChunks.length > 0 && (
          <button
            onClick={downloadVideo}
            className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white rounded shadow"
          >
            Download
          </button>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraMobileApp;
