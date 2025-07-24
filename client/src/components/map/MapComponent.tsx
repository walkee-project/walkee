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
  markerRef?: React.MutableRefObject<kakao.maps.Marker | null>;
}

function MapComponent({ onMapReady, markerRef }: MapComponentProps) {
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

          // 🚀 위치 탐색은 별도로 비동기 실행
          setTimeout(() => {
            if (!navigator.geolocation) {
              console.log(
                "위치 정보를 지원하지 않습니다. 기본 위치(서울)를 사용합니다."
              );
              return;
            }

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // 지도 중심 이동
                map.setCenter(new kakao.maps.LatLng(lat, lng));

                // 마커 생성 및 저장
                const marker = new kakao.maps.Marker({
                  map,
                  position: new kakao.maps.LatLng(lat, lng),
                  title: "내 위치",
                  image: new kakao.maps.MarkerImage(
                    "data:image/svg+xml;base64," +
                      btoa(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="white" stroke-width="3"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                      </svg>
                    `),
                    new kakao.maps.Size(24, 24),
                    {
                      offset: new kakao.maps.Point(12, 12),
                    }
                  ),
                });

                if (markerRef) {
                  markerRef.current = marker;
                }
                window.currentMarker = marker;
              },
              (error) => {
                console.error("위치 정보를 불러올 수 없습니다", error);
                // 위치 실패해도 지도는 이미 로드됨
              }
            );
          }, 100); // 100ms 지연으로 지도 렌더링 우선
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
