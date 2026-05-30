# Mini Recruitment Dashboard

## Teknologi
- Backend: Go (Gin + GORM, Clean Architecture)
- Frontend: React (Vite + TypeScript) + TailwindCSS

## Struktur Project
- `backend/` : API Go
- `frontend/` : aplikasi dashboard React

## Setup & Run (Local)

### Backend
1. Konfigurasi `.env` pada folder `backend/`
2. Jalankan migration & seeder sesuai Makefile project backend.

### Frontend
1. Buat env:
   - `frontend/.env` dengan `VITE_API_URL=http://localhost:8080`
2. Install & run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Dummy Account (Login)
- admin@example.com / password123

## API Base (Default)
- http://localhost:8080

## Deployment
- Deploy frontend ke Vercel.
- Pastikan environment variable `VITE_API_URL` diarahkan ke backend production.
