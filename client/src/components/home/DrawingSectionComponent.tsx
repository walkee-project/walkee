import { useNavigate } from "react-router-dom";
import homeMap_ex3 from "../../assets/homeMap_ex3.png";
import MapComponent from "../map/MapComponent";

function DrawingSectionComponent() {
  const navigate = useNavigate();

  const handleStartDrawing = () => {
    navigate("/map");
  };

  const handleMyCourse = () => {
    navigate("/courseList", { state: { section: "mycourse" } });
  };

  return (
    <div className="drawing_section">
      <div className="drawing_card">
        <div className="drawing_img">
          <MapComponent />
        </div>
        <div
          className="btn btn_one home_btn"
          id="start-drawing"
          onClick={handleStartDrawing}
          style={{ cursor: "pointer" }}
        >
          새그림그리기
        </div>
      </div>

      <div className="drawing_card">
        <div className="drawing_img">
          <img src={homeMap_ex3} alt="내그림보기" />
        </div>
        <div className="btn btn_one home_btn" onClick={handleMyCourse}>
          내그림보기
        </div>
      </div>
    </div>
  );
}

export default DrawingSectionComponent;
