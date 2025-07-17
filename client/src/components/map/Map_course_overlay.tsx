import "../css/Map_course_overlay.css";
import { dummyData } from "../dummydate";
import arrow_back from "../../assets/arrow_back.png";
import { useNavigate } from "react-router-dom";

export default function Map_course_overlay({
  routeId,
  btnTitle,
  handleHideOverlay,
}: {
  routeId: number;
  btnTitle: "오늘의 추천 경로" | "경로 따라 달리기" | "최근 경로 달리기";
  handleHideOverlay: () => void;
}) {
  const navigate = useNavigate();
  const route = dummyData.find((item) => item.id === routeId) ?? dummyData[0];

  return (
    <div className="overlay_section">
      <div className="overlay_map">
        <img src={route.image} alt={route.title} />
      </div>
      <div className="overlay_wrapper">
        <div className="arrow_back" onClick={handleHideOverlay}>
          <img src={arrow_back} alt="뒤로가기" />
        </div>
        <div className="overlay_title">
          <p>{btnTitle}</p>
        </div>
        <div className="overlay_content">
          <p>{btnTitle}는 시작 후 </p>
          <p>12시간이 지나면 자동으로 종료돼요 </p>
        </div>
        <div
          className="btn btn_two overlay_btn"
          onClick={() => {
            navigate("/map/ing");
          }}
        >
          시 작
        </div>
      </div>
    </div>
  );
}
