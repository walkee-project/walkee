// DeleteAccountPage.tsx
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import "./css/DeleteAccountPage.css";
import "./css/DeleteAccountPage.css";

export const DeleteAccountPage = () => {
  const navigate = useNavigate();
  const userIdx = useAppSelector((state) => state.user.user?.userIdx);

  const handleDelete = async () => {
    if (!userIdx) {
      alert("로그인 정보가 없습니다. 로그인 후 이용해 주세요.");
      return;
    }
    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;

    try {
      const res = await fetch(`${__API_URL__}/users/${userIdx}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // 토큰 삭제 등 추가 처리
        alert("회원탈퇴가 완료되었습니다.");
        navigate("/");
      } else {
        alert("회원탈퇴에 실패했습니다.");
      }
    } catch {
      alert("오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  return (
    <div className="delete-account-container">
      <div className="delete-account-card">
        <div className="warning-icon">⚠️</div>
        <h1 className="delete-title">회원탈퇴</h1>
        <div className="warning-message">
          <p>계정을 삭제하면 다음 정보들이 영구적으로 삭제됩니다:</p>
          <ul>
            <li>• 개인정보 및 프로필</li>
            <li>• 작성한 게시글 및 댓글</li>
            <li>• 저장한 경로 및 찜 목록</li>
            <li>• 구매 내역</li>
          </ul>
          <p className="final-warning">
            <strong>삭제된 정보는 복구할 수 없습니다.</strong>
          </p>
        </div>
        <div className="button-group">
          <button className="cancel-btn" onClick={handleCancel}>
            취소
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
            disabled={!userIdx}
            style={{
              opacity: userIdx ? 1 : 0.5,
              cursor: userIdx ? "pointer" : "not-allowed",
            }}
          >
            회원탈퇴
          </button>
        </div>
        {!userIdx && (
          <div style={{ color: "#e74c3c", marginTop: 20, fontWeight: 600 }}>
            로그인 후 이용해 주세요.
          </div>
        )}
      </div>
    </div>
  );
};
