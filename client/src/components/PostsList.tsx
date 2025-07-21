import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import React from "react";
import PostCard from "./PostCard";
import "./css/postsList.css";
import arrow_back from "../assets/arrow_back.png";

const PostsList: React.FC = () => {
  const navigate = useNavigate();
  const summary = useAppSelector((state) => state.user.summary);

  const postsList = summary?.userPost ?? [];

  const handleBack = () => {
    navigate(-1);
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
                      route: route,
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

export default PostsList;
