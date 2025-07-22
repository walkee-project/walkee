import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchCommunityPostsThunk } from "../../store/userSlice";
import "../css/Community.css";
import "../css/Header.css";
import Community_Find from "./Community_find";
import Community_Stats from "./Community_stats";
import CommunityAll from "./Community_all";
import Community_Rules from "./Community_rules";
import Header from "../../components/Header";
import flag from "../../assets/community_flag.svg";
import plus from "../../assets/plus_icon.svg";
import find from "../../assets/find_icon.svg";
import bell from "../../assets/bell_icon.svg";
import exmple from "../../assets/ex2.jpg";
import profile from "../../assets/profile.png"; // 프로필 이미지 더미

// 날짜 포맷 함수 추가
function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? "AM" : "PM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${ampm} ${pad(hours)}:${pad(minutes)}`;
}

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

const Community = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentSection, setCurrentSection] = useState("default");
  // const posts = useAppSelector((state) => state.user.communityPosts);
  const dummyPosts = [
    {
      postIdx: 1,
      userName: "홍길동",
      userProfile: "",
      postTitle: "첫 번째 더미 게시글",
      postContent: "이것은 더미 게시글 내용입니다.",
      postCreatedAt: new Date().toISOString(),
      postUploadImg: exmple,
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
  const safePosts = dummyPosts;
  // console.log(posts); // 더미데이터 사용 시 필요 없음
  const user = useAppSelector((state) => state.user.user);
  const userIdx = user?.userIdx;

  useEffect(() => {
    dispatch(fetchCommunityPostsThunk());
  }, [dispatch]);

  // 인기 TOP3: 좋아요(likeCount) 내림차순 정렬 후 상위 3개
  const popularPosts = [...safePosts]
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    .slice(0, 3);
  // 최근 게시물
  const recentPosts = safePosts;

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (e: React.MouseEvent, postIdx: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 막기
    if (!userIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    const post = safePosts.find((p) => p.postIdx === postIdx);
    if (!post) return;
    try {
      if (!post.isLiked) {
        await fetch("/api/post-likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIdx, postIdx }),
        });
      } else {
        await fetch(`/api/post-likes/by-user-post/${userIdx}/${postIdx}`, {
          method: "DELETE",
        });
      }
      // 좋아요 토글 후 서버에서 최신 posts 다시 받아오기
      dispatch(fetchCommunityPostsThunk());
    } catch (err) {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };

  const handleViewAllClick = () => {
    setIsSearchMode(false);
    setCurrentSection("all");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleCardClick = (postId: number) => {
    navigate(`/community/${postId}`);
  };

  return (
    <>
      {isSearchMode ? (
        <Community_Find onBack={() => setIsSearchMode(false)} />
      ) : currentSection === "all" ? (
        <CommunityAll onBack={() => setCurrentSection("default")} />
      ) : (
        <>
          <Header
            title="커뮤니티"
            rightIcons={[
              {
                icon: <img src={plus} alt="plus icon" />,
                onClick: () => navigate("/community/write"),
              },
              {
                icon: <img src={find} alt="find icon" />,
                onClick: handleSearchClick,
              },
              {
                icon: <img src={bell} alt="bell icon" />,
                onClick: () => console.log("알림"),
              },
            ]}
          />
          <div className="community-container">
            <section className="community-top-ui">
              <Link
                to="/community/rules"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="community-header">
                  <div>
                    <img src={flag} alt="community flag" />
                    <h2>WALKEE 커뮤니티 이용 가이드 보기</h2>
                  </div>
                  <p>{">"}</p>
                </div>
              </Link>
            </section>

            {/* 인기 TOP3 */}
            <section className="popular-section">
              <h3>인기 TOP3</h3>
              <div className="popular-scroll-wrapper">
                <div className="popular-cards">
                  {popularPosts.length === 0 ? (
                    <div className="no-posts-message">
                      게시글이 없습니다. 글을 써보세요!
                    </div>
                  ) : (
                    popularPosts.map((post) => (
                      <div
                        key={post.postIdx}
                        className="post-card"
                        onClick={() => handleCardClick(post.postIdx)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="profile-header">
                          <img
                            src={post.userProfile || profile}
                            className="post-profile"
                          />
                          <span className="username">{post.userName}</span>
                        </div>
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
                            className="main-detail-image"
                          />
                        )}
                        <div className="post-info">
                          <p className="post-title">{post.postTitle}</p>
                          <div className="post-meta">
                            <span className="post-date">
                              {formatDate(post.postCreatedAt)}
                            </span>
                            <Community_Stats
                              views={post.postCount}
                              comments={0}
                              likeCount={post.likeCount}
                              postId={post.postIdx}
                              isLiked={post.isLiked}
                              onLike={handleLikeToggle}
                              variant="popular"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* 최근 게시물 */}
            <section className="recent-section">
              <h3>최근 게시물</h3>
              {recentPosts.length === 0 ? (
                <div className="no-posts-message">
                  게시글이 없습니다. 글을 써보세요!
                </div>
              ) : (
                recentPosts.map((post) => (
                  <div
                    key={post.postIdx}
                    className="recent-post"
                    onClick={() => handleCardClick(post.postIdx)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="recent-post-top">
                      <div className="recent-post-left">
                        <div className="user-info">
                          <span
                            className="username"
                            style={{ fontWeight: "bold" }}
                          >
                            {post.userName}
                          </span>
                          <span className="date">
                            {formatRelativeDate(post.postCreatedAt)}
                          </span>
                        </div>
                        <h4 className="title">{post.postTitle}</h4>
                        <Community_Stats
                          views={post.postCount}
                          comments={0}
                          likeCount={post.likeCount}
                          postId={post.postIdx}
                          isLiked={post.isLiked}
                          onLike={handleLikeToggle}
                        />
                      </div>
                      <div className="recent-post-right">
                        {post.postUploadImg ? (
                          // <img
                          //   src={`${
                          //     import.meta.env.VITE_APP_API_URL
                          //   }/api/public${post.postUploadImg}`}
                          //   alt="post"
                          //   className="recent-post-map"
                          // />
                          <img
                            src={post.postUploadImg}
                            alt="게시글 이미지"
                            className="detail-image"
                          />
                        ) : (
                          <div className="no-image-placeholder"></div>
                        )}
                      </div>
                    </div>
                    <div className="recent-post-bottom">
                      <p className="content">{post.postContent}</p>
                    </div>
                  </div>
                ))
              )}
              <button className="view-all-button" onClick={handleViewAllClick}>
                게시물 전체보기
              </button>
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default Community;
