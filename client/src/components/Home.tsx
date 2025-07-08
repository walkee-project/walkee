import "./css/Home.css";
import mascot_long from "../assets/mascot_long.png";
import homeMap_ex1 from "../assets/homeMap_ex1.png";
import homeMap_ex2 from "../assets/homeMap_ex2.png";
import homeMap_ex3 from "../assets/homeMap_ex3.png";
import arrow_right from "../assets/arrow_right.png";
import { useDynamicGap } from "./hooks/useDynamicGap";
import { useWeather } from "./hooks/useWeather";
import { useState, useEffect } from "react";

interface UserInfo {
  userIdx: number;
  userProvider: string;
  userId: string;
  userEmail: string;
  userName: string;
  userProfile: string;
  userPoint: number;
}

function Home() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { containerRef, getSectionRef, gap, padding } = useDynamicGap(
    3,
    10,
    100
  );
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
  } = useWeather();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/profile", {
          credentials: "include", // 쿠키 자동 첨부
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const userData = await res.json();
        setUser(userData);
      } catch {
        // 인증 실패 처리
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = () => {
    window.location.href = "/";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="main_container"
      ref={containerRef}
      style={{
        gap: `${gap}px`,
        padding: `${padding}px 16px`,
      }}
    >
      {/* 상단 인사 영역 */}
      <div className="greeting_card" ref={getSectionRef(0)}>
        <p className="hello_text">Hi, {user ? user.userName : "게스트"}!</p>
        {!user && (
          <div style={{ marginBottom: "10px" }}>
            <button onClick={handleLogin}>로그인</button>
          </div>
        )}
        <div className="weather_container">
          <div className="mascot_section">
            <img src={mascot_long} alt="마스코트" className="mascot_img" />
          </div>
          <div className="weather_section">
            {weatherLoading ? (
              <p>날씨 정보를 불러오는 중...</p>
            ) : weatherError ? (
              <p>{weatherError}</p>
            ) : weather ? (
              <>
                <div className="location_weather">
                  <div className="weather_icon">
                    <img src={weather.iconUrl} alt="날씨" />
                  </div>
                  <p>{weather.location}</p>
                </div>
                <p className="weather_detail">
                  현재 온도 : {weather.temperature}도 | 강수량 :{" "}
                  {weather.precipitation}mm
                </p>
                <p className="weather_comment">{weather.comment}</p>
              </>
            ) : (
              <p>날씨 정보를 불러오지 못했어요.</p>
            )}
          </div>
        </div>
      </div>

      {/* 추천코스 영역 */}
      <div className="recommend_section" ref={getSectionRef(1)}>
        <div className="recommend_title">
          <div>
            오늘의 추천코스 <span>대구 스타디움 동그라미런</span>
          </div>
          <img src={arrow_right} alt="화살표" />
        </div>
        <div className="recommend_img">
          <img src={homeMap_ex1} alt="추천코스" />
          <div className="recommend_detail">
            <p>1.5km</p>
            <p>20분</p>
            <p>초급난이도</p>
          </div>
        </div>
      </div>

      {/* 새그리기 / 내그림보기 */}
      <div className="drawing_section" ref={getSectionRef(2)}>
        <div className="drawing_card">
          <div className="drawing_img">
            <img src={homeMap_ex2} alt="새그리기" />
          </div>
          <div className="home_btn">새그림그리기</div>
        </div>
        <div className="drawing_card">
          <div className="drawing_img">
            <img src={homeMap_ex3} alt="내그림보기" />
          </div>
          <div className="home_btn">내그림보기</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
