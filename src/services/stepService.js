import { supabase } from "../lib/superbase";

export async function getSteps() {
  const { data, error } =
    await supabase
      .from("step_entries")
      .select("*")
      .order("entry_date", {
        ascending: true,
      });

  if (error) throw error;

  return data;
}

export async function saveSteps(
  date,
  steps
) {
  const { error } =
    await supabase
      .from("step_entries")
      .upsert(
        {
          entry_date: date,
          steps,
        },
        {
          onConflict:
            "entry_date",
        }
      );

  if (error) throw error;
}

export async function deleteSteps(
  id
) {
  const { error } =
    await supabase
      .from("step_entries")
      .delete()
      .eq("id", id);

  if (error) throw error;
}