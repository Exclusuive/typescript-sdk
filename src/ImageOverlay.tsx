import React from "react";

interface ImageOverlayProps {
  images: string[];
  positions?: { x: number; y: number }[];
  sizes?: { width: number; height: number }[];
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  images,
  positions = [],
  sizes = [],
}) => {
  return (
    <div style={{ position: "relative", width: "300px", height: "300px" }}>
      {images.map((src, index) => {
        const position = positions[index] || { x: 0, y: 0 };
        const size = sizes[index] || { width: 100, height: 100 };

        return (
          <img
            key={index}
            src={src}
            alt={`overlay-${index}`}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height,
            }}
          />
        );
      })}
    </div>
  );
};

export default ImageOverlay;
