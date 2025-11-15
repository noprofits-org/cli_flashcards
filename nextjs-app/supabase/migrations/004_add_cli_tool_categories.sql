-- Add new CLI tool categories
INSERT INTO flashcard_sets (id, name, description, card_count) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'git-basics', 'Master fundamental Git commands', 0),
  ('b0000000-0000-0000-0000-000000000002', 'git-advanced', 'Advanced Git workflows and options', 0),
  ('c0000000-0000-0000-0000-000000000001', 'vercel-basics', 'Learn Vercel CLI essentials', 0),
  ('c0000000-0000-0000-0000-000000000002', 'vercel-advanced', 'Master Vercel deployment flags', 0),
  ('d0000000-0000-0000-0000-000000000001', 'supabase-basics', 'Supabase CLI fundamentals', 0),
  ('d0000000-0000-0000-0000-000000000002', 'supabase-advanced', 'Advanced Supabase operations', 0),
  ('e0000000-0000-0000-0000-000000000001', 'linux-basics', 'Essential Linux commands', 0),
  ('e0000000-0000-0000-0000-000000000002', 'linux-advanced', 'Advanced Linux system administration', 0),
  ('f0000000-0000-0000-0000-000000000001', 'freebsd-basics', 'FreeBSD command essentials', 0),
  ('f0000000-0000-0000-0000-000000000002', 'freebsd-advanced', 'Advanced FreeBSD administration', 0);

-- Update existing clasp sets to be more specific
UPDATE flashcard_sets SET name = 'clasp-basics', description = 'Learn fundamental clasp commands for Google Apps Script' WHERE id = 'a0000000-0000-0000-0000-000000000001';
UPDATE flashcard_sets SET name = 'clasp-advanced', description = 'Master clasp command flags and options' WHERE id = 'a0000000-0000-0000-0000-000000000002';
