// Data access for the MPAP premium package. Reads are protected by RLS,
// so a non-entitled user simply gets empty results.
export function useMpap() {
  const client = useSupabaseClient();
  const user = useSupabaseUser();

  const getStandards = async (grade = null) => {
    let q = client.from("mpap_standards").select("*").order("standard_order");
    if (grade) q = q.eq("grade", Number(grade));
    const { data } = await q;
    return data || [];
  };

  // Lessons for a grade, joined to their standard.
  const getLessonsByGrade = async (grade) => {
    const { data } = await client
      .from("mpap_lessons")
      .select("*, mpap_standards!inner(id, code, grade, strand, sub_strand, title)")
      .eq("mpap_standards.grade", Number(grade))
      .eq("status", "published")
      .order("lesson_order");
    return data || [];
  };

  // Full lesson package: lesson + standard + worksheets + guides + videos.
  const getLesson = async (lessonId) => {
    const { data: lesson } = await client
      .from("mpap_lessons")
      .select("*, mpap_standards(id, code, grade, strand, sub_strand, title)")
      .eq("id", lessonId)
      .maybeSingle();
    if (!lesson) return null;

    const [{ data: worksheets }, { data: guides }, { data: videos }] =
      await Promise.all([
        client.from("mpap_worksheets").select("*").eq("lesson_id", lessonId).order("worksheet_order"),
        client.from("mpap_answer_guides").select("*").eq("lesson_id", lessonId),
        client.from("mpap_videos").select("*").eq("lesson_id", lessonId).order("video_order"),
      ]);

    return {
      ...lesson,
      standard: lesson.mpap_standards,
      worksheets: worksheets || [],
      guides: guides || [],
      videos: videos || [],
    };
  };

  const getMyProgress = async () => {
    if (!user.value?.id) return [];
    const { data } = await client
      .from("mpap_progress")
      .select("*")
      .eq("student_id", user.value.id);
    return data || [];
  };

  // Upsert learner progress for a lesson (self only; RLS enforces).
  const markProgress = async (lessonId, standardId, { completed = true, score = null } = {}) => {
    if (!user.value?.id) return { error: "not-signed-in" };
    const { error } = await client.from("mpap_progress").upsert(
      {
        student_id: user.value.id,
        lesson_id: lessonId,
        standard_id: standardId,
        completed,
        worksheet_score: score,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "student_id,lesson_id" },
    );
    return { error };
  };

  return { getStandards, getLessonsByGrade, getLesson, getMyProgress, markProgress };
}
