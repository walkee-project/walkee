import { useParams, useNavigate } from "react-router-dom";
import "../css/Community_detail.css";
import profile from "../../assets/profile.png";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import Community_Stats from "./Community_stats";
import example from "../../assets/ex2.jpg";
import arrow from "../../assets/arrow_top.png";

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

  // 💬 댓글 관련 state
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<
    { userName: string; content: string; createdAt: string }[]
  >([]);

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

  // 좋아요 토글
  const handleLikeToggle = async (e: React.MouseEvent, postIdx: number) => {
    e.stopPropagation();
    if (!userIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!post) return;
    if (post.postIdx !== postIdx) return;

    const optimistic = !post.isLiked
      ? { ...post, likeCount: post.likeCount + 1, isLiked: true }
      : { ...post, likeCount: Math.max(post.likeCount - 1, 0), isLiked: false };

    setPost(optimistic);
    // TODO: 서버 반영
  };

  // 💬 댓글 등록
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    if (!userIdx || !post?.postIdx) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postIdx: post.postIdx,
          userIdx: userIdx,
          content: commentInput,
        }),
      });

      if (!res.ok) throw new Error("댓글 등록 실패");

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
    } catch (err) {
      console.error(err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  // 더미 게시글
  const dummyPosts = [
    {
      postIdx: 1,
      userName: "홍길동",
      userProfile: "",
      postTitle: "첫 번째 더미 게시글",
      postContent:
        "이것은 더미 게시글 내용입니다.이것은 더미 게시글 내용입니다.",
      postCreatedAt: new Date().toISOString(),
      postUploadImg: example,
      postCount: 10,
      likeCount: 5,
      isLiked: false,
    },
    {
      postIdx: 2,
      userName: "김철수",
      userProfile: "",
      postTitle: "두 번째 더미 게시글",
      postContent: "두 번째 더미 내용입니다.",
      postCreatedAt: new Date().toISOString(),
      postUploadImg: "",
      postCount: 3,
      likeCount: 2,
      isLiked: true,
    },
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    // 더미데이터 배열
    const dummyPosts = [
      {
        postIdx: 1,
        userName: "홍길동",
        userProfile: "",
        postTitle: "첫 번째 더미 게시글",
        postContent: "이것은 더미 게시글 내용입니다.",
        postCreatedAt: new Date().toISOString(),
        postUploadImg: "",
        postCount: 10,
        likeCount: 5,
        isLiked: false,
      },
      {
        postIdx: 2,
        userName: "김철수",
        userProfile: "",
        postTitle: "두 번째 더미 게시글",
        postContent: "두 번째 더미 내용입니다.",
        postCreatedAt: new Date().toISOString(),
        postUploadImg: "",
        postCount: 3,
        likeCount: 2,
        isLiked: true,
      },
    ];
    const found = dummyPosts.find((p) => p.postIdx === Number(id));
    setPost(found || null);
    setLoading(false);
  }, [id]);

  if (loading) return <div className="detail-container">로딩 중...</div>;
  if (error) return <div className="detail-container">{error}</div>;
  if (!post) return <div className="detail-container">게시글이 없습니다.</div>;

  return (
    <div className="detail-container" style={{ paddingBottom: "70px" }}>
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
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
            <p className="writer-name">{post.userName}</p>
          </div>
          <p className="writer-meta">
            {formatRelativeDate(post.postCreatedAt)}
          </p>
        </div>

        <h2 className="detail-title">{post.postTitle}</h2>

        {post.postUploadImg && (
          // <img
          //   src={`${
          //     import.meta.env.VITE_APP_API_URL
          //   }/api/public${post.postUploadImg}`}
          //   className="map-image"
          // />
          <img
            src={post.postUploadImg}
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
              <div key={idx} className="comment">
                <strong>{c.userName}</strong>{" "}
                <span style={{ color: "#888", fontSize: "13px" }}>
                  {formatRelativeDate(c.createdAt)}
                </span>
                <p>{c.content}</p>
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
