import { useParams, useNavigate } from "react-router-dom";
import "../css/Community_detail.css";
import sampleImage from "../../assets/ex2.jpg"; // 예시 이미지 경로
import profile from "../../assets/profile.png";

const Community_detail = () => {
  const { id } = useParams(); // 게시물 ID
  const navigate = useNavigate();

  return (
    <div className="detail-container">
      {/* 상단 헤더 */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="detail-actions">
          <button>🔔</button>
          <button>⋯</button>
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="detail-content">
        <div className="detail-writer">
          <div className="writer-profile">
            <img src={profile} alt="작성자 프로필" className="writer-img" />
            <p className="writer-name">푸른달걀</p>
          </div>
          <p className="writer-meta">3초전</p>
        </div>
        <h2 className="detail-title">산책가기 싫은 댕댕이</h2>
        <p className="detail-text">*내용*산책가기 싫은 댕댕이</p>
        <img src={sampleImage} className="detail-image" alt="sample" />

        <div className="detail-stats">👁 2명이 봤어요</div>

        <div className="detail-actions-btns">
          <button>👍 공감하기</button>
          <button>📎 저장</button>
        </div>

        <div className="detail-comments">
          <h4>댓글 0</h4>
          <p className="no-comments">
            아직 댓글이 없어요.
            <br />
            가장 먼저 댓글을 남겨보세요.
          </p>
        </div>
      </main>

      {/* 하단 댓글 입력창 */}
      <footer className="detail-footer">
        <input type="text" placeholder="댓글을 입력해주세요." />
      </footer>
    </div>
  );
};

export default Community_detail;
