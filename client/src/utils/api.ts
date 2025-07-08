const API_BASE_URL = "http://localhost:3000"; // NestJS 서버 주소

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

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

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
