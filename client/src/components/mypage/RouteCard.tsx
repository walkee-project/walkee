import React, { useState } from "react";
import "../css/RouteCard.css";
import type { RouteItem } from "../../types/mypage_type";
import heart from "../../assets/heart.png";

interface Props {
  route: RouteItem;
}

const RouteCard: React.FC<Props> = ({ route }) => {
  const [liked, setLiked] = useState(route.isLiked); // ✅ 상태를 useState로

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="route_card">
      <div className="route_imgDiv">
        <img src={route.image} alt={route.title} />
      </div>
      <div className="route_info">
        <div className="route_maininfo">
          <div className="route_date">{route.date}</div>
          <div className="route_title">{route.title}</div>
        </div>
        <div className="route_details">
          <p>{route.time}</p>
          <div className="route_km">
            <p>{route.distance} km</p>
            <p>|</p>
            <p>{route.speed} km/h</p>
          </div>
        </div>
      </div>
      <div className="like_button">
        <img
          src={heart}
          alt="하트"
          className={`${liked ? "like" : ""}`}
          onClick={toggleLike}
        />
      </div>
    </div>
  );
};

export default RouteCard;
