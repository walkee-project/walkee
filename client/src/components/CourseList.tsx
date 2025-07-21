import { useAppSelector } from "../store/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import RouteCard from "./RouteCard";
import "./css/courseList.css";
import arrow_back from "../assets/arrow_back.png";

const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summary = useAppSelector((state) => state.user.summary);

  // sectionType은 location.state에서만 fallback
  const sectionType = location.state?.sectionType ?? "mycourse";
  const routeList =
    sectionType === "mycourse"
      ? summary?.userRoute ?? []
      : summary?.userRouteLike ?? [];

  const title = sectionType === "mycourse" ? "내 경로" : "찜한 경로";

  const handleBack = () => {
    const from = location.state?.from;
    if (from === "map") {
      navigate("/map", {
        state: {
          tab: "course",
        },
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="courseList">
      <div className="courseList_section">
        <button className="back_btn" onClick={handleBack}>
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
                      routeId: route.routeIdx,
                      openOverlay: true,
                      from: "courseList",
                      fromState: sectionType,
                    },
                  })
                }
              >
                <RouteCard route={route} />
              </div>
            ))
          ) : (
            <div className="no-course-message">
              {sectionType === "mycourse" ? (
                <>
                  <p>저장한 경로가 없습니다.</p>
                  <p>지금 바로 기록해보세요!</p>
                  <div
                    className="no_btn btn_one"
                    onClick={() => navigate("/map")}
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
                    onClick={() => navigate("/community")}
                  >
                    커뮤니티 가기
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
