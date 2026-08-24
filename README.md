# Vertex

Vertex technical club website — events, member directory, teams, and the internal
Smart India Hackathon (SIH) workspace.

Built with TanStack Start (React 19, Vite, Tailwind CSS v4) and Supabase
(Postgres, auth, storage). Deployed on Vercel.

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in the Supabase credentials.

## Database

Schema lives in `supabase/migrations/`. Apply to a project:

```bash
psql "$DATABASE_URL" -f supabase/migrations/<migration>.sql
```

## Deploy

Vercel picks up pushes to `main`. Required environment variables:

- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
