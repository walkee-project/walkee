import React, { useState } from "react";
import "../css/Community_all.css";
import Community_Stats from "./Community_stats";
import TopButton from "../TopButton";
import profileImg from "../../assets/profile.png";
import sampleMap from "../../assets/map_ex4.png";
import arrow_back from "../../assets/arrow_back.png";

export type Post = {
  id: number;
  username: string;
  profile: string;
  image: string;
  content: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  isLiked: boolean;
};

const dummyAllPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  username: "달려라만보",
  profile: profileImg,
  image: sampleMap,
  content: `${
    i + 1
  }전체게시글 내용 표시 전체게시글 내용 표시  전체게시글 내용 표시 전체게시글 내용 표시 전체게시글 내용 표시 전체게시글 내용 표시 전체게시글 내용 표시 전체게시글 내용 표시`,
  date: `${i + 1}분 전`,
  views: 100 + i,
  comments: 5 + i,
  likes: 10 + i,
  isLiked: false,
}));

const CommunityAll = ({ onBack }: { onBack: () => void }) => {
  const [posts, setPosts] = useState(dummyAllPosts);

  const handleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="all-posts-container">
      <div className="all-posts-header">
        <button className="back-button" onClick={onBack}>
          <img src={arrow_back} alt="back_arrow" />
        </button>
        <h2 className="all-posts-title">전체 게시물</h2>
      </div>
      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="profile-header">
            <img src={post.profile} alt="profile" className="post-profile" />
            <span className="username">{post.username}</span>
          </div>

          <img src={post.image} alt="map" className="map-image" />

          <div className="post-actions">
            <Community_Stats
              views={post.views}
              comments={post.comments}
              initialLikes={post.likes}
              postId={post.id}
              isLiked={post.isLiked}
              onLike={handleLike}
              variant="recent"
            />
            <span className="post-date">{post.date}</span>
          </div>

          <div className="post-content">
            <p className="content-text">
              {post.content.length > 50
                ? `${post.content.slice(0, 50)}...더보기`
                : post.content}
            </p>
          </div>
        </div>
      ))}
      <TopButton />
    </div>
  );
};

export default CommunityAll;
