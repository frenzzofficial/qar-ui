"use client";
import React, { useState } from "react";
import { useCamera } from "@/libs/hooks/use-camera";

const CameraMobileCapturedMedia = () => {
  const {
    recording,
    recordedChunks,
    downloadVideo,
    snapshotUrl,
    isPreviewMode,
    switchBetweenPreviewMode,
  } = useCamera();

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const hasMedia = snapshotUrl || recordedChunks.length > 0 || isPreviewMode;
  if (!hasMedia) return null;

  const sharedButtonClasses =
    "w-full h-10 px-3 text-sm rounded-md shadow transition-colors duration-200";

  return (
    <div className="absolute z-50">
      <button
        onClick={() => setIsPanelOpen((prev) => !prev)}
        className="pointer-events-auto fixed top-8 right-4 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        aria-label="Toggle Control Panel"
      >
        {isPanelOpen ? "🔜" : "🔙"}
      </button>

      <div
        className={`fixed top-24 right-0 w-[160px] px-2 transition-transform duration-300 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ overflowX: "hidden", pointerEvents: "auto" }}
      >
        <div className="flex flex-col gap-3 mt-2">
          {snapshotUrl && (
            <>
              {!isPreviewMode ? (
                <button
                  onClick={switchBetweenPreviewMode}
                  className={`${sharedButtonClasses} bg-blue-600 text-white hover:bg-blue-700`}
                >
                  Preview Image
                </button>
              ) : (
                <>
                  <button
                    onClick={switchBetweenPreviewMode}
                    aria-label="Close Preview"
                    className={`${sharedButtonClasses} bg-blue-600 text-white hover:bg-blue-700`}
                  >
                    Cancel Preview
                  </button>
                  <a href={snapshotUrl} download="snapshot.png">
                    <button
                      className={`${sharedButtonClasses} bg-blue-600 text-white hover:bg-blue-700`}
                    >
                      Download Snapshot
                    </button>
                  </a>
                </>
              )}
            </>
          )}

          {!recording && recordedChunks.length > 0 && (
            <button
              onClick={downloadVideo}
              className={`${sharedButtonClasses} bg-purple-600 text-white hover:bg-purple-700`}
            >
              Download Video
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraMobileCapturedMedia;
