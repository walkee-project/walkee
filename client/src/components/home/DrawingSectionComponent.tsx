import { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeMap_ex3 from "../../assets/homeMap_ex3.png";
import MapComponent from "../map/MapComponent";
import MyRoutesComponent from "../map/MyRoutesComponent"; // 내 경로 보기 컴포넌트

function DrawingSectionComponent() {
  const navigate = useNavigate();
  const [showMyRoutes, setShowMyRoutes] = useState(false);

  const handleStartDrawing = () => {
    navigate("/map");
  };

  const handleShowMyRoutes = () => {
    setShowMyRoutes(true);
  };

  const handleCloseMyRoutes = () => {
    setShowMyRoutes(false);
  };

  return (
    <>
      <div className="drawing_section">
        <div className="drawing_card">
          <div className="drawing_img">
            <MapComponent />
          </div>
          <div
            className="home_btn"
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
          <div
            className="home_btn"
            onClick={handleShowMyRoutes}
            style={{ cursor: "pointer" }}
          >
            내그림보기
          </div>
        </div>
      </div>

      {/* 내 경로 보기 모달 */}
      {showMyRoutes && <MyRoutesComponent onClose={handleCloseMyRoutes} />}
    </>
  );
}

export default DrawingSectionComponent;
