export type course_section_type = "mycourse" | "wishlist" | "myruns";

// 서버에서 받아오는 실제 경로 데이터 타입
export interface RouteItem {
  routeIdx: number;
  routeTitle: string;
  routeTotalTime: number; // 초 단위 시간
  routeTotalKm: number; // km 단위 거리 (소수점)
  routeThumbnail: string; // 썸네일 이미지 경로
  routeCreatedAt: string; // ISO 날짜 문자열
  routeDifficulty: string;
  userIdx: number;
  isLiked?: boolean;
  userName?: string;
  // 아래 필드 추가
  routePolyline: string;
  routeStartLat: number;
  routeStartLng: number;
  routeEndLat: number;
  routeEndLng: number;
}

export interface Follow {
  followIdx: number;
  userIdx: number;
  routeIdx: number | null;
  followTitle: string;
  followTotalKm: number;
  followTotalTime: number;
  followPolyline: string;
  followStartLat: number;
  followStartLng: number;
  followEndLat: number;
  followEndLng: number;
  followThumbnail?: string;
  followCompleted: number | null;
  followCreatedAt: string;
  followDeletedAt?: string;
}
