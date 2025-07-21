import "../css/Ing_finish.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, type ChangeEvent } from "react";
import { useAppSelector } from "../../store/hooks";
import { encodePolyline } from "../../utils/encodePolyline";
import { captureStaticMapThumbnail } from "../../utils/captureStaticMapThumbnail";

interface IngFinishProps {
  totalDistance: number;
  elapsedTime: number;
  trackedPoints: kakao.maps.LatLng[];
  formatTime: (seconds: number) => string;
  tab?: "basic" | "course";
}

export default function Ing_finish({
  totalDistance,
  elapsedTime,
  trackedPoints,
  formatTime,
  tab,
}: IngFinishProps) {
  const navigate = useNavigate();
  const [Title, setTitle] = useState("");
  const { user } = useAppSelector((state) => state.user);
  const [routeThumbnailUrl, setRouteThumbnailUrl] = useState<string>("");
  const [encodedPolyline, setEncodedPolyline] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 평균 페이스 계산 (km/h)
  const avgPace =
    elapsedTime > 0 ? totalDistance / 1000 / (elapsedTime / 3600) : 0;

  const routeTitle = Title || `${new Date().toLocaleDateString()} 런닝`;

  const originalPoints = trackedPoints
    .filter(
      (point) =>
        point &&
        typeof point.getLat === "function" &&
        typeof point.getLng === "function"
    )
    .map((pos: kakao.maps.LatLng) => {
      try {
        return {
          lat: pos.getLat(),
          lng: pos.getLng(),
        };
      } catch (error) {
        console.error("포인트 변환 오류:", error);
        return null;
      }
    })
    .filter((point): point is { lat: number; lng: number } => point !== null);

  // 썸네일 + 인코딩 생성 함수
  const saveRouteThumbnail = async (points: { lat: number; lng: number }[]) => {
    try {
      const encoded = encodePolyline(points);
      const thumbnailUrl = await captureStaticMapThumbnail(encoded);
      setRouteThumbnailUrl(thumbnailUrl ?? "");
      setEncodedPolyline(encoded);
    } catch (error) {
      console.error("경로 인코딩 또는 썸네일 생성 오류:", error);
      setRouteThumbnailUrl("");
      setEncodedPolyline("");
    }
  };

  // 페이지 진입 시 썸네일 미리 생성
  useEffect(() => {
    if (originalPoints.length > 0) {
      saveRouteThumbnail(originalPoints);
    }
  }, []);

  // 경로 저장 함수
  const saveRoute = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (!user || !user.userIdx) {
        alert("로그인이 필요합니다.");
        setSaving(false);
        return;
      }
      if (!trackedPoints || trackedPoints.length === 0) {
        alert("경로 데이터가 없습니다.");
        setSaving(false);
        return;
      }
      if (!encodedPolyline || !routeThumbnailUrl) {
        alert("썸네일 생성이 완료되지 않았습니다. 잠시만 기다려주세요.");
        setSaving(false);
        return;
      }

      const startPoint = originalPoints[0];
      const endPoint = originalPoints[originalPoints.length - 1];
      const totalTimeInSeconds = elapsedTime;

      const routeData = {
        userIdx: user.userIdx,
        routeTitle,
        routeTotalKm: parseFloat((totalDistance / 1000).toFixed(3)),
        routeTotalTime: totalTimeInSeconds,
        routePolyline: encodedPolyline,
        routeStartLat: parseFloat(startPoint.lat.toFixed(7)),
        routeStartLng: parseFloat(startPoint.lng.toFixed(7)),
        routeEndLat: parseFloat(endPoint.lat.toFixed(7)),
        routeEndLng: parseFloat(endPoint.lng.toFixed(7)),
        routeThumbnail: routeThumbnailUrl,
        routeDifficulty: "초급",
      };

      const apiUrl = import.meta.env.VITE_APP_API_URL;
      if (!apiUrl) {
        alert("API URL이 설정되지 않았습니다.");
        setSaving(false);
        return;
      }

      const response = await fetch(`${apiUrl}/api/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage: string =
          errorData && typeof errorData.message === "string"
            ? errorData.message
            : `서버 오류 (${response.status})`;
        throw new Error(errorMessage);
      }

      alert("경로가 성공적으로 저장되었습니다!");
      navigate("/map");
    } catch (error) {
      console.error("경로 저장 오류:", error);
      if (error instanceof Error) {
        alert(`경로 저장에 실패했습니다. 오류: ${error.message}`);
      } else {
        alert("경로 저장에 실패했습니다. 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="finish_section">
      <div className="finish_map">
        {routeThumbnailUrl ? (
          <img
            src={`${
              import.meta.env.VITE_APP_API_URL
            }/api/public${routeThumbnailUrl}`}
            alt="경로 썸네일"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              background: "#eee",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            썸네일 생성 중...
          </div>
        )}
      </div>
      <div className="finish_wrapper">
        <div className="finish_content">
          <div>
            <p className="finish_label">총 시간</p>
            <div>
              <span className="finish_state">{formatTime(elapsedTime)}</span>
            </div>
          </div>
          <div>
            <p className="finish_label">총 거리</p>
            <div>
              <span className="finish_state">
                {(totalDistance / 1000).toFixed(2)}
              </span>
              <span className="unit"> km</span>
            </div>
          </div>
          <div>
            <p className="finish_label">평균페이스</p>
            <div>
              <span className="finish_state">{avgPace.toFixed(2)}</span>
              <span className="unit"> km/h</span>
            </div>
          </div>
        </div>
        <div className="finish_input">
          <p>제목</p>
          <input
            id="course_title"
            className="course_title"
            type="text"
            value={Title}
            onChange={handleTitleChange}
            placeholder="경로 제목을 입력하세요 (선택)"
          />
        </div>
        <div className="finish_btns">
          {tab === "basic" ? (
            <>
              <div
                className="btn btn_two finish_btn"
                onClick={saveRoute}
                style={{
                  opacity: saving ? 0.5 : 1,
                  pointerEvents: saving ? "none" : "auto",
                }}
              >
                {saving ? "저장 중..." : "경로 저장하기"}
              </div>
              <div
                className="btn btn_one finish_btn"
                onClick={() => navigate("/map")}
              >
                러닝 기록만 저장
              </div>
            </>
          ) : (
            <div
              className="btn btn_one finish_btn"
              onClick={() => navigate("/map")}
            >
              러닝 기록 저장
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
