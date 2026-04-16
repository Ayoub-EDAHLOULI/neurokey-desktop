import { useState } from "react";
import { getFaviconUrl } from "../core/helpers";

const getFallbackColor = (name: string) => {
  const colors = [
    "#007AFF",
    "#FF9500",
    "#FF3B30",
    "#5856D6",
    "#34C759",
    "#AF52DE",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface BrandIconProps {
  name: string;
  url?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandIcon({
  name,
  url,
  color,
  size = "md",
}: BrandIconProps) {
  const [imgError, setImgError] = useState(false);
  const isImage = url && !imgError;
  const faviconUrl = url ? getFaviconUrl(url) : null;

  // Determine layout sizing
  const dimensions = {
    sm: "w-8 h-8 rounded-lg text-sm",
    md: "w-12 h-12 rounded-xl text-xl",
    lg: "w-16 h-16 rounded-2xl text-2xl",
  }[size];

  const displayColor = isImage ? "bg-white" : color || getFallbackColor(name);

  return (
    <div
      className={`${dimensions} flex items-center justify-center shrink-0 overflow-hidden shadow-sm`}
      style={{ backgroundColor: isImage ? undefined : displayColor }}
    >
      {isImage && faviconUrl ? (
        <img
          src={faviconUrl}
          alt={name}
          className="w-2/3 h-2/3 object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-white font-bold leading-none select-none">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
