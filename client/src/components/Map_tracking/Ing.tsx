import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/Ing.css";
import MapComponent from "../map/MapComponent";
import MapTools from "../map/MapTools";
import Ing_finish from "./Ing_finish";
import useGpsTracking from "../../utils/useGpsTracking";
import { formatTime } from "../../utils/gpsUtils";
import { decodePolyline } from "../../utils/decodePolyline";

export default function Ing() {
  const location = useLocation();
  const tab = location.state?.tab; // "basic" | "course"
  const routeToFollow = location.state?.route; // 따라갈 경로 정보

  const trackingOptions = {
    mode: tab || "basic",
    targetStartPoint: routeToFollow
      ? {
          lat: routeToFollow.routeStartLat,
          lng: routeToFollow.routeStartLng,
        }
      : undefined,
  };

  const [isPause, setIsPause] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const [heading, setHeading] = useState(0);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  const {
    totalDistance,
    elapsedTime,
    startTracking,
    stopTracking,
    trackedPoints,
    isFollowingActive,
  } = useGpsTracking(markerRef, mapInstance, trackingOptions);

  const userPolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const targetPolylineRef = useRef<kakao.maps.Polyline | null>(null);

  useEffect(() => {
    if (mapInstance) {
      startTracking();
    }
    return () => {
      stopTracking();
    };
  }, [mapInstance]);

  useEffect(() => {
    if (!mapInstance || !trackedPoints || trackedPoints.length < 2) return;
    if (userPolylineRef.current) {
      userPolylineRef.current.setMap(null);
    }
    userPolylineRef.current = new window.kakao.maps.Polyline({
      path: trackedPoints,
      strokeWeight: 5,
      strokeColor: "#4285f4",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });
    if (userPolylineRef.current) {
      userPolylineRef.current.setMap(mapInstance);
    }
  }, [trackedPoints, mapInstance]);

  useEffect(() => {
    if (tab === "course" && mapInstance && routeToFollow) {
      const path = decodePolyline(routeToFollow.routePolyline);
      const bounds = new window.kakao.maps.LatLngBounds();

      const targetPath = path.map((p) => {
        const latLng = new window.kakao.maps.LatLng(p.lat, p.lng);
        bounds.extend(latLng);
        return latLng;
      });

      targetPolylineRef.current = new window.kakao.maps.Polyline({
        path: targetPath,
        strokeWeight: 7,
        strokeColor: "#555555",
        strokeOpacity: 0.6,
        strokeStyle: "solid",
      });

      if (targetPolylineRef.current) {
        targetPolylineRef.current.setMap(mapInstance);
        mapInstance.setBounds(bounds);
      }

      new window.kakao.maps.Marker({
        map: mapInstance,
        position: targetPath[0],
        title: "시작",
      });
      new window.kakao.maps.CustomOverlay({
        map: mapInstance,
        position: targetPath[0],
        content: `<div style="background:#fff;border:1px solid #4285f4;border-radius:6px;padding:2px 8px;font-size:13px;color:#4285f4;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.1);">시작</div>`,
        yAnchor: 1.5,
      });

      new window.kakao.maps.Marker({
        map: mapInstance,
        position: targetPath[targetPath.length - 1],
        title: "도착",
      });
      new window.kakao.maps.CustomOverlay({
        map: mapInstance,
        position: targetPath[targetPath.length - 1],
        content: `<div style="background:#fff;border:1px solid #e74c3c;border-radius:6px;padding:2px 8px;font-size:13px;color:#e74c3c;font-weight:bold;box-shadow:0 2px 6px rgba(0,0,0,0.1);">도착</div>`,
        yAnchor: 1.5,
      });
    }

    return () => {
      if (targetPolylineRef.current) {
        targetPolylineRef.current.setMap(null);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [mapInstance, tab, routeToFollow]);

  const handlePause = () => {
    setIsPause(!isPause);
  };

  const handleFinish = () => {
    stopTracking();
    setIsFinish(true);
  };

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
          tab={tab}
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

          {tab === "course" && !isFollowingActive && (
            <div className="info_box">
              <div>시작 지점으로 이동해주세요.</div>
            </div>
          )}

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
