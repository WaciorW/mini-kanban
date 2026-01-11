# Mini Kanban - React + TypeScript + Supabase

Prosta aplikacja Kanban board zbudowana z React, TypeScript, Tailwind CSS i Supabase.

## 🚀 Quick Start

**Chcesz od razu uruchomić aplikację?** Przejdź do [QUICK-START.md](./QUICK-START.md)

**5 kroków do działającej aplikacji:**
1. Utwórz konto Supabase (darmowe)
2. Uruchom SQL schema w Supabase
3. Skopiuj credentials do `.env.local`
4. `npm install && npm run dev`
5. Gotowe! 🎉

## ✨ Features

### Implemented (MVP)
- ✅ **Authentication** - Email/Password via Supabase Auth
- ✅ **Boards Management** - CRUD operations for boards
- ✅ **Lists Management** - Create, update, delete columns
- ✅ **Cards Management** - Create, edit, delete tasks
- ✅ **Priority System** - Low, Medium, High
- ✅ **Search & Filter** - Full-text search in cards
- ✅ **RLS Security** - Row Level Security w Supabase
- ✅ **Session Persistence** - Auto-restore on refresh
- ✅ **Responsive UI** - Tailwind CSS

### Coming Soon
- ⏳ Drag & Drop - Reorder cards between lists
- ⏳ Real-time updates - Supabase subscriptions
- ⏳ Card attachments - Supabase Storage
- ⏳ Board templates
- ⏳ E2E tests - Playwright

## 🏗️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **React Router 7** - Routing
- **Zustand** - State management
- **Zod** - Schema validation

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time subscriptions
  - Full-text search (pg_trgm)

### Testing
- **Vitest 2** - Unit tests
- **React Testing Library** - Component tests
- **Happy-DOM** - DOM environment

## 📁 Project Structure

```
mini-kanban/
├── docs/                      # Documentation
│   ├── QUICK-START.md        # Quick start guide
│   ├── PROMPT-7-SUMMARY.md   # Full implementation docs
│   ├── supabase-schema.sql   # Database schema
│   └── user-stories.md       # User stories & requirements
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base components (Button, Input, Modal)
│   │   └── layout/          # Layout components (Header, MainLayout)
│   ├── features/            # Feature-specific components
│   │   ├── boards/          # Board-related components
│   │   └── cards/           # Card-related components
│   ├── pages/               # Route pages
│   ├── store/               # Zustand stores
│   │   ├── authStore.ts     # Authentication state
│   │   ├── boardsStore.ts   # Boards list state
│   │   └── boardStore.ts    # Single board state
│   ├── lib/                 # Utilities & integrations
│   │   ├── repositories/    # Data access layer
│   │   ├── mappers/         # Data transformers
│   │   ├── supabase/        # Supabase client & types
│   │   ├── validation/      # Zod schemas
│   │   └── utils/           # Helper functions
│   ├── types/               # TypeScript types
│   └── router/              # React Router config
└── ...
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier OK)

### Installation

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Fill in Supabase credentials
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

### Available Scripts

```bash
# Development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type check
npm run type-check

# Lint
npm run lint
```

### Supabase Setup

See [QUICK-START.md](./QUICK-START.md) for detailed setup instructions.

**TL;DR:**
1. Create Supabase project
2. Run `docs/supabase-schema.sql` in SQL Editor
3. Enable Email auth
4. Copy URL and anon key to `.env.local`

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

Current test status: **41 tests passing** ✅

## 📚 Documentation

- [QUICK-START.md](./QUICK-START.md) - Quick start guide
- [docs/PROMPT-7-SUMMARY.md](./docs/PROMPT-7-SUMMARY.md) - Full implementation docs
- [docs/PROMPT-6-SUMMARY.md](./docs/PROMPT-6-SUMMARY.md) - Supabase setup guide
- [docs/architecture.md](./docs/architecture.md) - Architecture decisions
- [docs/user-stories.md](./docs/user-stories.md) - User stories

## 🐛 Known Issues

### TypeScript Build Errors
Supabase client type inference ma problemy - `npm run build` może pokazywać błędy TypeScript.

**Workaround:** Użyj `npm run build --force` lub tylko `npm run dev`

**Status:** Nie wpływa na działanie aplikacji w runtime.

Szczegóły: [docs/PROMPT-7-SUMMARY.md#known-issues](./docs/PROMPT-7-SUMMARY.md#known-issues)

## 🔒 Security

- **RLS (Row Level Security)** - Users see only their own data
- **Supabase Auth** - Secure authentication
- **Environment variables** - Credentials not in code
- **Input validation** - Zod schemas
- **.env.local** in .gitignore - No credentials in repo

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

### Other Platforms

Works on: Netlify, Cloudflare Pages, GitHub Pages, etc.

**Requirements:**
- Node.js 18+
- Set environment variables
- `npm run build` command

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch
3. Make your changes
4. Add tests
5. Submit PR

## 📧 Support

- Check [QUICK-START.md](./QUICK-START.md) troubleshooting section
- Open an issue on GitHub
- Check Supabase logs

---

**Made with ❤️ using React, TypeScript, and Supabase**
