import { useEffect, useRef, useState } from "react";
import "../css/Map_basic.css";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import MapTools from "./MapTools";
import { animateMarker, animateMapCenter } from "../../utils/gpsUtils";
import { createUserMarker } from "../../utils/createUserMarker";

export default function Map_basic() {
  const navigate = useNavigate();
  const [goalType, setGoalType] = useState("목표 없음");
  const [distanceGoal, setDistanceGoal] = useState("5");
  const [timeGoal, setTimeGoal] = useState("30");
  const [heading, setHeading] = useState(0);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const userLocationWatchId = useRef<number | null>(null);
  const markerAnimationRef = useRef<number | null>(null);
  const [gpsReady, setGpsReady] = useState(false);

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGoalType(e.target.value);
    setDistanceGoal("");
    setTimeGoal("");
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistanceGoal(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeGoal(e.target.value);
  };

  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
  };

  // 🚀 마커 렌더링을 별도 useEffect로 분리
  useEffect(() => {
    if (!mapInstance || !window.currentMarker) return;

    // 기존 마커가 있으면 재사용
    if (window.currentMarker) {
      markerRef.current = window.currentMarker;
    }
  }, [mapInstance]);

  const updateUserLocation = (position: GeolocationPosition) => {
    setGpsReady(true); // 위치가 잡히면 무조건 true
    if (!mapInstance) return;

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (!markerRef.current) {
      markerRef.current = createUserMarker(
        mapInstance,
        new window.kakao.maps.LatLng(lat, lng)
      );
    } else {
      // 마커를 부드럽게 이동
      animateMarker(markerRef.current, lat, lng, 1000, markerAnimationRef);
    }

    if (position.coords.heading !== null) {
      setHeading(position.coords.heading);
    }
  };

  const startContinuousLocationTracking = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateUserLocation(position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        animateMapCenter(mapInstance!, lat, lng, 1000);
        startHighAccuracyTracking();
      },
      (error) => {
        console.warn("초기 위치 가져오기 실패, 고정밀도로 재시도:", error);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateUserLocation(position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            animateMapCenter(mapInstance!, lat, lng, 1000);
            startHighAccuracyTracking();
          },
          (fallbackError) => {
            console.error("모든 초기 위치 가져오기 실패:", fallbackError);
            startHighAccuracyTracking();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
    );
  };

  const startHighAccuracyTracking = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        updateUserLocation(position);
      },
      (error) => {
        if (error.code === error.TIMEOUT) {
          console.warn("GPS 타임아웃 - 계속 진행");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          console.warn("위치 정보 일시적 불가 - 계속 진행");
        } else if (error.code === error.PERMISSION_DENIED) {
          console.error("위치 권한 거부됨");
          alert(
            "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요."
          );
        } else {
          console.warn("GPS 추적 오류:", error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      }
    );

    userLocationWatchId.current = watchId;
    return watchId;
  };

  useEffect(() => {
    if (!mapInstance) return;

    startContinuousLocationTracking();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);

      if (userLocationWatchId.current) {
        navigator.geolocation.clearWatch(userLocationWatchId.current);
        userLocationWatchId.current = null;
      }

      if (markerAnimationRef.current) {
        cancelAnimationFrame(markerAnimationRef.current);
        markerAnimationRef.current = null;
      }

      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };
  }, [mapInstance]);

  return (
    <div className="basic_section">
      <div className="map_container">
        <MapComponent markerRef={markerRef} onMapReady={handleMapReady} />
        <MapTools
          heading={heading}
          markerRef={markerRef}
          mapInstance={mapInstance}
        />
      </div>
      <div className="goal_wrapper">
        <div className="goal_label">목표 정하기</div>
        <div className="goal_box">
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
        <button
          className="btn_two btn basic_btn"
          onClick={() => {
            navigate("/map/ing", {
              state: {
                tab: "basic",
                goalType,
                distanceGoal,
                timeGoal,
              },
            });
          }}
          disabled={!gpsReady}
        >
          {gpsReady ? "시작" : "위치 잡는 중..."}
        </button>
      </div>
    </div>
  );
}
