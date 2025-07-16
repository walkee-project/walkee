import { type ChangeEvent, useEffect, useRef } from "react";
import "./css/Map_basic.css";
import useGpsTracking from "../../utils/useGpsTracking";
import { formatTime } from "../../utils/gpsUtils";
import { useAppSelector } from "../../store/hooks";
import { encodePolyline } from "../../utils/encodePolyline";
import { decodePolyline } from "../../utils/decodePolyline";
import { captureStaticMapThumbnail } from "../../utils/captureStaticMapThumbnail";

interface BasicRunSectionProps {
  goalType: string;
  distanceGoal: string;
  timeGoal: string;
  handleGoalChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  handleDistanceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleTimeChange: (e: ChangeEvent<HTMLInputElement>) => void;
  markerRef: React.MutableRefObject<kakao.maps.Marker | null>;
}

export default function Map_basic({
  goalType,
  distanceGoal,
  timeGoal,
  handleGoalChange,
  handleDistanceChange,
  handleTimeChange,
  markerRef,
}: BasicRunSectionProps) {
  // GPS 트래킹 훅 사용
  const {
    isTracking,
    totalDistance,
    elapsedTime,
    startTracking,
    stopTracking,
    trackedPoints, // useGpsTracking에서 반환하도록 확장 필요
  } = useGpsTracking(markerRef);

  const polylineRef = useRef<kakao.maps.Polyline | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;
    if (!markerRef.current) return;
    const map = markerRef.current.getMap();
    if (!map) return;
    if (trackedPoints.length > 1) {
      if (!polylineRef.current) {
        polylineRef.current = new window.kakao.maps.Polyline({
          path: trackedPoints,
          strokeWeight: 5,
          strokeColor: "#4285f4",
          strokeOpacity: 0.8,
          strokeStyle: "solid",
        });
        polylineRef.current.setMap(map);
      } else {
        polylineRef.current.setPath(trackedPoints);
      }
    }
  }, [trackedPoints, markerRef]);

  const { user } = useAppSelector((state) => state.user);

  // 경로 저장 함수
  const saveRoute = async () => {
    if (!user || !user.userIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    const routeTitle = prompt(
      "경로 제목을 입력하세요:",
      `${new Date().toLocaleDateString()} 런닝`
    );
    if (!routeTitle) return;
    const routeDescription =
      prompt("경로 설명을 입력하세요 (선택사항):", "") || "";
    if (!trackedPoints || trackedPoints.length === 0) {
      alert("경로 데이터가 없습니다.");
      return;
    }
    const originalPoints = trackedPoints.map((pos: kakao.maps.LatLng) => ({
      lat: pos.getLat(),
      lng: pos.getLng(),
    }));
    const compressedPoints =
      originalPoints.length > 2 ? originalPoints : originalPoints;
    const encoded = encodePolyline(compressedPoints);
    const routeThumbnailUrl = await captureStaticMapThumbnail(encoded);
    const startPoint = originalPoints[0];
    console.log(startPoint);
    const endPoint = originalPoints[originalPoints.length - 1];
    console.log(endPoint);
    const totalTimeInSeconds = elapsedTime;
    const routeData = {
      userIdx: user.userIdx,
      routeTitle,
      routeDescription,
      routeTotalKm: parseFloat((totalDistance / 1000).toFixed(3)),
      routeTotalTime: totalTimeInSeconds,
      routePolyline: encoded,
      routeStartLat: parseFloat(startPoint.lat.toFixed(7)),
      routeStartLng: parseFloat(startPoint.lng.toFixed(7)),
      routeEndLat: parseFloat(endPoint.lat.toFixed(7)),
      routeEndLng: parseFloat(endPoint.lng.toFixed(7)),
      routeThumbnail: routeThumbnailUrl,
      routeDifficulty: "초급",
    };
    console.log(routeData);

    // 테스트
    const polyline = "cz}yEqblpWBJAEAEACC@CACAECD@B@B?H?H?FAHAGB";
    const coords = decodePolyline(polyline);
    console.log(coords);
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      const apiUrl = import.meta.env.VITE_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(routeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "서버 오류가 발생했습니다.");
      }
      alert("경로가 성공적으로 저장되었습니다!");
    } catch (error) {
      if (error instanceof Error) {
        alert(`경로 저장에 실패했습니다. 오류: ${error.message}`);
      } else {
        alert("경로 저장에 실패했습니다. 알 수 없는 오류");
      }
    }
  };

  return (
    <div className="basic_section">
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
        <button className="mapbtn_one mapbtn" onClick={startTracking}>
          시작
        </button>
      </div>
    </div>
  );
}
