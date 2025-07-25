// 환경에 따른 API URL 설정
const API_BASE_URL = __API_URL__;

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

// 토큰 관리 유틸리티 함수들
const TokenManager = {
  // 토큰 저장
  setToken: (token: string) => {
    localStorage.setItem("access_token", token);
  },

  // 토큰 가져오기
  getToken: (): string | null => {
    return localStorage.getItem("access_token");
  },

  // 토큰 삭제
  removeToken: () => {
    localStorage.removeItem("access_token");
  },

  // 토큰 헤더 생성
  getAuthHeaders: () => {
    const token = TokenManager.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

// 인증이 필요한 fetch 요청을 위한 헬퍼 함수
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const authHeaders = TokenManager.getAuthHeaders();

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    } as HeadersInit,
  });
}

// 페이지 로드 시 URL에서 토큰 추출 및 저장
export function initializeTokenFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");

  if (accessToken) {
    TokenManager.setToken(accessToken);

    // URL에서 토큰 제거
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);

    console.log("토큰이 localStorage에 저장되었습니다");
    return true;
  }
  return false;
}

export async function fetchUserSummary(userId: number) {
  const res = await authenticatedFetch(
    `${API_BASE_URL}/users/${userId}/summary`
  );
  if (!res.ok) throw new Error("유저 요약 정보를 불러올 수 없습니다.");
  return res.json();
}

export async function fetchAllRoutes() {
  const res = await authenticatedFetch(`${API_BASE_URL}/routes`);
  if (!res.ok) throw new Error("전체 경로 정보를 불러올 수 없습니다.");
  return res.json();
}

export const api = {
  // 토큰 관리 함수들 노출
  TokenManager,

  // 토큰 초기화 (앱 시작 시 호출)
  initializeToken: initializeTokenFromURL,

  // 소셜 로그인 시작 (OAuth 리다이렉트)
  startSocialLogin: (provider: "google" | "kakao" | "naver") => {
    const url = `${API_BASE_URL}/auth/${provider}`;
    window.location.href = url;
  },

  // 토큰으로 사용자 정보 가져오기 (쿠키 대신 Authorization 헤더 사용)
  getUserInfo: async () => {
    const token = TokenManager.getToken();

    if (!token) {
      console.warn("토큰이 없습니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/";
      throw new Error("No access token found");
    }

    const response = await authenticatedFetch(`${API_BASE_URL}/users/profile`);

    if (!response.ok) {
      console.error("사용자 정보 가져오기 실패:", response.status);

      // 토큰이 만료되었거나 유효하지 않은 경우
      if (response.status === 401) {
        TokenManager.removeToken();
        window.location.href = "/";
      }

      throw new Error("Failed to fetch user info");
    }

    return response.json();
  },

  // 경로 찜 추가
  addRouteLike: async (userIdx: number, routeIdx: number) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/route-likes`, {
      method: "POST",
      body: JSON.stringify({ userIdx, routeIdx }),
    });

    if (!response.ok) throw new Error("찜 추가 실패");
    return response.json();
  },

  // 경로 찜 삭제
  removeRouteLike: async (userIdx: number, routeIdx: number) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/route-likes`, {
      method: "DELETE",
      body: JSON.stringify({ userIdx, routeIdx }),
    });

    if (!response.ok) throw new Error("찜 삭제 실패");
    return response.json();
  },

  // 로그아웃
  logout: async () => {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    });

    // 로그아웃 성공 여부와 관계없이 로컬 토큰 삭제
    TokenManager.removeToken();

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    return response.json();
  },

  // 회원탈퇴
  deleteUser: async (userIdx: number) => {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/users/${userIdx}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      // 회원탈퇴 성공 시 토큰 삭제
      TokenManager.removeToken();
    }

    if (!response.ok) {
      throw new Error("회원탈퇴 실패");
    }
    return response.json();
  },

  // 토큰 유효성 검사
  checkTokenValidity: async () => {
    try {
      await api.getUserInfo();
      return true;
    } catch {
      return false;
    }
  },
};
