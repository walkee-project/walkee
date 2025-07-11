import homeMap_ex1 from "../../assets/homeMap_ex1.png";
import arrow_right from "../../assets/arrow_right.png";

function RecommendCourseComponent() {
  return (
    <div className="recommend_section">
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
  );
}

export default RecommendCourseComponent;
