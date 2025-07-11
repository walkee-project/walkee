import "./css/Home.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUser } from "../store/userSlice";
import { useDynamicGap } from "./hooks/useDynamicGap";
import WeatherComponent from "./home/WeatherComponent";
import RecommendCourseComponent from "./home/RecommendCourseComponent";
import DrawingSectionComponent from "./home/DrawingSectionComponent";

function Home() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const { containerRef, getSectionRef, gap, padding } = useDynamicGap(
    3,
    10,
    40
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

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
        <WeatherComponent />
      </div>

      {/* 추천코스 영역 */}
      <div ref={getSectionRef(1)}>
        <RecommendCourseComponent />
      </div>

      {/* 새그리기 / 내그림보기 */}
      <div ref={getSectionRef(2)}>
        <DrawingSectionComponent />
      </div>
    </div>
  );
}

export default Home;
