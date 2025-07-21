import "../css/Map_course_overlay.css";
import arrow_back from "../../assets/arrow_back.png";
import type { RouteItem } from "../types/courseList_type";
import { useNavigate } from "react-router-dom";
import MapOverlayView from "./MapOverlayView";
import { decodePolyline } from "../../utils/decodePolyline";

export default function Map_course_overlay({
  route,
  btnTitle,
  handleHideOverlay,
  from,
}: {
  route: RouteItem;
  btnTitle: "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기";
  handleHideOverlay: () => void;
  from?: string;
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (from === "courseList") {
      navigate(-1);
    } else {
      handleHideOverlay();
    }
  };

  // polyline 디코딩
  const path = decodePolyline(route.routePolyline);

  return (
    <div className="overlay_section">
      <div className="overlay_map">
        <MapOverlayView
          path={path}
          start={{ lat: route.routeStartLat, lng: route.routeStartLng }}
          end={{ lat: route.routeEndLat, lng: route.routeEndLng }}
        />
      </div>
      <div className="overlay_wrapper">
        <div className="arrow_back" onClick={handleBack}>
          <img src={arrow_back} alt="뒤로가기" />
        </div>
        <div className="overlay_title">
          <p>{btnTitle}</p>
        </div>
        <div className="overlay_content">
          <p>{btnTitle}는 시작 후 </p>
          <p>12시간이 지나면 자동으로 종료돼요 </p>
        </div>
        <div
          className="btn btn_two overlay_btn"
          onClick={() => {
            navigate("/map/ing", { state: { tab: "course", route: route } });
          }}
        >
          시 작
        </div>
      </div>
    </div>
  );
}
