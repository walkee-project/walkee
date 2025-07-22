import React from "react";
import "./css/followCard.css";
import type { Follow } from "./types/courseList_type";

interface FollowCardProps {
  follow: Follow;
}

const FollowCard: React.FC<FollowCardProps> = ({ follow }) => {
  const formattedDate = follow.followCreatedAt
    ? new Date(follow.followCreatedAt).toISOString().slice(0, 10)
    : "";

  const totalSeconds = Number(follow.followTotalTime) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let speed = "-";
  if (follow.followTotalKm > 0 && totalSeconds > 0) {
    const hours = totalSeconds / 3600;
    speed = (follow.followTotalKm / hours).toFixed(2);
  }

  return (
    <div className="follow_card">
      <div className="follow_imgDiv">
        {follow.followThumbnail ? (
          <img
            src={`${__API_URL__}/public${follow.followThumbnail}`}
            alt={follow.followTitle}
          />
        ) : (
          <div style={{ backgroundColor: "#eee", height: "100%" }} />
        )}
      </div>
      <div className="follow_info">
        <div className="follow_maininfo">
          <div className="follow_date">{formattedDate}</div>
          <div className="follow_title">{follow.followTitle}</div>
        </div>
        <div className="follow_details">
          <p>
            {minutes}분{seconds > 0 ? ` ${seconds}초` : ""}
            {follow.followCompleted !== null &&
              ` | 완성도: ${follow.followCompleted}%`}
          </p>
          <div className="follow_km">
            <p>{follow.followTotalKm.toFixed(2)} km</p>
            <p>|</p>
            <p>{speed} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
