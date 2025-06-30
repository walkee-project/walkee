import express from "express";
import cors from "cors";
import { sequelize } from "./config/database";
import userRoutes from "./routes/user";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log("✅ Server running on http://localhost:5000");
  });
});
