import React from "react";
import RouteCard from "./RouteCard.tsx";
import type { course_section_type } from "../types/mypage_type";
import type { RouteItem } from "../types/mypage_type.ts";
import "../css/mypage_course.css";
import arrow_back from "../../assets/arrow_back.png";

interface Props {
  type: course_section_type; // "mycourse" | "wishlist"
  onChangeSection: () => void;
  routeList: RouteItem[];
}

const Mypage_course: React.FC<Props> = ({
  type,
  onChangeSection,
  routeList,
}) => {
  console.log("Mypage_course", type, routeList);
  const title = type === "mycourse" ? "내 경로" : "찜한 경로";
  return (
    <div className="course">
      <button className="back_btn" onClick={onChangeSection}>
        <img src={arrow_back} alt="back_arrow" />
      </button>
      <div className="course-header">
        <p>{title}</p>
      </div>

      <div className="course-list">
        {!routeList || routeList.length === 0 ? (
          <p className="empty-message">표시할 경로가 없습니다.</p>
        ) : (
          routeList.map((route) => (
            <RouteCard key={route.routeIdx} route={route} />
          ))
        )}
      </div>
    </div>
  );
};

export default Mypage_course;
