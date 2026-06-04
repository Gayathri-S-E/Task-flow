# TaskFlow — Premium Task Management System
A beautiful, modern, full-stack Task Management System featuring collaboration, task assignment, progress status controls, and real-time dashboard analytics.

## Tech Stack
- **Backend:** FastAPI (Python 3.11+) + SQLAlchemy + Alembic + PostgreSQL (Neon cloud / local)
- **Frontend:** React (Vite) + Tailwind CSS + Zustand + React Hook Form + Zod

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+

### Database Configuration
The application is pre-configured to run against a cloud-hosted Neon PostgreSQL database (`taskdb`). If you prefer to run against your local database, modify the `DATABASE_URL` in `backend/.env`.

---

### Running the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   - Windows: `.\venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
3. Run the migrations:
   ```bash
   alembic upgrade head
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --port 8000
   ```
   - Swagger API Documentation will be available at: http://127.0.0.1:8000/docs
   - Redoc alternative documentation at: http://127.0.0.1:8000/redoc

---

### Running the Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to: http://localhost:5173

---

## Hashing & Security details
- Direct `bcrypt` is used for password hashing to resolve compatibility bugs on Python 3.13.
- JWT tokens are signed using HMAC-SHA256 and stored in memory/Zustand on the frontend, sent via `Authorization` header.
- Permissive API guards: Only task creators can update details or assign tasks; only assigned users can advance task status.
