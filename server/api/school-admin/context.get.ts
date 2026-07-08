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
  const { userId } = getQuery(event);
  if (!userId || typeof userId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing userId" });
  }

  const supabase = getSupabase();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, firstName, lastName, email, role, school_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw createError({ statusCode: 404, statusMessage: "Profile not found." });
  }

  const { data: onboarding } = await supabase
    .from("onboarding")
    .select("role")
    .eq("id", userId)
    .single();

  const actorRole =
    profile.role === "school_admin"
      ? "school_admin"
      : onboarding?.role || profile.role || null;

  if (!actorRole || !["school_admin", "educator"].includes(actorRole)) {
    throw createError({
      statusCode: 403,
      statusMessage: "Only school admins or educators can access this page.",
    });
  }

  let school = null as any;
  if (actorRole === "school_admin") {
    const schoolByAdmin = await supabase
      .from("schools")
      .select("id, name, district, school_type, admin_id")
      .eq("admin_id", userId)
      .maybeSingle();

    school = schoolByAdmin.data;
    if (!school && profile.school_id) {
      const schoolById = await supabase
        .from("schools")
        .select("id, name, district, school_type, admin_id")
        .eq("id", profile.school_id)
        .maybeSingle();
      school = schoolById.data;
    }
  } else if (profile.school_id) {
    const schoolById = await supabase
      .from("schools")
      .select("id, name, district, school_type, admin_id")
      .eq("id", profile.school_id)
      .maybeSingle();
    school = schoolById.data;
  }

  if (!school?.id) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "No school is linked to this account yet. Ask your school admin to link your account.",
    });
  }

  const { data: teachers, error: teachersError } = await supabase
    .from("profiles")
    .select("id, firstName, lastName, email, school_id")
    .eq("school_id", school.id)
    .eq("role", "educator")
    .order("firstName", { ascending: true });

  if (teachersError) {
    throw createError({
      statusCode: 500,
      statusMessage: teachersError.message,
    });
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("school_teacher_memberships")
    .select("id, school_id, teacher_id, class_id, created_at")
    .eq("school_id", school.id)
    .order("created_at", { ascending: false });

  if (membershipsError) {
    throw createError({
      statusCode: 500,
      statusMessage: membershipsError.message,
    });
  }

  let classIds = (memberships || [])
    .map((m: any) => m.class_id)
    .filter(Boolean);
  if (actorRole === "educator") {
    classIds = (memberships || [])
      .filter((m: any) => m.teacher_id === userId)
      .map((m: any) => m.class_id)
      .filter(Boolean);
  }

  const { data: classes, error: classesError } = await supabase
    .from("school_classes")
    .select("id, school_id, name, grade_level, created_by, created_at")
    .eq("school_id", school.id)
    .order("created_at", { ascending: false });

  if (classesError) {
    throw createError({ statusCode: 500, statusMessage: classesError.message });
  }

  const filteredClasses =
    actorRole === "educator"
      ? (classes || []).filter((c: any) => classIds.includes(c.id))
      : classes || [];

  const classIdSet = new Set(filteredClasses.map((c: any) => c.id));

  const { data: classStudentsRaw, error: classStudentsError } = await supabase
    .from("class_students")
    .select("id, class_id, student_id, added_by, created_at")
    .in("class_id", [...classIdSet]);

  if (classStudentsError) {
    throw createError({
      statusCode: 500,
      statusMessage: classStudentsError.message,
    });
  }

  const studentIds = (classStudentsRaw || []).map((row: any) => row.student_id);
  let studentsById = new Map<string, any>();

  if (studentIds.length > 0) {
    const { data: studentProfiles } = await supabase
      .from("profiles")
      .select("id, firstName, lastName, email")
      .in("id", studentIds);
    studentsById = new Map((studentProfiles || []).map((s: any) => [s.id, s]));
  }

  const classStudents = (classStudentsRaw || []).map((row: any) => ({
    ...row,
    student: studentsById.get(row.student_id) || null,
  }));

  return {
    actorRole,
    user: profile,
    school,
    teachers: teachers || [],
    memberships: memberships || [],
    classes: filteredClasses,
    classStudents,
  };
});
