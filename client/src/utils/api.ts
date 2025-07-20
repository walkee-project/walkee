// 모든 환경에서 프록시 사용 (프론트엔드와 백엔드 통합)
const API_BASE_URL = "/api";

export interface LoginResponse {
  accessToken: string;
  user: {
    userIdx: number;
    userProvider: string;
    userId: string;
    userEmail: string;
    userName: string;
    userProfile: string;
    userPoint: number;
  };
}
export async function fetchUserSummary(userId: number) {
  const res = await fetch(`/api/users/${userId}/summary`);
  if (!res.ok) throw new Error("유저 요약 정보를 불러올 수 없습니다.");
  return res.json();
}

export async function fetchAllRoutes() {
  const res = await fetch("/api/routes");
  if (!res.ok) throw new Error("전체 경로 정보를 불러올 수 없습니다.");
  return res.json();
}
export const api = {
  // 소셜 로그인 시작 (OAuth 리다이렉트)
  startSocialLogin: (provider: "google" | "kakao" | "naver") => {
    const url = `${API_BASE_URL}/auth/${provider}`;
    window.location.href = url;
  },

  // 쿠키로 사용자 정보 가져오기
  getUserInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      credentials: "include", // 쿠키 자동 첨부
      headers: {
        "Content-Type": "application/json",
      },
    });

      // if (!response.ok) {
      //   // fetch 실패 원인: 백엔드에서 쿠키 인증이 제대로 안되거나, 세션 만료, 혹은 CORS 문제일 수 있음
      //   window.location.href = "/";
      //   throw new Error("Failed to fetch user info");
      // }

    return response.json();
  },

  // 경로 찜 추가
  addRouteLike: async (userIdx: number, routeIdx: number) => {
    const response = await fetch(`${API_BASE_URL}/route-likes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIdx, routeIdx }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("찜 추가 실패");
    return response.json();
  },

  // 경로 찜 삭제
  removeRouteLike: async (userIdx: number, routeIdx: number) => {
    const response = await fetch(`${API_BASE_URL}/route-likes`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIdx, routeIdx }),
      credentials: "include",
    });
    if (!response.ok) throw new Error("찜 삭제 실패");
    return response.json();
  },

  // 로그아웃
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    return response.json();
  },
};
