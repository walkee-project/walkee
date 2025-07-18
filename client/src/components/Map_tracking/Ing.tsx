import { useEffect, useRef, useState } from "react";
import "../css/Ing.css";
import MapComponent from "../map/MapComponent";
import MapTools from "../map/MapTools";
import Ing_finish from "./Ing_finish";
import useGpsTracking from "../../utils/useGpsTracking";
import { formatTime } from "../../utils/gpsUtils";

export default function Ing() {
  const [isPause, setIsPause] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [heading, setHeading] = useState(0);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  // 트래킹 데이터 관리
  const {
    isTracking,
    totalDistance,
    elapsedTime,
    startTracking,
    stopTracking,
    trackedPoints,
  } = useGpsTracking(markerRef);

  // Polyline을 지도에 그리기 위한 ref
  const polylineRef = useRef<kakao.maps.Polyline | null>(null);

  // 컴포넌트 마운트 시 트래킹 자동 시작, 언마운트 시 중지
  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);

  // trackedPoints가 바뀔 때마다 polyline을 지도에 그림
  useEffect(() => {
    if (!mapInstance || !trackedPoints || trackedPoints.length < 2) return;
    // 기존 polyline 제거
    if (polylineRef.current !== null) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    // 새 polyline 생성
    polylineRef.current = new window.kakao.maps.Polyline({
      path: trackedPoints,
      strokeWeight: 5,
      strokeColor: "#4285f4",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });
    if (polylineRef.current !== null) {
      polylineRef.current.setMap(mapInstance);
    }
  }, [trackedPoints, mapInstance]);

  // isTracking 미사용 경고 방지 (실제 사용처가 없으므로 주석 처리)
  // console.log(isTracking);

  const handlePause = () => {
    setIsPause(!isPause);
  };

  const handleFinish = () => {
    stopTracking();
    setIsFinish(true);
  };

  // MapComponent에서 onMapReady 콜백으로 mapInstance를 세팅
  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
  };

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className="ing_section">
      {isFinish ? (
        <Ing_finish
          totalDistance={totalDistance}
          elapsedTime={elapsedTime}
          trackedPoints={trackedPoints}
          formatTime={formatTime}
        />
      ) : (
        <>
          <div className="map_container">
            <MapComponent markerRef={markerRef} onMapReady={handleMapReady} />
            <MapTools
              heading={heading}
              markerRef={markerRef}
              mapInstance={mapInstance}
            />
          </div>

          {isPause && (
            <div className="pause_box">
              <div>쉬어가는 중</div>
            </div>
          )}

          <div className="state_wrapper">
            <div className="state_box">
              <div className="state_km">
                <span>{(totalDistance / 1000).toFixed(2)}</span>
                <span className="unit"> km</span>
              </div>
              <div className="state_kmh">
                <span>
                  {elapsedTime > 0
                    ? (totalDistance / 1000 / (elapsedTime / 3600)).toFixed(2)
                    : "0.00"}
                </span>
                <span className="unit"> km/h</span>
              </div>
              <div className="state_time">
                <span>{formatTime(elapsedTime)}</span>
              </div>
            </div>
            <div className="ing_btns">
              <button className="btn_two btn ing_btn" onClick={handleFinish}>
                끝내기
              </button>
              <button className="btn_one btn ing_btn" onClick={handlePause}>
                {isPause ? "계속하기" : "쉬어가기"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
