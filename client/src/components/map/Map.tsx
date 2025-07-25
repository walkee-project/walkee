import { useState } from "react";
import "../css/Map.css";
import Map_basic from "./Map_basic";
import Map_course from "./Map_course";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

// // window 객체에 카카오맵 타입 확장
// declare global {
//   interface Window {
//     kakaoMapInstance: kakao.maps.Map;
//     currentMarker: kakao.maps.Marker;
//   }
// }

function Map() {
  const location = useLocation();
  const state = location.state as {
    tab?: "basic" | "course";
    from?: string;
  } | null;

  const [activeTab, setActiveTab] = useState<"basic" | "course">(
    state?.tab === "course" ? "course" : "basic"
  );

  // 전역 상태에서 summary 가져오기
  const summary = useAppSelector((state) => state.user.summary);
  const routeList = summary?.userRouteLike || [];
  const userRouteList = summary?.userRoute || [];

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
          style={{ left: activeTab === "basic" ? "15%" : "65%" }}
        />
      </div>
      <div className="section_container" style={{ position: "relative" }}>
        <div
          style={{
            display: activeTab === "basic" ? "block" : "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: activeTab === "basic" ? 2 : 1,
          }}
        >
          <Map_basic />
        </div>
        <div
          style={{
            display: activeTab === "course" ? "block" : "none",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: activeTab === "course" ? 2 : 1,
          }}
        >
          <Map_course
            isActive={activeTab === "course"}
            routeList={routeList}
            userRouteList={userRouteList}
            from={state?.from}
          />
        </div>
      </div>
    </div>
  );
}

export default Map;
