// 서버에서 받아오는 실제 경로 데이터 타입
export interface postsItem {
  postIdx: number;
  userIdx: number;
  postContent: string;
  postTitle: string;
  postCreatedAt: string; // ISO 날짜 문자열
  postUploadImg?: string;
  postCount: number;
}
