import React from "react";
import RouteCard from "./RouteCard.tsx";
import type { course_section_type } from "../types/mypage_type.ts";
import type { RouteItem } from "../types/mypage_type.ts";
import "../css/mypage_course.css";
import arrow_back from "../../assets/arrow_back.png";
import ex2 from "../../assets/homeMap_ex2.png";
import ex3 from "../../assets/homeMap_ex3.png";
import ex4 from "../../assets/map_ex4.png";

interface Props {
  type: course_section_type; // "mycourse" | "wishlist"
  onChangeSection: () => void;
}

const dummyData: RouteItem[] = [
  {
    id: "1",
    date: "2025.07.08",
    title: "남매지 러닝",
    time: "32:34",
    distance: "2.58",
    speed: "4.69",
    image: ex4,
    who: "라쓰비",
    isLiked: false,
  },
  {
    id: "2",
    date: "2025.07.08",
    title: "붕어빵런",
    time: "32:34",
    distance: "2.58",
    speed: "4.69",
    image: ex2,
    who: "라쓰비",
    isLiked: false,
  },
  {
    id: "3",
    date: "2025.07.05",
    title: "한강 야경런",
    time: "30:12",
    distance: "3.12",
    speed: "5.1",
    image: ex3,
    who: "라쓰비",
    isLiked: false,
  },
];

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
