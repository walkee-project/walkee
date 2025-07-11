// src/components/map/MyRoutesComponent.tsx
import { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";

interface RouteInfo {
  routeIdx: number;
  routeTitle: string;
  routeDescription?: string;
  routeTotalKm: number;
  routeTotalTime: number;
  routeStartLat: number;
  routeStartLng: number;
  routeEndLat: number;
  routeEndLng: number;
  routeRunCount: number;
  routeThumbnail?: string;
  routeCreatedAt: string;
}

interface MyRoutesComponentProps {
  onClose: () => void;
}

function MyRoutesComponent({ onClose }: MyRoutesComponentProps) {
  const { user } = useAppSelector((state) => state.user);
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalDistance: 0,
    totalTime: 0,
    averageDistance: 0,
    averageTime: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchMyRoutes = async () => {
      try {
        console.log("내 경로 조회 시작");

        // 내 경로 조회
        const routesResponse = await fetch("/api/routes/my", {
          headers: {
            "user-id": user.userIdx.toString(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("경로 조회 응답:", routesResponse.status);

        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          console.log("조회된 경로:", routesData);
          setRoutes(routesData);
        } else {
          console.error("경로 조회 실패:", await routesResponse.text());
        }

        // 내 통계 조회
        const statsResponse = await fetch("/api/routes/stats", {
          headers: {
            "user-id": user.userIdx.toString(),
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log("조회된 통계:", statsData);
          setStats(statsData);
        } else {
          console.error("통계 조회 실패:", await statsResponse.text());
        }
      } catch (error) {
        console.error("내 경로 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRoutes();
  }, [user]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
    } else if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    } else {
      return `${remainingSeconds}초`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div style={{ color: "white", fontSize: "18px" }}>
          내 경로를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "white",
        zIndex: 1000,
        overflow: "auto",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          position: "sticky",
          top: 0,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1001,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
          내 러닝 기록
        </h2>
        <button
          onClick={onClose}
          style={{
            padding: "8px 16px",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            color: "white",
            fontSize: "14px",
          }}
        >
          닫기
        </button>
      </div>

      {/* 통계 섹션 */}
      <div
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          margin: "20px",
          borderRadius: "15px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>
          📊 나의 러닝 통계
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "15px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#4285f4" }}
            >
              {stats.totalRoutes}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>총 경로</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#34a853" }}
            >
              {stats.totalDistance}km
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>총 거리</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#ea4335" }}
            >
              {formatTime(stats.totalTime)}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>총 시간</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{ fontSize: "24px", fontWeight: "bold", color: "#fbbc05" }}
            >
              {stats.averageDistance}km
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>평균 거리</div>
          </div>
        </div>
      </div>

      {/* 경로 목록 */}
      <div style={{ padding: "0 20px 20px" }}>
        <h3 style={{ margin: "20px 0 15px 0", color: "#333" }}>
          🏃‍♂️ 내 경로 목록
        </h3>

        {routes.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
              backgroundColor: "#f8f9fa",
              borderRadius: "15px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>🏃‍♂️</div>
            <p>아직 저장된 경로가 없습니다.</p>
            <p>새로운 러닝을 시작해보세요!</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            {routes.map((route) => (
              <div
                key={route.routeIdx}
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      color: "#333",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {route.routeTitle}
                  </h4>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      backgroundColor: "#f0f0f0",
                      padding: "4px 8px",
                      borderRadius: "10px",
                    }}
                  >
                    {formatDate(route.routeCreatedAt)}
                  </span>
                </div>

                {route.routeDescription && (
                  <p
                    style={{
                      margin: "0 0 15px 0",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    {route.routeDescription}
                  </p>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                    gap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#4285f4",
                      }}
                    >
                      {route.routeTotalKm}km
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>거리</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#34a853",
                      }}
                    >
                      {formatTime(route.routeTotalTime)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>시간</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#ea4335",
                      }}
                    >
                      {route.routeRunCount}회
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>실행</div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#fbbc05",
                      }}
                    >
                      {Math.round(
                        (route.routeTotalKm / (route.routeTotalTime / 60)) * 100
                      ) / 100}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>km/분</div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#4285f4",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    경로 보기
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#34a853",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    다시 뛰기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRoutesComponent;
