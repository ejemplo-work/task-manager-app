# Task Manager App

Full-stack task management application with Express + TypeScript backend and Next.js frontend.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend       │────────▶│    Backend        │
│   Next.js 16     │  HTTP   │   Express + TS    │
│   App Router     │         │   REST API        │
│   Vercel         │         │   Railway         │
└─────────────────┘         └────────┬───────────┘
                                     │
                              ┌──────▼───────┐
                              │  PostgreSQL   │
                              │  Railway      │
                              └──────────────┘
```

## URLs

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://task-manager-frontend-mocha-zeta.vercel.app |
| Backend (Railway) | https://backend-production-6206.up.railway.app |
| Backend Health | https://backend-production-6206.up.railway.app/health |

## Local Development

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL (for local backend testing)

### Backend

```bash
cd backend
npm install
# Create .env with DATABASE_URL pointing to your PostgreSQL instance
cp ../backend/.env .  # or create your own
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm install
# Create .env.local with NEXT_PUBLIC_API_URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8080" > .env.local
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task (`{title, status?}`) |
| PUT | `/api/tasks/:id` | Update task (`{title?, status?}`) |
| DELETE | `/api/tasks/:id` | Delete task |

## Deploying Changes

### Backend (Railway)
```bash
cd ~/Documents/pi/task-manager-app
git add -A && git commit -m "your changes" && git push
railway up
```

### Frontend (Vercel)
```bash
cd ~/Documents/pi/task-manager-app/frontend
vercel deploy --prod --yes
```

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default: 8080) |
| `CORS_ORIGIN` | Allowed CORS origins (default: *) |

### Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
