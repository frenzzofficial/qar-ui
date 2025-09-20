"use client";
import React, { useRef, useEffect, useState } from "react";

const CameraApp = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          const videoElement = videoRef.current as HTMLVideoElement;
          videoElement.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or unavailable.");
        console.error(err);
      }
    };

    startCamera();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[640px] h-[480px] bg-white shadow-lg rounded-lg overflow-hidden flex items-center justify-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default CameraApp;
