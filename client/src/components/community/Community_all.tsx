import React from "react";
import "../css/Community_all.css";
import likeIcon from "../../assets/thumbs-up-regular.svg";
import commentIcon from "../../assets/comment-icon.svg";
import profileImg from "../../assets/profile.png";
import sampleMap from "../../assets/map_ex4.png";

type Post = {
  id: number;
  username: string;
  profile: string;
  image: string;
  content: string;
  date: string;
};

const dummyAllPosts: Post[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  username: "달려라만보",
  profile: profileImg,
  image: sampleMap,
  content: `남매지에서 닭다리 나옴ㅋㅋ 내용내용내용내용내용내용 ${i + 1}`,
  date: `${i + 1}분 전`,
}));

const CommunityAll = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="all-posts-container">
      <button className="back-button" onClick={onBack}>
        ← 돌아가기
      </button>
      <h2 className="all-posts-title">전체 게시물</h2>
      {dummyAllPosts.map((post) => (
        <div className="post-card" key={post.id}>
          <div className="profile-header">
            <img src={post.profile} alt="profile" className="post-profile" />
            <span className="username">{post.username}</span>
          </div>

          <img src={post.image} alt="map" className="map-image" />

          <div className="post-actions">
            <img src={likeIcon} alt="like" />
            <img src={commentIcon} alt="comment" />
          </div>

          <div className="post-content">
            <p className="content-text">
              {post.content.length > 50
                ? `${post.content.slice(0, 50)}...더보기`
                : post.content}
            </p>
            <span className="post-date">{post.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityAll;
