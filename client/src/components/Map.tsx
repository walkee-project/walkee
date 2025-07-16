import "./css/Map.css";
import { useState, useEffect, useRef, type ChangeEvent, type JSX } from "react";
import compass_bg from "../assets/compass_bg.png";
import compass_needle from "../assets/compass_needle.png";
import gpsBtnIcon from "../assets/gpsBtnIcon.png";
import Map_goalSection from "./Map_goalSection";
import MapComponent from "./map/MapComponent";
import MapTools from "./MapTools";

// window 객체에 카카오맵 타입 확장
declare global {
  interface Window {
    kakaoMapInstance: kakao.maps.Map;
    currentMarker: kakao.maps.Marker;
  }
}

function Map() {
  const [goalType, setGoalType] = useState("목표 없음");
  const [distanceGoal, setDistanceGoal] = useState("");
  const [timeGoal, setTimeGoal] = useState("");
  const [heading, setHeading] = useState(0);
  const [selectedMode, setSelectedMode] =
    useState<keyof typeof sectionComponents>("");
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  // MapComponent에서 onMapReady 콜백으로 mapInstance를 세팅
  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
  };

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

  // 버튼별 section 매핑 테이블 정의
  const sectionComponents: Record<string, JSX.Element> = {
    goalSection: (
      <Map_goalSection
        goalType={goalType}
        distanceGoal={distanceGoal}
        timeGoal={timeGoal}
        handleGoalChange={handleGoalChange}
        handleDistanceChange={handleDistanceChange}
        handleTimeChange={handleTimeChange}
        markerRef={markerRef}
      />
    ),
    course: (
      <div className="course_section">
        <div className="goal_label">코스 따라 달리기</div>
        {/* 코스 선택 UI */}
      </div>
    ),
  };

  return (
    <div className="map_page">
      <MapComponent markerRef={markerRef} onMapReady={handleMapReady} />

      {/* 🧭 나침반 + 현재 위치 이동 버튼 (합쳐진 컴포넌트) */}
      <MapTools
        heading={heading}
        markerRef={markerRef}
        mapInstance={mapInstance}
        compassBg={compass_bg}
        compassNeedle={compass_needle}
        gpsIcon={gpsBtnIcon}
      />

      {/* 기능 버튼들 (네비게이션 바로 위) */}
      <div className="button_section">
        {/* 기존 나침반, GPS 버튼 제거됨 */}

        <div className={`button_box ${selectedMode ? "" : "active"}`}>
          {/* 선택 전: 버튼 보여줌 */}
          {!selectedMode && (
            <div className="firstSelect_section">
              <button
                className="mapbtn mapbtn_two"
                onClick={() => handleModeSelect("goalSection")}
              >
                달리기 시작
              </button>
              <button
                className="mapbtn mapbtn_two"
                onClick={() => handleModeSelect("course")}
              >
                코스 따라 달리기
              </button>
            </div>
          )}

          {/* 선택 후: 섹션 보여줌 */}
          {selectedMode && <>{sectionComponents[selectedMode]}</>}
        </div>
      </div>
    </div>
  );
}

export default Map;
