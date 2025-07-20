import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { api } from "../utils/api";
import "./css/RouteCard.css";
import type { RouteItem } from "./types/courseList_type";
import heart from "../assets/heart.png";

interface Props {
  route: RouteItem;
}

const RouteCard: React.FC<Props> = ({ route }) => {
  console.log("RouteCard", route);
  const userIdx = useAppSelector((state) => state.user.user?.userIdx);
  const [liked, setLiked] = useState(false);

  // DB 기준으로 찜 상태 동기화
  useEffect(() => {
    if (userIdx && route.routeIdx) {
      fetch(
        `/api/route-likes/is-liked?userIdx=${userIdx}&routeIdx=${route.routeIdx}`
      )
        .then((res) => res.json())
        .then((data) => setLiked(data.isLiked))
        .catch(() => setLiked(false));
    }
  }, [userIdx, route.routeIdx]);

  const toggleLike = async () => {
    if (!userIdx) return;
    try {
      if (!liked) {
        await api.addRouteLike(userIdx, route.routeIdx);
        setLiked(true);
      } else {
        await api.removeRouteLike(userIdx, route.routeIdx);
        setLiked(false);
      }
    } catch (err) {
      alert(err + "찜 처리 중 오류가 발생했습니다.");
    }
  };

  // 날짜 변환: YYYY-MM-DD만 추출
  const formattedDate = route.routeCreatedAt
    ? route.routeCreatedAt.slice(0, 10)
    : "";

  // 속도 계산: km / 시간
  let speed = "-";
  if (route.routeTotalKm && route.routeTotalTime) {
    // route.routeTotalTime이 string 또는 number일 수 있으므로 string으로 변환
    const timeStr = String(route.routeTotalTime);
    const timeParts = timeStr.split(":").map(Number);
    let hours = 0;
    if (timeParts.length === 3) {
      hours = timeParts[0] + timeParts[1] / 60 + timeParts[2] / 3600;
    } else if (timeParts.length === 2) {
      hours = timeParts[0] / 60 + timeParts[1] / 3600;
    }
    if (hours > 0) {
      speed = (route.routeTotalKm / hours).toFixed(2);
    }
  }

  return (
    <div className="route_card">
      <div className="route_imgDiv">
        <img
          src={`${import.meta.env.VITE_APP_API_URL}/api/public${
            route.routeThumbnail
          }`}
          alt={route.routeTitle}
        />
      </div>
      <div className="route_info">
        <div className="route_maininfo">
          <div className="route_date">{formattedDate}</div>
          <div className="route_title">{route.routeTitle}</div>
        </div>
        <div className="route_details">
          <p>{route.routeTotalTime}</p>
          <div className="route_km">
            <p>{route.routeTotalKm} km</p>
            <p>|</p>
            <p>{speed} km/h</p>
          </div>
        </div>
      </div>
      <div className="like_button">
        <img
          src={heart}
          alt="하트"
          className={`${liked ? "like" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleLike();
          }}
        />
      </div>
    </div>
  );
};

export default RouteCard;
