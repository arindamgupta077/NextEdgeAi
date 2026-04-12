-- ============================================================
-- SCHEMA: team_members & career_roles
-- Run this FIRST in your Supabase SQL editor
-- ============================================================

-- ── team_members ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  role          TEXT NOT NULL,
  department    TEXT NOT NULL,
  bio           TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_team_members_updated_at ON team_members;
CREATE TRIGGER set_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: public read, authenticated write
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read team_members" ON team_members;
CREATE POLICY "Public read team_members"
  ON team_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Auth manage team_members" ON team_members;
CREATE POLICY "Auth manage team_members"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);


-- ── career_roles ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_roles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  department    TEXT NOT NULL,
  location      TEXT NOT NULL DEFAULT 'Remote (Global)',
  type          TEXT NOT NULL DEFAULT 'Full-Time',
  description   TEXT NOT NULL DEFAULT '',
  requirements  TEXT[] NOT NULL DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_career_roles_updated_at ON career_roles;
CREATE TRIGGER set_career_roles_updated_at
  BEFORE UPDATE ON career_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE career_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read career_roles" ON career_roles;
CREATE POLICY "Public read career_roles"
  ON career_roles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Auth manage career_roles" ON career_roles;
CREATE POLICY "Auth manage career_roles"
  ON career_roles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
