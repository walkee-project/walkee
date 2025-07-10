import { type ChangeEvent } from "react";
import "./css/Map_goalSection.css";

export default function BasicRunSection(props: {
  goalType: string;
  distanceGoal: string;
  timeGoal: string;
  handleGoalChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleDistanceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const {
    goalType,
    distanceGoal,
    timeGoal,
    handleGoalChange,
    handleDistanceChange,
    handleTimeChange,
  } = props;

  return (
    <div className="goal_section">
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
      </div>

      <button className="mapbtn_one mapbtn">시작</button>
    </div>
  );
}
