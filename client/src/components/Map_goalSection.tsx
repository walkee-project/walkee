import { type ChangeEvent, useState, useEffect, useRef } from "react";
import "./css/Map_goalSection.css";
import { waitForKakaoSdk } from "./hooks/useKakaoSdk";
import { useAppSelector } from "../store/hooks";

// Window 타입 확장
declare global {
  interface Window {
    kakaoMapInstance: kakao.maps.Map;
    currentMarker: kakao.maps.Marker;
  }
}

interface BasicRunSectionProps {
  goalType: string;
  distanceGoal: string;
  timeGoal: string;
  handleGoalChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleDistanceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicRunSection({
  goalType,
  distanceGoal,
  timeGoal,
  handleGoalChange,
  handleDistanceChange,
  handleTimeChange,
}: BasicRunSectionProps) {
  // Redux에서 사용자 정보 가져오기
  const { user } = useAppSelector((state) => state.user);

  // GPS 트래킹 관련 상태
  const [isTracking, setIsTracking] = useState(false);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [currentMarker, setCurrentMarker] = useState<kakao.maps.Marker | null>(
    null
  );
  const [polyline, setPolyline] = useState<kakao.maps.Polyline | null>(null);
  const [trackedPoints, setTrackedPoints] = useState<kakao.maps.LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);

  // 마커 애니메이션을 위한 ref
  const markerAnimationRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{ lat: number; lng: number } | null>(null);

  // 거리 계산 함수 (하버사인 공식)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number => {
    const R = 6371e3; // 지구 반지름(미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 시간 포맷팅 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 부드러운 마커 이동 애니메이션
  const animateMarker = (
    marker: kakao.maps.Marker,
    newLat: number,
    newLng: number,
    duration: number = 1000
  ): void => {
    // 이전 애니메이션이 있다면 취소
    if (markerAnimationRef.current) {
      cancelAnimationFrame(markerAnimationRef.current);
    }

    const startPosition = marker.getPosition();
    const startLat = startPosition.getLat();
    const startLng = startPosition.getLng();

    // 거리가 너무 가까우면 애니메이션 생략
    const distance = calculateDistance(startLat, startLng, newLat, newLng);
    if (distance < 1) {
      // 1미터 미만이면 바로 이동
      marker.setPosition(new kakao.maps.LatLng(newLat, newLng));
      return;
    }

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOutCubic 이징 함수 (더 부드러운 움직임)
      let easeProgress = progress;
      if (progress < 0.5) {
        easeProgress = 4 * progress * progress * progress;
      } else {
        easeProgress = 1 - Math.pow(-2 * progress + 2, 3) / 2;
      }

      const currentLat = startLat + (newLat - startLat) * easeProgress;
      const currentLng = startLng + (newLng - startLng) * easeProgress;

      marker.setPosition(new kakao.maps.LatLng(currentLat, currentLng));

      if (progress < 1) {
        markerAnimationRef.current = requestAnimationFrame(animate);
      } else {
        markerAnimationRef.current = null;
      }
    };

    markerAnimationRef.current = requestAnimationFrame(animate);
  };

  // 부드러운 지도 이동
  const animateMapCenter = (
    mapInstance: kakao.maps.Map,
    newLat: number,
    newLng: number,
    duration: number = 1000
  ): void => {
    const startCenter = mapInstance.getCenter();
    const startLat = startCenter.getLat();
    const startLng = startCenter.getLng();
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuad 이징 함수
      const easeProgress = 1 - Math.pow(1 - progress, 2);

      const currentLat = startLat + (newLat - startLat) * easeProgress;
      const currentLng = startLng + (newLng - startLng) * easeProgress;

      mapInstance.setCenter(new kakao.maps.LatLng(currentLat, currentLng));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // GPS 트래킹 시작
  const startTracking = async (): Promise<void> => {
    try {
      await waitForKakaoSdk();

      // 현재 위치 가져오기
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // 기존 지도와 마커 가져오기
          const mapInstance = window.kakaoMapInstance;
          const existingMarker = window.currentMarker;

          if (mapInstance && existingMarker) {
            setMap(mapInstance);
            setCurrentMarker(existingMarker);

            // 현재 위치로 지도 중심 부드럽게 이동
            animateMapCenter(mapInstance, lat, lng);

            // 기존 마커 위치 부드럽게 업데이트
            animateMarker(existingMarker, lat, lng);

            // 경로 시작점 설정
            setTrackedPoints([new kakao.maps.LatLng(lat, lng)]);
            lastPositionRef.current = { lat, lng };

            console.log("기존 지도와 마커 사용:", mapInstance, existingMarker);
          } else {
            console.error("지도 또는 마커를 찾을 수 없습니다.");
            return;
          }

          setIsTracking(true);
          setStartTime(new Date());
          setElapsedTime(0);
          setTotalDistance(0);

          // 위치 추적 시작
          const watchId = navigator.geolocation.watchPosition(
            (pos) => {
              const newLat = pos.coords.latitude;
              const newLng = pos.coords.longitude;
              const accuracy = pos.coords.accuracy;

              // GPS 정확도가 낮으면 무시
              if (accuracy > 50) {
                console.log("GPS 정확도가 낮아 무시됨:", accuracy);
                return;
              }

              // 이전 위치와의 거리 체크 (노이즈 필터링)
              if (lastPositionRef.current) {
                const distance = calculateDistance(
                  lastPositionRef.current.lat,
                  lastPositionRef.current.lng,
                  newLat,
                  newLng
                );

                // 거리가 너무 짧으면 무시 (GPS 노이즈)
                if (distance < 2) {
                  // 2미터 미만
                  return;
                }

                // 거리가 너무 멀면 무시 (GPS 점프)
                if (distance > 100) {
                  // 100미터 초과
                  console.warn("GPS 점프 감지:", distance);
                  return;
                }
              }

              const newPosition = new kakao.maps.LatLng(newLat, newLng);

              // 마커 부드럽게 업데이트
              if (existingMarker) {
                // 거리에 따라 애니메이션 속도 조절
                const animationDuration = Math.min(
                  2000,
                  Math.max(500, accuracy * 20)
                );
                animateMarker(
                  existingMarker,
                  newLat,
                  newLng,
                  animationDuration
                );
              }

              // 지도 중심도 부드럽게 이동 (트래킹 중에는 항상 중심 유지)
              if (mapInstance) {
                animateMapCenter(mapInstance, newLat, newLng, 1500);
              }

              // 경로 추가
              setTrackedPoints((prev) => {
                const newPoints = [...prev, newPosition];

                // 거리 계산
                if (prev.length > 0) {
                  const lastPoint = prev[prev.length - 1];
                  const distance = calculateDistance(
                    lastPoint.getLat(),
                    lastPoint.getLng(),
                    newLat,
                    newLng
                  );
                  setTotalDistance((prevDist) => prevDist + distance);
                }

                // 경로 라인 업데이트
                if (mapInstance && newPoints.length >= 2) {
                  if (polyline) {
                    polyline.setMap(null);
                  }
                  const newPolyline = new kakao.maps.Polyline({
                    map: mapInstance,
                    path: newPoints,
                    strokeWeight: 5,
                    strokeColor: "#4285f4",
                    strokeOpacity: 0.8,
                    strokeStyle: "solid",
                  });
                  setPolyline(newPolyline);
                }

                return newPoints;
              });

              // 마지막 위치 업데이트
              lastPositionRef.current = { lat: newLat, lng: newLng };
            },
            (error) => {
              console.error("위치 추적 오류:", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 2000, // 더 자주 업데이트
            }
          );

          setWatchId(watchId);
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          alert("위치 정보를 사용할 수 없습니다.");
        }
      );
    } catch (error) {
      console.error("카카오 지도 초기화 실패:", error);
      alert("지도를 불러올 수 없습니다.");
    }
  };

  // GPS 트래킹 중지
  const stopTracking = (): void => {
    setIsTracking(false);

    // 애니메이션 중지
    if (markerAnimationRef.current) {
      cancelAnimationFrame(markerAnimationRef.current);
      markerAnimationRef.current = null;
    }

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

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

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (markerAnimationRef.current) {
        cancelAnimationFrame(markerAnimationRef.current);
      }
    };
  }, []);

  return (
    <div className="goal_section">
      <div className="goal_wrapper">
        <div className="goal_label">목표 정하기</div>
        <select
          className="goal_select"
          id="goal"
          name="goal"
          value={goalType}
          onChange={handleGoalChange}
        >
          <option>목표 없음</option>
          <option>거리 설정</option>
          <option>시간 설정</option>
        </select>

        {goalType !== "목표 없음" && (
          <div className="goal_input">
            {goalType === "거리 설정" && (
              <div className="input_with_unit">
                <input
                  type="number"
                  placeholder="예: 3"
                  className="input_field"
                  value={distanceGoal}
                  onChange={handleDistanceChange}
                />
                <span className="unit_label">km</span>
              </div>
            )}
            {goalType === "시간 설정" && (
              <div className="input_with_unit">
                <input
                  type="number"
                  placeholder="예: 30"
                  className="input_field"
                  value={timeGoal}
                  onChange={handleTimeChange}
                />
                <span className="unit_label">분</span>
              </div>
            )}
          </div>
        )}
      </div>

      {!isTracking ? (
        <button className="mapbtn_one mapbtn" onClick={startTracking}>
          시작
        </button>
      ) : (
        <div className="tracking_info">
          <div className="tracking_stats">
            <div className="stat_item">
              <span className="stat_label">거리</span>
              <span className="stat_value">
                {(totalDistance / 1000).toFixed(3)} km
              </span>
            </div>
            <div className="stat_item">
              <span className="stat_label">시간</span>
              <span className="stat_value">{formatTime(elapsedTime)}</span>
            </div>
          </div>
          <button className="mapbtn_one mapbtn stop_btn" onClick={stopTracking}>
            중지
          </button>
        </div>
      )}
    </div>
  );
}
