import { supabase } from "../lib/superbase";

export async function getSettings() {
  const { data, error } =
    await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .single();

  if (error) return null;

  return data;
}

export async function saveSettings(
  settings
) {
  const existing =
    await getSettings();

  if (existing) {
    const { error } =
      await supabase
        .from("settings")
        .update({
          height:
            settings.height,
          starting_weight:
            settings.startingWeight,
          goal_weight:
            settings.goalWeight,
          daily_step_goal:
            settings.dailyStepGoal,
        })
        .eq(
          "id",
          existing.id
        );

    if (error) throw error;
  } else {
    const { error } =
      await supabase
        .from("settings")
        .insert({
          height:
            settings.height,
          starting_weight:
            settings.startingWeight,
          goal_weight:
            settings.goalWeight,
          daily_step_goal:
            settings.dailyStepGoal,
        });

    if (error) throw error;
  }
}