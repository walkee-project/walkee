import { useEffect, useRef } from "react";
import { waitForKakaoSdk } from "../hooks/useKakaoSdk";

// window 객체에 카카오맵 타입 확장
declare global {
  interface Window {
    kakaoMapInstance: kakao.maps.Map;
    currentMarker: kakao.maps.Marker;
  }
}

interface MapComponentProps {
  onMapReady?: () => void;
}

function MapComponent({ onMapReady }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  // 기본 위치 (대구)
  const DEFAULT_LAT = 35.87539;
  const DEFAULT_LON = 128.68155;

  useEffect(() => {
    waitForKakaoSdk()
      .then((kakao) => {
        if (mapRef.current) {
          // 🚀 지도를 먼저 기본 위치로 초기화 (위치 탐색 대기 없이)
          const container = mapRef.current!;
          const options = {
            center: new kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LON),
            level: 3,
            tileSize: 256,
            tileType: 0,
            mapTypeId: kakao.maps.MapTypeId.ROADMAP,
            hd: true,
          };
          const map = new kakao.maps.Map(container, options);

          // 전역으로 지도 인스턴스 저장 (마커는 나중에)
          window.kakaoMapInstance = map;

          // DrawingManager 초기화
          const drawingManager = new kakao.maps.drawing.DrawingManager({
            map: map,
            drawingMode: [kakao.maps.drawing.OverlayType.POLYLINE],
            guideTooltip: ["draw", "edit"],
            markerOptions: { draggable: true },
            polylineOptions: {
              draggable: true,
              editable: true,
              strokeColor: "#39f",
              strokeWeight: 3,
              strokeOpacity: 0.7,
              strokeStyle: "solid",
            },
          });

          const btn = document.getElementById("start-drawing");
          if (btn) {
            btn.onclick = () => {
              drawingManager.select(kakao.maps.drawing.OverlayType.POLYLINE);
            };
          }

          // 🚀 지도 준비 완료 즉시 콜백 호출
          onMapReady?.();
        }
      })
      .catch((err) => {
        console.error(err);
        alert("카카오 지도 SDK를 불러오지 못했습니다.");
      });
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
}

export default MapComponent;
