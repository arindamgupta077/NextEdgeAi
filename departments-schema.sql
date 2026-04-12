-- ============================================================
-- SCHEMA: departments + FK migration
-- Run AFTER team-careers-schema.sql
-- ============================================================

-- ── 1. Create departments table ───────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_departments_updated_at ON departments;
CREATE TRIGGER set_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: public read, authenticated write
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read departments" ON departments;
CREATE POLICY "Public read departments"
  ON departments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Auth manage departments" ON departments;
CREATE POLICY "Auth manage departments"
  ON departments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── 2. Seed existing distinct department names ────────────────
-- Inserts the unique departments that already appear in your seed data.
-- Run this AFTER creating the table and BEFORE adding the FK columns.
INSERT INTO departments (name)
SELECT DISTINCT department
FROM team_members
WHERE department IS NOT NULL AND department <> ''
UNION
SELECT DISTINCT department
FROM career_roles
WHERE department IS NOT NULL AND department <> ''
ON CONFLICT (name) DO NOTHING;


-- ── 3. Add department_id FK columns ──────────────────────────
-- team_members
ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

-- Back-fill from the text column
UPDATE team_members tm
SET    department_id = d.id
FROM   departments d
WHERE  d.name = tm.department
  AND  tm.department_id IS NULL;

-- career_roles
ALTER TABLE career_roles
  ADD COLUMN IF NOT EXISTS department_id UUID REFERENCES departments(id) ON DELETE SET NULL;

UPDATE career_roles cr
SET    department_id = d.id
FROM   departments d
WHERE  d.name = cr.department
  AND  cr.department_id IS NULL;


-- ── 4. (Optional — run after verifying data) ─────────────────
-- Once department_id is populated you can enforce NOT NULL and drop
-- the old text column.  Comment this block out if you want to keep the
-- text column as a fallback for now.
--
-- ALTER TABLE team_members ALTER COLUMN department_id SET NOT NULL;
-- ALTER TABLE team_members DROP COLUMN department;
--
-- ALTER TABLE career_roles ALTER COLUMN department_id SET NOT NULL;
-- ALTER TABLE career_roles DROP COLUMN department;
