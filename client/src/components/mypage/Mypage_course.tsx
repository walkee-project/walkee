import React from "react";
import RouteCard from "./RouteCard.tsx";
import type { course_section_type } from "../types/mypage_type";
import type { RouteItem } from "../types/mypage_type.ts";
import "../css/mypage_course.css";
import arrow_back from "../../assets/arrow_back.png";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
        {routeList.length > 0 ? (
          routeList.map((route) => (
            <div
              key={route.routeIdx}
              onClick={() =>
                navigate("/map", {
                  state: {
                    tab: "course",
                    routeId: route.routeIdx, // 또는 route.id
                    openOverlay: true,
                    from: "mypage", // 필요 시 어디서 왔는지도 넘김
                  },
                })
              }
            >
              <RouteCard route={route} />
            </div>
          ))
        ) : (
          <div className="no-course-message">
            {type == "mycourse" ? (
              <>
                <p>저장한 경로가 없습니다.</p>
                <p>지금 바로 기록해보세요!</p>
                <div
                  className="no_btn btn_one"
                  onClick={() => {
                    navigate("/map");
                  }}
                >
                  경로 그리기
                </div>
              </>
            ) : (
              <>
                <p>찜한 경로가 없습니다.</p>
                <p>지금 바로 저장해보세요!</p>
                <div
                  className="no_btn btn_one"
                  onClick={() => {
                    navigate("/community");
                  }}
                >
                  커뮤니티 가기
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mypage_course;
