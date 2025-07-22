import chart from "../../assets/chart-icon.svg";
import comment from "../../assets/comment-icon.svg";
import thumb from "../../assets/thumbs-up-regular.svg";

interface Community_StatsProps {
  views?: number;
  comments?: number;
  likeCount: number;
  postId: number;
  isLiked: boolean;
  onLike: (e: React.MouseEvent, postId: number) => void;
  variant?: "popular" | "recent";
}

const Community_Stats = ({
  views = 0,
  comments = 0,
  likeCount,
  postId,
  isLiked,
  onLike,
  variant = "recent",
}: Community_StatsProps) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    onLike(e, postId);
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
