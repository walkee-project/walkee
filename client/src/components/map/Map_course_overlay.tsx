import "../css/Map_course_overlay.css";
import arrow_back from "../../assets/arrow_back.png";
import type { RouteItem } from "../types/courseList_type";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import MapOverlayView from "./MapOverlayView";
import { decodePolyline } from "../../utils/decodePolyline";
import useBackHandler from "../hooks/useBackHandle";

export default function Map_course_overlay({
  route,
  btnTitle,
  handleHideOverlay,
  from,
}: {
  route: RouteItem;
  btnTitle: string;
  handleHideOverlay: () => void;
  from?: string;
}) {
  const navigate = useNavigate();
  const { handleBack } = useBackHandler();

  const handleBackBtn = () => {
    handleBack(from: from handleVoid: handleHideOverlay);
  };

  // 🚀 polyline 디코딩을 useMemo로 최적화
  const path = useMemo(() => {
    console.time("polyline-decode");
    const result = decodePolyline(route.routePolyline);
    console.timeEnd("polyline-decode");
    return result;
  }, [route.routePolyline]);

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
        <div className="arrow_back" onClick={handleBackBtn}>
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
