import { useState, useRef, useEffect } from "react";
import { animateMarker, calculateDistance } from "./gpsUtils";

export default function useGpsTracking(
  markerRef: React.MutableRefObject<kakao.maps.Marker | null>
) {
  const [isTracking, setIsTracking] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  // 시간 추적 useEffect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
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
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      lastPositionRef.current = { lat, lng };
      setTotalDistance(0);
      setStartTime(new Date());
      setElapsedTime(0);
      setIsTracking(true);
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;
          if (accuracy > 50) return;
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
          if (markerRef.current) {
            animateMarker(markerRef.current, newLat, newLng, 1000);
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
    });
  };

  // 트래킹 중지
  const stopTracking = () => {
    setIsTracking(false);
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // 언마운트 시 정리
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
  };
}
