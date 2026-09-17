import { createClient } from "@supabase/supabase-js";

// Facilitator Tracker: how a school's TEACHERS are implementing MPAP.
// Server-side aggregation with the service key after verifying the caller
// is the school admin. Mirrors server/api/school-admin/context.get.ts.
const getSupabase = () => {
  const config = useRuntimeConfig();
  const url = process.env.SUPABASE_URL;
  const key =
    (config.SUPABASE_SERVICE_KEY as string | undefined) ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw createError({ statusCode: 500, statusMessage: "Supabase service credentials are not configured." });
  }
  return createClient(url, key);
};

export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event);
  if (!userId || typeof userId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing userId" });
  }
  const supabase = getSupabase();

  const { data: profile } = await supabase
    .from("profiles").select("id, role, school_id").eq("id", userId).single();
  if (!profile || profile.role !== "school_admin") {
    throw createError({ statusCode: 403, statusMessage: "Only school admins can view the Facilitator Tracker." });
  }

  const { data: school } = await supabase
    .from("schools").select("id, name").eq("admin_id", userId).maybeSingle();
  const schoolId = school?.id || profile.school_id;
  if (!schoolId) {
    throw createError({ statusCode: 404, statusMessage: "No school linked to this account." });
  }

  // Teachers in the school.
  const { data: teachers } = await supabase
    .from("profiles")
    .select("id, firstName, lastName, email")
    .eq("school_id", schoolId)
    .eq("role", "educator");

  const teacherIds = (teachers || []).map((t: any) => t.id);

  // Total published lessons = 100% coverage target.
  const { count: totalLessons } = await supabase
    .from("mpap_lessons").select("id", { count: "exact", head: true }).eq("status", "published");

  // Classes + class students so we can attribute learner progress to teachers.
  const { data: memberships } = await supabase
    .from("school_teacher_memberships")
    .select("teacher_id, class_id").eq("school_id", schoolId);

  const classByTeacher = new Map<string, string[]>();
  (memberships || []).forEach((m: any) => {
    if (!classByTeacher.has(m.teacher_id)) classByTeacher.set(m.teacher_id, []);
    classByTeacher.get(m.teacher_id)!.push(m.class_id);
  });

  const rows: any[] = [];
  for (const t of teachers || []) {
    const classIds = classByTeacher.get(t.id) || [];
    let studentIds: string[] = [];
    if (classIds.length) {
      const { data: cs } = await supabase
        .from("class_students").select("student_id").in("class_id", classIds);
      studentIds = [...new Set((cs || []).map((r: any) => r.student_id))];
    }
    let lessonsDelivered = 0;
    let activeLearners = 0;
    if (studentIds.length) {
      const { data: prog } = await supabase
        .from("mpap_progress")
        .select("lesson_id, student_id, completed")
        .in("student_id", studentIds);
      lessonsDelivered = new Set((prog || []).filter((p: any) => p.completed).map((p: any) => p.lesson_id)).size;
      activeLearners = new Set((prog || []).map((p: any) => p.student_id)).size;
    }
    rows.push({
      teacher: t,
      classes: classIds.length,
      students: studentIds.length,
      activeLearners,
      lessonsDelivered,
      coveragePct: totalLessons ? Math.round((lessonsDelivered / (totalLessons || 1)) * 100) : 0,
      started: lessonsDelivered > 0 || activeLearners > 0,
    });
  }

  return { school: { id: schoolId, name: school?.name || null }, totalLessons: totalLessons || 0, teachers: rows };
});
