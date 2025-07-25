import { useEffect, useState } from "react";
import arrow_right from "../../assets/arrow_right.png";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouteItem } from "../types/courseList_type";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  addRouteLikeThunk,
  removeRouteLikeThunk,
  fetchUserSummaryThunk,
} from "../../store/userSlice";
import refreshIcon from "../../assets/refresh.png";

interface Props {
  routeList: RouteItem[];
  onViewRoute?: (route: RouteItem) => void;
  onCurrentRouteChange?: (route: RouteItem) => void;
}

// 두 좌표 간의 거리를 계산하는 함수 (하버사인 공식)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // 지구의 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // km 단위
  return distance * 1000; // m 단위로 변환
};

function RecommendCourseComponent({
  routeList,
  onViewRoute,
  onCurrentRouteChange,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState<RouteItem | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [nearbyRoutes, setNearbyRoutes] = useState<RouteItem[]>([]);
  const user = useAppSelector((state) => state.user.user);
  const userRouteLike =
    useAppSelector((state) => state.user.summary?.userRouteLike) ?? [];
  const dispatch = useAppDispatch();

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 위치 정보가 없을 경우 전체 routeList 사용
          setNearbyRoutes(routeList);
        }
      );
    } else {
      console.error("Geolocation이 지원되지 않습니다.");
      // Geolocation이 지원되지 않을 경우 전체 routeList 사용
      setNearbyRoutes(routeList);
    }
  }, []);

  // 사용자 위치 기반으로 1500m 이내 경로 필터링
  useEffect(() => {
    if (userLocation && routeList && routeList.length > 0) {
      const filtered = routeList.filter((route) => {
        if (
          typeof route.routeStartLat === "number" &&
          typeof route.routeStartLng === "number"
        ) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lon,
            route.routeStartLat,
            route.routeStartLng
          );
          return distance <= 1500; // 1,5km 이내
        }
        return false;
      });
      setNearbyRoutes(filtered);
    } else if (!userLocation) {
      // 위치 정보가 없을 경우 전체 routeList 사용
      setNearbyRoutes(routeList);
    }
  }, [userLocation, routeList]);

  // 1500m 이내 경로에서만 랜덤 추천
  useEffect(() => {
    if (nearbyRoutes && nearbyRoutes.length > 0) {
      const random =
        nearbyRoutes[Math.floor(Math.random() * nearbyRoutes.length)];
      setCurrentRoute(random);
    } else {
      setCurrentRoute(null);
    }
  }, [nearbyRoutes]);

  useEffect(() => {
    if (currentRoute && onCurrentRouteChange) {
      onCurrentRouteChange(currentRoute);
    }
  }, [currentRoute, onCurrentRouteChange]);

  if (!currentRoute) {
    return (
      <div className="recommend_section empty">
        {userLocation
          ? "근처 1500m 이내에 추천코스가 없습니다."
          : "위치 정보를 확인 중입니다..."}
      </div>
    );
  }

  // 초를 분, 초로 변환
  const totalSeconds = Number(currentRoute.routeTotalTime) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // 찜 상태
  const liked = userRouteLike.some(
    (item) => item.routeIdx === currentRoute.routeIdx
  );

  // 새로고침 핸들러 (1500m 이내 경로 중에서만 랜덤)
  const handleRefresh = () => {
    if (!nearbyRoutes || nearbyRoutes.length === 0) return;
    // 현재 추천 제외, 랜덤 추천
    const candidates = nearbyRoutes.filter(
      (r) => r.routeIdx !== currentRoute?.routeIdx
    );
    if (candidates.length === 0) {
      // 후보가 없으면 현재 경로 유지하거나 다시 선택
      const random =
        nearbyRoutes[Math.floor(Math.random() * nearbyRoutes.length)];
      setCurrentRoute(random);
      return;
    }
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentRoute(random);
  };

  // 찜 토글
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!liked) {
      await dispatch(
        addRouteLikeThunk({
          userIdx: user.userIdx,
          routeIdx: currentRoute.routeIdx,
        })
      );
    } else {
      await dispatch(
        removeRouteLikeThunk({
          userIdx: user.userIdx,
          routeIdx: currentRoute.routeIdx,
        })
      );
    }
    // 찜 상태 변경 후 반드시 최신 summary를 다시 받아옴
    await dispatch(fetchUserSummaryThunk(user.userIdx));
  };

  return (
    <div
      className="recommend_section"
      onClick={() => {
        navigate("/map", { state: { tab: "course" } });
      }}
    >
      <div className="recommend_title">
        <div>
          오늘의 추천코스 <span>{currentRoute.routeTitle}</span>
        </div>
        {location.pathname === "/map" ? null : (
          <img src={arrow_right} alt="화살표" />
        )}
      </div>
      <div className="recommend_img">
        <img
          src={`${__API_URL__}/public${currentRoute.routeThumbnail}`}
          alt="추천코스"
        />
        <div className="recommend_detail">
          {/* 왼쪽 위에 아이콘 */}
          <div className="recommend-icons">
            <img
              src={refreshIcon}
              alt="새로고침"
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh();
              }}
            />
            {/* 하트 아이콘 SVG로 명확히 구분 */}
            {liked ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#e74c3c"
                xmlns="http://www.w3.org/2000/svg"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            )}
          </div>
          {/* 오른쪽에 기존 정보 */}
          <div className="recommend-info">
            <p>{currentRoute.routeTotalKm} km</p>
            <p>
              {minutes}분{seconds > 0 ? ` ${seconds}초` : ""}
            </p>
            <p>{currentRoute.routeDifficulty}난이도</p>
          </div>
        </div>
        {/* 경로보기 버튼 */}
        {onViewRoute && (
          <button
            className="recommend_btn btn btn_two"
            onClick={(e) => {
              e.stopPropagation();
              onViewRoute(currentRoute);
            }}
            style={{ marginTop: 8 }}
          >
            경로보기
          </button>
        )}
      </div>
      {/* 디버깅용 - 개발 완료 후 제거 */}
      {process.env.NODE_ENV === "development" && (
        <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
          근처 경로: {nearbyRoutes.length}개 / 전체: {routeList.length}개
        </div>
      )}
    </div>
  );
}

export default RecommendCourseComponent;
