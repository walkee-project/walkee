import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Walkee server is running!");
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
