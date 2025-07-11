import "./css/Mypage_main.css";
import { useNavigate } from "react-router-dom";
import profile from "../assets/profile.png";
import arrow from "../assets/arrow_right.png";

type Props = {
  onChangeSection: (section: string) => void;
};

export default function Mypage_main({ onChangeSection }: Props) {
  const navigate = useNavigate();

  return (
    <div className="main">
      <div className="profile_card">
        <img src={profile} alt="프로필" className="profile_img" />
        <div className="profile_info">
          <div className="nickname_row">
            <span className="nickname">푸른달갈</span>
            <button
              className="edit_btn"
              onClick={() => onChangeSection("edit")}
            >
              수정
            </button>
          </div>
          <div className="join_date">가입일 : 2025.07.08</div>
        </div>
        <div className="counts">
          <p>총 12개 경로 |</p>
          <p> 찜 4개 |</p>
          <p> 게시글 3개</p>
        </div>
      </div>

      <div className="menu_list">
        <div className="menu_item" onClick={() => onChangeSection("mycourse")}>
          <p>내 경로</p>
          <img src={arrow} alt="화살표" />
        </div>
        <div className="menu_item" onClick={() => onChangeSection("wishlist")}>
          <p>찜한 경로</p>
          <img src={arrow} alt="화살표" />
        </div>
        <div className="menu_item" onClick={() => onChangeSection("posts")}>
          <p>게시글</p>
          <img src={arrow} alt="화살표" />
        </div>
        <div className="menu_item" onClick={() => onChangeSection("purchase")}>
          <p>구매목록</p>
          <img src={arrow} alt="화살표" />
        </div>
      </div>

      <div className="bottom_links">
        <span className="terms">이용약관 및 보안</span>
        <div className="btn_user">
          <span className="logout" onClick={() => navigate("/")}>
            로그아웃
          </span>
          <span className="userout" onClick={() => navigate("/")}>
            회원탈퇴
          </span>
        </div>
      </div>
    </div>
  );
}
