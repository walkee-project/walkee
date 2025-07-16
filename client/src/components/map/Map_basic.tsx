import { useEffect, useRef, useState } from "react";
import "../css/Map_basic.css";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import MapTools from "./MapTools";

export default function Map_basic() {
  const navigate = useNavigate();
  const [goalType, setGoalType] = useState("목표 없음");
  const [distanceGoal, setDistanceGoal] = useState("5");
  const [timeGoal, setTimeGoal] = useState("30");

  const [heading, setHeading] = useState(0);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGoalType(e.target.value);
    setDistanceGoal("");
    setTimeGoal("");
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistanceGoal(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeGoal(e.target.value);
  };

  // MapComponent에서 onMapReady 콜백으로 mapInstance를 세팅
  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
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

  return (
    <div className="basic_section">
      <div className="map_container">
        <MapComponent markerRef={markerRef} onMapReady={handleMapReady} />
        <MapTools
          heading={heading}
          markerRef={markerRef}
          mapInstance={mapInstance}
        />
      </div>
      <div className="goal_wrapper">
        <div className="goal_label">목표 정하기</div>
        <div className="goal_box">
          <select
            className="goal_select"
            id="goal"
            name="goal"
            value={goalType}
            onChange={handleGoalChange}
          >
            <option>목표 없음</option>
            <option>거리 설정</option>
            <option>시간 설정</option>
          </select>

          {goalType !== "목표 없음" && (
            <div className="goal_input">
              {goalType === "거리 설정" && (
                <div className="input_with_unit">
                  <input
                    type="number"
                    placeholder="예: 3"
                    className="input_field"
                    value={distanceGoal}
                    onChange={handleDistanceChange}
                  />
                  <span className="unit_label">km</span>
                </div>
              )}
              {goalType === "시간 설정" && (
                <div className="input_with_unit">
                  <input
                    type="number"
                    placeholder="예: 30"
                    className="input_field"
                    value={timeGoal}
                    onChange={handleTimeChange}
                  />
                  <span className="unit_label">분</span>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          className="btn_two btn basic_btn"
          onClick={() => {
            navigate("/map/ing");
          }}
        >
          시작
        </button>
      </div>
    </div>
  );
}
