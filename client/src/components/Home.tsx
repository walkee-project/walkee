import "./css/Home.css";
import "../components/css/Header.css";
import WeatherComponent from "./home/WeatherComponent";
import RecommendCourseComponent from "./home/RecommendCourseComponent";
import DrawingSectionComponent from "./home/DrawingSectionComponent";
import Header from "./Header";
import bell from "../assets/bell_icon.svg";
import { useAppSelector } from "../store/hooks";
import Loading from "./Loading";

const Home = () => {
  const routeList = useAppSelector((state) => state.user.allRoute);

  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return <Loading />;
  }

  // summary?.userRoute, summary?.userRouteLike, summary?.userPost 등 사용 가능

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
        <RecommendCourseComponent routeList={routeList} />
      </div>

      {/* 새그리기 / 내그림보기 */}
      <div>
        <DrawingSectionComponent />
      </div>
    </div>
  );
};

export default Home;
