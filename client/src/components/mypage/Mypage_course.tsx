import type {
  course_section_type,
  mypage_section,
} from "../../types/mypage_type";

type mypage_course_props = {
  type: course_section_type;
  onChangeSection: (section: mypage_section) => void;
};

export default function Mypage_course({
  type,
  onChangeSection,
}: mypage_course_props) {
  return <div className="course">{type}</div>;
}
