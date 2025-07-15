import "../css/Map.css";

// window 객체에 카카오맵 타입 확장
declare global {
  interface Window {
    kakaoMapInstance: kakao.maps.Map;
    currentMarker: kakao.maps.Marker;
  }
}

return (
  <div className="map_container">
    <MapComponent markerRef={markerRef} />

    <div className={`button_box ${selectedMode ? "" : "active"}`}>
      {/* 선택 전: 버튼 보여줌 */}
      {!selectedMode && (
        <div className="firstSelect_section">
          <button
            className="mapbtn mapbtn_two"
            onClick={() => handleModeSelect("goalSection")}
          >
            달리기 시작
          </button>
          <button
            className="mapbtn mapbtn_two"
            onClick={() => handleModeSelect("course")}
          >
            코스 따라 달리기
          </button>
        </div>
      )}

      {/* 선택 후: 섹션 보여줌 */}
      {selectedMode && <>{sectionComponents[selectedMode]}</>}
    </div>
  </div>
);

export default Map;
