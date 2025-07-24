import "../css/Mypage_edit.css";
import type { ChangeEvent } from "react";
import { useState, useRef } from "react";
import type { mypage_props } from "../types/mypage_type";
import profileImage from "../../assets/profile.png";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchUser, fetchUserSummaryThunk } from "../../store/userSlice";
import arrow_back from "../../assets/arrow_back.png";
import cameraIcon from "../../assets/cameraIcon.png";

export default function Mypage_edit({ onChangeSection }: mypage_props) {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState(user ? user.userName : "푸른달걀");
  const [imagePreview, setImagePreview] = useState<string>(
    user?.userProfile || profileImage
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[가-힣a-zA-Z0-9]*$/;
    const nativeEvent = e.nativeEvent as InputEvent;
    if (
      ("isComposing" in nativeEvent && nativeEvent.isComposing) ||
      regex.test(input) ||
      input === ""
    ) {
      setNickname(input);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) {
      window.location.href = "/";
      return;
    }
    let profileImageUrl = user.userProfile;
    try {
      if (selectedFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        const uploadRes = await fetch(
          `${__API_URL__}/users/${user.userIdx}/profile-image`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!uploadRes.ok) throw new Error("이미지 업로드 실패");
        const data = await uploadRes.json();
        profileImageUrl = data.url || data.profileImageUrl;
        setUploading(false);
      }
      const patchRes = await fetch(`${__API_URL__}/users/${user.userIdx}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: nickname,
          userProfile: profileImageUrl,
        }),
        credentials: "include",
      });
      if (!patchRes.ok) throw new Error("프로필 수정 실패");
      // store 최신화
      await dispatch(fetchUser());
      if (user.userIdx) {
        await dispatch(fetchUserSummaryThunk(user.userIdx));
      }
      alert(`프로필이 변경되었습니다.`);
      onChangeSection("main");
    } catch (err) {
      setUploading(false);
      alert(err + "프로필 수정/업로드에 실패했습니다.");
    }
  };

  return (
    <div className="edit">
      <button
        onClick={() => onChangeSection("main")}
        onTouchStart={() => onChangeSection("main")}
        className="back_btn"
        style={{
          minHeight: "44px",
          minWidth: "44px",
          touchAction: "manipulation",
        }}
      >
        <img src={arrow_back} alt="back_arrow" />
      </button>
      <div className="edit_header">
        <p>프로필 수정</p>
      </div>

      <div className="edit_section">
        <div>
          <div className="profile_section">
            <div className="profile_img_wrapper">
              <img
                src={imagePreview}
                alt="프로필"
                className="edit_profile_img"
              />
              <div
                className="camera_div"
                onClick={() => fileInputRef.current?.click()}
                onTouchStart={() => fileInputRef.current?.click()}
                style={{
                  cursor: "pointer",
                  minHeight: "44px",
                  minWidth: "44px",
                  touchAction: "manipulation",
                }}
              >
                <img
                  src={cameraIcon}
                  alt="카메라아이콘"
                  className="camera_icon"
                />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <div className="nickname_section">
            <div className="nickname_guideDiv">
              <label htmlFor="nickname_input" className="nickname_label">
                닉네임
              </label>
              <p className="nickname_guide">한글, 영문, 숫자만 가능</p>
            </div>
            <input
              id="nickname_input"
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              className="nickname_input"
              maxLength={12}
            />
          </div>
        </div>
        <button
          className="submit_btn"
          onClick={handleSave}
          onTouchStart={handleSave}
          disabled={uploading}
          style={{
            minHeight: "44px",
            touchAction: "manipulation",
          }}
        >
          {uploading ? "업로드 중..." : "수정하기"}
        </button>
      </div>
    </div>
  );
}
