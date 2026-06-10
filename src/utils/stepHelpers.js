export function getStepEntries() {
  return JSON.parse(
    localStorage.getItem("stepEntries") || "[]"
  );
}

export function getTodaySteps() {
  const entries = getStepEntries();

  if (!entries.length) return 0;

  return entries[entries.length - 1].steps;
}

export function getBestDay() {
  const entries = getStepEntries();

  if (!entries.length) return null;

  return [...entries].sort(
    (a, b) => b.steps - a.steps
  )[0];
}

export function getWeeklyAverage() {
  const entries = getStepEntries();

  if (!entries.length) return 0;

  const recent = entries.slice(-7);

  const total = recent.reduce(
    (sum, item) => sum + item.steps,
    0
  );

  return Math.round(
    total / recent.length
  );
}

export function getMonthlyAverage() {
  const entries = getStepEntries();

  if (!entries.length) return 0;

  const recent = entries.slice(-30);

  const total = recent.reduce(
    (sum, item) => sum + item.steps,
    0
  );

  return Math.round(
    total / recent.length
  );
}