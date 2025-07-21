import "../css/Map_course.css";
import RecommendCourseComponent from "../home/RecommendCourseComponent";
import RouteCard from "../RouteCard";
import Map_course_overlay from "./Map_course_overlay";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { course_section_type, RouteItem } from "../types/courseList_type";

export default function Map_course({
  isActive,
  routeList = [],
  recommendRoute,
  userRouteList = [],
}: {
  isActive: boolean;
  routeList?: RouteItem[];
  recommendRoute: RouteItem | null;
  userRouteList?: RouteItem[];
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState<
    "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기" | null
  >(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);

  const state = location.state as {
    route?: RouteItem;
    openOverlay?: boolean;
    from?: string;
    section?: course_section_type;
  } | null;

  const openOverlay = state?.openOverlay ?? false;
  const fromState = state?.section === "wishlist" ? "wishlist" : "mycourse";

  // 🔄 location.state를 바탕으로 오버레이 자동 오픈
  useEffect(() => {
    if (openOverlay && state?.route) {
      setShowOverlay(true);
      setSelectedRoute(state.route);
      setSelectedBtn("경로 따라 달리기");

      // 다시 열리지 않도록 state 제거
      navigate(location.pathname, { replace: true });
    }
  }, []);

  // 🔙 오버레이 닫기
  const handleHideOverlay = () => {
    console.log("아아");
    setShowOverlay(false);
    if (location.state !== undefined) {
      navigate("/course", { state: { section: fromState } });
    }
  };

  // 📌 오버레이 수동 오픈 (버튼 클릭)
  const handleShowOverlay = (
    route: RouteItem,
    btnTitle: "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기"
  ) => {
    setSelectedBtn(btnTitle);
    setShowOverlay(true);
    setSelectedRoute(route);
  };

  // ⛔ 탭 비활성화 시 오버레이 닫기
  useEffect(() => {
    if (!isActive) {
      setShowOverlay(false);
    }
  }, [isActive]);

  // 🧭 찜한 경로 리스트 버튼
  const handlelikeBtn = () => {
    if (routeList.length <= 0) {
      navigate("/community");
    } else {
      navigate("/courseList", {
        state: {
          sectionType: "wishlist",
          userRouteLike: routeList,
          from: "map",
        },
      });
    }
  };

  return (
    <div className="course_section">
      {showOverlay && selectedRoute && selectedBtn ? (
        <Map_course_overlay
          route={selectedRoute}
          btnTitle={selectedBtn}
          handleHideOverlay={handleHideOverlay}
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
