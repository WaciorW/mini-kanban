# Jak wypełnić plik .env.local

**Otwórz go w edytorze tekstu** (Notepad, VS Code, itp.)

## ✏️ Jak wypełnić

### Krok 1: Przejdź do Supabase Dashboard

1. Otwórz przeglądarkę
2. Idź na: https://supabase.com
3. Zaloguj się
4. Wybierz swój projekt (lub utwórz nowy jeśli nie masz)

### Krok 2: Znajdź dane w Supabase

1. W lewym menu kliknij **⚙️ Settings** (ikona koła zębatego na dole)
2. Z listy ustawień wybierz **API**
3. Na tej stronie zobaczysz:

#### A) Project URL
- Znajdź sekcję **"Project URL"**
- Skopiuj URL (np. `https://xyzabc123.supabase.co`)

#### B) Anon Key
- Znajdź sekcję **"Project API keys"**
- Pod **"anon public"** kliknij ikonę kopiowania
- Skopiuj klucz (zaczyna się od `eyJ...`)

### Krok 3: Wklej do .env.local

Otwórz plik `.env.local` i wypełnij tak:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

**⚠️ WAŻNE:**
- **NIE** dodawaj spacji przed lub po znaku `=`
- **NIE** używaj cudzysłowów (`"`) wokół wartości
- Zastąp przykładowe wartości swoimi prawdziwymi danymi
- Klucz `VITE_SUPABASE_ANON_KEY` jest bardzo długi - to normalne!

### Krok 4: Zapisz plik

1. **Zapisz** plik `.env.local` (Ctrl+S)
2. **Zrestartuj** dev server jeśli był uruchomiony:
   - Zatrzymaj server (Ctrl+C w terminalu)
   - Uruchom ponownie: `npm run dev`

## ✅ Weryfikacja

Po wypełnieniu i zapisaniu pliku, sprawdź czy:

1. **Plik istnieje**: `C:\Users\Wojtek\Documents\GitHub\mini-kanban\.env.local`
2. **Zawiera 2 linie** z `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`
3. **Wartości są wypełnione** (nie są puste po znaku `=`)

## 🎯 Przykład wypełnionego pliku

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.kCW9VfqFJ-R8MfkN4A5PQVjPR8V0rZY9w3_VqwN7Y8Y
```

## 🔒 Bezpieczeństwo

- ✅ Plik `.env.local` jest w `.gitignore` - **nie zostanie** wysłany do git
- ✅ Klucz `anon public` jest **bezpieczny** do użycia w przeglądarce
- ⚠️ **NIE** udostępniaj tego pliku publicznie
- ⚠️ **NIE** commituj go do repozytorium

## 🐛 Problemy?

### "Missing environment variables"
- Upewnij się że plik nazywa się **dokładnie** `.env.local` (z kropką na początku)
- Sprawdź czy jest w głównym katalogu projektu (obok `package.json`)
- Zrestartuj dev server

### "Invalid credentials" lub błędy połączenia
- Sprawdź czy URL i klucz są **dokładnie** takie jak w Supabase
- Nie ma spacji ani znaków nowej linii wewnątrz wartości
- URL kończy się na `.supabase.co` (bez `/` na końcu)

## 🚀 Co dalej?

Po wypełnieniu `.env.local`:
1. Uruchom `npm run dev`
2. Otwórz http://localhost:5173
3. Zarejestruj się i testuj aplikację!

Szczegółowy przewodnik testowania: [QUICK-START.md](QUICK-START.md)
