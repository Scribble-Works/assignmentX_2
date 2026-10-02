import { createClient } from "@supabase/supabase-js";

// Learner Tracker data: a teacher (or school admin) views MPAP progress
// for the learners in their classes. Service key + role check, mirroring
// server/api/school-admin/context.get.ts.
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
  const { userId, classId } = getQuery(event);
  if (!userId || typeof userId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing userId" });
  }
  const supabase = getSupabase();

  const { data: profile } = await supabase
    .from("profiles").select("id, role, school_id").eq("id", userId).single();
  const { data: onboarding } = await supabase
    .from("onboarding").select("role").eq("id", userId).single();
  const role = profile?.role === "school_admin" ? "school_admin" : (onboarding?.role || profile?.role);
  const normalized = ["teacher", "facilitator"].includes(role || "") ? "educator" : role;
  if (!["educator", "school_admin"].includes(normalized || "")) {
    throw createError({ statusCode: 403, statusMessage: "Only educators or school admins can view learner progress." });
  }

  // Resolve this teacher's class ids (admins see all classes in their school).
  let classIds: string[] = [];
  if (normalized === "school_admin") {
    const { data: school } = await supabase.from("schools").select("id").eq("admin_id", userId).maybeSingle();
    const schoolId = school?.id || profile?.school_id;
    const { data: classes } = await supabase.from("school_classes").select("id").eq("school_id", schoolId);
    classIds = (classes || []).map((c: any) => c.id);
  } else {
    const { data: memberships } = await supabase
      .from("school_teacher_memberships").select("class_id").eq("teacher_id", userId);
    classIds = (memberships || []).map((m: any) => m.class_id);
  }
  if (classId && typeof classId === "string") classIds = classIds.filter((c) => c === classId);
  if (!classIds.length) return { lessons: [], learners: [] };

  // Students in those classes.
  const { data: cs } = await supabase
    .from("class_students").select("student_id, class_id").in("class_id", classIds);
  const studentIds = [...new Set((cs || []).map((r: any) => r.student_id))];

  const { data: lessons } = await supabase
    .from("mpap_lessons")
    .select("id, title, lesson_order, mpap_standards(code, grade)")
    .eq("status", "published").order("lesson_order");

  let learners: any[] = [];
  if (studentIds.length) {
    const { data: students } = await supabase
      .from("profiles").select("id, firstName, lastName, email").in("id", studentIds);
    const { data: progress } = await supabase
      .from("mpap_progress").select("student_id, lesson_id, completed, worksheet_score, completed_at").in("student_id", studentIds);
    const byStudent = new Map<string, any[]>();
    (progress || []).forEach((p: any) => {
      if (!byStudent.has(p.student_id)) byStudent.set(p.student_id, []);
      byStudent.get(p.student_id)!.push(p);
    });
    learners = (students || []).map((s: any) => {
      const rows = byStudent.get(s.id) || [];
      const completed = rows.filter((r: any) => r.completed).map((r: any) => r.lesson_id);
      return {
        student: s,
        completedLessonIds: completed,
        completedCount: completed.length,
        totalLessons: (lessons || []).length,
        progress: rows,
      };
    });
  }

  return { lessons: lessons || [], learners };
});
