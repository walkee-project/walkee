import React from "react";
import RouteCard from "./RouteCard.tsx";
import type { course_section_type } from "../types/mypage_type.ts";
import "../css/mypage_course.css";
import arrow_back from "../../assets/arrow_back.png";
import { dummyData } from "../dummydate.ts";

interface Props {
  type: course_section_type; // "mycourse" | "wishlist"
  onChangeSection: () => void;
}

const Mypage_course: React.FC<Props> = ({ type, onChangeSection }) => {
  const title = type === "mycourse" ? "내 경로" : "찜한 경로";

  const filterList =
    type === "wishlist"
      ? dummyData.filter((item) => item.isLiked)
      : dummyData.filter((item) => item.who === "푸른달걀");

  return (
    <div className="course">
      <button className="back_btn" onClick={onChangeSection}>
        <img src={arrow_back} alt="back_arrow" />
      </button>
      <div className="course-header">
        <p>{title}</p>
      </div>

      <div className="course-list">
        {filterList.length > 0 ? (
          filterList.map((route) => <RouteCard key={route.id} route={route} />)
        ) : (
          <div className="no-course-message">
            {type == "mycourse" ? (
              <>
                <p>저장한 경로가 없습니다.</p>
                <p>지금 바로 기록해보세요!</p>
                <div className="no_btn btn_one">경로 그리기</div>
              </>
            ) : (
              <>
                <p>찜한 경로가 없습니다.</p>
                <p>지금 바로 저장해보세요!</p>
                <div className="no_btn btn_one">커뮤니티 가기</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mypage_course;
