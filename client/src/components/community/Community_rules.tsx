import React from "react";
import { useNavigate } from "react-router-dom";
import back from "../../assets/arrow_back.png";

const Community_Rules: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  return (
    <section style={{ padding: "20px", lineHeight: "1.7", fontSize: "15px" }}>
      {/* ← 뒤로가기 버튼 */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
          height: "40px", // 버튼 높이 고려해서 높이 확보
        }}
      >
        {/* 뒤로가기 버튼: 왼쪽에 고정 */}
        <button
          onClick={handleBack}
          style={{
            position: "absolute",
            left: 0,
            background: "none",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <img
            src={back}
            alt="뒤로가기"
            style={{ width: "15px", height: "15px" }}
          />
        </button>

        {/* 제목은 중앙에 위치 */}
        <h1 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
          💌 커뮤니티 이용 가이드
        </h1>
      </div>

      <p style={{ marginBottom: "20px" }}>
        안녕하세요, <strong>WALKEE</strong> 팀입니다 😊 <br />
        우리 커뮤니티가 <strong>재미있고 건강한 공간</strong>이 되도록 <br />
        아래 내용을 꼭 확인해주세요!
      </p>

      <hr style={{ margin: "20px 0" }} />

      <h2 style={{ fontWeight: "bold", fontSize: "17px" }}>📌 이용 수칙</h2>

      <ol style={{ paddingLeft: "18px" }}>
        <li style={{ marginBottom: "12px" }}>
          <strong>타인을 불쾌하게 하는 게시물은 금지 ❌</strong>
          <br />
          욕설, 비방, 혐오 표현, 음란물 등은 <br />
          <strong>사전 통보 없이 삭제</strong>될 수 있어요.
        </li>
        <li style={{ marginBottom: "12px" }}>
          <strong>광고/홍보 목적의 글은 금지 🛑</strong>
          <br />
          다이어트 제품, 특정 서비스 등 반복 홍보는 <br />
          <strong>삭제</strong> 대상이에요.
        </li>
        <li style={{ marginBottom: "12px" }}>
          <strong>같은 글 반복 업로드 금지 📵</strong>
          <br />
          도배성 글은 <strong>운영 방해로 간주</strong>되어 <br />
          삭제될 수 있어요.
        </li>
        <li style={{ marginBottom: "12px" }}>
          <strong>서비스 운영 방해 행위는 금지 🚫</strong>
          <br />
          관리자 사칭, 시스템 오류 유도, 허위정보 유포 시 <br />
          <strong>이용 제한 또는 탈퇴</strong> 조치됩니다.
        </li>
      </ol>

      <hr style={{ margin: "20px 0" }} />

      <h2 style={{ fontWeight: "bold", fontSize: "17px" }}>🧹 운영 방침</h2>
      <ul style={{ paddingLeft: "18px", marginBottom: "30px" }}>
        <li style={{ marginBottom: "10px" }}>
          운영진은 커뮤니티를 수시로 모니터링하며, <br />
          규칙 위반 시<strong> 안내 없이 게시글을 삭제</strong>할 수 있어요.
        </li>
        <li>
          반복 위반 시 <strong>이용 제한 또는 회원 탈퇴</strong>
          <br /> 처리될 수 있습니다.
        </li>
      </ul>

      <p>
        함께 만드는 즐거운 <strong>WALKEE</strong> 커뮤니티! <br />
        여러분의 협조에 감사드려요 😊
      </p>
    </section>
  );
};

export default Community_Rules;
