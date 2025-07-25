import { useState, useRef, useEffect } from "react";
import { calculateDistance, animateMarker } from "./gpsUtils";

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
  const [totalDistance, setTotalDistance] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const [trackedPoints, setTrackedPoints] = useState<kakao.maps.LatLng[]>([]);

  // "경로 따라가기" 모드의 활성화 상태
  const [isFollowingActive, setIsFollowingActive] = useState(
    options.mode === "basic"
  );
  const isFollowingActiveRef = useRef(options.mode === "basic");
  const setAndRefIsFollowingActive = (val: boolean) => {
    isFollowingActiveRef.current = val;
    setIsFollowingActive(val);
  };

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

    // 최초 위치 요청 제거, 바로 watchPosition만 실행
    const id = navigator.geolocation.watchPosition(
      (pos) => {
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

          if (distanceToStart <= 20) {
            setAndRefIsFollowingActive(true);
            setStartTime(new Date());
            setTotalDistance(0);
            setElapsedTime(0);
            lastPositionRef.current = { lat: newLat, lng: newLng };
            setTrackedPoints([currentPosition]);
          }
          return;
        }

        if (isFollowingActiveRef.current) {
          if (isPauseRef.current) return;
          if (lastPositionRef.current) {
            const distance = calculateDistance(
              lastPositionRef.current.lat,
              lastPositionRef.current.lng,
              newLat,
              newLng
            );

            if (distance < 2) return;
            if (distance > 100) return;

            setTotalDistance((prevDist) => prevDist + distance);
          }
          lastPositionRef.current = { lat: newLat, lng: newLng };
          setTrackedPoints((prev) => [...prev, currentPosition]);
        }
      },
      () => {
        alert("위치 정보를 사용할 수 없습니다.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 2000,
      }
    );
    setWatchId(id);
    setIsTracking(true);
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
    totalDistance,
    elapsedTime,
    startTracking,
    stopTracking,
    trackedPoints,
    isFollowingActive,
  };
}
