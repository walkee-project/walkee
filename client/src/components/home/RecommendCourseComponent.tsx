import { useEffect, useState } from "react";
import arrow_right from "../../assets/arrow_right.png";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouteItem } from "../types/courseList_type";

// 거리 계산 함수 (Haversine 공식)
function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000; // 지구 반지름(m)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function RecommendCourseComponent({ route }: { route: RouteItem | null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNearby, setIsNearby] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!route) {
      setChecked(true);
      setIsNearby(false);
      return;
    }
    if (!navigator.geolocation) {
      setChecked(true);
      setIsNearby(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const dist = getDistanceFromLatLonInMeters(
          pos.coords.latitude,
          pos.coords.longitude,
          route.routeStartLat,
          route.routeStartLng
        );
        setIsNearby(dist <= 300); // 300m 이내만 추천
        setChecked(true);
      },
      () => {
        setIsNearby(false);
        setChecked(true);
      }
    );
  }, [route]);

  if (!route || !checked) {
    return (
      <div className="recommend_section empty">
        등록 되어있는 경로가 없습니다.
      </div>
    );
  }
  if (!isNearby) {
    return (
      <div className="recommend_section empty">근처에 추천코스가 없습니다.</div>
    );
  }

  // 초를 분, 초로 변환
  const totalSeconds = Number(route.routeTotalTime) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div
      className="recommend_section"
      onClick={() => {
        navigate("/map", { state: { tab: "course" } });
      }}
    >
      <div className="recommend_title">
        <div>
          오늘의 추천코스 <span>{route.routeTitle}</span>
        </div>
        {location.pathname === "/map" ? null : (
          <img src={arrow_right} alt="화살표" />
        )}
      </div>
      <div className="recommend_img">
        <img
          src={`${__API_URL__}/public${route.routeThumbnail}`}
          alt="추천코스"
        />
        <div className="recommend_detail">
          <p>{route.routeTotalKm} km</p>
          <p>
            {minutes}분{seconds > 0 ? ` ${seconds}초` : ""}
          </p>
          <p>{route.routeDifficulty}난이도</p>
        </div>
      </div>
    </div>
  );
}

export default RecommendCourseComponent;
