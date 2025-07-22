import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "walkeeteam.s3-website.ap-northeast-2.amazonaws.com",
      "localhost",
      "192.168.0.82",
    ],
    // proxy: {
    //   "/api": {
    //     target: "https://walkee.duckdns.org",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === "production"
        ? "https://walkee.duckdns.org"
        : "/api"
    ),
    "process.env.VITE_KAKAO_APP_KEY": JSON.stringify(
      process.env.VITE_KAKAO_APP_KEY
    ),
  },
});
