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
  routeList = [], // 찜한 경로 리스트를 props로 받음
  recommendRoute,
  userRouteList = [], // 전체 경로 리스트를 props로 받음
  from,
}: {
  isActive: boolean;
  routeList?: RouteItem[];
  recommendRoute: RouteItem | null;
  userRouteList?: RouteItem[];
  from?: string;
}) {
  console.log(routeList);
  const location = useLocation();
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState<
    "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기" | null
  >(null);
  console.log(userRouteList);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  const [selectedFrom, setSelectedFrom] = useState<string | undefined>(
    undefined
  );

  // useEffect로 setRecommendRoute 등은 모두 삭제

  const handlelikeBtn = () => {
    if (routeList.length <= 0) {
      navigate("/community");
    } else {
      navigate("/courseList", {
        state: {
          sectionType: "wishlist",
          from: "map", // 출처 명확히 추가
        },
      });
    }
  };

  const handleShowOverlay = (
    route: RouteItem,
    btnTitle: "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기"
  ) => {
    setSelectedBtn(btnTitle);
    setShowOverlay(true);
    setSelectedRoute(route);
    setSelectedFrom(from); // 내부에서 띄울 때는 undefined
  };

  const handleHideOverlay = () => {
    setShowOverlay(false);
  };

  useEffect(() => {
    if (!isActive) setShowOverlay(false);
  }, [isActive]);

  const state = location.state as {
    route?: RouteItem | null;
    openOverlay?: boolean;
  } | null;

  const openOverlay = state?.openOverlay ?? false;

  useEffect(() => {
    if (openOverlay && state?.route) {
      setShowOverlay(true);
      setSelectedRoute(state.route);
      setSelectedBtn("경로 따라 달리기");
      setSelectedFrom(from);
      // 🚫 다시 뜨지 않도록 location.state 초기화
      navigate(location.pathname, { replace: true });
    }
  }, []);

  return (
    <div className="course_section">
      {showOverlay && selectedRoute && selectedBtn ? (
        <Map_course_overlay
          route={selectedRoute}
          btnTitle={selectedBtn}
          handleHideOverlay={handleHideOverlay}
          from={selectedFrom}
        />
      ) : (
        <>
          <div className="recommend_course">
            <RecommendCourseComponent route={recommendRoute} />
            <div
              className="recommend_btn btn btn_two"
              onClick={() =>
                recommendRoute &&
                handleShowOverlay(recommendRoute, "오늘의 추천 경로")
              }
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
              <RouteCard key={routeList[0].routeIdx} route={routeList[0]} />
            )}

            <div className="like_btns">
              <div
                className="btn btn_two"
                onClick={() =>
                  userRouteList.length > 0 &&
                  handleShowOverlay(userRouteList[0], "최근 경로 달리기")
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
