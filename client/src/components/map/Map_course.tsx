import "../css/Map_course.css";
import RecommendCourseComponent from "../home/RecommendCourseComponent";
import RouteCard from "../RouteCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Map_course_overlay from "./Map_course_overlay";
import { useLocation } from "react-router-dom";
import type { RouteItem } from "../types/courseList_type";

export default function Map_course({
  isActive,
  routeId,
  routeList = [], // 찜한 경로 리스트를 props로 받음
}: {
  isActive: boolean;
  routeId: number;
  routeList?: RouteItem[];
}) {
  console.log(routeList);
  const location = useLocation();
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [selectedBtn, setSelectedBtn] = useState<
    "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기" | null
  >(null);

  // 추천 경로: 랜덤
  const route_num = routeList.length > 0 ? Math.floor(Math.random() * routeList.length) : 0;

  const handlelikeBtn = () => {
    if (routeList.length <= 0) {
      navigate("/community");
    } else {
      navigate("/courseList", {
        state: { sectionType: "wishlist", userRouteLike: routeList, from: "map" }
      });
    }
  };

  const handleShowOverlay = (
    routeId: number,
    btnTitle: "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기"
  ) => {
    setSelectedRouteId(routeId); // 코스 번호 저장
    setSelectedBtn(btnTitle); //선택 btn 이름
    setShowOverlay(true); // 오버레이 열기
  };

  const handleHideOverlay = () => {
    setShowOverlay(false);
    navigate(-1);
  };

  useEffect(() => {
    if (!isActive) setShowOverlay(false);
  }, [isActive]);

  const state = location.state as {
    routeId?: number;
    openOverlay?: boolean;
    from?: string;
  } | null;

  const routeIdFromState = state?.routeId ?? null;
  const openOverlay = state?.openOverlay ?? false;

  useEffect(() => {
    if (openOverlay && routeIdFromState !== null) {
      setShowOverlay(true);
      setSelectedRouteId(routeIdFromState);
      setSelectedBtn("경로 따라 달리기");
      // 🚫 다시 뜨지 않도록 location.state 초기화
      navigate(location.pathname, { replace: true });
    }
  }, []);

  return (
    <div className="course_section">
      {showOverlay && typeof selectedRouteId === "number" && selectedBtn ? (
        <Map_course_overlay
          routeId={selectedRouteId}
          btnTitle={selectedBtn}
          handleHideOverlay={handleHideOverlay}
        />
      ) : (
        <>
          <div className="recommend_course">
            <RecommendCourseComponent routeId={routeId} />
            <div
              className="recommend_btn btn btn_two"
              onClick={() => handleShowOverlay(routeId, "오늘의 추천 경로")}
            >
              경로보기
            </div>
          </div>
          <div className="like_course">
            <div className="like_label">
              <p>찜한 경로 달리기</p>
            </div>
            {routeList.length <= 0 ? (
              <div className="no_course">
                <p>찜한 경로가 없습니다.</p>
                <p>지금 바로 저장해보세요!</p>
              </div>
            ) : (
              <RouteCard
                key={routeList[0].routeIdx}
                route={routeList[0]}
              />
            )}

            <div className="like_btns">
              <div
                className="btn btn_two"
                onClick={() =>
                  routeList.length > 0 && handleShowOverlay(routeList[0].routeIdx, "최근 경로 달리기")
                }
              >
                최근 경로 달리기
              </div>
              <div className="btn btn_two" onClick={handlelikeBtn}>
                {routeList.length <= 0 ? "커뮤니티 가기" : "찜한 경로 리스트"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
