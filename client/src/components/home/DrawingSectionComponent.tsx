import { useNavigate } from "react-router-dom";
import MapComponent from "../map/MapComponent";
import { useAppSelector } from "../../store/hooks";

function DrawingSectionComponent() {
  const summary = useAppSelector((state) => state.user.summary);

  const navigate = useNavigate();

  const handleStartDrawing = () => {
    navigate("/map");
  };

  const handleMyCourse = () => {
    navigate("/courseList", {
      state: { sectionType: "mycourse", userRoute: summary?.userRoute },
    });
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
          {summary?.userRoute &&
          summary.userRoute.length > 0 &&
          summary.userRoute[0].routeThumbnail ? (
            <img
              src={`api/public${summary.userRoute[0].routeThumbnail}`}
              alt="내그림보기"
            />
          ) : (
            <div className="drawing_empty_text">그림을 그려보세요!</div>
          )}
        </div>
        <div className="btn btn_one home_btn" onClick={handleMyCourse}>
          내그림보기
        </div>
      </div>
    </div>
  );
}

export default DrawingSectionComponent;
