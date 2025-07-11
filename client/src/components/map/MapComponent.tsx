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

  // 기본 위치 (서울)
  const DEFAULT_LAT = 37.5665;
  const DEFAULT_LON = 126.978;

  useEffect(() => {
    waitForKakaoSdk()
      .then((kakao) => {
        if (mapRef.current) {
          const initMap = (lat: number, lng: number) => {
            const container = mapRef.current!;
            const options = {
              center: new kakao.maps.LatLng(lat, lng),
              level: 6,
              tileSize: 256,
              tileType: 0,
              mapTypeId: kakao.maps.MapTypeId.ROADMAP,
              hd: true,
            };
            const map = new kakao.maps.Map(container, options);

            // 현재 위치 마커 생성 (커스텀 마커)
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

            // 전역으로 지도 인스턴스와 마커 저장
            window.kakaoMapInstance = map;
            window.currentMarker = marker;

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

            onMapReady?.();
          };

          // 위치 정보 지원 여부 확인
          if (!navigator.geolocation) {
            console.log(
              "위치 정보를 지원하지 않습니다. 기본 위치(서울)를 사용합니다."
            );
            initMap(DEFAULT_LAT, DEFAULT_LON);
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              initMap(lat, lng);
            },
            (error) => {
              console.error("위치 정보를 불러올 수 없습니다", error);

              // HTTPS 환경에서 위치 정보 접근이 차단된 경우 기본 위치 사용
              if (error.code === 1 && window.location.protocol === "https:") {
                console.log(
                  "HTTPS 환경에서 위치 정보 접근이 차단되었습니다. 기본 위치(서울)를 사용합니다."
                );
                initMap(DEFAULT_LAT, DEFAULT_LON);
                return;
              }

              alert(
                "위치 정보를 사용할 수 없습니다. 기본 위치(서울)를 사용합니다."
              );
              initMap(DEFAULT_LAT, DEFAULT_LON);
            }
          );
        }
      })
      .catch((err) => {
        console.error(err);
        alert("카카오 지도 SDK를 불러오지 못했습니다.");
      });
  }, [onMapReady]);

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
