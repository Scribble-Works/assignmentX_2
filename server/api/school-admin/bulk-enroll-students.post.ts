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
  const actorId = String(body?.actorId || "").trim();
  const classId = String(body?.classId || "").trim();
  const schoolId = String(body?.schoolId || "").trim();
  const students = Array.isArray(body?.students) ? body.students : [];

  if (!actorId || !classId || !schoolId || students.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "actorId, classId, schoolId and at least one student are required.",
    });
  }

  const supabase = getSupabase();

  const { data: actorProfile, error: actorError } = await supabase
    .from("profiles")
    .select("id, role, school_id")
    .eq("id", actorId)
    .single();

  if (actorError || !actorProfile) {
    throw createError({ statusCode: 404, statusMessage: "Actor not found." });
  }

  const { data: onboarding } = await supabase
    .from("onboarding")
    .select("role")
    .eq("id", actorId)
    .maybeSingle();

  const actorRole =
    actorProfile.role === "school_admin"
      ? "school_admin"
      : onboarding?.role || actorProfile.role || "";
  const normalizedActorRole = ["teacher", "facilitator"].includes(actorRole)
    ? "educator"
    : actorRole;

  if (!["school_admin", "educator"].includes(normalizedActorRole)) {
    throw createError({
      statusCode: 403,
      statusMessage:
        "Only school admins or educators can bulk enroll students.",
    });
  }

  let resolvedSchoolId = actorProfile.school_id || null;
  if (!resolvedSchoolId) {
    const { data: schoolRow } = await supabase
      .from("schools")
      .select("id")
      .eq("admin_id", actorId)
      .single();
    resolvedSchoolId = schoolRow?.id || null;
  }

  if (!resolvedSchoolId) {
    throw createError({
      statusCode: 404,
      statusMessage: "No school found for this actor.",
    });
  }

  if (resolvedSchoolId !== schoolId) {
    throw createError({
      statusCode: 403,
      statusMessage: "You can only upload students to your own school.",
    });
  }

  const { data: classRow, error: classError } = await supabase
    .from("school_classes")
    .select("id, school_id")
    .eq("id", classId)
    .single();

  if (classError || !classRow || classRow.school_id !== resolvedSchoolId) {
    throw createError({
      statusCode: 404,
      statusMessage: "Class not found for this school.",
    });
  }

  if (normalizedActorRole === "educator") {
    const { data: membership } = await supabase
      .from("school_teacher_memberships")
      .select("id")
      .eq("teacher_id", actorId)
      .eq("class_id", classId)
      .maybeSingle();

    if (!membership) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "You can only bulk enroll students into your assigned classes.",
      });
    }
  }

  const errors: Array<{ email: string; student: string; error: string }> = [];
  let successCount = 0;
  let errorCount = 0;

  for (const entry of students) {
    const email = String(entry?.email || "")
      .trim()
      .toLowerCase();
    const firstName = String(entry?.firstName || "").trim();
    const lastName = String(entry?.lastName || "").trim();

    if (!email) {
      errorCount += 1;
      errors.push({
        email: "",
        student:
          [firstName, lastName].filter(Boolean).join(" ") || "Unknown student",
        error: "Missing email.",
      });
      continue;
    }

    const { data: studentProfile, error: studentError } = await supabase
      .from("profiles")
      .select("id, firstName, lastName, email, role, school_id")
      .ilike("email", email)
      .maybeSingle();

    if (studentError || !studentProfile) {
      errorCount += 1;
      errors.push({
        email,
        student: [firstName, lastName].filter(Boolean).join(" ") || email,
        error: "Student account not found.",
      });
      continue;
    }

    const { data: studentOnboarding } = await supabase
      .from("onboarding")
      .select("role")
      .eq("id", studentProfile.id)
      .maybeSingle();

    const isStudentRole =
      studentProfile.role === "student" ||
      studentOnboarding?.role === "student";

    if (!isStudentRole) {
      errorCount += 1;
      errors.push({
        email,
        student:
          [studentProfile.firstName, studentProfile.lastName]
            .filter(Boolean)
            .join(" ") || email,
        error: "This account is not onboarded as a student.",
      });
      continue;
    }

    if (
      studentProfile.school_id &&
      studentProfile.school_id !== resolvedSchoolId
    ) {
      errorCount += 1;
      errors.push({
        email,
        student:
          [studentProfile.firstName, studentProfile.lastName]
            .filter(Boolean)
            .join(" ") || email,
        error: "Student belongs to a different school.",
      });
      continue;
    }

    if (!studentProfile.school_id) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ school_id: resolvedSchoolId, role: "student" })
        .eq("id", studentProfile.id);

      if (updateError) {
        errorCount += 1;
        errors.push({
          email,
          student:
            [studentProfile.firstName, studentProfile.lastName]
              .filter(Boolean)
              .join(" ") || email,
          error: updateError.message,
        });
        continue;
      }
    }

    const { data: existingMembership } = await supabase
      .from("class_students")
      .select("id")
      .eq("class_id", classId)
      .eq("student_id", studentProfile.id)
      .maybeSingle();

    if (!existingMembership) {
      const { error: insertError } = await supabase
        .from("class_students")
        .insert({
          class_id: classId,
          student_id: studentProfile.id,
          added_by: actorId,
        });

      if (insertError) {
        errorCount += 1;
        errors.push({
          email,
          student:
            [studentProfile.firstName, studentProfile.lastName]
              .filter(Boolean)
              .join(" ") || email,
          error: insertError.message,
        });
        continue;
      }
    }

    successCount += 1;
  }

  return {
    success: true,
    successCount,
    errorCount,
    errors,
  };
});
