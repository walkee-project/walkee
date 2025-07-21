import { useState } from "react";
import Mypage_main from "./Mypage_main";
import Mypage_edit from "./Mypage_edit";
import Mypage_posts from "./Mypage_posts";
import type { mypage_section } from "../types/mypage_type";

function Mypage() {
  const [currentSection, setCurrentSection] = useState<mypage_section>("main");

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
      default:
        return null;
    }
  };
  return <div className="mypage_container">{renderSection()}</div>;
}

export default Mypage;
