import "../css/Mypage_main.css";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import type { mypage_props } from "../types/mypage_type";
import profile from "../../assets/profile.png";
import arrow from "../../assets/arrow_right.png";
import { api } from "../../utils/api";
import Loading from "../Loading";

export default function Mypage_main({ onChangeSection }: mypage_props) {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const summary = useAppSelector((state) => state.user.summary);
  const loading = useAppSelector((state) => state.user.loading);
  const error = useAppSelector((state) => state.user.error);

  //로딩 중일 때 표시
  if (loading) {
    return <Loading />;
  }

  // 에러가 있을 때 표시
  if (error) {
    return <div className="main">에러: {error}</div>;
  }

  // 사용자 정보가 없을 때 표시
  if (!user) {
    return <div className="main">사용자 정보를 불러올 수 없습니다.</div>;
  }

  const handleUserOut = async () => {
    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;
    try {
      await fetch(`${__API_URL__}/users/${user.userIdx}`, { method: "DELETE" });
      // 로그아웃 처리 및 메인/로그인 페이지로 이동
      navigate("/");
    } catch {
      alert("회원탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate("/"); // 로그아웃 후 메인/로그인 페이지로 이동
    } catch {
      alert("로그아웃 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="main">
      <div className="profile_card">
        <img
          src={user.userProfile || profile}
          alt="프로필"
          className="profile_img"
        />
        <div className="profile_info">
          <div className="nickname_row">
            <span className="nickname">{user.userName}</span>
            <button
              className="edit_btn"
              onClick={() => onChangeSection("edit")}
            >
              수정
            </button>
          </div>
          <div className="join_date">
            가입일 :{" "}
            {user.userCreatedAt
              ? new Date(user.userCreatedAt)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\. /g, ".")
                  .replace(/\.$/, "")
              : "-"}
          </div>
        </div>
        <div className="counts">
          <p>
            총{" "}
            {Array.isArray(summary?.userRoute) ? summary.userRoute.length : 0}개
            경로 |
          </p>
          <p>
            찜{" "}
            {Array.isArray(summary?.userRouteLike)
              ? summary.userRouteLike.length
              : 0}
            개 |
          </p>
          <p>
            게시글{" "}
            {Array.isArray(summary?.userPost) ? summary.userPost.length : 0}개
          </p>
        </div>
      </div>

      <div className="menu_list">
        <div
          className="menu_item"
          onClick={() =>
            navigate("/courseList", {
              state: { sectionType: "mycourse" },
            })
          }
        >
          <p>내 경로</p>
          <img src={arrow} alt="화살표" />
        </div>
        <div
          className="menu_item"
          onClick={() =>
            navigate("/courseList", {
              state: { sectionType: "wishlist" },
            })
          }
        >
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
          <span className="logout" onClick={handleLogout}>
            로그아웃
          </span>
          <span className="userout" onClick={handleUserOut}>
            회원탈퇴
          </span>
        </div>
      </div>
    </div>
  );
}
