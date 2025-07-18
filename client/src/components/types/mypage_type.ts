export type mypage_section = "main" | "edit" | "posts" | "purchase";

// Mypage 컴포넌트에서 사용하는 props 타입
export type mypage_props = {
  onChangeSection: (section: mypage_section) => void;
  currentSection: mypage_section;
};

// 타입 가드 함수 (특정 섹션인지 체크)
export function isSection<T extends mypage_section>(
  section: mypage_section,
  targets: readonly T[]
): section is T {
  return targets.includes(section as T);
}
