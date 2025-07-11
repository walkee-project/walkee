// hooks/useKakaoSdk.ts
export function waitForKakaoSdk(): Promise<typeof window.kakao> {
  return new Promise((resolve, reject) => {
    const maxAttempts = 20;
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
    }, 100);
  });
}
