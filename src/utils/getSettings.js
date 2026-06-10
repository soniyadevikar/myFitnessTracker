export default function getSettings() {
  const saved =
    localStorage.getItem(
      "fitnessSettings"
    );

  if (!saved) {
    return {
      height: 172,
      startingWeight: 95,
      goalWeight: 58,
      dailyStepGoal: 10000,
    };
  }

  return JSON.parse(saved);
}