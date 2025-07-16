import { type ChangeEvent } from "react";
import "../css/Map_basic.css";
import useGpsTracking from "../../utils/useGpsTracking";

interface BasicRunSectionProps {
  goalType: string;
  distanceGoal: string;
  timeGoal: string;
  handleGoalChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleDistanceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  markerRef: React.MutableRefObject<kakao.maps.Marker | null>;
}

export default function Map_basic({
  goalType,
  distanceGoal,
  timeGoal,
  handleGoalChange,
  handleDistanceChange,
  handleTimeChange,
  markerRef,
}: BasicRunSectionProps) {
  // GPS 트래킹 훅 사용
  const {
    isTracking,
    totalDistance,
    elapsedTime,
    startTracking,
    stopTracking,
  } = useGpsTracking(markerRef);

  return (
    <div className="basic_section">
      <div className="goal_wrapper">
        <div className="goal_label">목표 정하기</div>
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
        <button className="mapbtn_one mapbtn" onClick={startTracking}>
          시작
        </button>
      </div>
    </div>
  );
}
