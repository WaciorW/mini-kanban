# Architektura Frontendu - Mini Kanban

## 🏗️ Struktura Katalogów (Features-Based Architecture)

```
src/
├── components/              # Shared/reusable UI components
│   ├── ui/                 # Podstawowe komponenty UI (button, input, modal, etc.)
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Card.tsx
│   │   └── index.ts
│   ├── layout/             # Komponenty layoutu
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   └── common/             # Inne współdzielone komponenty
│       ├── ErrorBoundary.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       └── index.ts
│
├── features/               # Feature modules (business logic)
│   ├── auth/              # Autentykacja
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.test.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useAuth.test.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── authService.test.ts
│   │   │   └── index.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── authStore.test.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts
│   │
│   ├── boards/            # Zarządzanie tablicami
│   │   ├── components/
│   │   │   ├── BoardList.tsx
│   │   │   ├── BoardList.test.tsx
│   │   │   ├── BoardCard.tsx
│   │   │   ├── CreateBoardModal.tsx
│   │   │   ├── EditBoardModal.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useBoards.ts
│   │   │   ├── useBoard.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── boardRepository.ts
│   │   │   ├── boardRepository.test.ts
│   │   │   └── index.ts
│   │   ├── store/
│   │   │   ├── boardsStore.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── board/             # Pojedyncza tablica (kanban view)
│   │   ├── components/
│   │   │   ├── Board.tsx
│   │   │   ├── Board.test.tsx
│   │   │   ├── BoardHeader.tsx
│   │   │   ├── List.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CreateListButton.tsx
│   │   │   ├── CardFilters.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useBoardData.ts
│   │   │   ├── useCardFilters.ts
│   │   │   ├── useDragDrop.ts (optional)
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── listRepository.ts
│   │   │   ├── cardRepository.ts
│   │   │   └── index.ts
│   │   ├── store/
│   │   │   ├── boardStore.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   └── cards/             # Zarządzanie kartami (CRUD)
│       ├── components/
│       │   ├── CardDetail.tsx
│       │   ├── CardForm.tsx
│       │   ├── CardForm.test.tsx
│       │   ├── PriorityBadge.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   ├── useCard.ts
│       │   └── index.ts
│       ├── validation/
│       │   ├── cardSchema.ts
│       │   ├── cardSchema.test.ts
│       │   └── index.ts
│       └── index.ts
│
├── lib/                   # Utility libraries i konfiguracja
│   ├── supabase/
│   │   ├── client.ts     # Supabase client setup
│   │   ├── config.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   ├── stringUtils.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   └── index.ts
│   └── mappers/          # Database ↔ Domain mappers
│       ├── boardMapper.ts
│       ├── listMapper.ts
│       ├── cardMapper.ts
│       └── index.ts
│
├── store/                # Global state management (Zustand)
│   ├── index.ts
│   ├── rootStore.ts
│   └── types.ts
│
├── pages/                # Page components (routing)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── BoardsPage.tsx
│   ├── BoardPage.tsx
│   ├── NotFoundPage.tsx
│   └── index.ts
│
├── router/               # Routing configuration
│   ├── routes.tsx
│   ├── ProtectedRoute.tsx
│   └── index.ts
│
├── types/                # Global TypeScript types
│   ├── database.types.ts
│   ├── domain.types.ts
│   └── index.ts
│
├── test/                 # Test utilities
│   ├── setup.ts
│   ├── testUtils.tsx    # Custom render, mocks
│   └── mocks/
│       ├── supabase.mock.ts
│       ├── data.mock.ts
│       └── index.ts
│
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Tailwind imports
```

---

## 🎯 Uzasadnienie Struktury

### 1. **Features-Based Architecture**

**Dlaczego?**
- **Skalowalno\u015b\u0107**: Każdy feature jest izolowany i może rosnąć niezależnie
- **Maintainability**: Łatwiej znaleźć kod związany z konkretną funkcjonalnością
- **Team collaboration**: Różne zespoły mogą pracować nad różnymi features bez konfliktów
- **Code splitting**: Łatwiejsze lazy loading poszczególnych features

**Alternatywy (odrzucone):**
- **Type-based** (`/components`, `/hooks`, `/services`) - trudne do utrzymania w większych projektach
- **MVC** - zbyt ciężkie dla React SPA

### 2. **Separacja Concerns**

Każdy feature module zawiera:
- **components/** - UI components (prezentacja)
- **hooks/** - React hooks (logika biznesowa)
- **services/** - Data access layer (komunikacja z API)
- **store/** - Local state management (jeśli potrzebny)
- **types/** - Feature-specific types

**Zalety:**
- Clear separation of concerns
- Łatwe testowanie każdej warstwy osobno
- Możliwość zamiany implementacji (np. Supabase → REST API)

### 3. **Shared vs Feature Components**

**components/ui/** - Tylko "głupie" komponenty
- Nie zawierają logiki biznesowej
- Reusable w całej aplikacji
- Łatwe do przeniesienia do design system

**features/*/components/** - Feature-specific components
- Mogą zawierać logikę biznesową
- Używają shared components z `components/ui/`
- Związane z konkretnym use case

### 4. **Lib Folder**

**lib/** zawiera kod infrastrukturalny:
- **supabase/** - konfiguracja klienta
- **utils/** - pure functions (żadnych React hooks)
- **mappers/** - transformacja database ↔ domain types
- **constants/** - konfiguracja, routes, magic numbers

**Dlaczego osobny folder?**
- Oddzielenie infrastruktury od logiki biznesowej
- Łatwe do mockowania w testach
- Reusable w całej aplikacji

---

## 📦 Repository Pattern

### Interfejs Repository

Każda encja ma dedykowany repository z interfejsem:

```typescript
interface IRepository<T, TCreate, TUpdate> {
  getAll(filters?: FilterOptions): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(data: TCreate): Promise<T>
  update(id: string, data: TUpdate): Promise<T>
  delete(id: string): Promise<void>
}
```

**Zalety:**
- **Testowalno\u015b\u0107**: Łatwe mockowanie w testach
- **Separation**: Oddzielenie logiki dostępu do danych od UI
- **Flexibility**: Możliwość zamiany źródła danych bez zmian w UI
- **Type safety**: Pełna kontrola typów dla CRUD operations

---

## 🔄 Data Flow

```
┌─────────────┐
│   UI/Page   │
└──────┬──────┘
       │ uses
       ▼
┌─────────────┐
│    Hook     │ (useBoards, useBoard, etc.)
└──────┬──────┘
       │ calls
       ▼
┌─────────────┐
│   Service   │ (boardRepository.ts)
│ (Repository)│
└──────┬──────┘
       │ uses
       ▼
┌─────────────┐
│   Supabase  │
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Database   │
└─────────────┘

Response flow (reverse):
Database → Supabase → Repository → Mapper → Domain Types → Hook → UI
```

### Przykład Flow:

**User klika "Create Board":**
1. `CreateBoardModal` wywołuje `onSubmit(data)`
2. `onSubmit` wywołuje `createBoard` z `useBoards` hook
3. `useBoards` wywołuje `boardRepository.create(data)`
4. `boardRepository` transformuje domain → database types
5. `boardRepository` wywołuje Supabase API
6. Response przechodzi przez mapper: database → domain types
7. Hook aktualizuje local state / cache
8. UI re-renderuje się z nowymi danymi

---

## 🎨 State Management Strategy

### Zustand Stores

**Global State:**
- `authStore` - Current user, auth status
- `boardsStore` - Lista wszystkich tablic użytkownika
- `boardStore` - Aktualna tablica z listami i kartami

**Local State:**
- React `useState` dla UI state (modals, inputs, filters)
- React Query (opcjonalnie) dla server state caching

**Dlaczego Zustand?**
- Prosty API (vs Redux boilerplate)
- Dobra TypeScript support
- Mały bundle size (~1KB)
- Nie wymaga Context Provider wrappera
- Łatwe devtools

**Alternatywy:**
- **React Query**: Rozważane dla server state caching (post-MVP)
- **Jotai/Recoil**: Zbyt atomic dla naszych potrzeb
- **Redux Toolkit**: Za ciężkie dla MVP

---

## 🧪 Testing Strategy

### Unit Tests
- **Components**: `@testing-library/react`
- **Hooks**: `@testing-library/react-hooks`
- **Services/Repositories**: Mocked Supabase client
- **Utils/Mappers**: Pure function tests

### Test Organization
```
feature/
  ├── Component.tsx
  ├── Component.test.tsx    # Obok komponentu
  ├── hooks/
  │   ├── useFeature.ts
  │   └── useFeature.test.ts
  └── services/
      ├── repository.ts
      └── repository.test.ts
```

**Dlaczego obok plików?**
- Łatwiej znaleźć testy
- Jawna widoczność co ma testy
- Proste importy

### Test Coverage Goals
- **MVP**: min. 70% coverage
- **Critical paths**: 90%+ (auth, CRUD operations)
- **UI components**: snapshot + interaction tests

---

## 🔐 Security & Best Practices

### Environment Variables
```typescript
// lib/supabase/config.ts
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
}
```

### Protected Routes
```typescript
// router/ProtectedRoute.tsx
<ProtectedRoute>
  <BoardsPage />
</ProtectedRoute>
```

### RLS na poziomie bazy
- Nie polegamy tylko na frontend validation
- Wszystkie polityki RLS w Supabase
- Double-check permissions przed operacjami

---

## 📊 Performance Considerations

### Code Splitting
```typescript
// Lazy loading for routes
const BoardPage = lazy(() => import('@/pages/BoardPage'))
```

### Memoization
- `useMemo` dla expensive computations (filtering, sorting)
- `useCallback` dla event handlers przekazywanych do child components
- `React.memo` dla często re-renderowanych components

### Virtualization (Post-MVP)
- React Virtual dla długich list kart
- Tylko jeśli > 100 kart w kolumnie

### Optimistic Updates
- Aktualizacja UI przed response z API
- Rollback w przypadku błędu
- Lepsze UX dla CRUD operations

---

## 🎯 Decyzje Techniczne - Podsumowanie

| Obszar | Decyzja | Uzasadnienie |
|--------|---------|--------------|
| **Architecture** | Features-based | Skalowalność, maintainability |
| **State** | Zustand | Prosty, lekki, TypeScript-friendly |
| **Styling** | Tailwind v4 | Utility-first, JIT, mały bundle |
| **Forms** | Controlled + Zod | Type-safe validation |
| **Testing** | Vitest + RTL | Fast, Vite-native, modern |
| **Data Access** | Repository pattern | Separation, testability |
| **Auth** | Supabase Auth | Managed, secure, RLS integration |
| **Types** | Database + Domain | Clear separation, mappable |

---

## 🚀 Next Steps

Po zaimplementowaniu struktury:
1. Setup routingu (react-router-dom)
2. Layout components (Header, MainLayout)
3. Auth flow (LoginPage, RegisterPage)
4. Supabase client configuration
5. Repository implementations
6. Zustand stores
7. Feature components

---

## 📚 Folder Index Quick Reference

```bash
# Tworzenie nowego feature
src/features/new-feature/
  ├── components/      # UI dla tego feature
  ├── hooks/          # Custom hooks
  ├── services/       # Data access
  ├── store/          # Local state (jeśli potrzebny)
  ├── types/          # Feature-specific types
  └── index.ts        # Public API

# Dodawanie shared component
src/components/ui/NewComponent.tsx

# Dodawanie utility function
src/lib/utils/newUtil.ts

# Dodawanie nowej strony
src/pages/NewPage.tsx
```
