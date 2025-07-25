import { useState, useEffect } from "react";
import "./css/First.css";
import logo_big from "../assets/logo_big.png";
import logo_small from "../assets/logo_small.png";
import mascot_short from "../assets/mascot_short.png";
import kakao_login from "../assets/kakao_login.png";
import { api } from "../utils/api";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";

function First() {
  const [shrink, setShrink] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setShrink(true), 1500);
    const afterTimer = setTimeout(() => setShowAfter(true), 1800);
    return () => {
      clearTimeout(timer);
      clearTimeout(afterTimer);
    };
  }, []);

  // 소셜 로그인 핸들러
  const handleSocialLogin = (provider: "google" | "kakao" | "naver") => {
    console.log(`${provider} 로그인 시작`);
    api.startSocialLogin(provider);
  };

  return (
    <div className={`splash-container ${shrink ? "shrink" : ""}`}>
      <div className={`logo-container ${shrink ? "shrink" : ""}`}>
        <img
          src={shrink ? logo_small : logo_big}
          alt="logo"
          className="logo-img"
        />
      </div>

      {shrink && (
        <div className={`after_container ${showAfter ? "shrink" : ""}`}>
          <div className="comment">
            <p>반가워요!</p>
            <p>로그인하고 WALKEE를 이용해 보세요.</p>
          </div>

          <div className="mascot_container">
            <img src={mascot_short} alt="마스코트" />
          </div>
          <div className="button-group">
            <div
              className="first_btn kakao_btn"
              onClick={() => handleSocialLogin("kakao")}
              style={{ cursor: "pointer" }}
            >
              <img src={kakao_login} alt="카카오 로그인" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default First;
