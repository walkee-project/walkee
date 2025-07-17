import { useState } from "react";
import "../css/Community.css";
import { useNavigate } from "react-router-dom";
import Community_Find from "./Community_find"; // 🔍 검색 컴포넌트 import
import Community_Stats from "./Community_stats";
import CommunityAll from "./Community_all";

import example from "../../assets/map_ex4.png";
import example2 from "../../assets/ex2.jpg";
import example3 from "../../assets/homeMap_ex3.png";
import profile from "../../assets/profile.png";
import flag from "../../assets/community_flag.svg";
import logo from "../../assets/logo_small.png";
import plus from "../../assets/plus_icon.svg";
import find from "../../assets/find_icon.svg";
import bell from "../../assets/bell_icon.svg";

interface PostData {
  id: number;
  profile: string;
  username: string;
  title: string;
  content: string;
  distance: string;
  time: string;
  date: string;
  views: number;
  comments?: number;
  likes: number;
  image?: string | null;
}

const popularPosts: PostData[] = [
  {
    id: 1,
    profile: profile,
    username: "달려라만보",
    title: "남매지에서 닭다리 나옴ㅋㅋ",
    content: "내용칸 두줄까지 표시",
    distance: "2.41km",
    time: "20:11",
    date: "2025.07.05",
    views: 356,
    comments: 12,
    likes: 79,
    image: example,
  },
  {
    id: 2,
    profile: profile,
    username: "푸른달걀",
    title: "산책가기 싫은 댕댕이 ",
    content: "내용칸 두줄까지 표시",
    distance: "2.41km",
    time: "20:11",
    date: "2025.07.07",
    views: 356,
    comments: 8,
    likes: 79,
    image: example2,
  },
  {
    id: 3,
    profile: profile,
    username: "몽실산책러러",
    title: "친구랑 같이 거북런 성공",
    content: "내용칸 두줄까지 표시",
    distance: "2.41km",
    time: "20:11",
    date: "2025.07.07",
    views: 356,
    comments: 5,
    likes: 79,
    image: example3,
  },
];

const recentPosts: PostData[] = [
  {
    id: 3,
    profile: profile,
    username: "댕댕이바구니",
    title: "친구랑 같이 하트 그리기 성공 ",
    content: "내용칸 두줄까지 표시",
    distance: "2.41km",
    time: "20:11",
    date: "1분전 ",
    views: 14,
    comments: 0,
    likes: 7,
    image: null,
  },
  {
    id: 4,
    profile: profile,
    username: "댕댕이바구니",
    title: "코끼리 그릴 생각은 없었는데",
    content:
      "내용칸 두줄까지 표시 예정 내용칸 두줄까지 표시 예정 내용칸 두줄까지 표시 예정 내용칸 두줄까지 표시 예정 내용칸 두줄까지 표시 예정 내용칸 두줄까지 표시 예정",
    distance: "2.41km",
    time: "20:11",
    date: "3분전",
    views: 4,
    comments: 1,
    likes: 9,
    image: profile,
  },
  {
    id: 5,
    profile: profile,
    username: "댕댕이바구니",
    title: "비 오는 날 산책, 물고기 완성",
    content: "내용칸 두줄까지 표시",
    distance: "2.41km",
    time: "20:11",
    date: "4분전",
    views: 19,
    comments: 2,
    likes: 15,
    image: example,
  },
];

const Community = () => {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentSection, setCurrentSection] = useState("default");

  const handleLike = (postId: number) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };

  const handleViewAllClick = () => {
    setIsSearchMode(false);
    setCurrentSection("all");
  };

  return (
    <>
      {isSearchMode ? (
        <Community_Find onBack={() => setIsSearchMode(false)} />
      ) : currentSection === "all" ? (
        <CommunityAll onBack={() => setCurrentSection("default")} />
      ) : (
        <div className="community-container">
          <section className="community-top-ui">
            <header className="community-header">
              <div>
                <img src={flag} alt="community flag" />
                <h2>WALKEE 커뮤니티 이용 가이드 보기</h2>
              </div>
              <p>{">"}</p>
            </header>

            <div className="community-logo-container">
              <img src={logo} alt="community logo" className="community_logo" />
              <div className="icons">
                <img src={plus} alt="plus icon" />
                <img
                  src={find}
                  alt="find icon"
                  onClick={handleSearchClick}
                  style={{ cursor: "pointer" }}
                />
                <img src={bell} alt="bell icon" />
              </div>
            </div>
          </section>

          {/* 인기 TOP3 */}
          <section className="popular-section">
            <h3>인기 TOP3</h3>
            <div className="popular-scroll-wrapper">
              <div className="popular-cards">
                {popularPosts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="profile-header">
                      <img src={post.profile} className="post-profile" />
                      <span className="username">{post.username}</span>
                    </div>
                    <img src={post.image!} className="map-image" />
                    <div className="post-info">
                      <p className="post-title">{post.title}</p>
                      <div className="post-meta">
                        <span className="post-date">{post.date}</span>
                        <Community_Stats
                          views={post.views}
                          comments={post.comments}
                          initialLikes={post.likes}
                          postId={post.id}
                          isLiked={likedPosts.includes(post.id)}
                          onLike={handleLike}
                          variant="popular"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 최근 게시물 */}
          <section className="recent-section">
            <h3>최근 게시물</h3>
            {recentPosts.map((post) => (
              <div key={post.id} className="recent-post">
                <div className="recent-post-top">
                  <div className="recent-post-left">
                    <div className="user-info">
                      <span className="username">{post.username}</span>
                      <span className="date">{post.date}</span>
                    </div>
                    <h4 className="title">{post.title}</h4>
                    <Community_Stats
                      views={post.views}
                      comments={post.comments}
                      initialLikes={post.likes}
                      postId={post.id}
                      isLiked={likedPosts.includes(post.id)}
                      onLike={handleLike}
                    />
                  </div>
                  <div className="recent-post-right">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="post"
                        className="recent-post-map"
                      />
                    ) : (
                      <div className="no-image-placeholder"></div>
                    )}
                  </div>
                </div>
                <div className="recent-post-bottom">
                  <p className="content">{post.content}</p>
                </div>
              </div>
            ))}
            <button className="view-all-button" onClick={handleViewAllClick}>
              게시물 전체보기
            </button>
          </section>
        </div>
      )}
    </>
  );
};

export default Community;
