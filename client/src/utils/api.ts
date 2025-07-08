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

  // 토큰으로 사용자 정보 가져오기
  getUserInfo: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return response.json();
  },

  // 토큰 저장
  saveToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },

  // 토큰 가져오기
  getToken: () => {
    return localStorage.getItem("accessToken");
  },

  // 토큰 삭제
  removeToken: () => {
    localStorage.removeItem("accessToken");
  },

  // 로그인 상태 확인
  isLoggedIn: () => {
    return !!localStorage.getItem("accessToken");
  },
};
