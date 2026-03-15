// ── TypeScript types mirroring the Supabase schema ───────────────────────────

export interface PortfolioProject {
  id:            string
  title:         string
  category:      string
  year:          string
  description:   string
  tags:          string[]
  gradient:      string
  accent:        string
  thumbnail_url: string | null
  youtube_url:   string | null
  youtube_id:    string | null
  display_order: number
  is_featured:   boolean
  created_at:    string
  updated_at:    string
}

export type ContactStatus = 'new' | 'read' | 'replied' | 'archived'

export interface ContactSubmission {
  id:           string
  name:         string
  email:        string
  company:      string | null
  project_type: string | null
  budget:       string | null
  message:      string
  status:       ContactStatus
  notes:        string | null
  created_at:   string
  updated_at:   string
}

export interface InquiryCounts {
  new_count:      number
  read_count:     number
  replied_count:  number
  archived_count: number
  total_count:    number
}

export interface Service {
  id:            string
  title:         string
  tagline:       string
  description:   string
  icon_name:     string
  color_theme:   string
  display_order: number
  is_active:     boolean
  created_at:    string
  updated_at:    string
}
