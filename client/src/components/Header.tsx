import React from "react";
import "../components/css/Home.css"; // 스타일 따로 분리

interface HeaderProps {
  title: string;
  rightIcons?: {
    icon: React.ReactNode;
    onClick?: () => void;
  }[];
}

const Header: React.FC<HeaderProps> = ({ title, rightIcons }) => {
  return (
    <header className="header-container">
      <h1 className="header-title">{title}</h1>
      <div className="header-right">
        {rightIcons?.map((item, i) => (
          <button key={i} className="header-icon" onClick={item.onClick}>
            {item.icon}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
