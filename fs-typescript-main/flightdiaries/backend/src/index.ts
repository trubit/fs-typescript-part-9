import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import diaryRouter from "./routes/diaries.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const staticDir = path.resolve(__dirname, "..", "..", "frontend");
app.use(express.static(staticDir));

const PORT = 3000;

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diaries", diaryRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
