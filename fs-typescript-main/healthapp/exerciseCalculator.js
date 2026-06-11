export const calculateExercises = (exerciseHours, target) => {
    const periodLength = exerciseHours.length;
    const trainingDays = exerciseHours.filter((hour) => hour > 0).length;
    const average = exerciseHours.reduce((sum, hour) => sum + hour, 0) / periodLength;
    const success = average >= target;
    let rating;
    let ratingDescription;
    const performanceRatio = average / target;
    if (performanceRatio >= 1) {
        rating = 3;
        ratingDescription = "Great job! You've met your target.";
    }
    else if (performanceRatio >= 0.75) {
        rating = 2;
        ratingDescription = "Not bad, but you can do better.";
    }
    else {
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
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
