import { useParams, useNavigate } from "react-router-dom";
import "../css/Community_detail.css";
import profile from "../../assets/profile.png";
import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { useAppSelector } from "../../store/hooks";
import Community_Stats from "./Community_stats";
import arrow from "../../assets/arrow_top.png";
import back from "../../assets/arrow_back.png";

interface CommentUser {
  userName: string;
  userProfile?: string; // 필요 시 추가
}
interface CommentType {
  userIdx: string;
  user: CommentUser;
  commentContent: string;
  commentCreatedAt: string;
}

const Community_detail = () => {
  const { id } = useParams(); // 게시물 ID
  const navigate = useNavigate();
  const [post, setPost] = useState<{
    postIdx: number;
    userName: string;
    userProfile: string;
    postTitle: string;
    postContent: string;
    postCreatedAt: string;
    postUploadImg: string;
    postCount: number;
    likeCount: number;
    isLiked: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAppSelector((state) => state.user.user);
  const userIdx = user?.userIdx;
  console.log(user);
  // 💬 댓글 관련 state
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<CommentType[]>([]);

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

  const handleLikeToggle = async (e: React.MouseEvent, postIdx: number) => {
    e.stopPropagation();
    if (!userIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!post || post.postIdx !== postIdx) return;
    const currentLikeCount =
      typeof post.likeCount === "number" ? post.likeCount : 0;

    // optimistic UI 업데이트
    const prevPost = { ...post };
    const updatedPost = !post.isLiked
      ? { ...post, likeCount: currentLikeCount + 1, isLiked: true }
      : {
          ...post,
          likeCount: Math.max(currentLikeCount - 1, 0),
          isLiked: false,
        };

    setPost(updatedPost);

    try {
      if (!post.isLiked) {
        // 좋아요 추가
        const res = await fetch(`${__API_URL__}/post-likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIdx, postIdx }),
        });
        if (!res.ok) throw new Error("좋아요 추가 실패");
      } else {
        // 좋아요 제거
        const res = await fetch(
          `${__API_URL__}/post-likes/by-user-post/${userIdx}/${postIdx}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("좋아요 취소 실패");
      }
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      alert("좋아요 처리 중 문제가 발생했습니다.");
      // 실패 시 이전 상태로 롤백
      setPost(prevPost);
    }
  };

  // 💬 댓글 등록
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!userIdx || !post?.postIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const res = await fetch(`${__API_URL__}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postIdx: post.postIdx,
          userIdx: userIdx,
          commentContent: commentInput,
        }),
      });
      if (!res.ok) throw new Error("댓글 등록 실패");
      // 댓글 등록 후 최신 댓글 목록 다시 fetch
      const commentsRes = await fetch(
        `${__API_URL__}/comments?postIdx=${post.postIdx}`
      );
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
      setCommentInput("");
    } catch (err) {
      console.error(err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // 댓글 입력창에서 Enter로 등록
  const handleCommentKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && commentInput.trim()) {
      handleCommentSubmit();
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetch(`${__API_URL__}/posts/${id}/view`, { method: "PATCH" }),
      userIdx
        ? fetch(`${__API_URL__}/posts/${id}?userIdx=${userIdx}`)
        : fetch(`${__API_URL__}/posts/${id}`),
      fetch(`${__API_URL__}/comments?postIdx=${id}`), // 댓글 목록도 fetch
    ])
      .then(([, res, commentsRes]) => {
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        if (!commentsRes.ok) throw new Error("댓글을 불러오지 못했습니다.");
        return Promise.all([res.json(), commentsRes.json()]);
      })
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch(() => setError("오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, [id, userIdx]);
  console.log(comments);
  if (loading) return <div className="detail-container">로딩 중...</div>;
  if (error) return <div className="detail-container">{error}</div>;
  if (!post) return <div className="detail-container">게시글이 없습니다.</div>;

  // userName fallback: post.userName 없으면 전역 user.userName 사용
  const displayUserName = post.userName || user?.userName || "익명";

  return (
    <div className="detail-container" style={{ paddingBottom: "70px" }}>
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <img
            src={back}
            alt="뒤로가기"
            style={{ width: "15px", height: "15px" }}
          />
        </button>
      </header>

      <main className="detail-content" style={{ overflowY: "auto" }}>
        <div className="detail-writer">
          <div className="writer-profile">
            <img
              src={post.userProfile || profile}
              alt="작성자 프로필"
              className="writer-img"
            />
            <p className="writer-name">{displayUserName}</p>
          </div>
          <p className="writer-meta">
            {formatRelativeDate(post.postCreatedAt)}
          </p>
        </div>

        <h2 className="detail-title">{post.postTitle}</h2>

        {post.postUploadImg && post.postUploadImg !== "" && (
          <img
            src={`${__API_URL__}/public${post.postUploadImg}`}
            alt="게시글 이미지"
            className="detail-image"
          />
        )}

        <div className="detail-stats">
          <Community_Stats
            views={post.postCount}
            comments={comments.length}
            likeCount={post.likeCount}
            postId={post.postIdx}
            isLiked={post.isLiked}
            onLike={handleLikeToggle}
          />
        </div>
        <p className="detail-text">{post.postContent}</p>

        {/* 댓글 목록 */}
        <div className="detail-comments">
          <h4>댓글 {comments.length}</h4>
          {comments.length === 0 ? (
            <p className="no-comments">
              아직 댓글이 없어요.
              <br />
              가장 먼저 댓글을 남겨보세요.
            </p>
          ) : (
            comments.map((c, idx) => (
              <div key={idx} className="comment-in">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <strong>{c.user.userName || c.userIdx}</strong>
                  <span style={{ color: "#888", fontSize: "13px" }}>
                    {formatRelativeDate(c.commentCreatedAt)}
                  </span>
                </div>
                <p>{c.commentContent}</p>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 댓글 입력창 */}
      <footer className="detail-footer">
        <input
          type="text"
          placeholder="댓글을 입력해 주세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={handleCommentKeyDown}
          className="comment-input"
        />
        <button
          onClick={handleCommentSubmit}
          disabled={!commentInput.trim()}
          className={`comment-submit ${commentInput.trim() ? "active" : ""}`}
        >
          <img src={arrow} alt="submit" />
        </button>
      </footer>
    </div>
  );
};

export default Community_detail;
