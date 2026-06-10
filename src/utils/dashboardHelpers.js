export function getLatestWeight(weights = []) {
  if (!weights.length) return null;

  return weights[weights.length - 1].weight;
}

export function calculateBMI(weight, height) {
  if (!weight || !height) return null;

  return (
    weight /
    ((height / 100) * (height / 100))
  ).toFixed(1);
}

export function bmiCategory(bmi) {
  if (!bmi) return "";

  if (bmi < 18.5)
    return "Underweight";

  if (bmi < 25)
    return "Normal";

  if (bmi < 30)
    return "Overweight";

  return "Obese";
}