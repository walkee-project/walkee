import React from "react";
import "../css/MapTools.css";
import { animateMarker, animateMapCenter } from "../../utils/gpsUtils";
import compass_bg from "../../assets/compass_bg.png";
import compass_needle from "../../assets/compass_needle.png";
import gpsBtnIcon from "../../assets/gpsBtnIcon.png";

interface MapToolsProps {
  heading: number;
  markerRef: React.MutableRefObject<kakao.maps.Marker | null>;
  mapInstance: kakao.maps.Map | null;
}

const MapTools: React.FC<MapToolsProps> = ({
  heading,
  markerRef,
  mapInstance,
}) => {
  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (markerRef.current) {
            animateMarker(markerRef.current, lat, lng, 1000);
          }
          if (mapInstance) {
            animateMapCenter(mapInstance, lat, lng, 1000);
          }
        },
        (error) => {
          console.error("현재 위치를 가져올 수 없습니다:", error);
          alert("현재 위치를 가져올 수 없습니다.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );
    } else {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  };

  return (
    <div className="map_tools">
      {/* 🧭 나침반 (좌상단 고정) */}
      <div className="compass">
        <img src={compass_bg} alt="나침반 배경" className="compass_bg" />
        <img
          src={compass_needle}
          alt="나침반 바늘"
          className="compass_needle"
          style={{ transform: `translate(-50%, -50%) rotate(${heading}deg)` }}
        />
      </div>
      {/* 📍 현재 위치 이동 버튼 (오른쪽 위 고정) */}
      <button
        className="gps_button"
        onClick={moveToCurrentLocation}
        disabled={!mapInstance}
      >
        <img src={gpsBtnIcon} alt="현재위치로이동" />
      </button>
    </div>
  );
};

export default MapTools;
