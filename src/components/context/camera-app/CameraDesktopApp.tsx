import React from "react";
import CameraDesktopUi from "./desktop/CameraDesktopUi";
import CameraDesktopVideo from "./desktop/CameraDesktopVideo";
import CameraDesktopCapturedMedia from "./desktop/CameraDesktopCapturedMedia";

const CameraDesktopApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-[640px] h-[480px] bg-white shadow-lg rounded-lg overflow-hidden relative">
        <CameraDesktopVideo />
      </div>
      <div className="flex flex-col items-center justify-center pt-4 h-34">
        <CameraDesktopUi />
        <CameraDesktopCapturedMedia />
      </div>
    </div>
  );
};

export default CameraDesktopApp;
