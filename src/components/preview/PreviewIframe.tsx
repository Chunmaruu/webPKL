"use client";

import { useState } from "react";
import { HiOutlineDesktopComputer, HiOutlineDeviceTablet, HiOutlineDeviceMobile } from "react-icons/hi";

export function PreviewIframe({ websiteId }: { websiteId: number }) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const deviceWidths = {
    desktop: "w-full max-w-full h-full",
    tablet: "w-[768px] max-w-full h-full border-x-8 border-t-8 border-dark-800 rounded-t-2xl shadow-2xl",
    mobile: "w-[375px] max-w-full h-full border-x-8 border-t-8 border-dark-800 rounded-t-2xl shadow-2xl",
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Device selectors toolbar */}
      <div className="flex justify-center gap-2 mb-4 shrink-0 bg-dark-950 p-1.5 rounded-xl border border-dark-800">
        <button
          onClick={() => setDevice("desktop")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            device === "desktop"
              ? "bg-primary-500/15 text-primary-400 border border-primary-500/25"
              : "text-dark-400 hover:text-dark-200"
          }`}
        >
          <HiOutlineDesktopComputer className="w-4 h-4" />
          Desktop
        </button>
        <button
          onClick={() => setDevice("tablet")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            device === "tablet"
              ? "bg-primary-500/15 text-primary-400 border border-primary-500/25"
              : "text-dark-400 hover:text-dark-200"
          }`}
        >
          <HiOutlineDeviceTablet className="w-4 h-4" />
          Tablet
        </button>
        <button
          onClick={() => setDevice("mobile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            device === "mobile"
              ? "bg-primary-500/15 text-primary-400 border border-primary-500/25"
              : "text-dark-400 hover:text-dark-200"
          }`}
        >
          <HiOutlineDeviceMobile className="w-4 h-4" />
          Mobile
        </button>
      </div>

      {/* Frame wrapper */}
      <div className="flex-1 w-full min-h-0 flex justify-center items-stretch overflow-hidden">
        <iframe
          src={`/api/preview/${websiteId}`}
          className={`bg-white transition-all duration-300 ${deviceWidths[device]}`}
          title="Website Preview"
        />
      </div>
    </div>
  );
}
