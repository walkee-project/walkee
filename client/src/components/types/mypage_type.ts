export type course_section_type = "mycourse" | "wishlist";

export type mypage_section =
  | "main"
  | "edit"
  | course_section_type
  | "posts"
  | "purchase";

// Mypage 컴포넌트에서 사용하는 props 타입
export type mypage_props = {
  onChangeSection: (section: mypage_section, data?: RouteItem[]) => void;
  currentSection: mypage_section;
};

// 서버에서 받아오는 실제 경로 데이터 타입
export interface RouteItem {
  routeIdx: number;
  routeTitle: string;
  routeTotalTime: number; // 초 단위 시간
  routeTotalKm: number; // km 단위 거리 (소수점)
  routeThumbnail: string; // 썸네일 이미지 경로
  routeCreatedAt: string; // ISO 날짜 문자열
  userIdx: number;
  isLiked?: boolean;
  userName?: string;
}

// 타입 가드 함수 (특정 섹션인지 체크)
export function isSection<T extends mypage_section>(
  section: mypage_section,
  targets: readonly T[]
): section is T {
  return targets.includes(section as T);
}
