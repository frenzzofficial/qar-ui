import CameraMobileCaptureButton from "./mobile/CameraMobileCaptureButton";
import CameraMobileCapturedMedia from "./mobile/CameraMobileCapturedMedia";
import CameraMobileUi from "./mobile/CameraMobileUi";
import CameraMobileVideo from "./mobile/CameraMobileVideo";

const CameraMobileApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Mobile Camera */}
      <div className="relative w-full h-full flex flex-col">
        <CameraMobileVideo />
        <CameraMobileCapturedMedia />
        <CameraMobileUi />
        {/* Bottom-center Capture Button */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <CameraMobileCaptureButton />
        </div>
      </div>
    </div>
  );
};

export default CameraMobileApp;
