-- =====================================================================
--  MPAP (Maths Practical Application Package) — Premium feature schema
--  Run this in the Supabase SQL editor for the AssignmentX project.
--  Idempotent where practical. Review RLS before applying to prod.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ENTITLEMENTS  (generic premium access layer — reusable, not MPAP-only)
--    A user has access to a feature when an active, unexpired row exists.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS entitlements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature      VARCHAR(50)  NOT NULL,               -- e.g. 'mpap'
  source       VARCHAR(50)  DEFAULT 'paystack',     -- paystack | school_plan | admin_grant | trial
  school_id    UUID REFERENCES schools(id) ON DELETE SET NULL, -- set when granted via a school plan
  status       VARCHAR(20)  DEFAULT 'active',       -- active | expired | revoked
  granted_at   TIMESTAMPTZ  DEFAULT NOW(),
  expires_at   TIMESTAMPTZ,                         -- NULL = perpetual
  paystack_ref TEXT,
  UNIQUE (user_id, feature)
);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_feature ON entitlements(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_entitlements_school       ON entitlements(school_id);

-- Helper: does the current auth user hold an active entitlement for a feature?
CREATE OR REPLACE FUNCTION has_entitlement(p_feature TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM entitlements e
    WHERE e.user_id = auth.uid()
      AND e.feature = p_feature
      AND e.status  = 'active'
      AND (e.expires_at IS NULL OR e.expires_at > NOW())
  );
$$;

-- ---------------------------------------------------------------------
-- 2. MPAP CONTENT TABLES  (kept fully separate from workbook/worksheet tables)
-- ---------------------------------------------------------------------

-- The 60 NaCCA minimum standards — the spine of the package.
CREATE TABLE IF NOT EXISTS mpap_standards (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           VARCHAR(20) NOT NULL,             -- e.g. 'B7.1.2.1'
  grade          SMALLINT NOT NULL CHECK (grade IN (7, 8, 9)),
  strand         TEXT NOT NULL,
  sub_strand     TEXT,
  title          TEXT NOT NULL,
  standard_order INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_mpap_standards_grade ON mpap_standards(grade);

-- One lesson package per standard (single FK for now; swap to a join
-- table later if several standards should share one lesson).
CREATE TABLE IF NOT EXISTS mpap_lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id  UUID REFERENCES mpap_standards(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  overview     TEXT,
  objectives   JSONB DEFAULT '[]'::jsonb,          -- learning indicators
  lesson_order INT DEFAULT 0,
  status       VARCHAR(20) DEFAULT 'published',     -- draft | published
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mpap_lessons_standard ON mpap_lessons(standard_id);

-- MPAP-specific worksheets (separate from the platform `facilitator-resources`).
CREATE TABLE IF NOT EXISTS mpap_worksheets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       UUID REFERENCES mpap_lessons(id) ON DELETE CASCADE,
  title           TEXT,
  content         JSONB DEFAULT '{}'::jsonb,        -- blocks/questions (KaTeX-friendly, like quizzes)
  file_url        TEXT,                             -- optional downloadable PDF
  worksheet_order INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_mpap_worksheets_lesson ON mpap_worksheets(lesson_id);

CREATE TABLE IF NOT EXISTS mpap_answer_guides (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worksheet_id UUID REFERENCES mpap_worksheets(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES mpap_lessons(id) ON DELETE CASCADE,
  content      JSONB DEFAULT '{}'::jsonb,           -- worked solutions
  file_url     TEXT
);
CREATE INDEX IF NOT EXISTS idx_mpap_guides_lesson ON mpap_answer_guides(lesson_id);

-- Practical maths videos — BUILT NOW, populated later.
-- status='coming_soon' + video_url NULL renders a placeholder card.
CREATE TABLE IF NOT EXISTS mpap_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID REFERENCES mpap_lessons(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  video_url   TEXT,                                 -- NULL = coming soon
  status      VARCHAR(20) DEFAULT 'coming_soon',    -- coming_soon | published
  video_order INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_mpap_videos_lesson ON mpap_videos(lesson_id);

-- Learner progress through MPAP (feeds the Learner Tracker).
CREATE TABLE IF NOT EXISTS mpap_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id       UUID REFERENCES mpap_lessons(id) ON DELETE CASCADE NOT NULL,
  standard_id     UUID REFERENCES mpap_standards(id) ON DELETE SET NULL,
  worksheet_score NUMERIC,
  completed       BOOLEAN DEFAULT FALSE,
  completed_at    TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_mpap_progress_student ON mpap_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_mpap_progress_lesson  ON mpap_progress(lesson_id);

-- ---------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
--    Content tables: readable only by users entitled to MPAP.
--    (Seeding/editing is done with the service key from the server.)
-- ---------------------------------------------------------------------
ALTER TABLE mpap_standards     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpap_lessons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpap_worksheets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpap_answer_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpap_videos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpap_progress      ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements       ENABLE ROW LEVEL SECURITY;

-- Entitled users can READ content.
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['mpap_standards','mpap_lessons','mpap_worksheets','mpap_answer_guides','mpap_videos']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "mpap read for entitled" ON %I;', t);
    EXECUTE format(
      'CREATE POLICY "mpap read for entitled" ON %I FOR SELECT USING (has_entitlement(''mpap''));', t);
  END LOOP;
END $$;

-- Users can see their own entitlements.
DROP POLICY IF EXISTS "own entitlements" ON entitlements;
CREATE POLICY "own entitlements" ON entitlements FOR SELECT USING (user_id = auth.uid());

-- Learners read/write their own progress; entitlement required.
DROP POLICY IF EXISTS "own mpap progress" ON mpap_progress;
CREATE POLICY "own mpap progress" ON mpap_progress FOR ALL
  USING (student_id = auth.uid() AND has_entitlement('mpap'))
  WITH CHECK (student_id = auth.uid() AND has_entitlement('mpap'));

-- NOTE: teacher/admin read of learner progress and the trackers is served
-- from the server using the service key (see server/api/mpap/*), which
-- bypasses RLS after verifying the caller's role — same pattern as
-- server/api/school-admin/context.get.ts.

-- ---------------------------------------------------------------------
-- 4. SEED — sample standards/lessons so the UI renders before full content.
--    Safe to delete once real content is loaded.
-- ---------------------------------------------------------------------
INSERT INTO mpap_standards (code, grade, strand, sub_strand, title, standard_order)
VALUES
  ('B7.1.1.1', 7, 'Number', 'Number & Numeration Systems', 'Model number quantities up to 1,000,000,000', 1),
  ('B7.2.1.1', 7, 'Algebra', 'Patterns & Relations', 'Extend and generalise number/shape patterns', 2),
  ('B8.1.2.1', 8, 'Number', 'Number Operations', 'Apply operations on fractions in real-life contexts', 3),
  ('B9.3.1.1', 9, 'Geometry & Measurement', 'Shape & Space', 'Apply properties of angles to solve problems', 4)
ON CONFLICT DO NOTHING;

INSERT INTO mpap_lessons (standard_id, title, overview, objectives, lesson_order)
SELECT s.id,
       'Lesson: ' || s.title,
       'Practical, ready-to-teach package aligned to NaCCA standard ' || s.code || '.',
       '["Understand the core idea","Apply it to a real Ghanaian context","Complete the MPAP worksheet"]'::jsonb,
       s.standard_order
FROM mpap_standards s
ON CONFLICT DO NOTHING;

-- One coming-soon video placeholder per lesson so the video section renders now.
INSERT INTO mpap_videos (lesson_id, title, description, status)
SELECT l.id, 'Practical demonstration', 'Video walkthrough — coming soon.', 'coming_soon'
FROM mpap_lessons l
ON CONFLICT DO NOTHING;
