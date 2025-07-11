import "./css/Map.css";
import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import compass_bg from "../assets/compass_bg.png";
import compass_needle from "../assets/compass_needle.png";
import gpsBtnIcon from "../assets/gpsBtnIcon.png";
import Map_goalSection from "./Map_goalSection";
import MapComponent from "./map/MapComponent";

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

  // 현재 위치로 지도 이동하는 함수
  const moveToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const newPosition = new kakao.maps.LatLng(lat, lng);

          // 지도를 부드럽게 이동시키는 애니메이션
          if (window.kakaoMapInstance) {
            const map = window.kakaoMapInstance;

            // 카카오맵에서 부드러운 이동을 위한 내장 메서드 사용
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mapAny = map as any;
            if (mapAny.panTo) {
              mapAny.panTo(newPosition);
            } else {
              // 내장 메서드가 없으면 수동 애니메이션
              const duration = 1000;
              const startTime = Date.now();

              const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // 매우 부드러운 이징
                const easeProgress =
                  progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                const currentLat = newPosition.getLat() * easeProgress;
                const currentLng = newPosition.getLng() * easeProgress;

                map.setCenter(new kakao.maps.LatLng(currentLat, currentLng));

                if (progress < 1) {
                  requestAnimationFrame(animate);
                }
              };

              requestAnimationFrame(animate);
            }
          }

          // 마커를 부드럽게 이동시키는 애니메이션
          if (window.currentMarker) {
            const startPosition = window.currentMarker.getPosition();
            const startLat = startPosition.getLat();
            const startLng = startPosition.getLng();
            const endLat = newPosition.getLat();
            const endLng = newPosition.getLng();

            const duration = 1000; // 1초
            const startTime = Date.now();

            const animateMarker = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // 이징 함수 (부드러운 움직임)
              const easeProgress = 1 - Math.pow(1 - progress, 3);

              const currentLat = startLat + (endLat - startLat) * easeProgress;
              const currentLng = startLng + (endLng - startLng) * easeProgress;

              window.currentMarker.setPosition(
                new kakao.maps.LatLng(currentLat, currentLng)
              );

              if (progress < 1) {
                requestAnimationFrame(animateMarker);
              }
            };

            requestAnimationFrame(animateMarker);
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

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    // iOS 13+ 권한 요청 필요 시 활성화 (주석 해제해서 사용)
    /*
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }
    */

    // iOS 권한 요청 없이 테스트하려면 그냥 등록
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

      {/* 기능 버튼들 (네비게이션 바로 위) */}
      <div className="button_section">
        {/* 📍 현재 위치 이동 버튼 (우하단) */}
        <button className="gps_button" onClick={moveToCurrentLocation}>
          <img src={gpsBtnIcon} alt="현재위치로이동" />
        </button>

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
