/**
 * Seed use cases into Supabase.
 * Run with: npx tsx scripts/seed-use-cases.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const filePath = path.join(process.cwd(), "seed", "use-cases.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const { error } = await supabase.from("use_cases").insert(data);

  if (error) {
    if (error.code === "23505") {
      console.log("Use cases already seeded (duplicate key). Skip or delete existing rows first.");
    } else {
      console.error("Seed failed:", error);
      process.exit(1);
    }
  } else {
    console.log(`Seeded ${data.length} use cases`);
  }
}

seed();
