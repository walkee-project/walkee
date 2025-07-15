import { useState } from "react";
import "../css/Map.css";

// window 객체에 카카오맵 타입 확장
declare global {
  interface Window {
    kakaoMapInstance: kakao.maps.Map;
    currentMarker: kakao.maps.Marker;
  }
}
function Map() {
  const [selectedMode, setSelectedMode] =
    useState<keyof typeof sectionComponents>("");

  const handleModeSelect = (mode: keyof typeof sectionComponents) => {
    setSelectedMode(mode);
  };
  return (
    <div className="map_container">
      {/* 선택 후: 섹션 보여줌 */}
      {selectedMode && <>{sectionComponents[selectedMode]}</>}
    </div>
  );
}

export default Map;
