import "../css/Mypage_edit.css";
import type { ChangeEvent } from "react";
import { useState } from "react";
import type { mypage_props } from "../types/mypage_type";
import profileImage from "../../assets/profile.png";
import arrow_back from "../../assets/arrow_back.png";
import cameraIcon from "../../assets/cameraIcon.png";

export default function Mypage_edit({ onChangeSection }: mypage_props) {
  const [nickname, setNickname] = useState("푸른달갈");

  const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const regex = /^[가-힣a-zA-Z0-9]*$/;

    if (regex.test(input) || input === "") {
      setNickname(input);
    }
  };

  const handleSave = () => {
    // 실제 저장 로직 (API 연동 등)
    alert(`닉네임이 '${nickname}'으로 변경되었습니다.`);
    onChangeSection("main");
  };

  return (
    <div className="edit">
      <button onClick={() => onChangeSection("main")} className="back_btn">
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
                src={profileImage}
                alt="프로필"
                className="edit_profile_img"
              />
              <div className="camera_div">
                <img
                  src={cameraIcon}
                  alt="카메라아이콘"
                  className="camera_icon"
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
        <button className="submit_btn" onClick={handleSave}>
          수정하기
        </button>
      </div>
    </div>
  );
}
