"use client";
import React from "react";
import { useCamera } from "@/libs/hooks/use-camera";

const CameraDesktopCapturedMedia = () => {
  const {
    snapshotUrl,
    recording,
    recordedChunks,
    downloadVideo,
    isPreviewMode,
    switchBetweenPreviewMode,
  } = useCamera();

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {snapshotUrl && (
        <div>
          {!isPreviewMode ? (
            <button
              onClick={switchBetweenPreviewMode}
              className="min-w-[160px] h-10 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center"
            >
              Preview Image
            </button>
          ) : (
            <a href={snapshotUrl} download="snapshot.png">
              <button className="min-w-[160px] h-10 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center">
                Download Snapshot
              </button>
            </a>
          )}
        </div>
      )}

      {!recording && recordedChunks.length > 0 && (
        <button
          onClick={downloadVideo}
          className="min-w-[160px] h-10 px-4 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center justify-center"
        >
          Download Video
        </button>
      )}
    </div>
  );
};

export default CameraDesktopCapturedMedia;
