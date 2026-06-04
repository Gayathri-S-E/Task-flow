from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, user, task, summary

app = FastAPI(title="Task Management API", version="1.0.0")

# ⚠️ CRITICAL: CORS must be configured before any router
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],   # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(task.router)
app.include_router(summary.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok"}
