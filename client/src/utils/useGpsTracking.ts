import { useState, useRef, useEffect } from "react";
import { calculateDistance, animateMarker } from "./gpsUtils";
import { createUserMarker } from "./createUserMarker";

interface GpsTrackingOptions {
  mode: "basic" | "course";
  targetStartPoint?: { lat: number; lng: number };
}

export default function useGpsTracking(
  markerRef: React.MutableRefObject<kakao.maps.Marker | null>,
  options: GpsTrackingOptions,
  isPause: boolean = false
) {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [trackedPoints, setTrackedPoints] = useState<kakao.maps.LatLng[]>([]);

  // "경로 따라가기" 모드의 활성화 상태
  const isFollowingActiveRef = useRef(options.mode === "basic");

  // isPause 최신값을 항상 참조하도록 useRef 사용
  const isPauseRef = useRef(isPause);
  useEffect(() => {
    isPauseRef.current = isPause;
  }, [isPause]);

  // 시간 추적 useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime && isFollowingActiveRef.current) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, startTime]);

  // 트래킹 시작
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("GPS를 지원하지 않는 브라우저입니다.");
      return;
    }

    let firstPositionReceived = false;
    const DEFAULT_LAT = 35.87539;
    const DEFAULT_LON = 128.68155;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        firstPositionReceived = true;
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        const currentPosition = new window.kakao.maps.LatLng(newLat, newLng);

        if (accuracy > 50) return;

        if (markerRef.current) {
          // setPosition 대신 animateMarker 사용
          animateMarker(markerRef.current, newLat, newLng, 1000);
        }

        if (options.mode === "course" && !isFollowingActiveRef.current) {
          const distanceToStart = calculateDistance(
            newLat,
            newLng,
            options.targetStartPoint!.lat,
            options.targetStartPoint!.lng
          );
          if (distanceToStart < 30) {
            isFollowingActiveRef.current = true;
          }
        }

        setTrackedPoints((prev) => [...prev, currentPosition]);
        if (!startTime) setStartTime(new Date());
        setIsTracking(true);
      },
      () => {
        if (!firstPositionReceived) {
          // 최초 위치 못 잡으면 기본 위치로 마커/지도 표시
          if (markerRef.current && window.kakaoMapInstance) {
            markerRef.current.setPosition(
              new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LON)
            );
          } else if (window.kakaoMapInstance) {
            markerRef.current = createUserMarker(
              window.kakaoMapInstance,
              new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LON)
            );
          }
          window.kakaoMapInstance.setCenter(
            new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LON)
          );
        }
        setIsTracking(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 30000,
      }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    isTracking,
    elapsedTime,
    startTracking,
    stopTracking,
    trackedPoints,
  };
}
