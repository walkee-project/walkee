import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      "d1i3d05ur40jbn.cloudfront.net",
      "localhost",
      "192.168.0.82",
    ],
    // proxy: {
    //   "/api": {
    //     target: "https://walkeeee.cloud",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
  define: {
    __API_URL__: JSON.stringify(
      process.env.NODE_ENV === "production" ? "https://walkeeee.cloud" : "/api"
    ),
    "process.env.VITE_KAKAO_APP_KEY": JSON.stringify(
      process.env.VITE_KAKAO_APP_KEY
    ),
  },
});
