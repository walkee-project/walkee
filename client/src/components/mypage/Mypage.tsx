import { useState } from "react";
import Mypage_main from "./Mypage_main";
import Mypage_edit from "./Mypage_edit";
import Mypage_posts from "./Mypage_posts";
import Mypage_purchase from "./Mypage_purchase";
import type { mypage_section } from "../types/mypage_type";
import Header from "../Header";
import bell from "../../assets/bell_icon.svg";

function Mypage() {
  const [currentSection, setCurrentSection] = useState<mypage_section>("main");

  const hideHeaderSections: mypage_section[] = ["posts", "purchase"];

  const handleChangeSection = (section: mypage_section) => {
    setCurrentSection(section);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "main":
        return (
          <Mypage_main
            onChangeSection={handleChangeSection}
            currentSection={currentSection}
          />
        );
      case "edit":
        return (
          <Mypage_edit
            onChangeSection={handleChangeSection}
            currentSection={currentSection}
          />
        );
      case "posts":
        return (
          <Mypage_posts
            onChangeSection={handleChangeSection}
            currentSection={currentSection}
          />
        );
      case "purchase":
        return (
          <Mypage_purchase
            onChangeSection={handleChangeSection}
            currentSection={currentSection}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div
      className={`mypage_container ${
        hideHeaderSections.includes(currentSection) ? "no-header" : ""
      }`}
    >
      {!hideHeaderSections.includes(currentSection) && (
        <Header
          title="마이워키"
          rightIcons={[
            {
              icon: <img src={bell} alt="plus icon" />,
              onClick: () => console.log("알림 클릭"),
            },
          ]}
        />
      )}
      {renderSection()}
    </div>
  );
}

export default Mypage;
