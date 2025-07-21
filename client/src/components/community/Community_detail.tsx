import { useParams, useNavigate } from "react-router-dom";
import "../css/Community_detail.css";
import profile from "../../assets/profile.png";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import Community_Stats from "./Community_stats";

const Community_detail = () => {
  const { id } = useParams(); // 게시물 ID
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = useAppSelector((state) => state.user.user);
  const userIdx = user?.userIdx;

  // 날짜 상대 포맷 함수
  function formatRelativeDate(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay >= 1) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    } else if (diffHour >= 1) {
      return `${diffHour}시간전`;
    } else if (diffMin >= 1) {
      return `${diffMin}분전`;
    } else {
      return '방금전';
    }
  }

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (e: React.MouseEvent, postIdx: number) => {
    e.stopPropagation();
    if (!userIdx) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!post) return;
    // 1. 프론트에서 즉시 반영 (optimistic update)
    const prevPost = { ...post };
    const optimistic = !post.isLiked
      ? { ...post, likeCount: (post.likeCount || 0) + 1, isLiked: true }
      : { ...post, likeCount: Math.max((post.likeCount || 1) - 1, 0), isLiked: false };
    setPost(optimistic);
    try {
      if (!post.isLiked) {
        await fetch('/api/post-likes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIdx, postIdx }),
        });
      } else {
        await fetch(`/api/post-likes/by-user-post/${userIdx}/${postIdx}`, {
          method: 'DELETE',
        });
      }
    } catch (err) {
      alert('좋아요 처리 중 오류가 발생했습니다.');
      // 실패 시 롤백
      setPost(prevPost);
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // 두 요청을 병렬로 실행
        const [_, res] = await Promise.all([
          fetch(`/api/posts/${id}/view`, { method: 'PATCH' }),
          userIdx ? fetch(`/api/posts/${id}?userIdx=${userIdx}`) : fetch(`/api/posts/${id}`)
        ]);
        if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.');
        const data = await res.json();
        setPost(data);
      } catch (e: any) {
        setError(e.message || '오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userIdx]);

  if (loading) return <div className="detail-container">로딩 중...</div>;
  if (error) return <div className="detail-container">{error}</div>;
  if (!post) return <div className="detail-container">게시글이 없습니다.</div>;

  return (
    <div className="detail-container">
      {/* 상단 헤더 */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="detail-actions">
          <button>🔔</button>
          <button>⋯</button>
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="detail-content">
        <div className="detail-writer">
          <div className="writer-profile">
            <img src={post.userProfile || profile} alt="작성자 프로필" className="writer-img" />
            <p className="writer-name">{post.userName}</p>
          </div>
          <p className="writer-meta">{formatRelativeDate(post.postCreatedAt)}</p>
        </div>
        <h2 className="detail-title">{post.postTitle}</h2>
        <p className="detail-text">{post.postContent}</p>
        {post.postUploadImg && (
          <img src={`${import.meta.env.VITE_APP_API_URL}/api/public${post.postUploadImg}`} className="detail-image" alt="post" />
        )}

        <div className="detail-stats">
          <Community_Stats
            views={post.postCount}
            comments={0}
            likeCount={post.likeCount}
            postId={post.postIdx}
            isLiked={post.isLiked}
            onLike={() => {}} // 클릭 불가, 단순 표시만
          />
          {`👁 ${post.postCount}명이 봤어요`}
        </div>

        <div className="detail-actions-btns">
          <button onClick={(e) => handleLikeToggle(e, post.postIdx)}>
            👍 공감하기 {post.likeCount}
          </button>
          <button>📎 저장</button>
        </div>

        <div className="detail-comments">
          <h4>댓글 0</h4>
          <p className="no-comments">
            아직 댓글이 없어요.
            <br />
            가장 먼저 댓글을 남겨보세요.
          </p>
        </div>
      </main>

      {/* 하단 댓글 입력창 */}
      <footer className="detail-footer">
        <input type="text" placeholder="댓글을 입력해주세요." />
      </footer>
    </div>
  );
};

export default Community_detail;
