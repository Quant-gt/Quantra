# QUANTRA

Your Algorithm. Your Mantra. Your Edge.

## Tech Stack
- Frontend: Next.js 14 App Router
- Backend API: Node.js 22 (Express)
- NLP Service: Python FastAPI
- Execution Engine: Node.js
- Database: Supabase (PostgreSQL with pgvector)
- Cache: Upstash Redis

## Monorepo Structure (Turborepo)
- `/apps/web`: React frontend
- `/apps/api`: Node.js API
- `/apps/nlp`: Python NLP microservice
- `/apps/execution`: Order execution engine
- `/packages/types`: Shared TypeScript interfaces

## How to Run Locally

### Prerequisites
1. Node.js 22+
2. Python 3.10+
3. npm 11+
4. Supabase CLI installed locally

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables. Copy `.env.example` to `.env` in all relevant directories.

### Running the Apps
From the root directory, run:
```bash
npm run dev
```
This will start the frontend, API, and execution engine.
For the Python NLP service, navigate to `/apps/nlp` and run `npm run dev` (which runs `fastapi dev main.py`).

### Supabase Migrations
To apply the database migrations locally:
```bash
cd apps/api
supabase db push
```

## Environment Variables
Create `.env` files based on `.env.example`. You will need:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis token

## Deployment
- **Web**: Auto-deployed to Vercel on push to `main`
- **API/NLP/Execution**: Auto-deployed to Render on push to `main`
- **Database**: Supabase
