"use client";
import React, { useState } from "react";
import { useCamera } from "@/libs/hooks/use-camera";

const CameraMobileUi = () => {
  const {
    isCameraStreaming,
    stopCamera,
    startCamera,
    switchBetweenARModes,
    isARMode,
  } = useCamera();

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const sharedButtonClasses =
    "w-full h-10 px-3 text-sm rounded-md shadow transition-colors duration-200";

  return (
    <div className="relative z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsPanelOpen((prev) => !prev)}
        className="fixed top-8 left-4 z-30 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        aria-label="Toggle Control Panel"
      >
        {isPanelOpen ? "🔙" : "🔜"}
      </button>

      {/* Control Panel */}
      <div
        className={`fixed top-24 left-0 w-[160px] px-2 transition-transform duration-300 ${
          isPanelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ overflowX: "hidden", pointerEvents: "auto" }}
      >
        <div className="flex flex-col gap-3 mt-2">
          <button
            type="button"
            onClick={isCameraStreaming ? stopCamera : startCamera}
            aria-label={isCameraStreaming ? "Pause Camera" : "Play Camera"}
            className={`${sharedButtonClasses} bg-purple-600 text-white hover:bg-purple-700`}
          >
            {isCameraStreaming ? "Pause Camera" : "Play Camera"}
          </button>

          <button
            type="button"
            onClick={switchBetweenARModes}
            aria-label={isARMode ? "Switch to Normal Mode" : "Enable AR Mode"}
            className={`${sharedButtonClasses} bg-yellow-500 text-black hover:bg-yellow-600`}
            disabled={!isCameraStreaming}
          >
            {isARMode ? "Switch to Normal" : "Enable AR Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraMobileUi;
