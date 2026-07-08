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
  const teacherId = String(body?.teacherId || "").trim();
  const classId = String(body?.classId || "").trim();
  const studentEmail = String(body?.studentEmail || "")
    .trim()
    .toLowerCase();

  if (!teacherId || !classId || !studentEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: "teacherId, classId and studentEmail are required.",
    });
  }

  const supabase = getSupabase();

  const { data: teacherProfile, error: teacherError } = await supabase
    .from("profiles")
    .select("id, role, school_id")
    .eq("id", teacherId)
    .single();

  if (teacherError || !teacherProfile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Teacher profile not found.",
    });
  }

  const { data: teacherOnboarding } = await supabase
    .from("onboarding")
    .select("role")
    .eq("id", teacherId)
    .maybeSingle();

  const canTeach =
    teacherProfile.role === "educator" ||
    teacherOnboarding?.role === "educator";
  if (!canTeach) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only teachers can enroll students.",
    });
  }

  if (!teacherProfile.school_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Teacher is not linked to a school yet.",
    });
  }

  const { data: membership, error: membershipError } = await supabase
    .from("school_teacher_memberships")
    .select("id, school_id, teacher_id, class_id")
    .eq("teacher_id", teacherId)
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
    studentOnboarding?.role === "student" || studentProfile.role === "student";

  if (!isStudentRole) {
    throw createError({
      statusCode: 400,
      statusMessage: "This user is not onboarded as a student.",
    });
  }

  if (studentProfile.school_id !== teacherProfile.school_id) {
    const { error: updateStudentError } = await supabase
      .from("profiles")
      .update({ school_id: teacherProfile.school_id, role: "student" })
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
        added_by: teacherId,
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
