import "../css/Ing_finish.css";
import ex from "../../assets/map_ex4.png";
import { useNavigate } from "react-router-dom";

export default function Ing_finish() {
  const navigate = useNavigate();

  return (
    <div className="finish_section">
      <div className="finish_map">
        <img src={ex} alt="ex" />
      </div>
      <div className="finish_wrapper">
        <div className="finish_content">
          <div>
            <p className="finish_label">총 시간</p>
            <div>
              <span className="finish_state">32:34</span>
            </div>
          </div>
          <div>
            <p className="finish_label">총 거리</p>
            <div>
              <span className="finish_state">2.58</span>
              <span className="unit"> km</span>
            </div>
          </div>
          <div>
            <p className="finish_label">평균페이스</p>
            <div>
              <span className="finish_state">4.69</span>
              <span className="unit"> km/h</span>
            </div>
          </div>
        </div>
        <div className="finish_input">
          <p>제목</p>
          <input type="text" placeholder="경로 제목을 입력하세요 (선택)" />
        </div>
        <div className="finish_btns">
          <div
            className="btn btn_two finish_btn"
            onClick={() => {
              navigate("/map");
            }}
          >
            경로 저장하기
          </div>
          <div
            className="btn btn_one finish_btn"
            onClick={() => {
              navigate("/map");
            }}
          >
            러닝 기록만 저장
          </div>
        </div>
      </div>
    </div>
  );
}
