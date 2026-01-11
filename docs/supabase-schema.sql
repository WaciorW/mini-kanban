-- Mini Kanban Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- TABLES
-- ============================================================================

-- Boards table
CREATE TABLE IF NOT EXISTS public.boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lists table (columns in Kanban board)
CREATE TABLE IF NOT EXISTS public.lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) >= 2 AND char_length(title) <= 50),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(board_id, position)
);

-- Priority enum type
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');

-- Cards table (tasks)
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  description TEXT CHECK (char_length(description) <= 5000),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  priority priority_level NOT NULL DEFAULT 'medium',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(list_id, position)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Boards indexes
CREATE INDEX IF NOT EXISTS idx_boards_owner_id ON public.boards(owner_id);
CREATE INDEX IF NOT EXISTS idx_boards_updated_at ON public.boards(updated_at DESC);

-- Lists indexes
CREATE INDEX IF NOT EXISTS idx_lists_board_id ON public.lists(board_id);
CREATE INDEX IF NOT EXISTS idx_lists_board_position ON public.lists(board_id, position);

-- Cards indexes
CREATE INDEX IF NOT EXISTS idx_cards_list_id ON public.cards(list_id);
CREATE INDEX IF NOT EXISTS idx_cards_list_position ON public.cards(list_id, position);
CREATE INDEX IF NOT EXISTS idx_cards_priority ON public.cards(priority);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cards_title_trgm ON public.cards USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cards_description_trgm ON public.cards USING gin(description gin_trgm_ops);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_boards_updated_at ON public.boards;
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lists_updated_at ON public.lists;
CREATE TRIGGER update_lists_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cards_updated_at ON public.cards;
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - BOARDS
-- ============================================================================

-- Users can view own boards
CREATE POLICY "Users can view own boards"
  ON public.boards FOR SELECT
  USING (auth.uid() = owner_id);

-- Users can create own boards
CREATE POLICY "Users can create own boards"
  ON public.boards FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Users can update own boards
CREATE POLICY "Users can update own boards"
  ON public.boards FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Users can delete own boards
CREATE POLICY "Users can delete own boards"
  ON public.boards FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================================================
-- RLS POLICIES - LISTS
-- ============================================================================

-- Users can view lists of own boards
CREATE POLICY "Users can view lists of own boards"
  ON public.lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Users can create lists in own boards
CREATE POLICY "Users can create lists in own boards"
  ON public.lists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Users can update lists in own boards
CREATE POLICY "Users can update lists in own boards"
  ON public.lists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Users can delete lists in own boards
CREATE POLICY "Users can delete lists in own boards"
  ON public.lists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - CARDS
-- ============================================================================

-- Users can view cards in own boards
CREATE POLICY "Users can view cards in own boards"
  ON public.cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Users can create cards in own boards
CREATE POLICY "Users can create cards in own boards"
  ON public.cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = list_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Users can update cards in own boards
CREATE POLICY "Users can update cards in own boards"
  ON public.cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Users can delete cards in own boards
CREATE POLICY "Users can delete cards in own boards"
  ON public.cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lists
      JOIN public.boards ON boards.id = lists.board_id
      WHERE lists.id = cards.list_id
      AND boards.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Insert sample data for testing
-- Note: Replace 'YOUR_USER_ID' with actual user ID from auth.users

-- INSERT INTO public.boards (id, name, owner_id) VALUES
--   ('650e8400-e29b-41d4-a716-446655440000', 'Project X', 'YOUR_USER_ID');

-- INSERT INTO public.lists (id, title, board_id, position) VALUES
--   ('750e8400-e29b-41d4-a716-446655440001', 'To Do', '650e8400-e29b-41d4-a716-446655440000', 0),
--   ('750e8400-e29b-41d4-a716-446655440002', 'In Progress', '650e8400-e29b-41d4-a716-446655440000', 1),
--   ('750e8400-e29b-41d4-a716-446655440003', 'Done', '650e8400-e29b-41d4-a716-446655440000', 2);

-- INSERT INTO public.cards (id, title, description, list_id, priority, position) VALUES
--   ('850e8400-e29b-41d4-a716-446655440001', 'Setup project', 'Initialize Vite + React + Tailwind', '750e8400-e29b-41d4-a716-446655440003', 'high', 0),
--   ('850e8400-e29b-41d4-a716-446655440002', 'Implement auth', 'Supabase Auth integration', '750e8400-e29b-41d4-a716-446655440002', 'high', 0),
--   ('850e8400-e29b-41d4-a716-446655440003', 'Drag & Drop', 'Optional feature', '750e8400-e29b-41d4-a716-446655440001', 'low', 0);
