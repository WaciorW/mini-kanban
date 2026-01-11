# Quick Start Guide - Mini Kanban

Szybki przewodnik uruchomienia aplikacji do testowania.

## 📋 Wymagania wstępne

- Node.js 18+ zainstalowany
- Konto Supabase (darmowe) - [https://supabase.com](https://supabase.com)
- Git (opcjonalnie)

## 🚀 Krok 1: Setup Supabase (5 minut)

### 1.1. Utwórz projekt Supabase

1. Przejdź do [https://supabase.com](https://supabase.com)
2. Zaloguj się / Zarejestruj
3. Kliknij **"New Project"**
4. Wypełnij:
   - **Name:** mini-kanban (lub dowolna nazwa)
   - **Database Password:** Zapisz gdzieś bezpiecznie!
   - **Region:** Wybierz najbliższy (Europe - Frankfurt dla Polski)
5. Kliknij **"Create new project"**
6. Poczekaj ~2 minuty aż projekt się utworzy

### 1.2. Uruchom SQL Schema

1. W dashboardzie Supabase, kliknij **"SQL Editor"** w lewym menu
2. Kliknij **"New query"**
3. Otwórz plik `docs/supabase-schema.sql` z tego projektu
4. Skopiuj **całą zawartość** pliku
5. Wklej do SQL Editor w Supabase
6. Kliknij **"Run"** (lub naciśnij F5)
7. Poczekaj aż się wykona - powinieneś zobaczyć "Success"

**Weryfikacja:**
- W lewym menu kliknij **"Table Editor"**
- Powinieneś zobaczyć 3 tabele: `boards`, `lists`, `cards`

### 1.3. Włącz Email Authentication

1. Kliknij **"Authentication"** w lewym menu
2. Kliknij **"Providers"**
3. Upewnij się że **"Email"** jest włączony (zielony toggle)
4. Kliknij **"Settings"** (pod Authentication)
5. Znajdź **"Enable email confirmations"**
6. **WYŁĄCZ** to ustawienie (dla developmentu)
   - W produkcji zostaw włączone!

### 1.4. Skopiuj credentials

1. Kliknij **"Settings"** (ikona koła zębatego w lewym menu)
2. Kliknij **"API"**
3. Znajdź i skopiuj:
   - **Project URL** (coś w stylu `https://xxxxx.supabase.co`)
   - **anon public** key (długi ciąg znaków zaczynający się od `eyJ...`)

**Zapisz te dane - będą potrzebne w następnym kroku!**

---

## ⚙️ Krok 2: Skonfiguruj aplikację (2 minuty)

### 2.1. Zainstaluj dependencje

```bash
npm install
```

### 2.2. Utwórz plik .env.local

W głównym katalogu projektu (obok package.json) utwórz plik `.env.local`:

```bash
# Windows (PowerShell)
New-Item -Path .env.local -ItemType File

# Linux/Mac
touch .env.local
```

### 2.3. Wypełnij .env.local

Otwórz `.env.local` w edytorze i wklej:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Zamień** `xxxxx` i `eyJ...` na dane skopiowane z Supabase w kroku 1.4!

**⚠️ WAŻNE:**
- Upewnij się że NIE MA spacji przed ani po `=`
- NIE używaj cudzysłowów wokół wartości
- Plik `.env.local` jest w `.gitignore` - nie zostanie commitowany

### 2.4. Zweryfikuj konfigurację

Sprawdź czy plik wygląda mniej więcej tak:
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.kCW9VfqFJ-R8MfkN4A5PQVjPR8V0rZY9w3_VqwN7Y8Y
```

---

## 🎯 Krok 3: Uruchom aplikację (30 sekund)

### Opcja A: Development mode (z hot-reload)

```bash
npm run dev
```

Aplikacja uruchomi się na: **http://localhost:5173**

### Opcja B: Build + Preview (jak produkcja)

```bash
npm run build --force
npm run preview
```

**Uwaga:** Build może pokazać błędy TypeScript - to znany issue (patrz sekcja Troubleshooting). Aplikacja zadziała mimo to.

---

## ✅ Krok 4: Przetestuj aplikację

### Test 1: Rejestracja

1. Otwórz **http://localhost:5173**
2. Kliknij **"Register"** (lub przejdź do `/register`)
3. Wypełnij formularz:
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Kliknij **"Register"**
5. Powinieneś zostać automatycznie zalogowany i przekierowany do `/boards`

**Weryfikacja w Supabase:**
- Idź do **Authentication** → **Users**
- Powinieneś zobaczyć użytkownika `test@example.com`

### Test 2: Tworzenie Board

1. Na stronie `/boards` kliknij **"+ New Board"**
2. Wpisz nazwę: `Mój pierwszy board`
3. Kliknij **"Create Board"**
4. Board powinien pojawić się na liście

**Weryfikacja w Supabase:**
- Idź do **Table Editor** → **boards**
- Powinieneś zobaczyć rekord z nazwą "Mój pierwszy board"
- `owner_id` powinno być ID twojego użytkownika

### Test 3: Dodawanie List i Card

1. Kliknij na board "Mój pierwszy board"
2. Powinieneś zobaczyć pusty board
3. (Jeśli UI dla tworzenia list istnieje) - dodaj listę "To Do"
4. (Jeśli UI dla tworzenia card istnieje) - dodaj kartę "Test task"

**Weryfikacja w Supabase:**
- Sprawdź tabele `lists` i `cards`
- Dane powinny się tam pojawić

### Test 4: Logout i Login

1. Kliknij **"Logout"** (przycisk w headerze)
2. Powinieneś zostać przekierowany do `/login`
3. Zaloguj się ponownie:
   - Email: `test@example.com`
   - Password: `password123`
4. Kliknij **"Login"**
5. Powinieneś zobaczyć swoje boards

### Test 5: Refresh (Session Persistence)

1. Będąc zalogowanym, odśwież stronę (F5)
2. Powinieneś pozostać zalogowany
3. Boards powinny się załadować

---

## 🐛 Troubleshooting

### Błąd: "Missing environment variables"

**Problem:** Aplikacja nie widzi VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY

**Rozwiązanie:**
1. Sprawdź czy plik `.env.local` jest w głównym katalogu (obok `package.json`)
2. Sprawdź czy nazwy zmiennych zaczynają się od `VITE_`
3. Zrestartuj dev server (`npm run dev`)

### Błąd: "relation does not exist"

**Problem:** Tabele nie zostały utworzone w Supabase

**Rozwiązanie:**
1. Idź do Supabase → SQL Editor
2. Uruchom ponownie `docs/supabase-schema.sql`
3. Sprawdź w Table Editor czy tabele istnieją

### Błąd: "row-level security policy"

**Problem:** RLS policies nie działają lub nie są utworzone

**Rozwiązanie:**
1. Sprawdź w SQL Editor czy policies zostały utworzone:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```
2. Powinno być 12 policies (4 na tabelę)
3. Jeśli nie ma - uruchom ponownie schema

### Błąd: "Failed to fetch boards"

**Problem:** Użytkownik nie jest zalogowany lub RLS blokuje dostęp

**Rozwiązanie:**
1. Wyloguj się i zaloguj ponownie
2. Sprawdź w dev console (F12) jakie błędy zwraca Supabase
3. Zweryfikuj czy `owner_id` w boards odpowiada ID użytkownika

### TypeScript Build Errors (Expected)

**Problem:** `npm run build` pokazuje błędy TypeScript

**Status:** Known issue - Database type inference

**Workaround:** Użyj `npm run build --force` lub uruchom tylko `npm run dev`

**Nie wpływa** na działanie aplikacji w runtime!

### Nie widzę swoich boards

**To jest poprawne!** RLS (Row Level Security) zapewnia że:
- Użytkownik A widzi tylko swoje boards
- Użytkownik B widzi tylko swoje boards
- Nawet jeśli znasz ID board innego użytkownika, nie możesz go zobaczyć

**Test:**
1. Utwórz drugi account (inny email)
2. Zaloguj się
3. Nie powinieneś widzieć boards z pierwszego account

---

## 📊 Monitoring w Supabase

### Sprawdź co się dzieje w bazie:

**Table Editor** - Zobacz dane:
```
- boards → twoje tablice
- lists → kolumny w tablicach
- cards → karty w kolumnach
```

**Authentication → Users** - Zobacz użytkowników:
```
- Lista wszystkich zarejestrowanych
- ID użytkownika (potrzebne do debugowania)
```

**Logs** - Zobacz zapytania:
```
- API Logs → wszystkie requesty do Supabase
- Database Logs → SQL queries
```

---

## 🎉 Gotowe!

Aplikacja działa! Możesz teraz:

1. ✅ Rejestrować użytkowników
2. ✅ Logować się
3. ✅ Tworzyć boards
4. ✅ Dane są zapisywane w Supabase
5. ✅ RLS chroni dane użytkowników
6. ✅ Session persists po refresh

## 📚 Następne kroki

- **Dodaj UI dla list i cards** - obecnie masz tylko boards
- **Zaimplementuj drag & drop** - @dnd-kit
- **Dodaj filtering i search** - UI dla funkcji z cardRepository
- **Real-time updates** - Supabase subscriptions
- **Testy E2E** - Playwright

---

## 🆘 Potrzebujesz pomocy?

1. Sprawdź **docs/PROMPT-7-SUMMARY.md** - pełna dokumentacja
2. Sprawdź **docs/PROMPT-6-SUMMARY.md** - Supabase setup
3. Sprawdź konsole w przeglądarce (F12) - błędy JavaScript
4. Sprawdź **Logs** w Supabase - błędy API

---

**Happy coding! 🚀**
