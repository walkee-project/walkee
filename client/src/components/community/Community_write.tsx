///Community_write.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Community_write.css";
import photo from "../../assets/photo.svg";
import location from "../../assets/location.svg";

import useKeyboardAwareToolbar from "../hooks/useKeyboardAwareToolbar";
import ConfirmExitModal from "./ConfirmExitModal";

const Community_write = () => {
  useKeyboardAwareToolbar();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="write-container">
      {showConfirm && (
        <ConfirmExitModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => navigate(-1)}
        />
      )}

      <header className="write-header">
        <button className="write-close" onClick={() => setShowConfirm(true)}>
          ✕
        </button>
        <span className="write-title">글쓰기</span>
        <button className="write-submit">완료</button>
      </header>

      {/* 글쓰기 내용 영역 */}
      <main className="write-body">
        <div className="write-warning">
          <strong>안내</strong> 운영 정책에 위배되는 글은 관리자에 의해 삭제될
          수 있어요.
        </div>

        <input className="write-input-title" placeholder="제목을 입력하세요." />
        <textarea className="write-textarea" placeholder="내용을 입력하세요." />
      </main>

      {/* 하단 고정 툴바 */}
      <footer className="write-footer">
        <button>
          <img src={photo} />
          <h5>사진</h5>
        </button>
        <button>
          <img src={location} /> <h5>장소</h5>
        </button>
      </footer>
    </div>
  );
};

export default Community_write;
