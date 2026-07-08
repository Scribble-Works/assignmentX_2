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
  const teacherEmail = String(body?.teacherEmail || "")
    .trim()
    .toLowerCase();

  if (!adminId || !teacherEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: "adminId and teacherEmail are required.",
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
      statusMessage: "Only school admins can add teachers.",
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
    .select("id, firstName, lastName, email, role")
    .eq("email", teacherEmail)
    .single();

  if (teacherError || !teacherProfile) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "Teacher account not found. The teacher must sign up first.",
    });
  }

  const { data: onboarding } = await supabase
    .from("onboarding")
    .select("role")
    .eq("id", teacherProfile.id)
    .maybeSingle();

  const isTeacherRole =
    onboarding?.role === "educator" || teacherProfile.role === "educator";
  if (!isTeacherRole) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user is not onboarded as a teacher (educator).",
    });
  }

  const { error: updateTeacherError } = await supabase
    .from("profiles")
    .update({ school_id: schoolId, role: "educator" })
    .eq("id", teacherProfile.id);

  if (updateTeacherError) {
    throw createError({
      statusCode: 500,
      statusMessage: updateTeacherError.message,
    });
  }

  return {
    success: true,
    teacher: {
      id: teacherProfile.id,
      firstName: teacherProfile.firstName,
      lastName: teacherProfile.lastName,
      email: teacherProfile.email,
      school_id: schoolId,
    },
  };
});
