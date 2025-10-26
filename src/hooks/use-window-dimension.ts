import * as React from "react";

const SMALL_MOBILE_BREAKPOINT = 375;
const MOBILE_BREAKPOINT = 390;
const TABLET_BREAKPOINT = 768;
const TABLET_LANDSCAPE_BREAKPOINT = 1024;
const LAPTOP_BREAKPOINT = 1280;
const DESKTOP_BREAKPOINT = 1920;
const MONITOR_2K_BREAKPOINT = 2560;
const MONITOR_4K_BREAKPOINT = 3840;

export type TDeviceType =
  | "small-mobile"
  | "mobile"
  | "tablet"
  | "tablet-landscape"
  | "laptop"
  | "desktop"
  | "monitor-2k"
  | "monitor-4k";

const getDeviceType = (width: number): TDeviceType => {
  if (width <= SMALL_MOBILE_BREAKPOINT) return "small-mobile";
  if (width <= MOBILE_BREAKPOINT) return "mobile";
  if (width <= TABLET_BREAKPOINT) return "tablet";
  if (width <= TABLET_LANDSCAPE_BREAKPOINT) return "tablet-landscape";
  if (width <= LAPTOP_BREAKPOINT) return "laptop";
  if (width <= DESKTOP_BREAKPOINT) return "desktop";
  if (width <= MONITOR_2K_BREAKPOINT) return "monitor-2k";
  if (width <= MONITOR_4K_BREAKPOINT) return "monitor-4k";
  return "monitor-4k";
};

export function useWindowDimension() {
  const [deviceType, setDeviceType] = React.useState<TDeviceType | undefined>(undefined);
  const [dimensions, setDimensions] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType(window.innerWidth));
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // initialize on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    // Base types
    deviceType,
    width: dimensions.width,
    height: dimensions.height,

    // Mobile
    isSmallMobile: deviceType === "small-mobile",
    isMobile: deviceType === "mobile",
    isAnyMobile: deviceType === "mobile" || deviceType === "small-mobile",

    // Tablet
    isTablet: deviceType === "tablet",
    isTabletLandscape: deviceType === "tablet-landscape",
    isAnyTablet: deviceType === "tablet" || deviceType === "tablet-landscape",

    // Desktop
    isLaptop: deviceType === "laptop",
    isDesktop: deviceType === "desktop",
    isMonitor2k: deviceType === "monitor-2k",
    isMonitor4k: deviceType === "monitor-4k",
  };
}
