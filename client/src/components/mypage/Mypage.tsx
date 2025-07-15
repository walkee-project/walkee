import { useState } from "react";
import Mypage_main from "./Mypage_main";
import Mypage_edit from "./Mypage_edit";
import Mypage_course from "./Mypage_course";
import { isSection } from "../../types/mypage_type";
import type {
  mypage_section,
  course_section_type,
} from "../../types/mypage_type";

function Mypage() {
  const [currentSection, setCurrentSection] = useState<mypage_section>("main");

  // 섹션 렌더링 함수
  const renderSection = () => {
    // ✅ "mycourse" 또는 "wishlist"면 공통 CourseSection 컴포넌트 사용
    if (isSection(currentSection, ["mycourse", "wishlist"])) {
      return (
        <Mypage_course
          type={currentSection as course_section_type}
          onChangeSection={() => setCurrentSection("main")}
        />
      );
    }

    switch (currentSection) {
      case "main":
        return (
          <Mypage_main
            onChangeSection={setCurrentSection}
            currentSection={currentSection}
          />
        );

      case "edit":
        return (
          <Mypage_edit
            onChangeSection={setCurrentSection}
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
