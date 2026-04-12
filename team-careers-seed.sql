-- ============================================================
-- SEED: sample team members & career roles
-- Run AFTER team-careers-schema.sql
-- ============================================================

-- ── Team Members ─────────────────────────────────────────────
INSERT INTO team_members (name, role, department, bio, display_order, is_active) VALUES
  ('Tanmay Gupta',   'Chief Creative Officer',         'Creative Direction', 'Former award-winning director with 15 years in cinematic advertising. Arjun fuses traditional filmmaking instincts with AI-first creative thinking.', 1,  true),
  ('Mayank Pandit',     'Creative Director — Narrative',  'Creative Direction', 'Novelist-turned-screenwriter who leads our AI narrative systems team. Her methodology has shaped over 80 brand film campaigns.', 2, true),
  ('Ravi Krishnan', 'Chief AI Officer',               'AI & Engineering',   'PhD in Generative Models from IIT Bombay, previously led AI research at a top VFX studio. Ravi built our generative visual intelligence engine from the ground up.', 3, true),


-- ── Career Roles ─────────────────────────────────────────────
INSERT INTO career_roles (title, department, location, type, description, requirements, display_order, is_active) VALUES
  (
    'Senior AI Research Engineer — Video Generation',
    'AI & Engineering',
    'Remote (Global)',
    'Full-Time',
    'Lead research and development on our next-generation video diffusion models, with a focus on temporal coherence, cinematographic quality, and real-time inference optimization.',
    ARRAY['PhD or equivalent in ML/CV', '3+ years generative model research', 'PyTorch / JAX proficiency', 'Video diffusion model experience'],
    1, true
  ),
  (
    'AI Film Director',
    'Creative Direction',
    'Remote (Global)',
    'Full-Time',
    'Direct AI-assisted productions from concept to delivery. You will work alongside our GVI engine, virtual production suite, and human crews to craft cinematic narratives for brands and studios.',
    ARRAY['5+ films or commercial credits', 'Fluency with AI tools (MidJourney, Runway, Kling)', 'Strong visual storytelling instinct', 'Experience with virtual production a plus'],
    2, true
  ),
  (
    'Narrative Strategist',
    'Creative Direction',
    'Remote (Global)',
    'Full-Time',
    'Develop story frameworks, brand narratives, and audience strategies for our global client roster. You will bridge the gap between brand goals and cinematic storytelling.',
    ARRAY['Background in screenwriting or brand strategy', 'Strong research and synthesis skills', 'Proven campaign narrative work', 'Comfortable with AI writing tools'],
    3, true
  ),
  (
    'ML Infrastructure Engineer',
    'AI & Engineering',
    'Remote (Global)',
    'Full-Time',
    'Build and maintain the cloud infrastructure that powers our production pipeline. Focus on GPU orchestration, model serving, and low-latency rendering at scale.',
    ARRAY['5+ years cloud infrastructure (AWS/GCP)', 'Kubernetes & Docker expertise', 'CUDA / GPU workload optimization', 'Experience with large-scale ML serving'],
    4, true
  ),
  (
    'Client Partnership Manager',
    'Strategy & Brand',
    'London / Dubai / Remote',
    'Full-Time',
    'Manage and grow relationships with brand and agency partners. You will be the bridge between client ambitions and our creative/technical capabilities.',
    ARRAY['5+ years in advertising or production sales', 'Strong client relationship track record', 'Understanding of film/video production', 'Experience with enterprise contracts'],
    5, true
  ),
  (
    'Post-Production Supervisor — AI Workflow',
    'Production',
    'Remote (Global)',
    'Full-Time',
    'Oversee the intelligent post-production pipeline, coordinating AI-assisted color grading, sound design, and editorial across multiple simultaneous projects.',
    ARRAY['8+ years post-production supervision', 'DaVinci Resolve / Avid / Premiere Pro', 'Experience integrating AI post tools', 'VFX pipeline knowledge'],
    6, true
  ),
  (
    'Prompt Engineer — Cinematic AI',
    'AI & Engineering',
    'Remote (Global)',
    'Contract / Full-Time',
    'Craft and optimize prompt systems for our generative visual and narrative AI engines. Your work directly shapes the quality and consistency of every NextEdgeAI production.',
    ARRAY['Deep knowledge of image/video gen models', 'Systematic approach to prompt engineering', 'Cinematic aesthetics literacy', 'Python scripting skills'],
    7, true
  ),
  (
    'Marketing & Content Lead',
    'Strategy & Brand',
    'Remote (Global)',
    'Full-Time',
    'Lead NextEdgeAI''s external marketing, thought leadership, and content presence. Shape how the world understands the future of AI filmmaking through compelling storytelling.',
    ARRAY['5+ years B2B content or brand marketing', 'Excellent writing and editing skills', 'Experience in tech or creative industries', 'Social and SEO proficiency'],
    8, true
  );
