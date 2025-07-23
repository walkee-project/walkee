///Community_write.tsx
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useAppSelector } from "../../store/hooks";
import "../css/Community_write.css";
import photo from "../../assets/photo.svg";
import location from "../../assets/location.svg";
import useKeyboardAwareToolbar from "../hooks/useKeyboardAwareToolbar";
import ConfirmExitModal from "../ConfirmExitModal";

const Community_write = () => {
  useKeyboardAwareToolbar();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const [showConfirm, setShowConfirm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [locationText, setLocationText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // 사진 선택 핸들러
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 위치(장소) 자동 입력
  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // 카카오 REST API로 역지오코딩
        try {
          const res = await fetch(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
            {
              headers: {
                Authorization: `KakaoAK ${
                  import.meta.env.VITE_KAKAO_REST_API_KEY
                }`,
              },
            }
          );
          const data = await res.json();
          const address =
            data.documents?.[0]?.address?.address_name ||
            data.documents?.[0]?.road_address?.address_name ||
            `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          // '시 구 동'까지만 표시
          const shortAddress = address.split(" ").slice(0, 3).join(" ");
          setLocationText(shortAddress);
        } catch {
          setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      },
      (err) => {
        alert(err + "위치 정보를 가져올 수 없습니다.");
      }
    );
  };

  // 글 등록
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (!user?.userIdx) {
      alert("로그인이 필요합니다.");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        // 이미지 업로드 (엔드포인트는 예시)
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch(`${__API_URL__}/posts/upload-image`, {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.url; // 서버에서 반환하는 이미지 경로
        } else {
          alert("이미지 업로드 실패");
          setLoading(false);
          return;
        }
      }
      // 게시글 등록
      const postRes = await fetch(`${__API_URL__}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIdx: user.userIdx,
          postTitle: title,
          postContent: content,
          postUploadImg: imageUrl,
          postLocation: locationText,
        }),
      });
      if (postRes.ok) {
        alert("게시글이 등록되었습니다!");
        navigate("/community");
      } else {
        alert("게시글 등록 실패");
      }
    } catch {
      alert("오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="write-container">
      {showConfirm && (
        <ConfirmExitModal
          where="Community"
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => navigate("/home")}
        />
      )}

      <header className="write-header">
        <button className="write-close" onClick={() => setShowConfirm(true)}>
          ✕
        </button>
        <span className="write-title">글쓰기</span>
        <button
          className="write-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "등록 중..." : "완료"}
        </button>
      </header>

      {/* 글쓰기 내용 영역 */}
      <main className="write-body">
        <div className="write-warning">
          <strong>안내</strong> 운영 정책에 위배되는 글은 관리자에 의해 삭제될
          수 있어요.
        </div>
        <input
          className="write-input-title"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="write-textarea"
          placeholder="내용을 입력하세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {imagePreview && (
          <div className="write-img-preview">
            <img
              src={imagePreview}
              alt="미리보기"
              style={{
                maxWidth: 200,
                maxHeight: 200,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {locationText && (
          <div className="write-location-preview">장소: {locationText}</div>
        )}
      </main>

      {/* 하단 고정 툴바 */}
      <footer className="write-footer">
        <button type="button" onClick={handlePhotoClick}>
          <img src={photo} />
          <h5>사진</h5>
        </button>
        <button type="button" onClick={handleLocationClick}>
          <img src={location} /> <h5>장소</h5>
        </button>
      </footer>
    </div>
  );
};

export default Community_write;
