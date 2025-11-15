-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Flashcard sets/categories table
CREATE TABLE flashcard_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  card_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual flashcards table
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  answer TEXT NOT NULL,
  description TEXT NOT NULL,
  when_to_use TEXT NOT NULL,
  scenarios JSONB NOT NULL DEFAULT '[]',
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  session_id UUID,
  user_answer TEXT,
  is_correct BOOLEAN NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  set_id UUID NOT NULL REFERENCES flashcard_sets(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_guest BOOLEAN DEFAULT FALSE,
  guest_session_id TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_flashcards_set_id ON flashcards(set_id);
CREATE INDEX idx_flashcards_order ON flashcards(set_id, order_index);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_session_id ON user_progress(session_id);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_guest ON user_sessions(guest_session_id) WHERE is_guest = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flashcard_sets (public read)
CREATE POLICY "Flashcard sets are viewable by everyone"
  ON flashcard_sets FOR SELECT
  USING (true);

-- RLS Policies for flashcards (public read)
CREATE POLICY "Flashcards are viewable by everyone"
  ON flashcards FOR SELECT
  USING (true);

-- RLS Policies for user_progress (users can only see their own progress)
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id OR (is_guest = TRUE));

CREATE POLICY "Users can create their own sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR (is_guest = TRUE));

CREATE POLICY "Users can update their own sessions"
  ON user_sessions FOR UPDATE
  USING (auth.uid() = user_id OR (is_guest = TRUE AND guest_session_id IS NOT NULL));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_flashcard_sets_updated_at
  BEFORE UPDATE ON flashcard_sets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update flashcard_sets.card_count
CREATE OR REPLACE FUNCTION update_flashcard_set_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE flashcard_sets
  SET card_count = (
    SELECT COUNT(*)
    FROM flashcards
    WHERE set_id = COALESCE(NEW.set_id, OLD.set_id)
  )
  WHERE id = COALESCE(NEW.set_id, OLD.set_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update card_count
CREATE TRIGGER update_set_count_on_flashcard_change
  AFTER INSERT OR UPDATE OR DELETE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_flashcard_set_count();
