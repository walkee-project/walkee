import { useState } from "react";
import Mypage_main from "./Mypage_main";
import Mypage_edit from "./Mypage_edit";
import Mypage_course from "./Mypage_course";
import { isSection } from "../types/mypage_type";
import type {
  mypage_section,
  course_section_type,
  RouteItem,
} from "../types/mypage_type";

function Mypage() {
  const [currentSection, setCurrentSection] = useState<mypage_section>("main");
  const [routeList, setRouteList] = useState<RouteItem[]>([]);

  const handleChangeSection = (section: mypage_section, list?: RouteItem[]) => {
    setCurrentSection(section);
    if (list) setRouteList(list);
  };

  const renderSection = () => {
    if (isSection(currentSection, ["mycourse", "wishlist"])) {
      return (
        <Mypage_course
          key={currentSection}
          type={currentSection as course_section_type}
          routeList={routeList}
          onChangeSection={() => setCurrentSection("main")}
        />
      );
    }

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
      default:
        return null;
    }
  };
  console.log("📦 Mypage routeList:", routeList);
  return <div className="mypage_container">{renderSection()}</div>;
}

export default Mypage;
