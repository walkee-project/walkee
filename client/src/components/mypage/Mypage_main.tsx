import "../css/Mypage_main.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchUser } from "../../store/userSlice";
import type { mypage_props } from "../../types/mypage_type";
import profile from "../../assets/profile.png";
import arrow from "../../assets/arrow_right.png";
import { fetchUserSummary } from "../../utils/api";

export default function Mypage_main({ onChangeSection }: mypage_props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  const [summary, setSummary] = useState({
    routeCount: 0,
    likeCount: 0,
    postCount: 0,
  });

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 정보 로드
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      fetchUserSummary(user.userIdx).then(setSummary).catch(console.error);
    }
  }, [user]);

  // 로딩 중일 때 표시
  if (loading) {
    return <div className="main">로딩 중...</div>;
  }

  // 에러가 있을 때 표시
  if (error) {
    return <div className="main">에러: {error}</div>;
  }

  // 사용자 정보가 없을 때 표시
  if (!user) {
    return <div className="main">사용자 정보를 불러올 수 없습니다.</div>;
  }

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
          <p>총 {summary.routeCount}개 경로 |</p>
          <p>찜 {summary.likeCount}개 |</p>
          <p>게시글 {summary.postCount}개</p>
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
