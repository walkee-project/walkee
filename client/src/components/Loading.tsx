import "./css/Loading.css";
import mascot from "../assets/mascot_long.png";

export default function Loading() {
  return (
    <div className="loading">
      <p>Loading...</p>
      <div className="load_box">
        <div className="bar_container">
          <div className="bar_bg" />
          <img src={mascot} alt="마스코트" className="bar_mascot" />
        </div>
      </div>
    </div>
  );
}
