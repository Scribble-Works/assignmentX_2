import { createClient } from "@supabase/supabase-js";

const getSupabase = () => {
  const config = useRuntimeConfig();
  const url = process.env.SUPABASE_URL;
  const key =
    (config.SUPABASE_SERVICE_KEY as string | undefined) ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY;

  if (!url || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: "Supabase service credentials are not configured.",
    });
  }

  return createClient(url, key);
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const adminId = String(body?.adminId || "").trim();
  const name = String(body?.name || "").trim();
  const gradeLevel = String(body?.gradeLevel || "").trim();

  if (!adminId || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: "adminId and class name are required.",
    });
  }

  const supabase = getSupabase();

  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("id, role, school_id")
    .eq("id", adminId)
    .single();

  if (adminError || !adminProfile || adminProfile.role !== "school_admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Only school admins can create classes.",
    });
  }

  let schoolId = adminProfile.school_id as string | null;
  if (!schoolId) {
    const { data: schoolRow } = await supabase
      .from("schools")
      .select("id")
      .eq("admin_id", adminId)
      .single();
    schoolId = schoolRow?.id || null;
  }

  if (!schoolId) {
    throw createError({
      statusCode: 404,
      statusMessage: "No school found for this admin.",
    });
  }

  const { data, error } = await supabase
    .from("school_classes")
    .insert({
      school_id: schoolId,
      name,
      grade_level: gradeLevel || null,
      created_by: adminId,
    })
    .select("id, school_id, name, grade_level, created_by, created_at")
    .single();

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return { success: true, class: data };
});
