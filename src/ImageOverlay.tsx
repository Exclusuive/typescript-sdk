import React from "react";

interface ImageData {
  layer: string;
  url: string;
}

interface ImageOverlayProps {
  images: ImageData[]; // { layer: string, url: string } 형태의 배열
  layerInfo: string[]; // 렌더링 순서가 들어있는 배열 (ex: ["background", "character", "effect"])
  size: { width: number; height: number };
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  images,
  layerInfo,
  size,
}) => {
  // layerInfo 순서에 맞게 images 배열 정렬
  const sortedImages = layerInfo
    .map((layer) => images.find((img) => img.layer === layer)) // layerInfo 순서대로 images에서 찾기
    .filter(Boolean) as ImageData[]; // undefined 값 제거

  return (
    <div
      style={{
        position: "relative",
        width: `${size.width}px`,
        height: `${size.height}px`,
        overflow: "hidden",
      }}
    >
      {sortedImages.map((image, index) => (
        <img
          key={index}
          src={image.url}
          alt={`layer-${image.layer}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
        />
      ))}
    </div>
  );
};

export default ImageOverlay;
