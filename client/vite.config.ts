import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 외부 IP에서도 접근 가능하게
    port: 5173,
    allowedHosts: [
      "trusted-hippo-finally.ngrok-free.app",
      "localhost",
      "192.168.0.82",
    ],
    proxy: {
      // 모든 환경에서 프록시 사용 (프론트엔드와 백엔드 통합)
      "/api": {
        target: "https://until-telecom-floors-phases.trycloudflare.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  define: {
    // 환경변수를 전역으로 사용 가능하게 설정
    "process.env.VITE_KAKAO_APP_KEY": JSON.stringify(
      process.env.VITE_KAKAO_APP_KEY
    ),
  },
});
