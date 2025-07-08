import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // <== 이게 핵심! 외부 IP에서도 접근 가능하게
    port: 5173, // 포트는 그대로 써도 되고 바꿔도 됨
  },
});
