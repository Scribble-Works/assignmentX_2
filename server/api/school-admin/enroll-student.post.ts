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
  const actorId = String(
    body?.actorId || body?.teacherId || body?.adminId || "",
  ).trim();
  const classId = String(body?.classId || "").trim();
  const studentEmail = String(body?.studentEmail || "")
    .trim()
    .toLowerCase();

  if (!actorId || !classId || !studentEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: "actorId, classId and studentEmail are required.",
    });
  }

  const supabase = getSupabase();

  const { data: actorProfile, error: actorError } = await supabase
    .from("profiles")
    .select("id, role, school_id")
    .eq("id", actorId)
    .single();

  if (actorError || !actorProfile) {
    throw createError({
      statusCode: 404,
      statusMessage: "User profile not found.",
    });
  }

  const { data: actorOnboarding } = await supabase
    .from("onboarding")
    .select("role")
    .eq("id", actorId)
    .maybeSingle();

  const actorRole = actorProfile.role || actorOnboarding?.role || "";
  const isTeacher = ["educator", "teacher", "facilitator"].includes(actorRole);
  const isAdmin = actorRole === "school_admin";

  if (!isTeacher && !isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only school admins or teachers can add students.",
    });
  }

  let schoolId = actorProfile.school_id as string | null;
  if (!schoolId) {
    const { data: schoolRow } = await supabase
      .from("schools")
      .select("id")
      .eq("admin_id", actorId)
      .maybeSingle();
    schoolId = schoolRow?.id || null;
  }

  if (!schoolId) {
    throw createError({
      statusCode: 400,
      statusMessage: "User is not linked to a school yet.",
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

  if (isTeacher) {
    const { data: membership, error: membershipError } = await supabase
      .from("school_teacher_memberships")
      .select("id, school_id, teacher_id, class_id")
      .eq("teacher_id", actorId)
      .eq("class_id", classId)
      .maybeSingle();

    if (membershipError) {
      throw createError({
        statusCode: 500,
        statusMessage: membershipError.message,
      });
    }

    if (!membership) {
      throw createError({
        statusCode: 403,
        statusMessage: "You are not assigned to this class.",
      });
    }
  }

  const { data: studentProfile, error: studentError } = await supabase
    .from("profiles")
    .select("id, firstName, lastName, email, role, school_id")
    .eq("email", studentEmail)
    .single();

  if (studentError || !studentProfile) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "Student account not found. The student must sign up first.",
    });
  }

  const { data: studentOnboarding } = await supabase
    .from("onboarding")
    .select("role")
    .eq("id", studentProfile.id)
    .maybeSingle();

  const isStudentRole =
    ["student"].includes(studentOnboarding?.role || "") ||
    ["student"].includes(studentProfile.role || "");

  if (!isStudentRole) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user is not onboarded as a student.",
    });
  }

  if (studentProfile.school_id !== schoolId) {
    const { error: updateStudentError } = await supabase
      .from("profiles")
      .update({ school_id: schoolId, role: "student" })
      .eq("id", studentProfile.id);

    if (updateStudentError) {
      throw createError({
        statusCode: 500,
        statusMessage: updateStudentError.message,
      });
    }
  }

  const { data: existing } = await supabase
    .from("class_students")
    .select("id")
    .eq("class_id", classId)
    .eq("student_id", studentProfile.id)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("class_students")
      .insert({
        class_id: classId,
        student_id: studentProfile.id,
        added_by: actorId,
      });

    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: insertError.message,
      });
    }
  }

  return {
    success: true,
    student: {
      id: studentProfile.id,
      firstName: studentProfile.firstName,
      lastName: studentProfile.lastName,
      email: studentProfile.email,
    },
  };
});
