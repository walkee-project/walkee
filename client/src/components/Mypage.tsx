import "./css/Mypage.css";
import { useState } from "react";
import Mypage_main from "./Mypage_main";

function Mypage() {
  const [currentSection, setCurrentSection] = useState("main");

  // 섹션 렌더링 함수
  const renderSection = () => {
    switch (currentSection) {
      case "main":
        return <Mypage_main onChangeSection={setCurrentSection} />;
      case "mycourse":
        return <MyCourseSection onBack={() => setCurrentSection("main")} />;
      case "wishlist":
        return <WishlistSection onBack={() => setCurrentSection("main")} />;
      case "posts":
        return <PostsSection onBack={() => setCurrentSection("main")} />;
      case "purchase":
        return <PurchaseSection onBack={() => setCurrentSection("main")} />;
      case "edit":
        return <EditProfileSection onBack={() => setCurrentSection("main")} />;
      default:
        return null;
    }
  };

  return <div className="mypage_container">{renderSection()}</div>;
}

export default Mypage;
