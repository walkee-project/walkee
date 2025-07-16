export type course_section_type = "mycourse" | "wishlist";

export type mypage_section =
  | "main"
  | "edit"
  | course_section_type
  | "posts"
  | "purchase";

export type mypage_props = {
  onChangeSection: (section: mypage_section) => void;
  currentSection: mypage_section;
};

// 경로 데이터 타입
export interface RouteItem {
  id: string;
  date: string;
  title: string;
  time: string;
  distance: string;
  speed: string;
  image: string;
  who: string;
  isLiked: boolean;
}

// ✅ 범용 타입 가드 함수 (함수도 여기 같이 넣기)
export function isSection<T extends mypage_section>(
  section: mypage_section,
  targets: readonly T[]
): section is T {
  return targets.includes(section as T);
}
