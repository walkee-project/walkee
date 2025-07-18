import { useEffect, useRef, useState } from "react";
import "../css/Map_basic.css";
import { useNavigate } from "react-router-dom";
import MapComponent from "./MapComponent";
import MapTools from "./MapTools";
import { animateMarker, animateMapCenter } from "../../utils/gpsUtils";

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

  // 통일된 사용자 마커 생성 함수
  const createUserMarker = (position: kakao.maps.LatLng) => {
    const svgString =
      '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="#4285f4" stroke="white" stroke-width="2"/><circle cx="10" cy="10" r="3" fill="white"/></svg>';

    const markerImage = new window.kakao.maps.MarkerImage(
      "data:image/svg+xml;base64," + btoa(svgString),
      new window.kakao.maps.Size(20, 20),
      { offset: new window.kakao.maps.Point(10, 10) }
    );

    return new window.kakao.maps.Marker({
      position: position,
      map: mapInstance,
      title: "내 위치",
      image: markerImage,
    });
  };

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

  // MapComponent에서 onMapReady 콜백으로 mapInstance를 세팅
  const handleMapReady = () => {
    if (window.kakaoMapInstance) {
      setMapInstance(window.kakaoMapInstance);
    }
  };

  // 사용자 위치 업데이트 함수 (항상 실행)
  const updateUserLocation = (position: GeolocationPosition) => {
    if (!mapInstance) return;

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const latLng = new window.kakao.maps.LatLng(lat, lng);

    console.log("GPS 위치 업데이트:", lat, lng);

    // 마커가 없으면 생성
    if (!markerRef.current) {
      markerRef.current = createUserMarker(latLng);
    } else {
      // 마커 위치 부드럽게 업데이트
      animateMarker(markerRef.current, lat, lng, 1000, markerAnimationRef);
    }

    // 디바이스 방향도 업데이트
    if (position.coords.heading !== null) {
      setHeading(position.coords.heading);
    }
  };

  // GPS 추적 시작 함수 (항상 실행)
  const startContinuousLocationTracking = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    // 먼저 빠른 위치 가져오기 (저정밀도)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateUserLocation(position);
        // 지도 중심을 사용자 위치로 이동
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        animateMapCenter(mapInstance!, lat, lng, 1000);
        console.log("초기 위치 설정:", lat, lng);

        // 성공 후 고정밀도 추적 시작
        startHighAccuracyTracking();
      },
      (error) => {
        console.warn("초기 위치 가져오기 실패, 고정밀도로 재시도:", error);
        // 실패 시 고정밀도로 재시도
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateUserLocation(position);
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            animateMapCenter(mapInstance!, lat, lng, 1000);
            console.log("초기 위치 설정 (고정밀도):", lat, lng);
            startHighAccuracyTracking();
          },
          (fallbackError) => {
            console.error("모든 초기 위치 가져오기 실패:", fallbackError);
            // 그래도 추적은 시작
            startHighAccuracyTracking();
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 30000 }
    );
  };

  // 고정밀도 GPS 추적 시작
  const startHighAccuracyTracking = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        updateUserLocation(position);
        console.log(
          "위치 업데이트:",
          position.coords.latitude,
          position.coords.longitude,
          "정확도:",
          position.coords.accuracy
        );
      },
      (error) => {
        // 타임아웃이나 일시적 오류는 경고만 출력
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
        timeout: 20000, // 타임아웃을 20초로 증가
        maximumAge: 10000, // 캐시 시간을 10초로 증가
      }
    );

    userLocationWatchId.current = watchId;
    return watchId;
  };

  // 지도 로드 시 항상 GPS 추적 시작
  useEffect(() => {
    if (!mapInstance) return;

    // 항상 사용자 위치 추적 시작
    startContinuousLocationTracking();

    // 디바이스 방향 이벤트 리스너
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHeading(event.alpha);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);

      // 항상 실행되는 위치 추적 정리
      if (userLocationWatchId.current) {
        navigator.geolocation.clearWatch(userLocationWatchId.current);
        userLocationWatchId.current = null;
      }

      // 마커 애니메이션 정리
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
            navigate("/map/ing");
          }}
        >
          시작
        </button>
      </div>
    </div>
  );
}
