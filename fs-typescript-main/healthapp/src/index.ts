import express from "express";
import { calculateBmi } from "../bmiCalculator.ts";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello, World!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const bmi = calculateBmi(height, weight);
  res.json({ height, weight, bmi });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
