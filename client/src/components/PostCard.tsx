import React from "react";
// import { useAppSelector, useAppDispatch } from "../store/hooks";
import type { postsItem } from "./types/postsList_type";
import "./css/PostCard.css";
import viewsIcon from "../assets/viewsIcon.png";
import goodIcon from "../assets/goodIcon.png";
import { useAppSelector } from "../store/hooks";
import profile from "../assets/profile.png";

interface Props {
  post: postsItem;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const user = useAppSelector((state) => state.user.user);
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
    <div className="postList_card">
      <div className="postcard_imgDiv">
        {post.postUploadImg && (
          <img
            src={`${__API_URL__}/${post.postUploadImg}`}
            alt="thumbnail"
            className="postcard_img"
          />
        )}
      </div>

      <div className="postcard-container">
        <div className="postcard-contentInfo">
          <p className="postcard_title">{post.postTitle}</p>
          <p className="postcard_content">{post.postContent}</p>
        </div>
        <div className="postcard_date">{postDate}</div>
      </div>

      <div className="postcard-footer">
        <div className="postcard-interactions">
          <div className="postcard-profileDiv">
            <img
              src={user?.userProfile || profile}
              alt="user"
              className="postcard-profile"
            />
          </div>
          <div className="postcard_username">{user?.userName}</div>
          <div className="postcard-footerInfo">
            <div className="postcard_check">
              <img src={viewsIcon} alt="view 아이콘" />
              <span> {post.postCount}</span>
            </div>
            <div className="postcard_check">
              <img src={goodIcon} alt="good 아이콘" />
              <span> {post.likeCount ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
