import "../css/Mypage_purchase.css";
import Construction from "../Construction";
import type { mypage_props } from "../types/mypage_type";
import arrow_back from "../../assets/arrow_back.png";

export default function Mypage_purchase({ onChangeSection }: mypage_props) {
  return (
    <div className="purchase">
      <button onClick={() => onChangeSection("main")} className="back_btn">
        <img src={arrow_back} alt="back_arrow" />
      </button>
      <div className="purchase_header">
        <p>구매목록</p>
      </div>

      <div className="purchase_section">
        <Construction />
      </div>
    </div>
  );
}
