"use client";
import CameraMobileApp from "./CameraMobileApp";
import CameraDesktopApp from "./CameraDesktopApp";
import React, { useEffect, useState } from "react";
import { useBreakpoint } from "@/libs/hooks/use-breakpoints";

const CameraApp: React.FC = () => {
  const [hydrated, setHydrated] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const isResponsive = isMobile || isTablet;

  useEffect(() => {
    // Prevent mismatch between SSR and client
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return isResponsive ? <CameraMobileApp /> : <CameraDesktopApp />;
};

export default CameraApp;
