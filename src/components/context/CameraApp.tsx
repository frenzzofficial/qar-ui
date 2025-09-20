"use client";
import CameraMobileApp from "./CameraMobileApp";
import CameraDesktopApp from "./CameraDesktopApp";
import React, { useEffect, useState } from "react";
import { useBreakpoint } from "@/libs/hooks/use-breakpoints";

const CameraApp: React.FC = () => {
  const { isMobile } = useBreakpoint();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Prevent mismatch between SSR and client
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return isMobile ? <CameraMobileApp /> : <CameraDesktopApp />;
};

export default CameraApp;
