# Vertex

Frontend: TanStack Start (React 19, Vite 8, Tailwind CSS v4). Backend: Supabase
(Postgres + auth + storage). Deploys to Vercel (nitro `vercel` preset).

- Schema: `supabase/migrations/` (apply in filename order with psql)
- Server-only Supabase admin client: `src/integrations/supabase/client.server.ts`
  (requires `SUPABASE_SERVICE_ROLE_KEY`; never import from client code)
- Path alias `@` → `src/`
- Lint: `npm run lint` · Build: `npm run build`
