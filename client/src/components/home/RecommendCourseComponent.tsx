import arrow_right from "../../assets/arrow_right.png";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouteItem } from "../types/courseList_type";

function RecommendCourseComponent({ route }: { route: RouteItem | null }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!route) {
    return (
      <div className="recommend_section empty">
        아직 등록된 경로가 없습니다.
      </div>
    );
  }

  return (
    <div
      className="recommend_section"
      onClick={() => {
        navigate("/map", { state: { tab: "course" } });
      }}
    >
      <div className="recommend_title">
        <div>
          오늘의 추천코스 <span>{route.routeTitle}</span>
        </div>
        {location.pathname === "/map" ? null : (
          <img src={arrow_right} alt="화살표" />
        )}
      </div>
      <div className="recommend_img">
        <img src={`api/public${route.routeThumbnail}`} alt="추천코스" />
        <div className="recommend_detail">
          <p>{route.routeTotalKm} km</p>
          <p>{route.routeTotalTime}분</p>
          <p>초급난이도</p>
        </div>
      </div>
    </div>
  );
}

export default RecommendCourseComponent;
