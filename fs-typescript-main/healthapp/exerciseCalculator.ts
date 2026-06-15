export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  exerciseHours: number[],
  target: number,
): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter((hour) => hour > 0).length;
  const average =
    exerciseHours.reduce((sum, hour) => sum + hour, 0) / periodLength;

  const success = average >= target;
  let rating: number;
  let ratingDescription: string;

  const performanceRatio = average / target;

  if (performanceRatio >= 1) {
    rating = 3;
    ratingDescription = "Great job! You've met your target.";
  } else if (performanceRatio >= 0.75) {
    rating = 2;
    ratingDescription = "Not bad, but you can do better.";
  } else {
    rating = 1;
    ratingDescription = "You need to work harder to meet your target.";
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseArguments = (
  args: string[],
): { target: number; dailyExercises: number[] } => {
  if (args.length < 4) {
    throw new Error("Not enough arguments");
  }

  const target = Number(args[2]);
  const dailyExercises = args.slice(3).map((arg) => Number(arg));

  if (isNaN(target) || dailyExercises.some(isNaN)) {
    throw new Error("Provided values were not numbers!");
  }

  return { target, dailyExercises };
};

if (require.main === module) {
  try {
    const { target, dailyExercises } = parseArguments(process.argv);
    console.log(calculateExercises(dailyExercises, target));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage = "Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
