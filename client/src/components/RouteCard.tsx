import React from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { addRouteLikeThunk, removeRouteLikeThunk } from "../store/userSlice";
import type { RouteItem } from "./types/courseList_type";
import heart from "../assets/heart.png";
import "./css/RouteCard.css";

interface Props {
  route: RouteItem;
}

const RouteCard: React.FC<Props> = ({ route }) => {
  const dispatch = useAppDispatch();
  const userIdx = useAppSelector((state) => state.user.user?.userIdx);
  const liked = useAppSelector(
    (state) =>
      state.user.summary?.userRouteLike?.some(
        (item) => item.routeIdx === route.routeIdx
      ) ?? false
  );

  const toggleLike = async () => {
    if (!userIdx) return;
    if (!liked) {
      dispatch(addRouteLikeThunk({ userIdx, routeIdx: route.routeIdx }));
    } else {
      dispatch(removeRouteLikeThunk({ userIdx, routeIdx: route.routeIdx }));
    }
  };

  // 날짜 변환: YYYY-MM-DD만 추출
  const formattedDate = route.routeCreatedAt
    ? route.routeCreatedAt.slice(0, 10)
    : "";

  // 속도 계산: km / 시간
  let speed = "-";
  if (route.routeTotalKm && route.routeTotalTime) {
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

  // 초를 분, 초로 변환
  const totalSeconds = Number(route.routeTotalTime) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="route_card">
      <div className="route_imgDiv">
        <img
          src={`${__API_URL__}/public${route.routeThumbnail}`}
          alt={route.routeTitle}
        />
      </div>
      <div className="route_info">
        <div className="route_maininfo">
          <div className="route_date">{formattedDate}</div>
          <div className="route_title">{route.routeTitle}</div>
        </div>
        <div className="route_details">
          <p>
            {minutes}분{seconds > 0 ? ` ${seconds}초` : ""}
          </p>
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
