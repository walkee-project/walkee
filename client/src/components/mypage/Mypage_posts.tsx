import { useNavigate } from "react-router-dom";
import React from "react";
import PostCard from "../PostCard";
import "../css/Mypage_posts.css";
import arrow_back from "../../assets/arrow_back.png";
import type { postsItem } from "../types/postsList_type";
import type { mypage_props } from "../types/mypage_type";
import { useAppSelector } from "../../store/hooks";

const Mypage_posts: React.FC<mypage_props> = ({ onChangeSection }) => {
  const navigate = useNavigate();
  const summary = useAppSelector((state) => state.user.summary);

  const postsList = summary?.userPost ?? [];
  console.log(postsList);
  // const postsList = [
  //   {
  //     postIdx: 1,
  //     userIdx: 1,
  //     postContent:
  //       "아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로아 살려줘 진심으로",
  //     postTitle: "친구랑 같이 하트 그리기 성공 💖",
  //     postCreatedAt: "2025-07-18 17:07:37",
  //     postUploadImg: "../assets/map_ex4.png",
  //     postCount: 298,
  //   },
  //   {
  //     postIdx: 2,
  //     userIdx: 1,
  //     postContent: "아 살려줘 진심으로",
  //     postTitle: "친구랑 같이 하트 그리기 실패 💖",
  //     postCreatedAt: "2025-07-18 1:07:37",
  //     postUploadImg: "../assets/map_ex4.png",
  //     postCount: 298,
  //   },
  // ];

  const handleBack = () => {
    onChangeSection("main");
  };

  return (
    <div className="postList">
      <div className="postList_section">
        <button className="back_btn" onClick={handleBack}>
          <img src={arrow_back} alt="back_arrow" />
        </button>

        <div className="post-header">
          <p>내 게시글</p>
        </div>

        <div className="post-list">
          {postsList.length > 0 ? (
            postsList.map((post: postsItem) => (
              <div
                key={post.postIdx}
                onClick={() =>
                  navigate("/community/detail", {
                    state: {
                      post: post,
                      from: "postList",
                    },
                  })
                }
              >
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="no-course-message">
              <>
                <p>작성한 게시글이 없습니다.</p>
                <p>지금 바로 기록해보세요!</p>
                <div
                  className="no_btn btn_one"
                  onClick={() => navigate("/community")}
                >
                  커뮤니티 가기
                </div>
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mypage_posts;
