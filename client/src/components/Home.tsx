import "./css/Home.css";
import "../components/css/Header.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { fetchUser } from "../store/userSlice";
import WeatherComponent from "./home/WeatherComponent";
import RecommendCourseComponent from "./home/RecommendCourseComponent";
import DrawingSectionComponent from "./home/DrawingSectionComponent";
import Header from "./Header";
import bell from "../assets/bell_icon.svg";

function Home({ routeId }: { routeId: number }) {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);

  // useEffect(() => {
  //   dispatch(fetchUser());
  // }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main_container">
      <Header
        title="홈"
        rightIcons={[
          {
            icon: <img src={bell} alt="bell icon" />,
            onClick: () => console.log("알림"),
          },
        ]}
      />
      {/* 상단 인사 영역 */}
      <div className="greeting_card">
        <p className="hello_text">Hi, {user ? user.userName : "게스트"}!</p>
        <WeatherComponent />
      </div>

      {/* 추천코스 영역 */}
      <div>
        <RecommendCourseComponent routeId={routeId} />
      </div>

      {/* 새그리기 / 내그림보기 */}
      <div>
        <DrawingSectionComponent />
      </div>
    </div>
  );
}

export default Home;
