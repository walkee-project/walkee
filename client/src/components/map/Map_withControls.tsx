import MapComponent from "./MapComponent";
import gpsIcon from "../../assets/gpsBtnIcon.png";
import compass_bg from "../../assets/compass_bg.png";
import compass_needle from "../../assets/compass_needle.png";
import { animateMarker } from "../../utils/gpsUtils";
import { useState, useEffect, useRef, type ChangeEvent, type JSX } from "react";

function MapWithControls() {
  // kakao.maps.Map에 panTo 메서드 타입을 명시적으로 추가
  interface KakaoMapWithPanTo extends kakao.maps.Map {
    panTo: (latlng: kakao.maps.LatLng) => void;
  }

  const [goalType, setGoalType] = useState("목표 없음");
  const [distanceGoal, setDistanceGoal] = useState("");
  const [timeGoal, setTimeGoal] = useState("");
  const [heading, setHeading] = useState(0);

  const markerRef = useRef<kakao.maps.Marker | null>(null);

  const handleModeSelect = (mode: keyof typeof sectionComponents) => {
    setSelectedMode(mode);
  };

  const handleGoalChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setGoalType(e.target.value);
    setDistanceGoal("");
    setTimeGoal("");
  };

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDistanceGoal(e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTimeGoal(e.target.value);
  };

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // 현재 위치로 지도 이동하는 함수
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (markerRef.current) {
            animateMarker(markerRef.current, lat, lng, 1000);
          }
          if (window.kakaoMapInstance) {
            (window.kakaoMapInstance as KakaoMapWithPanTo).panTo(
              new window.kakao.maps.LatLng(lat, lng)
            );
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
    <div className="map-wrapper">
      <MapComponent />

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

      {/* 📍 현재 위치 이동 버튼 (우하단) */}
      <button className="gps_button" onClick={moveToCurrentLocation}>
        <img src={gpsIcon} alt="현재위치로이동" />
      </button>
    </div>
  );
}

export default MapWithControls;
