import "../css/Map_course.css";
import RecommendCourseComponent from "../home/RecommendCourseComponent";
import RouteCard from "../RouteCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Map_course_overlay from "./Map_course_overlay";
import type { RouteItem } from "../types/courseList_type";
import { useAppSelector } from "../../store/hooks";

export default function Map_course({
  isActive,
  routeList = [], // 찜한 경로 리스트를 props로 받음
  userRouteList = [], // 전체 경로 리스트를 props로 받음
  from,
}: {
  isActive: boolean;
  routeList?: RouteItem[];
  userRouteList?: RouteItem[];
  from?: string;
}) {
  console.log("찜한 경로:", routeList);
  console.log("전체 경로:", userRouteList);
  
  const navigate = useNavigate();
  const location = useLocation() as any;
  
  // Redux에서 전체 경로 가져오기 (fallback)
  const allRoutes = useAppSelector((state) => state.user.allRoute) || [];
  
  const state = location.state as {
    route?: RouteItem | null;
    openOverlay?: boolean;
    from?: string;
    fromState?: string;
    sectionType?: string;
    activeTab?: string;
  } | null;

  // 오버레이 자동 오픈 (CourseList 등에서 넘어올 때)
  useEffect(() => {
    if (state?.openOverlay && state?.route) {
      let btnTitle = "오늘의 추천 경로";
      if (state.sectionType === "wishlist") btnTitle = "찜한 경로 달리기";
      else if (state.sectionType === "mycourse" || state.activeTab === "myruns") btnTitle = "경로 따라 달리기";
      setShowOverlay(true);
      setSelectedRoute(state.route);
      setSelectedBtn(btnTitle);
      setSelectedFrom(state.from);
      // 🚫 다시 뜨지 않도록 location.state 초기화
      navigate(location.pathname, { replace: true });
    }
  }, []);

  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteItem | null>(null);
  const [selectedFrom, setSelectedFrom] = useState<string | undefined>(
    undefined
  );

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
    btnTitle: "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기" | "찜한 경로 달리기"
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

  // 추천용 경로 리스트 결정 (우선순위: userRouteList > allRoutes)
  const recommendRouteList = userRouteList.length > 0 ? userRouteList : allRoutes;

  console.log("추천에 사용할 경로 개수:", recommendRouteList.length);

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
            {/* 전체 경로에서 추천 (찜한 경로가 아닌) */}
            <RecommendCourseComponent
              routeList={recommendRouteList}
              onViewRoute={(route) => handleShowOverlay(route, "오늘의 추천 경로")}
            />
            <div
              className="recommend_btn btn btn_two"
              onClick={() => {
                // 추천 경로가 있을 때만 첫 번째 경로 표시
                if (recommendRouteList.length > 0) {
                  handleShowOverlay(recommendRouteList[0], "오늘의 추천 경로");
                }
              }}
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
              routeList.map((item) => (
                <div key={item.routeIdx} onClick={() => handleShowOverlay(item, "찜한 경로 달리기") }>
                  <RouteCard route={item} />
                </div>
              ))
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
          
          {/* 디버깅 정보 - 개발 완료 후 제거 */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              position: 'fixed', 
              bottom: '10px', 
              right: '10px', 
              background: 'rgba(0,0,0,0.7)', 
              color: 'white', 
              padding: '8px', 
              fontSize: '12px',
              borderRadius: '4px',
              zIndex: 9999
            }}>
              <div>찜한경로: {routeList.length}개</div>
              <div>전체경로: {userRouteList.length}개</div>
              <div>Redux경로: {allRoutes.length}개</div>
              <div>추천용: {recommendRouteList.length}개</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}