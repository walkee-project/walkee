import React from "react";
// import { useAppSelector, useAppDispatch } from "../store/hooks";
import type { postsItem } from "./types/postsList_type";
import "./css/PostCard.css";
import profile from "../assets/profile.png";

interface Props {
  post: postsItem;
}

const PostCard: React.FC<Props> = ({ post }) => {
  //   const dispatch = useAppDispatch();
  //   const userIdx = useAppSelector((state) => state.user.user?.userIdx);

  //날짜변환
  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 12시간제 변환 (0시는 12로)

    const formatted = `${year}.${month}.${day} ${period} ${hours
      .toString()
      .padStart(2, "0")}:${minutes}`;

    return formatted;
  }

  const input = post.postCreatedAt;
  const postDate = formatDate(input); // 👉 2025.07.18 PM 05:07

  return (
    <div className="post-card">
      <div className="post_imgDiv">
        <img src={post.postUploadImg} alt="thumbnail" className="post_img" />
      </div>

      <div className="post-content">
        <div className="info">
          <p className="post_title">{post.postTitle}</p>
          <p className="post_info">
            위치 : 경북 경산시 | 거리 : 2.41km | 시간 : 20:11
          </p>
        </div>
        <div className="date">{postDate}</div>
      </div>

      <div className="footer">
        <div className="interactions">
          <div className="profile_imgDiv">
            <img src={profile} alt="user" className="profile" />
          </div>
          <p className="post_username">하기싫어</p>
          <div className="footer_info">
            <div className="post_check">
              <span>👍</span>
              <span> {post.postCount}</span>
            </div>
            <div className="post_check">
              <span>👍</span>
              <span> 89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
