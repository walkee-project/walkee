import "./css/Map.css";
import { useState, useEffect, type ChangeEvent, type JSX } from "react";
import compass_bg from "../assets/compass_bg.png";
import compass_needle from "../assets/compass_needle.png";
import gpsBtnIcon from "../assets/gpsBtnIcon.png";
import Map_goalSection from "./Map_goalSection";

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
      <div className="map_container" id="map"></div>

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
        <button className="gps_button">
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
