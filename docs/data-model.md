# Model Danych - Mini Kanban

## 🗂️ Schemat Bazy Danych (PostgreSQL / Supabase)

### Diagram ERD

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │   boards    │       │    lists    │       │    cards    │
├─────────────┤       ├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │◄──┐   │ id (PK)     │◄──┐   │ id (PK)     │
│ email       │   │   │ name        │   │   │ title       │   │   │ title       │
│ created_at  │   │   │ owner_id(FK)│───┘   │ board_id(FK)│───┘   │ description │
│             │   │   │ created_at  │       │ position    │       │ list_id (FK)│───┘
│             │   │   │ updated_at  │       │ created_at  │       │ priority    │
│             │   └───│             │       │ updated_at  │       │ position    │
└─────────────┘       └─────────────┘       └─────────────┘       │ created_at  │
                                                                    │ updated_at  │
                                                                    └─────────────┘
```

---

## 📋 Tabele

### 1. **users** (zarządzane przez Supabase Auth)

Supabase automatycznie zarządza tabelą `auth.users`. Możemy dodać rozszerzenia w tabeli `public.profiles` jeśli potrzebne.

```sql
-- Opcjonalna tabela profiles dla dodatkowych danych użytkownika
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Pola:**
- `id` - UUID, klucz główny (sync z auth.users)
- `email` - unikalna wartość
- `display_name` - opcjonalna nazwa wyświetlana
- `avatar_url` - opcjonalny link do awatara
- `created_at` - timestamp utworzenia
- `updated_at` - timestamp ostatniej modyfikacji

---

### 2. **boards** (tablice Kanban)

```sql
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 100),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Pola:**
- `id` - UUID, klucz główny
- `name` - nazwa tablicy (3-100 znaków)
- `owner_id` - UUID właściciela (FK do auth.users)
- `created_at` - timestamp utworzenia
- `updated_at` - timestamp ostatniej modyfikacji

**Ograniczenia:**
- `CHECK` constraint na długość nazwy
- `ON DELETE CASCADE` - usunięcie użytkownika usuwa jego tablice

---

### 3. **lists** (kolumny na tablicy)

```sql
CREATE TABLE public.lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) >= 2 AND char_length(title) <= 50),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(board_id, position)
);
```

**Pola:**
- `id` - UUID, klucz główny
- `title` - nazwa kolumny (2-50 znaków)
- `board_id` - UUID tablicy (FK do boards)
- `position` - pozycja kolumny (dla sortowania), INTEGER
- `created_at` - timestamp utworzenia
- `updated_at` - timestamp ostatniej modyfikacji

**Ograniczenia:**
- `UNIQUE(board_id, position)` - unikalna pozycja w ramach tablicy
- `ON DELETE CASCADE` - usunięcie tablicy usuwa kolumny
- Max 10 kolumn na tablicę (walidacja aplikacyjna)

---

### 4. **cards** (karty zadań)

```sql
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');

CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  description TEXT CHECK (char_length(description) <= 5000),
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  priority priority_level NOT NULL DEFAULT 'medium',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(list_id, position)
);
```

**Pola:**
- `id` - UUID, klucz główny
- `title` - tytuł karty (3-200 znaków)
- `description` - opis (max 5000 znaków)
- `list_id` - UUID kolumny (FK do lists)
- `priority` - poziom priorytetu (ENUM: low, medium, high)
- `position` - pozycja karty w kolumnie (dla sortowania)
- `created_at` - timestamp utworzenia
- `updated_at` - timestamp ostatniej modyfikacji

**Ograniczenia:**
- `UNIQUE(list_id, position)` - unikalna pozycja w ramach kolumny
- `ON DELETE CASCADE` - usunięcie kolumny usuwa karty
- Typ ENUM dla priorytetu zapewnia spójność danych

---

### 5. **card_history** (opcjonalne - dla Nice-to-Have US-017)

```sql
CREATE TYPE change_type AS ENUM ('created', 'updated', 'moved', 'deleted');

CREATE TABLE public.card_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  change_type change_type NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Pola:**
- `id` - UUID, klucz główny
- `card_id` - UUID karty
- `user_id` - UUID użytkownika który wykonał zmianę
- `change_type` - typ zmiany (ENUM)
- `old_data` - poprzedni stan (JSONB)
- `new_data` - nowy stan (JSONB)
- `changed_at` - timestamp zmiany

---

## 🔒 Row Level Security (RLS) Policies

### Polityki dla tabeli `boards`

```sql
-- Enable RLS
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

-- Użytkownik widzi tylko swoje tablice
CREATE POLICY "Users can view own boards"
  ON public.boards FOR SELECT
  USING (auth.uid() = owner_id);

-- Użytkownik może tworzyć tylko swoje tablice
CREATE POLICY "Users can create own boards"
  ON public.boards FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Użytkownik może aktualizować tylko swoje tablice
CREATE POLICY "Users can update own boards"
  ON public.boards FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Użytkownik może usuwać tylko swoje tablice
CREATE POLICY "Users can delete own boards"
  ON public.boards FOR DELETE
  USING (auth.uid() = owner_id);
```

### Polityki dla tabeli `lists`

```sql
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- Użytkownik widzi kolumny swoich tablic
CREATE POLICY "Users can view lists of own boards"
  ON public.lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Użytkownik może tworzyć kolumny w swoich tablicach
CREATE POLICY "Users can create lists in own boards"
  ON public.lists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Użytkownik może aktualizować kolumny w swoich tablicach
CREATE POLICY "Users can update lists in own boards"
  ON public.lists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.owner_id = auth.uid()
    )
  );

-- Użytkownik może usuwać kolumny w swoich tablicach
CREATE POLICY "Users can delete lists in own boards"
  ON public.lists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE boards.id = lists.board_id
      AND boards.owner_id = auth.uid()
    )
  );
```

### Polityki dla tabeli `cards`

```sql
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Użytkownik widzi karty w kolumnach swoich tablic
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

-- Podobne polityki dla INSERT, UPDATE, DELETE
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
```

---

## 📇 Indeksy dla Wydajności

### Indeksy podstawowe

```sql
-- boards: wyszukiwanie po owner_id
CREATE INDEX idx_boards_owner_id ON public.boards(owner_id);
CREATE INDEX idx_boards_updated_at ON public.boards(updated_at DESC);

-- lists: wyszukiwanie po board_id i position
CREATE INDEX idx_lists_board_id ON public.lists(board_id);
CREATE INDEX idx_lists_board_position ON public.lists(board_id, position);

-- cards: wyszukiwanie po list_id, priority, position
CREATE INDEX idx_cards_list_id ON public.cards(list_id);
CREATE INDEX idx_cards_list_position ON public.cards(list_id, position);
CREATE INDEX idx_cards_priority ON public.cards(priority);

-- Full-text search dla wyszukiwania kart po tytule/opisie
CREATE INDEX idx_cards_title_trgm ON public.cards USING gin(title gin_trgm_ops);
CREATE INDEX idx_cards_description_trgm ON public.cards USING gin(description gin_trgm_ops);

-- Aktywacja rozszerzenia pg_trgm dla full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- card_history: wyszukiwanie po card_id i changed_at
CREATE INDEX idx_card_history_card_id ON public.card_history(card_id);
CREATE INDEX idx_card_history_changed_at ON public.card_history(changed_at DESC);
```

### Uzasadnienie indeksów:

1. **idx_boards_owner_id** - najczęstsze zapytanie: lista tablic użytkownika
2. **idx_boards_updated_at** - sortowanie tablic po ostatniej modyfikacji
3. **idx_lists_board_id** - pobieranie kolumn dla tablicy
4. **idx_lists_board_position** - sortowanie kolumn według pozycji
5. **idx_cards_list_id** - pobieranie kart dla kolumny
6. **idx_cards_list_position** - sortowanie kart według pozycji
7. **idx_cards_priority** - filtrowanie po priorytecie (US-015)
8. **idx_cards_title_trgm** - wyszukiwanie pełnotekstowe (US-016)
9. **idx_cards_description_trgm** - wyszukiwanie w opisach (US-016)

---

## 🔄 Triggery dla `updated_at`

```sql
-- Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery dla wszystkich tabel
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lists_updated_at
  BEFORE UPDATE ON public.lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📦 Przykładowe Dane (Seed Data)

```sql
-- Przykładowy użytkownik (utworzony przez Supabase Auth)
-- Zakładamy user_id = '550e8400-e29b-41d4-a716-446655440000'

-- Przykładowa tablica
INSERT INTO public.boards (id, name, owner_id) VALUES
  ('650e8400-e29b-41d4-a716-446655440000', 'Projekt X', '550e8400-e29b-41d4-a716-446655440000');

-- Przykładowe kolumny
INSERT INTO public.lists (id, title, board_id, position) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'To Do', '650e8400-e29b-41d4-a716-446655440000', 0),
  ('750e8400-e29b-41d4-a716-446655440002', 'In Progress', '650e8400-e29b-41d4-a716-446655440000', 1),
  ('750e8400-e29b-41d4-a716-446655440003', 'Done', '650e8400-e29b-41d4-a716-446655440000', 2);

-- Przykładowe karty
INSERT INTO public.cards (id, title, description, list_id, priority, position) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', 'Setup projektu', 'Konfiguracja Vite + React + Tailwind', '750e8400-e29b-41d4-a716-446655440003', 'high', 0),
  ('850e8400-e29b-41d4-a716-446655440002', 'Implementacja auth', 'Supabase Auth integration', '750e8400-e29b-41d4-a716-446655440002', 'high', 0),
  ('850e8400-e29b-41d4-a716-446655440003', 'Drag & Drop', 'Opcjonalna funkcjonalność', '750e8400-e29b-41d4-a716-446655440001', 'low', 0),
  ('850e8400-e29b-41d4-a716-446655440004', 'Testy E2E', 'Playwright tests', '750e8400-e29b-41d4-a716-446655440001', 'medium', 1);
```

---

## 🎯 Podsumowanie

### Główne założenia:
- **Separacja danych** - każdy użytkownik widzi tylko swoje dane (RLS)
- **Kaskadowe usuwanie** - spójność danych przy usuwaniu
- **Walidacja** - CHECK constraints na poziomie bazy
- **Wydajność** - indeksy na często używanych kolumnach
- **Rozszerzalność** - JSONB dla przyszłych metadanych, ENUM dla typów
- **Audit trail** - timestamps dla wszystkich encji

### Ograniczenia biznesowe:
- Max 10 kolumn na tablicę (walidacja aplikacyjna)
- Max 5000 znaków w opisie karty
- Min 3 znaki w nazwie tablicy/tytule karty
- Priorytety: low, medium, high

### Migracje:
Wszystkie schematy powinny być zarządzane przez migracje Supabase lub narzędzie typu Prisma/Drizzle.
