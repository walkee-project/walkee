import "../css/Community_all.css";
import Community_Stats from "./Community_stats";
import TopButton from "../TopButton";
import arrow_back from "../../assets/arrow_back.png";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { fetchCommunityPostsThunk } from "../../store/userSlice";
import profile from "../../assets/profile.png"; // 프로필 이미지 더미

export type Post = {
  postIdx: number;
  userName: string;
  userProfile: string;
  postContent: string;
  postCreatedAt: string;
  postUploadImg: string;
  postCount: number;
  likeCount: number;
  isLiked: boolean;
};

// 날짜 상대 포맷 함수 추가
function formatRelativeDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay >= 1) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
  } else if (diffHour >= 1) {
    return `${diffHour}시간전`;
  } else if (diffMin >= 1) {
    return `${diffMin}분전`;
  } else {
    return "방금전";
  }
}

// 더 이상 더미데이터 사용하지 않음

const CommunityAll = ({ onBack }: { onBack: () => void }) => {
  // 전역 상태에서 posts 가져오기
  const posts = useAppSelector((state) => state.user.communityPosts);
  const safePosts = Array.isArray(posts) ? posts : [];
  const user = useAppSelector((state) => state.user.user);
  const userIdx = user?.userIdx;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 좋아요 버튼 등은 필요시 구현

  const handleCardClick = (postId: number) => {
    navigate(`/community/${postId}`);
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (e: React.MouseEvent, postIdx: number) => {
    e.stopPropagation();
    if (!userIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    const post = safePosts.find((p) => p.postIdx === postIdx);
    if (!post) return;
    try {
      if (!post.isLiked) {
        await fetch(`${__API_URL__}/post-likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIdx, postIdx }),
        });
      } else {
        await fetch(
          `${__API_URL__}/post-likes/by-user-post/${userIdx}/${postIdx}`,
          {
            method: "DELETE",
          }
        );
      }
      // 좋아요 토글 후 서버에서 최신 posts 다시 받아오기
      dispatch(fetchCommunityPostsThunk());
    } catch (err) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="all-posts-container">
      <div className="all-posts-header">
        <button className="back-button" onClick={onBack}>
          <img src={arrow_back} alt="back_arrow" />
        </button>
        <h2 className="all-posts-title">전체 게시물</h2>
      </div>
      {safePosts.length === 0 ? (
        <div className="no-posts-message">
          게시글이 없습니다. 글을 써보세요!
        </div>
      ) : (
        safePosts.map((post) => (
          <div
            className="post-card"
            key={post.postIdx}
            onClick={() => handleCardClick(post.postIdx)}
            style={{ cursor: "pointer" }}
          >
            <div className="profile-header">
              <img
                src={post.userProfile || profile}
                alt="profile"
                className="post-profile"
              />
              <span className="username" style={{ fontWeight: "bold" }}>
                {post.userName}
              </span>
              <span className="post-date">
                {formatRelativeDate(post.postCreatedAt)}
              </span>
            </div>

            {post.postUploadImg && (
              <img
                src={`${__API_URL__}/public${post.postUploadImg}`}
                alt="map"
                className="map-image"
              />
            )}

            <div className="post-actions">
              <Community_Stats
                views={post.postCount}
                comments={0}
                likeCount={post.likeCount}
                postId={post.postIdx}
                isLiked={post.isLiked}
                onLike={handleLikeToggle}
                variant="recent"
              />
            </div>

            <div className="post-content">
              <p className="content-text two-line-ellipsis">
                {post.postContent}
              </p>
            </div>
          </div>
        ))
      )}
      <TopButton />
    </div>
  );
};

export default CommunityAll;
