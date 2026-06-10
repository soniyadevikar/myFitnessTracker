import { supabase } from "../lib/superbase";

export async function getWeights() {
  const { data, error } =
    await supabase
      .from("weight_entries")
      .select("*")
      .order("entry_date", {
        ascending: true,
      });

  if (error) throw error;

  return data;
}

export async function saveWeight(
  date,
  weight
) {
  const { error } =
    await supabase
      .from("weight_entries")
      .upsert(
        {
          entry_date: date,
          weight,
        },
        {
          onConflict:
            "entry_date",
        }
      );

  if (error) throw error;
}

export async function deleteWeight(
  id
) {
  const { error } =
    await supabase
      .from("weight_entries")
      .delete()
      .eq("id", id);

  if (error) throw error;
}