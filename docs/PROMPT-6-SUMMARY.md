# Prompt #6 - Backend + Auth (Supabase) - Podsumowanie

## ✅ Zakończone Zadania

### 1. 📦 Instalacja Supabase SDK

**Zainstalowane:**
- `@supabase/supabase-js` v2.x

### 2. 🗄️ Database Schema

**[docs/supabase-schema.sql](../docs/supabase-schema.sql)**

Kompletny SQL schema zawierający:

**Tabele:**
- `boards` - Tablice użytkownika
- `lists` - Kolumny (To Do, In Progress, Done)
- `cards` - Karty zadań

**Features:**
- ✅ UUID primary keys
- ✅ CHECK constraints (min/max lengths)
- ✅ CASCADE deletes (board → lists → cards)
- ✅ UNIQUE constraints (position per board/list)
- ✅ Enum type dla priority
- ✅ Timestamps (created_at, updated_at)
- ✅ Auto-update triggers

**Indexes (9 total):**
- Owner ID, updated_at
- Board/List relationships
- Position sorting
- **Full-text search** (pg_trgm na title i description)

**RLS Policies (12 total):**
- Użytkownik widzi tylko swoje dane
- 4 policies per table (SELECT, INSERT, UPDATE, DELETE)
- Nested checks dla lists i cards

---

### 3. 🔧 Supabase Client Configuration

**[src/lib/supabase/client.ts](../src/lib/supabase/client.ts)**
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

**Features:**
- ✅ Singleton pattern
- ✅ Type-safe (Database generic)
- ✅ Session persistence
- ✅ Auto token refresh
- ✅ Environment variables validation

**[src/lib/supabase/database.types.ts](../src/lib/supabase/database.types.ts)**
- TypeScript types dla wszystkich tabel
- Row, Insert, Update types
- Auto-generated (można używać `supabase gen types`)

**[.env.example](.././env.example)**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 Setup Instructions

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Create new project
3. Choose region (closest to users)
4. Set strong database password
5. Wait for project to be ready (~2 minutes)

### Step 2: Run Database Schema

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Create new query
4. Copy content from `docs/supabase-schema.sql`
5. Click **Run** (or F5)
6. Verify:
   - Tables created (boards, lists, cards)
   - RLS enabled on all tables
   - Policies created (12 total)

### Step 3: Enable Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. **Disable** email confirmations (for development):
   - Authentication → **Settings**
   - Disable "Enable email confirmations"
   - (Re-enable in production!)

### Step 4: Configure Environment Variables

1. Go to **Settings** → **API**
2. Copy **Project URL** and **anon public** key
3. Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
4. **NEVER commit .env.local** (already in .gitignore)

### Step 5: Update Auth Store

Replace mock auth in `src/store/authStore.ts`:

```typescript
import { supabase } from '@/lib/supabase'

// In login action:
login: async (email, password) => {
  set({ isLoading: true, error: null })

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    set({ error: error.message, isLoading: false })
    return
  }

  const user: User = {
    id: data.user.id,
    email: data.user.email!,
  }

  set({
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })
},

// In register action:
register: async (email, password) => {
  set({ isLoading: true, error: null })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    set({ error: error.message, isLoading: false })
    return
  }

  const user: User = {
    id: data.user!.id,
    email: data.user!.email!,
  }

  set({
    user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })
},
```

### Step 6: Implement Board Repository

Create `src/lib/repositories/boardRepository.ts`:

```typescript
import { supabase } from '@/lib/supabase'
import { dbBoardToDomain, createBoardToDb } from '@/lib/mappers'
import type { Board, CreateBoardInput } from '@/types'

export const boardRepository = {
  async getAllByUserId(userId: string): Promise<Board[]> {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return dbBoardsToDomain(data)
  },

  async getById(id: string): Promise<Board | null> {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return dbBoardToDomain(data)
  },

  async create(input: CreateBoardInput, userId: string): Promise<Board> {
    const dbBoard = createBoardToDb(input, userId)

    const { data, error } = await supabase
      .from('boards')
      .insert(dbBoard)
      .select()
      .single()

    if (error) throw error
    return dbBoardToDomain(data)
  },

  async update(id: string, input: UpdateBoardInput): Promise<Board> {
    const { data, error } = await supabase
      .from('boards')
      .update({ name: input.name })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return dbBoardToDomain(data)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
```

### Step 7: Update Boards Store

Replace mock operations in `src/store/boardsStore.ts`:

```typescript
import { boardRepository } from '@/lib/repositories/boardRepository'

// In fetchBoards:
fetchBoards: async () => {
  set({ isLoading: true, error: null })

  try {
    const userId = useAuthStore.getState().user?.id
    if (!userId) throw new Error('Not authenticated')

    const boards = await boardRepository.getAllByUserId(userId)

    set({
      boards: boards.map(board => ({
        ...board,
        listCount: 0, // TODO: Add count from query
        cardCount: 0,
      })),
      isLoading: false,
    })
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : 'Failed to fetch boards',
      isLoading: false,
    })
  }
},

// In createBoard:
createBoard: async (input) => {
  const userId = useAuthStore.getState().user?.id
  if (!userId) throw new Error('Not authenticated')

  const board = await boardRepository.create(input, userId)

  set({
    boards: [
      { ...board, listCount: 0, cardCount: 0 },
      ...get().boards,
    ],
    isLoading: false,
  })

  return board
},
```

---

## 🔑 Key Implementation Patterns

### 1. Error Handling

```typescript
try {
  const { data, error } = await supabase.from('boards').select()

  if (error) throw error

  return data
} catch (error) {
  if (error.code === 'PGRST116') {
    // Not found
    return null
  }

  // Re-throw other errors
  throw error
}
```

### 2. RLS Automatic Filtering

```typescript
// No need to filter by user_id - RLS handles it!
const { data } = await supabase
  .from('boards')
  .select('*')

// RLS automatically adds: WHERE owner_id = auth.uid()
```

### 3. Relationships

```typescript
// Get board with lists
const { data } = await supabase
  .from('boards')
  .select(`
    *,
    lists (
      *,
      cards (*)
    )
  `)
  .eq('id', boardId)
  .single()
```

### 4. Real-time Subscriptions (Optional)

```typescript
const channel = supabase
  .channel('board-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'boards',
      filter: `owner_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Board changed:', payload)
      // Update store
    }
  )
  .subscribe()
```

---

## 📊 Migration Checklist

### Auth
- [ ] Update authStore.login()
- [ ] Update authStore.register()
- [ ] Update authStore.logout()
- [ ] Add session restore on app load
- [ ] Handle auth errors (email exists, weak password, etc.)

### Boards
- [ ] Implement boardRepository
- [ ] Update boardsStore.fetchBoards()
- [ ] Update boardsStore.createBoard()
- [ ] Update boardsStore.updateBoard()
- [ ] Update boardsStore.deleteBoard()

### Lists
- [ ] Implement listRepository
- [ ] Update boardStore.createList()
- [ ] Update boardStore.updateList()
- [ ] Update boardStore.deleteList()

### Cards
- [ ] Implement cardRepository
- [ ] Update boardStore.createCard()
- [ ] Update boardStore.updateCard()
- [ ] Update boardStore.deleteCard()
- [ ] Update boardStore.moveCard()

### Testing
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test RLS (can't access other users' data)
- [ ] Test cascade deletes
- [ ] Test search functionality
- [ ] Test error handling

---

## 🔒 Security Checklist

- [x] RLS enabled on all tables
- [x] Policies check auth.uid()
- [x] Cascade deletes configured
- [x] Anon key is public (safe to expose)
- [ ] Email confirmation enabled (production)
- [ ] Rate limiting configured (production)
- [ ] Strong password requirements
- [ ] CORS configured correctly

---

## 🎯 Environment Variables

### Development (.env.local)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### Production
- Set in Vercel/Netlify/etc.
- Same variables
- Enable email confirmations
- Consider custom domain

---

## 📚 Supabase Features Used

- ✅ Authentication (Email/Password)
- ✅ Database (PostgreSQL)
- ✅ Row Level Security (RLS)
- ✅ Full-text Search (pg_trgm)
- ✅ Auto-generated Types
- ⏳ Real-time (optional)
- ⏳ Storage (for attachments - future)

---

## 🐛 Common Issues & Solutions

### Issue: "Missing environment variables"
**Solution:** Create `.env.local` with correct values

### Issue: "relation does not exist"
**Solution:** Run SQL schema in Supabase SQL Editor

### Issue: "row-level security policy"
**Solution:** Check policies are created and user is authenticated

### Issue: "duplicate key value violates unique constraint"
**Solution:** Position conflicts - handle in repository with transactions

### Issue: Can't see other users' boards
**Solution:** This is correct! RLS is working

---

## ✨ Prompt #6 Complete!

Supabase backend jest skonfigurowany i gotowy do użycia:
- ✅ Database schema created
- ✅ RLS policies configured
- ✅ Client configured
- ✅ Types generated
- ✅ Environment variables setup
- ✅ Migration guide documented

**Next Steps:**
- Implement all repositories
- Update all stores to use Supabase
- Test auth flow
- Test CRUD operations
- Add real-time updates (optional)

**Ready for full integration!** 🚀
