import React, { useState } from "react";
import chart from "../../assets/chart-icon.svg";
import comment from "../../assets/comment-icon.svg";
import thumb from "../../assets/thumbs-up-regular.svg";

interface Community_StatsProps {
  views?: number;
  comments?: number;
  initialLikes?: number;
  postId: number;
  isLiked: boolean;
  onLike: (postId: number) => void;
  variant?: "popular" | "recent";
}

const Community_Stats = ({
  views = 0,
  comments = 0,
  initialLikes = 0,
  postId,
  isLiked,
  onLike,
  variant = "recent",
}: Community_StatsProps) => {
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLikeClick = () => {
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onLike(postId);
  };

  return (
    <div className={variant === "popular" ? "stats" : "recent-post-info"}>
      <span className="stats-item">
        <img src={chart} alt="views" /> {views}
      </span>
      <span className="stats-item">
        <img src={comment} alt="comments" /> {comments}
      </span>
      <span
        onClick={handleLikeClick}
        className={`stats-item like-button ${isLiked ? "liked" : ""}`}
      >
        <img src={thumb} alt="likes" />
        <span className={isLiked ? "liked-text" : ""}>{likeCount}</span>
      </span>
    </div>
  );
};

export default Community_Stats;
