import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/Ing.css";
import MapComponent from "../map/MapComponent";
import MapTools from "../map/MapTools";
import Ing_finish from "./Ing_finish";
import useGpsTracking from "../../utils/useGpsTracking";
import { formatTime } from "../../utils/gpsUtils";
import { decodePolyline } from "../../utils/decodePolyline";
import { calculateDistance } from "../../utils/gpsUtils";
import ConfirmExitModal from "../ConfirmExitModal";
import loadingGif from "../../assets/map_loading.gif";
import { createUserMarker } from "../../utils/createUserMarker";

interface Prop {
  isMapModalOpen: boolean;
}

export default function Ing({ isMapModalOpen }: Prop) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.state?.tab; // "basic" | "course"
  const routeToFollow = location.state?.route; // 따라갈 경로 정보
  const goalType = location.state?.goalType;
  const distanceGoal = Number(location.state?.distanceGoal);
  const timeGoal = Number(location.state?.timeGoal);
  const [showExitModal, setShowExitModal] = useState(false);

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

  useEffect(() => {
    if (isMapModalOpen) {
      setIsPause(true);
    }
  }, [isMapModalOpen]);

  // 쉬는 중 마지막 위치 저장
  const [pauseLocation, setPauseLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isTooFar, setIsTooFar] = useState(false);
  const DIST_THRESHOLD = 20; // 미터

  const [heading, setHeading] = useState(0);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  const {
    totalDistance,
    // elapsedTime,
    startTracking,
    stopTracking,
    trackedPoints,
    isFollowingActive,
  } = useGpsTracking(markerRef, trackingOptions, isPause);

  const [internalElapsedTime, setInternalElapsedTime] = useState(0);

  // 목표 달성 체크 (이 부분만 남기기)
  const [goalAchieved, setGoalAchieved] = useState(false);
  useEffect(() => {
    if (
      goalType === "거리 설정" &&
      totalDistance / 1000 >= distanceGoal &&
      distanceGoal > 0
    ) {
      setGoalAchieved(true);
    } else if (
      goalType === "시간 설정" &&
      internalElapsedTime / 60 >= timeGoal &&
      timeGoal > 0
    ) {
      setGoalAchieved(true);
    }
  }, [goalType, distanceGoal, timeGoal, totalDistance, internalElapsedTime]);

  const userPolylineRef = useRef<kakao.maps.Polyline | null>(null);
  const targetPolylineRef = useRef<kakao.maps.Polyline | null>(null);

  useEffect(() => {
    if (loading) return;
    if (mapInstance) {
      startTracking();
    }
    return () => {
      stopTracking();
    };
  }, [mapInstance, loading]);

  useEffect(() => {
    if (loading) return;
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
  }, [trackedPoints, mapInstance, loading]);

  useEffect(() => {
    if (loading) return;
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
  }, [mapInstance, tab, routeToFollow, loading]);

  // 완성도 계산 (경로 따라가기 모드에서만)
  const [completion, setCompletion] = useState<number>(0);
  useEffect(() => {
    if (loading) return;
    if (tab === "course" && routeToFollow && trackedPoints.length > 0) {
      const targetPath = decodePolyline(routeToFollow.routePolyline);
      let successCount = 0;
      trackedPoints.forEach((userPoint) => {
        let minDist = Infinity;
        for (const targetPoint of targetPath) {
          const dist = calculateDistance(
            userPoint.getLat(),
            userPoint.getLng(),
            targetPoint.lat,
            targetPoint.lng
          );
          if (dist < minDist) minDist = dist;
        }
        if (minDist <= 10) successCount += 1;
      });
      setCompletion(
        trackedPoints.length > 0
          ? Math.round((successCount / trackedPoints.length) * 100)
          : 0
      );
    }
  }, [tab, routeToFollow, trackedPoints, loading]);

  // 트래킹/타이머 제어용
  // const [internalElapsedTime, setInternalElapsedTime] = useState(0);
  // const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  // 타이머 동작 제어
  useEffect(() => {
    if (loading) return;
    if (!isPause && !isFinish && (tab !== "course" || isFollowingActive)) {
      // 계속하기: 타이머 시작
      if (timerId) clearInterval(timerId);
      const id = setInterval(() => {
        setInternalElapsedTime((prev) => prev + 1);
      }, 1000);
      setTimerId(id);
      return () => clearInterval(id);
    } else if (isPause) {
      // 쉬어가기: 타이머 멈춤
      if (timerId) clearInterval(timerId);
      setTimerId(null);
    }
  }, [isPause, isFinish, loading, tab, isFollowingActive]);

  // 쉬기 시작할 때 시간 저장
  // useEffect(() => {
  //   if (loading) return;
  //   if (isPause) {
  //     setPauseStartTime(Date.now());
  //   } else {
  //     setPauseStartTime(null);
  //   }
  // }, [isPause, loading]);

  // elapsedTime이 바뀔 때(트래킹 재시작 등) internalElapsedTime을 리셋하지 않도록 기존 useEffect 제거

  // 트래킹(경로 추가) 제어: isPause일 때는 trackedPoints 업데이트 막기
  // useGpsTracking 내부에서 직접 제어가 안 되면, trackedPoints를 별도 관리 필요
  // 여기서는 경로 그리기만 멈추는 방식으로 처리

  // 쉬는 중 위치 이탈 감지
  useEffect(() => {
    if (loading) return;
    if (isPause && pauseLocation && trackedPoints.length > 0) {
      const last = trackedPoints[trackedPoints.length - 1];
      const dist = calculateDistance(
        last.getLat(),
        last.getLng(),
        pauseLocation.lat,
        pauseLocation.lng
      );
      setIsTooFar(dist > DIST_THRESHOLD);
    } else if (!isPause) {
      setPauseLocation(null);
      setIsTooFar(false);
    }
  }, [isPause, pauseLocation, trackedPoints, loading]);

  const handlePause = () => {
    setIsPause((prev) => !prev);
  };

  const [speedWarning, setSpeedWarning] = useState(false);

  // 12시간 초과 시 자동 이동
  useEffect(() => {
    if (internalElapsedTime >= 43200) {
      alert("12시간이 초과되어 홈으로 이동합니다.");
      navigate("/home");
    }
  }, [internalElapsedTime, navigate]);

  // 속도 7km/h 초과 경고
  useEffect(() => {
    const speed =
      internalElapsedTime > 0
        ? totalDistance / 1000 / (internalElapsedTime / 3600)
        : 0;
    setSpeedWarning(speed > 7);
  }, [totalDistance, internalElapsedTime]);

  const handleFinish = () => {
    // if (totalDistance < 1000) {
    //   setShowExitModal(true);
    //   setIsPause(true);
    //   return;
    // }
    stopTracking();
    setIsFinish(true);
  };

  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
  };

  useEffect(() => {
    if (loading) return;
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [loading]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const [waitingForLocation, setWaitingForLocation] = useState(false);
  useEffect(() => {
    if (!loading) {
      setWaitingForLocation(true);
      const timer = setTimeout(() => setWaitingForLocation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    if (!mapInstance) return;
    // 마커가 없으면 생성
    if (!markerRef.current && trackedPoints.length > 0) {
      markerRef.current = createUserMarker(
        mapInstance,
        trackedPoints[trackedPoints.length - 1]
      );
    }
  }, [mapInstance, trackedPoints, loading]);

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2196f3",
        }}
      >
        <img
          src={loadingGif}
          alt="321 카운트다운"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
  if (waitingForLocation) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2196f3",
        }}
      >
        <span style={{ color: "#fff", fontSize: "1.2rem" }}>
          위치 잡는 중...
        </span>
      </div>
    );
  }

  return (
    <div className="ing_section">
      {showExitModal && (
        <ConfirmExitModal
          where="finish"
          onCancel={() => {
            setShowExitModal(false);
            setIsPause(false);
          }}
          onConfirm={() => navigate("/home")}
        />
      )}
      {isFinish ? (
        <Ing_finish
          totalDistance={totalDistance}
          elapsedTime={internalElapsedTime}
          trackedPoints={trackedPoints}
          formatTime={formatTime}
          tab={tab}
          completion={tab === "course" ? completion : undefined}
          routeIdx={
            tab === "course" && routeToFollow
              ? routeToFollow.routeIdx
              : undefined
          }
        />
      ) : (
        <>
          <div className="map_container">
            <MapComponent onMapReady={handleMapReady} />
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
          {goalAchieved && (
            <div className="info_box">
              <div>목표를 달성하셨습니다!</div>
            </div>
          )}
          {isPause && isTooFar && (
            <div className="info_box">
              <div>마지막 지점으로 이동해주세요.</div>
            </div>
          )}

          {isPause && (
            <div className="pause_box">
              <div>쉬어가는 중</div>
            </div>
          )}

          <div className="state_wrapper">
            {speedWarning && (
              <div
                className="info_box"
                style={{
                  color: "#e74c3c",
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                속도가 너무 빠릅니다. 운전 도중에는 사용하지 마세요.
              </div>
            )}
            <div className="state_box">
              <div className="state_km">
                <span>{(totalDistance / 1000).toFixed(2)}</span>
                <span className="unit"> km</span>
              </div>
              <div className="state_kmh">
                <span>
                  {internalElapsedTime > 0
                    ? (
                        totalDistance /
                        1000 /
                        (internalElapsedTime / 3600)
                      ).toFixed(2)
                    : "0.00"}
                </span>
                <span className="unit"> km/h</span>
              </div>
              <div className="state_time">
                <span>{formatTime(internalElapsedTime)}</span>
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
