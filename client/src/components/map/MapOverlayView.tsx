import { useEffect, useRef } from "react";

interface LatLng {
  lat: number;
  lng: number;
}
export default function MapOverlayView({
  path,
  start,
  end,
}: {
  path: LatLng[];
  start: LatLng;
  end: LatLng;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    // 🚀 지도 생성 (기본 설정으로 빠르게)
    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(start.lat, start.lng),
      level: 5,
    });

    // 🚀 지도 렌더링 완료 후 오버레이 추가 (비동기)
    setTimeout(() => {
      // 빨간색 polyline
      const polyline = new window.kakao.maps.Polyline({
        path: path.map((p) => new window.kakao.maps.LatLng(p.lat, p.lng)),
        strokeWeight: 5,
        strokeColor: "#FF0000",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      // 시작 마커
      new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(start.lat, start.lng),
        title: "시작",
      });

      // 시작 라벨(커스텀 오버레이)
      new window.kakao.maps.CustomOverlay({
        map,
        position: new window.kakao.maps.LatLng(start.lat, start.lng),
        content: `<div style="background:#fff;border:1px solid #4285f4;border-radius:6px;padding:2px 8px;font-size:13px;color:#4285f4;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.1);">시작</div>`,
        yAnchor: 1.5,
      });

      // 끝 마커
      new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(end.lat, end.lng),
        title: "도착",
      });

      // 끝 라벨(커스텀 오버레이)
      new window.kakao.maps.CustomOverlay({
        map,
        position: new window.kakao.maps.LatLng(end.lat, end.lng),
        content: `<div style="background:#fff;border:1px solid #e74c3c;border-radius:6px;padding:2px 8px;font-size:13px;color:#e74c3c;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.1);">도착</div>`,
        yAnchor: 1.5,
      });

      // 지도 bounds 자동 맞춤
      const bounds = new window.kakao.maps.LatLngBounds();
      path.forEach((p) =>
        bounds.extend(new window.kakao.maps.LatLng(p.lat, p.lng))
      );
      map.setBounds(bounds);
    }, 50); // 50ms 지연으로 지도 렌더링 우선

    // 정리
    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, [path, start, end]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
    />
  );
}
