import { useState } from "react";

interface ImageOverlayProps {
  imageUrls: string[];
  sizes?: { width: number; height: number }[];
}

export function useImageOverlay({ imageUrls, sizes = [] }: ImageOverlayProps) {
  const [images, setImages] = useState(imageUrls);

  return {
    images,
    sizes,
    setImages,
  };
}
