import { useState } from "react";

interface ImageOverlayProps {
  imageUrls: string[];
  positions?: { x: number; y: number }[];
  sizes?: { width: number; height: number }[];
}

export function useImageOverlay({
  imageUrls,
  positions = [],
  sizes = [],
}: ImageOverlayProps) {
  const [images, setImages] = useState(imageUrls);

  return {
    images,
    positions,
    sizes,
    setImages,
  };
}
