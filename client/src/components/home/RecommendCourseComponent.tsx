import arrow_right from "../../assets/arrow_right.png";
import { useLocation, useNavigate } from "react-router-dom";
import { dummyData } from "../dummydate";

function RecommendCourseComponent({ routeId }: { routeId: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const route = dummyData.find((item) => item.id === routeId) ?? dummyData[0];

  return (
    <div
      className="recommend_section"
      onClick={() => {
        navigate("/map", { state: { tab: "course" } });
      }}
    >
      <div className="recommend_title">
        <div>
          오늘의 추천코스 <span>{route.title}</span>
        </div>
        {location.pathname === "/map" ? null : (
          <img src={arrow_right} alt="화살표" />
        )}
      </div>
      <div className="recommend_img">
        <img src={route.image} alt="추천코스" />
        <div className="recommend_detail">
          <p>{route.distance} km</p>
          <p>{route.time}</p>
          <p>초급난이도</p>
        </div>
      </div>
    </div>
  );
}

export default RecommendCourseComponent;
