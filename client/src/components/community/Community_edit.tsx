import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import "../css/Community_write.css";
import photo from "../../assets/photo.svg";
import location from "../../assets/location.svg";
import useKeyboardAwareToolbar from "../hooks/useKeyboardAwareToolbar";
import ConfirmExitModal from "./ConfirmExitModal";

const Community_edit = () => {
  useKeyboardAwareToolbar();
  const navigate = useNavigate();
  const { id } = useParams(); // 게시글 ID
  const user = useAppSelector((state) => state.user.user);
  const [showConfirm, setShowConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [locationText, setLocationText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`${__API_URL__}/posts/${id}`);
      const data = await res.json();
      setTitle(data.postTitle);
      setContent(data.postContent);
      setLocationText(data.postLocation || "");
      setImagePreview(`${__API_URL__}/public${data.postUploadImg}` || "");
    };

    if (id) fetchPost();
  }, [id]);

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

  const handleLocationClick = () => {
    if (!navigator.geolocation) return alert("위치 정보 사용 불가");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
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
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const shortAddress = address.split(" ").slice(0, 3).join(" ");
        setLocationText(shortAddress);
      } catch {
        setLocationText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    });
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return alert("제목/내용 입력 필수");
    if (!user?.userIdx || !id) return alert("로그인이 필요하거나 ID 없음");

    setLoading(true);
    try {
      let imageUrl = imagePreview;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const res = await fetch(`${__API_URL__}/posts/upload-image`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        imageUrl = data.url;
      }

      const res = await fetch(`${__API_URL__}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postTitle: title,
          postContent: content,
          postUploadImg: imageUrl,
          postLocation: locationText,
        }),
      });

      if (res.ok) {
        alert("수정 완료!");
        navigate(`/community/${id}`);
      } else {
        alert("수정 실패");
      }
    } catch {
      alert("오류 발생");
    } finally {
      setLoading(false);
    }
  };

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
        <span className="write-title">게시글 수정</span>
        <button
          className="write-submit"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "수정 중..." : "완료"}
        </button>
      </header>

      <main className="write-body">
        <div className="write-warning">
          <strong>안내</strong> 작성한 글은 언제든 수정할 수 있어요.
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

      <footer className="write-footer">
        <button type="button" onClick={handlePhotoClick}>
          <img src={photo} />
          <h5>사진</h5>
        </button>
        <button type="button" onClick={handleLocationClick}>
          <img src={location} />
          <h5>장소</h5>
        </button>
      </footer>
    </div>
  );
};

export default Community_edit;
