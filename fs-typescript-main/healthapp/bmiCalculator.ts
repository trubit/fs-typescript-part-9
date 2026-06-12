export const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return "Normal weight";
  } else if (bmi >= 25 && bmi < 29.9) {
    return "Overweight";
  } else {
    return "Obesity";
  }
};

if (require.main === module) {
  try {
    const height = Number(process.argv[2]);
    const weight = Number(process.argv[3]);

    if (isNaN(height) || isNaN(weight)) {
      throw new Error("malformatted parameters");
    }
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log("Error:", errorMessage);
  }
}
