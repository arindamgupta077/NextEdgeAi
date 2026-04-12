-- ============================================================
-- SCHEMA: career_applications
-- Run AFTER team-careers-schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS career_applications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id        UUID REFERENCES career_roles(id) ON DELETE SET NULL,
  role_title     TEXT NOT NULL,
  department     TEXT NOT NULL,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  linkedin_url   TEXT,
  portfolio_url  TEXT,
  cover_letter   TEXT,
  status         TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'reviewed', 'shortlisted', 'rejected', 'archived')),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE TRIGGER set_career_applications_updated_at
  BEFORE UPDATE ON career_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for fast admin queries
CREATE INDEX IF NOT EXISTS idx_career_applications_status     ON career_applications(status);
CREATE INDEX IF NOT EXISTS idx_career_applications_role_id    ON career_applications(role_id);
CREATE INDEX IF NOT EXISTS idx_career_applications_created_at ON career_applications(created_at DESC);

-- RLS
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (submit an application)
CREATE POLICY "Public can submit applications"
  ON career_applications FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users (admin) can SELECT / UPDATE / DELETE
CREATE POLICY "Admins can read applications"
  ON career_applications FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update applications"
  ON career_applications FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete applications"
  ON career_applications FOR DELETE
  TO authenticated
  USING (true);
