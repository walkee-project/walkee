import "../css/Map_course.css";
import RecommendCourseComponent from "../home/RecommendCourseComponent";
import RouteCard from "../mypage/RouteCard";
import { dummyData } from "../dummydate";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Map_course() {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  const filterList = dummyData.filter((item) => item.isLiked);
  const route_num = Math.floor(Math.random() * filterList.length);

  const handlelikeBtn = () => {
    if (filterList.length <= 0) {
      navigate("/mypage", { state: { section: "wishlist" } });
    } else {
      navigate("./community");
    }
  };

  return (
    <div className="course_section">
      <div className="recommend_course">
        <RecommendCourseComponent />
        <div className="recommend_btn btn btn_two">경로보기</div>
      </div>
      <div className="like_course">
        <div className="like_label">
          <p>찜한 경로 달리기</p>
        </div>
        {filterList.length <= 0 ? (
          <div className="no_course">
            <p>찜한 경로가 없습니다.</p>
            <p>지금 바로 저장해보세요!</p>
          </div>
        ) : (
          <RouteCard
            key={dummyData[route_num].id}
            route={dummyData[route_num]}
          />
        )}

        <div className="like_btns">
          <div className="btn btn_two">최근 경로 달리기</div>
          <div className="btn btn_two" onClick={handlelikeBtn}>
            {filterList.length <= 0 ? "커뮤니티 가기" : "찜한 경로 리스트"}
          </div>
        </div>
      </div>
    </div>
  );
}
