import express from "express";
import { calculateBmi } from "../bmiCalculator";
import { calculateExercises } from "../exerciseCalculator";

const app = express();
app.use(express.json());

interface ExerciseRequestBody {
  daily_exercises: number[];
  target: number;
}

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

const parseExerciseRequestBody = (
  body: unknown,
): ExerciseRequestBody | undefined => {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const candidate = body as Record<string, unknown>;

  if (!Array.isArray(candidate.daily_exercises)) {
    return undefined;
  }

  const target = toNumber(candidate.target);
  const dailyExercises = candidate.daily_exercises.map((hours) =>
    toNumber(hours),
  );

  if (
    target === undefined ||
    dailyExercises.some((hours) => hours === undefined)
  ) {
    return undefined;
  }

  return {
    daily_exercises: dailyExercises as number[],
    target,
  };
};

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
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

app.post("/exercises", (req, res) => {
  const body = req.body as unknown;

  if (
    typeof body !== "object" ||
    body === null ||
    !("daily_exercises" in body) ||
    !("target" in body)
  ) {
    res.status(400).json({
      error: "parameters missing",
    });
    return;
  }

  const parsedBody = parseExerciseRequestBody(body);

  if (!parsedBody) {
    res.status(400).json({
      error: "malformatted parameters",
    });
    return;
  }

  const result = calculateExercises(
    parsedBody.daily_exercises,
    parsedBody.target,
  );
  res.json(result);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
