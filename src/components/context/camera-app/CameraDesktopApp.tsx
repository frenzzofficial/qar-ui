"use client";
import React from "react";
import Image from "next/image";
import { useCamera } from "../../../libs/hooks/use-camera";

const CameraApp: React.FC = () => {
  const {
    videoRef,
    canvasRef,
    snapshotUrl,
    recording,
    recordedChunks,
    captureSnapshot,
    toggleRecording,
    downloadVideo,
  } = useCamera();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-[640px] h-[480px] bg-white shadow-lg rounded-lg overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={captureSnapshot}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Capture
        </button>
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded text-white ${
            recording ? "bg-red-600" : "bg-green-600"
          } hover:opacity-80`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        {!recording && recordedChunks.length > 0 && (
          <button
            onClick={downloadVideo}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Download Video
          </button>
        )}
      </div>

      {snapshotUrl && (
        <div className="mt-4">
          <Image
            src={snapshotUrl}
            alt="Snapshot"
            className="rounded shadow-md max-w-full"
            width={512}
            height={512}
          />
          <a
            href={snapshotUrl}
            download="snapshot.png"
            className="block mt-2 text-blue-600 underline text-center"
          >
            Download Snapshot
          </a>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraApp;
