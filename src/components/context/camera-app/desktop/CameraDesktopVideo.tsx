"use client";
import React from "react";
import Image from "next/image";
import { useCamera } from "@/libs/hooks/use-camera";

const CameraDesktopVideo = () => {
  const {
    videoRef,
    overlayRef,
    capturedMediaRef,
    isCameraStreaming,
    isARMode,
    snapshotUrl,
    isPreviewMode,
    switchBetweenPreviewMode,
  } = useCamera();

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Base video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* AR overlay */}
      {isARMode && (
        <canvas
          ref={overlayRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
      )}

      {/* Snapshot canvas */}
      {!snapshotUrl && (
        <canvas
          ref={capturedMediaRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />
      )}

      {/* Fallback overlay */}
      {!isCameraStreaming && (
        <div className="absolute inset-0 w-full h-full bg-black opacity-50 z-30 flex items-center justify-center text-white text-sm">
          Camera inactive
        </div>
      )}

      {/* Snapshot preview */}
      {snapshotUrl && isPreviewMode && (
        <div className="absolute inset-0 w-full h-full z-40 flex items-center justify-center">
          <Image
            src={snapshotUrl}
            alt="Snapshot Preview"
            className="rounded shadow-md max-w-full max-h-full"
            width={640}
            height={480}
            priority
          />
          <button
            onClick={switchBetweenPreviewMode}
            aria-label="Close Preview"
            className="absolute top-4 right-4 px-3 py-1 bg-white text-black rounded shadow hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraDesktopVideo;
