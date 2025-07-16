import { useState } from "react";
import "../css/Map.css";
import Map_basic from "./Map_basic";
import Map_course from "./Map_course";
import { useLocation } from "react-router-dom";

// // window 객체에 카카오맵 타입 확장
// declare global {
//   interface Window {
//     kakaoMapInstance: kakao.maps.Map;
//     currentMarker: kakao.maps.Marker;
//   }
// }

function Map({ routeId }: { routeId: number }) {
  const location = useLocation();
  const state = location.state as {
    tab?: "basic" | "course";
  } | null;

  const [activeTab, setActiveTab] = useState<"basic" | "course">(
    state?.tab === "course" ? "course" : "basic"
  );

  return (
    <div className="map_container">
      <div className="tab_container">
        <div className="tab_item" onClick={() => setActiveTab("basic")}>
          일반 달리기
        </div>
        <div className="tab_divider" />
        <div className="tab_item" onClick={() => setActiveTab("course")}>
          경로 따라 달리기
        </div>
        <div
          className="tab_border"
          style={{ left: activeTab === "basic" ? "0%" : "50%" }}
        />
      </div>
      <div className="section_container">
        {activeTab === "basic" && <Map_basic />}
        {activeTab === "course" && (
          <Map_course isActive={activeTab === "course"} routeId={routeId} />
        )}
      </div>
    </div>
  );
}

export default Map;
