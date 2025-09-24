"use client";
import React from "react";
import Image from "next/image";
import { useCamera } from "@/libs/hooks/use-camera";

const CameraMobileVideo = () => {
  const {
    videoRef,
    overlayRef,
    capturedMediaRef,
    isCameraStreaming,
    isARMode,
    snapshotUrl,
    isPreviewMode,
  } = useCamera();

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="flex-1 w-full object-cover"
        style={{ aspectRatio: "9/16" }}
      />
      {isARMode && (
        <canvas
          ref={overlayRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"
        />
      )}
      {/* Snapshot canvas */}
      {!snapshotUrl && (
        <canvas
          ref={capturedMediaRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />
      )}

      {!isCameraStreaming && (
        <div className="absolute top-0 left-0 w-full h-full z-[1] bg-black opacity-50" />
      )}
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
        </div>
      )}
    </>
  );
};

export default CameraMobileVideo;
