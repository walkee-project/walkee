import express from "express";
import cors from "cors";
import { sequelize } from "./config/database";
import userRoutes from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

// 연결 체크 후 서버 시작
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ DB 연결 성공!");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("❌ DB 연결 실패:", error);
  });
