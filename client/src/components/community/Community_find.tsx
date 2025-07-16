import React, { useState } from "react";
import "../css/Community_Find.css";

import logo from "../../assets/logo_small.png";
import flag from "../../assets/community_flag.svg";
import plus from "../../assets/plus_icon.svg";
import find from "../../assets/find_icon.svg";
import bell from "../../assets/bell_icon.svg";
import arrow from "../../assets/arrow_back.png";

const Community_Find = ({ onBack }: { onBack?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showError, setShowError] = useState(false);

  const validPattern = /^[가-힣a-zA-Z0-9\s]+$/;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2 && validPattern.test(searchTerm)) {
      console.log("Searching for:", searchTerm);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsValid(validPattern.test(value));
  };

  return (
    <div className="find-container">
      {/* 검색창 */}
      <button className="back-button" onClick={onBack}>
        <img src={arrow} className="arrow_icon" />
      </button>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="검색어를 입력해주세요"
          value={searchTerm}
          onChange={handleInputChange}
          className={`search-input ${!isValid ? "invalid" : ""}`}
        />
        <select className="region-select">
          <option value="">지역 검색</option>
        </select>
        <button
          type="submit"
          className="search-button"
          disabled={searchTerm.length < 2 || !isValid}
        >
          <img src={find} alt="search" />
        </button>
      </form>

      {/* 오류 메시지 */}
      {showError && (
        <p className="error-message">
          {!isValid
            ? "한글, 영어, 숫자만 입력 가능합니다"
            : "검색어는 2글자 이상이어야 합니다"}
        </p>
      )}
    </div>
  );
};

export default Community_Find;
