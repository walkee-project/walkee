// hooks/useKakaoSdk.ts
let kakaoSdkPromise: Promise<typeof window.kakao> | null = null;

export function waitForKakaoSdk(): Promise<typeof window.kakao> {
  // 🚀 이미 로드된 경우 즉시 반환
  if (window.kakao?.maps?.services) {
    return Promise.resolve(window.kakao);
  }

  // 🚀 이미 진행 중인 요청이 있으면 재사용
  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise((resolve, reject) => {
      const maxAttempts = 30; // 증가
      let attempts = 0;
      const interval = setInterval(() => {
        if (window.kakao?.maps?.services) {
          clearInterval(interval);
          resolve(window.kakao);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(interval);
            reject(new Error("카카오 지도 SDK 로드 실패"));
          }
        }
      }, 50); // 간격 단축
    });
  }
  return kakaoSdkPromise;
}
