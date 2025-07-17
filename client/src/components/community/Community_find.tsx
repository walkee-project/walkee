import React, { useState, useEffect, useRef } from "react";
import "../css/Community_Find.css";
import find from "../../assets/find_icon.svg";
import logo from "../../assets/logo_small.png";
import back from "../../assets/arrow_back.png";

type SearchResult = {
  id: number;
  title: string;
  content: string;
  date: string;
};

const Community_Find = ({ onBack }: { onBack?: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showError, setShowError] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const validPattern = /^[가-힣a-zA-Z0-9\s]+$/;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.length >= 2 && validPattern.test(searchTerm)) {
      setShowError(false);
      setCurrentPage(1); // 검색할 때마다 페이지 초기화

      const dummyResults: SearchResult[] = Array.from(
        { length: 55 },
        (_, i) => ({
          id: i + 1,
          title: `"${searchTerm}" 관련 게시물 ${String.fromCharCode(
            65 + (i % 26)
          )}`,
          content: `이건 ${
            i + 1
          }번째 더미 게시물입니다. 커뮤니티 테스트용이에요.WALKEEWALKEE`,
          date: `2025-07-${String((i % 30) + 1).padStart(2, "0")}`,
        })
      );
      setResults(dummyResults);
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
          {currentItems.map((result) => (
            <div key={result.id} className="search-result-card">
              <h4 className="result-title">{result.title}</h4>
              <p className="result-content">{result.content}</p>
              <span className="result-date">{result.date}</span>
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
