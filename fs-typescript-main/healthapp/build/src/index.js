"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bmiCalculator_1 = require("../bmiCalculator");
const exerciseCalculator_1 = require("../exerciseCalculator");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const toNumber = (value) => {
    if (typeof value === "number") {
        return Number.isNaN(value) ? undefined : value;
    }
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
};
const parseExerciseRequestBody = (body) => {
    if (typeof body !== "object" || body === null) {
        return undefined;
    }
    const candidate = body;
    if (!Array.isArray(candidate.daily_exercises)) {
        return undefined;
    }
    const target = toNumber(candidate.target);
    const dailyExercises = candidate.daily_exercises.map((hours) => toNumber(hours));
    if (target === undefined ||
        dailyExercises.some((hours) => hours === undefined)) {
        return undefined;
    }
    return {
        daily_exercises: dailyExercises,
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
    const bmi = (0, bmiCalculator_1.calculateBmi)(height, weight);
    res.json({ height, weight, bmi });
});
app.post("/exercises", (req, res) => {
    const body = req.body;
    if (typeof body !== "object" ||
        body === null ||
        !("daily_exercises" in body) ||
        !("target" in body)) {
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
    const result = (0, exerciseCalculator_1.calculateExercises)(parsedBody.daily_exercises, parsedBody.target);
    res.json(result);
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
