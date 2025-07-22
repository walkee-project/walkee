import React, { useState, useEffect, useRef } from "react";
import "../css/Community_Find.css";
import find from "../../assets/find_icon.svg";
import logo from "../../assets/logo_small.png";
import back from "../../assets/arrow_back.png";
import { useNavigate } from "react-router-dom";

type SearchResult = {
  id?: number;
  postIdx?: number;
  title: string;
  content: string;
  date: string;
};

// 날짜 포맷 함수 추가
function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours < 12 ? "AM" : "PM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${ampm} ${pad(hours)}:${pad(minutes)}`;
}

const Community_Find = ({ onBack }: { onBack?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showError, setShowError] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const validPattern = /^[가-힣a-zA-Z0-9\s]+$/;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2 && validPattern.test(searchTerm)) {
      setShowError(false);
      setCurrentPage(1); // 검색할 때마다 페이지 초기화
      try {
        const res = await fetch(
          `${__API_URL__}/posts/search?query=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) throw new Error("검색 결과를 불러오지 못했습니다.");
        const data = await res.json();
        // 서버에서 내려온 필드명을 프론트에서 사용하는 필드명으로 매핑
        const mapped = data.map((post: any) => ({
          postIdx: post.postIdx,
          title: post.postTitle,
          content: post.postContent,
          date: post.postCreatedAt,
        }));
        setResults(mapped);
      } catch (err) {
        setResults([]);
        setShowError(true);
      }
    } else {
      setShowError(true);
      setResults([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsValid(validPattern.test(value));
  };

  // 페이지 나눠서 보여줄 데이터
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <>
      {/* 로고 + 뒤로가기 */}
      <div className="logo-wrapper">
        <button onClick={onBack} className="back-button">
          <img src={back} alt="back" />
        </button>
        <img src={logo} alt="logo" className="community-find-logo" />
      </div>

      <div className="find-container">
        {/* 검색창 */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            ref={inputRef}
            type="text"
            placeholder="검색어를 입력해주세요"
            value={searchTerm}
            onChange={handleInputChange}
            className={`search-input ${!isValid ? "invalid" : ""}`}
          />
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

        {/* 검색 결과 */}
        <div className="search-results">
          {currentItems.map((result, idx) => (
            <div
              key={result.postIdx || result.id || idx}
              className="search-result-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/community/${result.postIdx}`)}
            >
              <h4 className="result-title">{result.title}</h4>
              <p className="result-content">{result.content}</p>
              <span className="result-date">{formatDate(result.date)}</span>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        {results.length > 0 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Community_Find;
