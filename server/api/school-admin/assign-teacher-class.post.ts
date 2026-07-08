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
  const teacherId = String(body?.teacherId || "").trim();
  const classId = String(body?.classId || "").trim();

  if (!adminId || !teacherId || !classId) {
    throw createError({
      statusCode: 400,
      statusMessage: "adminId, teacherId and classId are required.",
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
      statusMessage: "Only school admins can assign teachers to classes.",
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

  const { data: teacherProfile, error: teacherError } = await supabase
    .from("profiles")
    .select("id, role, school_id")
    .eq("id", teacherId)
    .single();

  if (teacherError || !teacherProfile) {
    throw createError({ statusCode: 404, statusMessage: "Teacher not found." });
  }

  if (
    teacherProfile.role !== "educator" ||
    teacherProfile.school_id !== schoolId
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Teacher must be linked to this school and onboarded as educator.",
    });
  }

  const { data: classRow, error: classError } = await supabase
    .from("school_classes")
    .select("id, school_id")
    .eq("id", classId)
    .single();

  if (classError || !classRow || classRow.school_id !== schoolId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Class not found for this school.",
    });
  }

  const { data: existing } = await supabase
    .from("school_teacher_memberships")
    .select("id")
    .eq("teacher_id", teacherId)
    .eq("class_id", classId)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("school_teacher_memberships")
      .insert({
        school_id: schoolId,
        teacher_id: teacherId,
        class_id: classId,
      });

    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: insertError.message,
      });
    }
  }

  return { success: true };
});
